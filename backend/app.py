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




if __name__ == '__main__':
    app.run(debug=True)