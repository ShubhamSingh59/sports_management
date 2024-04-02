from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_mysqldb import MySQL
import config

from flask_cors import CORS
from functools import wraps
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

import jwt
import datetime


app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = config.MYSQL_HOST
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB
app.config['SECRET_KEY'] = config.SECRET_KEY

mysql = MySQL(app)


# Dummy user data (replace with your actual user database)
users = {
    'john@example.com': {'password': 'password123', 'role': 'user'},
    'admin@example.com': {'password': 'admin123', 'role': 'admin'}
}



from functools import wraps

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user = get_jwt_identity()
    
        if users[current_user]['role'] != 'admin':
            # Handle unauthorized access
            return jsonify({'message': 'Admin permission required, This user is not an admin'}), 403
        
        return f(*args, **kwargs)
    return decorated_function


def valid_token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user = get_jwt_identity()
    
        if users[current_user]['role'] not in ['admin', 'user']:
            # Handle unauthorized access
            return jsonify({'message': 'Invalid token, creditanls'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/admin', methods=['GET'])
@jwt_required()
@admin_required
def admin_only_endpoint():
    return jsonify({'message': 'Admin endpoint'}), 200



@app.route('/')
def index():
    return 'hello world'



@app.route('/api/<table>', methods=['GET'])
@jwt_required()
@valid_token_required
def get_data(table):
    try:
        cur = mysql.connection.cursor()
        
        # Select all rows from the specified table
        cur.execute(f"SELECT * FROM {table}")
        data = cur.fetchall()
        
        # Get column names
        cur.execute(f"SHOW COLUMNS FROM {table}")
        column_names = [row[0] for row in cur.fetchall()]
        
        # Get primary key column(s)
        cur.execute(f"SHOW INDEX FROM {table} WHERE Key_name = 'PRIMARY'")
        primary_key = [row[4] for row in cur.fetchall()]

        cur.close()
        
        # Return the response
        return jsonify({'table_name': table, 'column_names': column_names, 'primary_key': primary_key, 'data': data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/tables', methods=['GET'])
@jwt_required()
@valid_token_required
def get_tables():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]
        cursor.close()
        return jsonify(tables)
    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/api/insert', methods=['POST'])
@jwt_required()
@admin_required
def insert_data():
    try:
        data = request.get_json()
        table_name = data['table_name']
        column_names = data['column_names']
        data_values = data['data']

        cursor = mysql.connection.cursor()
        query = f"INSERT INTO {table_name} ({', '.join(column_names)}) VALUES ({', '.join(['%s'] * len(column_names))})"
        for row in data_values:
            cursor.execute(query, tuple(row))
        mysql.connection.commit()
        cursor.close()

        return jsonify({'message': 'Data inserted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/api/update', methods=['PUT'])
@jwt_required()
@admin_required
def update_data():
    try:
        data = request.get_json()
        table_name = data['table_name']
        column_names = data['column_names']
        update_values = data['data']
        where_values = data['primary_key']

        set_clause = ', '.join([f"{column} = %s" for column in column_names])
        where_clause = ' AND '.join([f"{column} = %s" for column in where_values.keys()])

        cursor = mysql.connection.cursor()
        query = f"UPDATE {table_name} SET {set_clause} WHERE {where_clause}"
        cursor.execute(query, tuple(update_values + list(where_values.values())))
        mysql.connection.commit()
        cursor.close()

        return jsonify({'message': 'Data updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
# Update the /api/delete route to accept any combination of attribute values

   
@app.route('/api/delete', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_data():
    try:
        data = request.get_json()
        table_name = data['table_name']
        where_values = data['where_values']  # Change from 'primary_key' to 'where_values'

        where_clause = ' AND '.join([f"{column} = %s" for column in where_values.keys()])

        cursor = mysql.connection.cursor()
        query = f"DELETE FROM {table_name} WHERE {where_clause}"
        cursor.execute(query, tuple(where_values.values()))
        mysql.connection.commit()
        cursor.close()

        return jsonify({'message': 'Data deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/api/rename', methods=['PUT'])
@jwt_required()
@admin_required 
def rename_table():
    try:
        data = request.get_json()
        old_table_name = data['table_name']
        new_table_name = data['new_table_name']

        cursor = mysql.connection.cursor()
        query = f"ALTER TABLE {old_table_name} RENAME TO {new_table_name}"
        cursor.execute(query)
        mysql.connection.commit()
        cursor.close()

        return jsonify({'message': 'Table renamed successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/where', methods=['POST'])
@jwt_required()
@admin_required
def apply_where_clause():
    try:
        data = request.get_json()
        table_name = data['table_name']
        column_name = data['column_name']
        operation = data['operation']
        value = data['value']

        # Ensure the operation is valid
        valid_operations = ['=', '>', '<', '>=', '<=']
        if operation not in valid_operations:
            return jsonify({'error': 'Invalid operation'}), 400

        cursor = mysql.connection.cursor()
        query = f"SELECT * FROM {table_name} WHERE {column_name} {operation} %s"
        cursor.execute(query, (value,))
        result = cursor.fetchall()
        cursor.close()

        return jsonify({'data': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


jwt = JWTManager(app)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    user = users.get(username)

    if not user or user['password'] != password:
        return jsonify({'message': 'Invalid username or password'}), 401

    # Generate access token
    access_token = create_access_token(identity=username)

    return jsonify({'token': access_token}), 200



if __name__ == '__main__':
    app.run(debug=True)