from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_mysqldb import MySQL
import config

from flask_cors import CORS
from functools import wraps
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

import jwt
import datetime
from datetime import timedelta
from flask_mail import Mail, Message
from authlib.integrations.flask_client import OAuth


app = Flask(__name__)
CORS(app)
mail = Mail(app)

app.config['SERVER_NAME'] = 'localhost:5000'
oauth = OAuth(app)
app.secret_key = config.SECRET_KEY

# configuration of mail 
#app.config['MAIL_SERVER']= config.MAIL_SERVER
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'subhams@iitgn.ac.in'
#app.config['MAIL_PASSWORD'] = config.MAIL_PASSWORD
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

app.config['MYSQL_HOST'] = config.MYSQL_HOST
#app.config['MYSQL_USER'] = config.MYSQL_USER
#app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB
app.config['SECRET_KEY'] = config.SECRET_KEY
app.config['JWT_EXPIRATION_DELTA'] = timedelta(minutes=180)

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


# Function to check if a notification should be shown to the user
def check_notification(players_not_returned):
    current_user_email = get_jwt_identity()
    for player in players_not_returned:
        if player[6] == current_user_email:
            # Show notification to user
            return True,player
    return False,[]


@app.route('/google/')
def google():
    GOOGLE_CLIENT_ID = config.CLIENT_ID
    GOOGLE_CLIENT_SECRET = config.CLIENT_SECRET
     
    CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'
    oauth.register(
        name='google',
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        server_metadata_url=CONF_URL,
        client_kwargs={
            'scope': 'openid email profile'
        }
    )
     
    # Redirect to google_auth function
    redirect_uri = url_for('google_auth', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)
 
@app.route('/google/auth/')
def google_auth():
    token = oauth.google.authorize_access_token()
    user = oauth.google.parse_id_token(token)
    print(" Google User ", user)
    return jsonify({'all set bro'}), 200


def get_players_not_returned():
        # Connect to the database and query for players who haven't returned their equipment
        app.config['MYSQL_USER'] = config.MYSQL_USER
        app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
        cursor = mysql.connection.cursor()
        query = """
        SELECT p.*, i.Player_ID, i.Return_Status, i.Equipment_Name
        FROM Player p
        INNER JOIN Issue i ON p.Player_ID = i.Player_ID
        WHERE i.Return_Status = 'Not Returned'
        GROUP BY p.Player_ID, i.Player_ID, i.Return_Status, i.Equipment_Name
        """
        cursor.execute(query)
        players_not_returned = cursor.fetchall()
        cursor.close()

        return players_not_returned
    

@app.route('/send-reminder', methods=['GET'])
@jwt_required()
def sendReminder():
    players_not_returned = get_players_not_returned()
    Not_Returned , loggedInPlayerdata =  check_notification(players_not_returned)
    if Not_Returned:
        return jsonify({'show_notification': True, 'player_data':loggedInPlayerdata} ), 200 
    else :
        return jsonify({'show_notification': False, 'player_data':loggedInPlayerdata} ), 200 
    

# # Function to check equipment returns and send notifications
# @jwt_required()
# def send_return_reminders():
#     try:
#         # Connect to the database and query for overdue equipment returns
#         app.config['MYSQL_USER'] = config.MYSQL_USER
#         app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
#         cursor = mysql.connection.cursor()
#         query = """
#             SELECT p.First_Name, p.Last_Name, p.Email, i.Equipment_Name
#             FROM Issue i
#             INNER JOIN Player p ON i.Player_ID = p.Player_ID
#             WHERE i.Return_Status = 'Not Returned'
#             AND i.Date_Time < DATE_SUB(NOW(), INTERVAL 2 DAY)
#         """
#         cursor.execute(query)
#         overdue_equipment = cursor.fetchall()
#         print(overdue_equipment)
#         # Send email notifications to players with overdue equipment returns
#         for player in overdue_equipment:
#             send_notification_email(player[2], player[0], player[1], player[3])
        
#         cursor.close()
#     except Exception as e:
#         print("Error sending return reminders:", e)

# # Function to send notification email
# def send_notification_email(email, first_name, last_name, equipment_name):
#     try:
#         msg = Message( 
#                         'Equipment Return Reminder', 
#                         sender = config.MAIL_USERNAME, 
#                         recipients = [email] 
#                     ) 
#         msg.body = f"Dear {first_name} {last_name},\n\nThis is a reminder to return the equipment '{equipment_name}' as soon as possible.\n\nThank you.\nSports Management Team"
#         print(email)
#         mail.send(msg) 
#         return 'Sent'
#     except Exception as e:
#         print("Error sending email notification:", e)

# # Expose an endpoint to trigger the notification process
# @app.route('/api/send-return-reminders', methods=['POST'])
# def trigger_return_reminders():
#     send_return_reminders()
#     return jsonify({'message': 'Return reminders sent successfully'}), 200


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


@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_email = get_jwt_identity()
    cursor = mysql.connection.cursor()

    # Query for fetching player profile with team information
    player_query = """
        SELECT p.*, t.Team_ID
        FROM Player p
        LEFT JOIN belongs_to b ON p.Player_ID = b.Player_ID
        LEFT JOIN Team t ON b.Team_ID = t.Team_ID
        WHERE p.Email = %s
    """
    cursor.execute(player_query, (current_user_email,))
    player = dict_cursor(cursor)

    if player:
        cursor.close()
        return jsonify({'type': 'player', 'data': player}), 200

    # Query for fetching coach profile with team and sports information
    coach_query = """
        SELECT c.*, t.Team_ID, t.Team_Name, t.Sports_Name
        FROM Coach c
        LEFT JOIN guide_of g ON c.Coach_ID = g.Coach_ID
        LEFT JOIN Team t ON g.Team_ID = t.Team_ID
        WHERE c.Email = %s
    """
    cursor.execute(coach_query, (current_user_email,))
    coach = dict_cursor(cursor)
    cursor.close()

    if coach:
        return jsonify({'type': 'coach', 'data': coach}), 200

    return jsonify({'error': 'User not found'}), 404


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
    
import logging

# Set up logging configuration
logging.basicConfig(level=logging.DEBUG)

def lock_table(table_name, lock_type):
    cursor = mysql.connection.cursor()
    cursor.execute(f"LOCK TABLES {table_name} {lock_type}")
    cursor.close()
    logging.debug(f"Table {table_name} locked successfully")

def unlock_tables():
    cursor = mysql.connection.cursor()
    cursor.execute("UNLOCK TABLES")
    cursor.close()
    logging.debug("Tables unlocked successfully")



from pymysql.err import OperationalError

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

        # Acquire a WRITE lock for the table
        lock_table(table_name, 'WRITE')

        select_query = f"SELECT * FROM {table_name} WHERE {where_clause}"
        cursor.execute(select_query, tuple(where_values.values()))
        rows = cursor.fetchall()

        if not rows:
            return jsonify({'error': 'No entry found for updating'}), 404
        #lock_table(table_name, 'Read')
        update_query = f"UPDATE {table_name} SET {set_clause} WHERE {where_clause}"
        cursor.execute(update_query, tuple(update_values + list(where_values.values())))
        mysql.connection.commit()
        cursor.close()
        unlock_tables()  # Unlock the table after the operation
        return jsonify({'message': 'Data updated successfully'}), 200
    except OperationalError as e:
        return jsonify({'error': 'Database lock error. Please try again later.'}), 500
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
        print(config.MYSQL_USER)
        print(config.MYSQL_PASSWORD)
        print(data)
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