from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_mysqldb import MySQL
import config

from flask_cors import CORS


app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = config.MYSQL_HOST
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB

mysql = MySQL(app)

@app.route('/')
def index():
    return render_template('../frontend/public/index.html') 

@app.route('/api/<table>', methods=['GET'])
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
        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]
        cursor.close()
        return jsonify(tables)
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/api/insert', methods=['POST'])
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

@app.route('/api/where', methods=['GET'])
def get_data_with_where_clause():
    try:
        data = request.get_json()
        table_name = data['table_name']
        where_column = data['where_column']
        where_value = data['where_value']

        cursor = mysql.connection.cursor()
        query = f"SELECT * FROM {table_name} WHERE {where_column} = %s"
        cursor.execute(query, (where_value,))
        data = cursor.fetchall()
        cursor.close()

        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)