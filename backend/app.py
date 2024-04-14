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
#app.config['MYSQL_USER'] = config.MYSQL_USER
#app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB
app.config['SECRET_KEY'] = config.SECRET_KEY

mysql = MySQL(app)

""" 
# Dummy user data (replace with your actual user database)
users = {
    'john@example.com': {'password': 'password123', 'role': 'player'},
    'ram@gmail.com': {'password': 'sitaram', 'role': 'coach'},
    'admin@example.com': {'password': 'admin123', 'role': 'admin'}
}
"""
def set_mysql_credentials(user, password):
    app.config['MYSQL_USER'] = user
    app.config['MYSQL_PASSWORD'] = password


def dict_cursor(cursor):
    # Fetch the column names for the cursor
    columns = [column[0] for column in cursor.description]

    # Fetch all rows from the cursor
    rows = cursor.fetchall()

    # Convert each row into a dictionary
    result = []
    for row in rows:
        result.append({columns[i]: row[i] for i in range(len(columns))})
    
    return result

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user = get_jwt_identity()
        
        # Fetch user data from the database
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT role FROM Users WHERE useremail = %s", (current_user,))
        user = dict_cursor(cursor)
        cursor.close()

        if not user or user[0]['role'] != 'admin':
            # Handle unauthorized access
            return jsonify({'message': 'Admin permission required, This user is not an admin'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

def valid_token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user = get_jwt_identity()
        
        # Fetch user data from the database
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT role FROM Users WHERE useremail = %s", (current_user,))
        user = dict_cursor(cursor)
        cursor.close()

        if not user or user[0]['role'] not in ['admin', 'Player', 'Coach']:
            # Handle unauthorized access
            return jsonify({'message': 'Invalid token, credentials'}), 403
        
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
def get_tables():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute ("SELECT table_name FROM information_schema.tables WHERE table_schema = 'sports_management' AND table_name != 'Users'") 
        #cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
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
        select_query = f"SELECT * FROM {table_name} WHERE {where_clause}"
        cursor.execute(select_query, tuple(where_values.values()))
        rows = cursor.fetchall()

        if not rows:
            return jsonify({'error': 'No entry found for updating'}), 404

        update_query = f"UPDATE {table_name} SET {set_clause} WHERE {where_clause}"
        cursor.execute(update_query, tuple(update_values + list(where_values.values())))
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
        where_values = data['where_values']

        where_clause = ' AND '.join([f"{column} = %s" for column in where_values.keys()])

        cursor = mysql.connection.cursor()
        query = f"SELECT * FROM {table_name} WHERE {where_clause}"
        cursor.execute(query, tuple(where_values.values()))
        rows = cursor.fetchall()

        if not rows:
            return jsonify({'message': 'No data found'}), 200

        delete_query = f"DELETE FROM {table_name} WHERE {where_clause}"
        cursor.execute(delete_query, tuple(where_values.values()))
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


# Route to fetch column types for a given table
@app.route('/api/columns/<table_name>')
@jwt_required()
def get_table_columns(table_name):
    try:
        cursor = mysql.connection.cursor()
        # Fetch column names and types from information_schema
        cursor.execute(f"SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{table_name}'")
        columns = cursor.fetchall()
        return jsonify(columns)
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

        if not result:
            return jsonify({'message': 'No data found for the provided condition.'}), 404

        return jsonify({'data': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



jwt = JWTManager(app)


@app.route('/api/create_user', methods=['POST'])
def create_user():
    try:
        app.config['MYSQL_USER'] = config.MYSQL_USER
        app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
        cur = mysql.connection.cursor()
        data = request.get_json()
        useremail = data['useremail']
        password = data['password']
        role = data.get('role')  # Get the role from the request data

        
        cur.execute("CREATE USER %s@'localhost' IDENTIFIED BY %s", (useremail, password))
        
        # Grant different table access based on the role
        if role == 'Player':
            cur.execute("GRANT SELECT ON sports_management.Coach TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.Competition TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.guide_of TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.Matches TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.Participate TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.Player TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.Sports TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.Team TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.Tournament TO %s@'localhost'", (useremail,))
            mysql.connection.commit()

            cur.execute("GRANT SELECT ON sports_management.Users TO %s@'localhost'", (useremail,))
            mysql.connection.commit() 
        elif role == 'Coach':
            cur.execute("GRANT SELECT ON sports_management.Coach TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.Competition TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.guide_of TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.Matches TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.Participate TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.Player TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.Sports TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.Team TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.Tournament TO %s@'localhost'", (useremail,))
            mysql.connection.commit()
            cur.execute("GRANT SELECT ON sports_management.Users TO %s@'localhost'", (useremail,))
            mysql.connection.commit() 
        else:
            # Handle invalid role
            return jsonify({'error': 'Invalid role'}), 400
        
        # Insert user details into the Users table
        cur.execute("INSERT INTO Users (useremail, password, role) VALUES (%s, %s, %s)", (useremail, password, role))
        mysql.connection.commit() 
        cur.close()

        return jsonify({"message": "User created successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/api/login', methods=['POST'])
def Login():
    try:
        #set_mysql_credentials('root', 'Stromer/2003')
        useremail = request.json.get('useremail')
        password = request.json.get('password')
        set_mysql_credentials(useremail, password)
        cur = mysql.connection.cursor()
        # Check if the user exists in the users table
        cur.execute("SELECT * FROM Users WHERE useremail = %s AND password = %s", (useremail, password))
        mysql.connection.commit() 
        user_data = cur.fetchone()
        print(user_data)
        #cur.close()
        if user_data:
            # Set MySQL credential
            cur = mysql.connection.cursor()
            # Execute "SHOW TABLES" query
            # cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'sports_management' AND table_name != 'Users'")
            mysql.connection.commit() 
            # tables = cur.fetchall()
            #print(tables)
            cur.close()
            access_token = create_access_token(identity=useremail)
            return jsonify({'token': access_token,'success': True}), 200
        else:
            return jsonify({'success': False, 'error': 'Invalid credentials'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': 'Please Sign'})

if __name__ == '__main__':
    app.run(debug=True)