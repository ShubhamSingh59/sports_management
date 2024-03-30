from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
import config

app = Flask(__name__)

app.config['MYSQL_HOST'] = config.MYSQL_HOST
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB

mysql = MySQL(app)


def get_unique_identifier(table_name):
    # Implement logic to get the unique identifier for the given table name
    # This could involve querying the database schema or using predefined mappings
    # For simplicity, let's assume a predefined mapping for now
    id_mapping = {
        'Player': 'player_id',
        'Sports': 'sport_id'
        # Add more mappings as needed for other tables
    }
    return id_mapping.get(table_name)



@app.route('/api/playerData', methods=['GET'])
def get_data():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM Player")  # Replace 'your_table' with your actual table name
    data = cur.fetchall()
    cur.close()
    return jsonify(data)

@app.route('/api/sportsData')
def get_sportsData():
    cur = mysql.connection.cursor() 
    cur.execute("select * from Sports")
    sportsdata = cur.fetchall()
    cur.close()
    return jsonify(sportsdata)


@app.route('/api/insert', methods=['POST'])
def insert_data():
    try:
        data = request.get_json()
        table_name = data['table_name']
        columns = data['columns']
        values = data['values']

        cursor = mysql.connection.cursor()
        query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(['%s'] * len(values))})"
        cursor.execute(query, tuple(values))
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
        update_values = data['update_values']
        where_values = data['where_values']

        unique_identifier = get_unique_identifier(table_name)
        if unique_identifier is None:
            return jsonify({'error': 'Unique identifier not found for table'}), 400

        set_clause = ', '.join([f"{column} = %s" for column in update_values])
        where_clause = f"{unique_identifier} = %s"

        cursor = mysql.connection.cursor()
        query = f"UPDATE {table_name} SET {set_clause} WHERE {where_clause}"
        cursor.execute(query, tuple(update_values + [where_values[unique_identifier]]))
        mysql.connection.commit()
        cursor.close()

        return jsonify({'message': 'Data updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/delete', methods=['DELETE'])
def delete_data():
    try:
        data = request.get_json()
        table_name = data['table_name']
        where_values = data['where_values']

        unique_identifier = get_unique_identifier(table_name)
        if unique_identifier is None:
            return jsonify({'error': 'Unique identifier not found for table'}), 400

        where_clause = f"{unique_identifier} = %s"

        cursor = mysql.connection.cursor()
        query = f"DELETE FROM {table_name} WHERE {where_clause}"
        cursor.execute(query, (where_values[unique_identifier],))
        mysql.connection.commit()
        cursor.close()

        return jsonify({'message': 'Data deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/rename', methods=['PUT'])
def rename_table():
    try:
        data = request.get_json()
        old_table_name = data['old_table_name']
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
        table_name = request.args.get('table_name')
        where_column = request.args.get('where_column')
        where_value = request.args.get('where_value')

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
