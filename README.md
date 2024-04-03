# sports_management

## Introduction
This project is a sports management application built with React.js for the frontend and Flask for the backend. It allows users to perform various operations related to sports management, such as viewing data, inserting, updating, and deleting records.

## Dependencies

### Frontend (React.js)
- **Node.js and npm:** [Install Node.js and npm](https://nodejs.org/)
- **Clone the repository**
- **Navigate to the frontend directory and install dependencies:**


npm install


### Backend (Flask)
- **MySQL Workbench:** [Install MySQL Workbench](https://www.mysql.com/products/workbench/)
- **Python 3**
- **Clone the repository**
- **Navigate to the backend directory and set up a virtual environment:**

- pip install virtualenv
- python3 -m venv myenv
# For macOS and Linux:
- source myenv/bin/activate
# For Windows:
- myenv\Scripts\activate


#### Install required Python packages:
- pip install Flask flask-mysqldb

#### Create a MySQL database using sports_management.sql
#### Create a config.py file in the backend directory with the following content:
# config.py
- MYSQL_HOST = 'localhost'
- MYSQL_USER = 'root'  # Change this to your MySQL username
- MYSQL_PASSWORD = ''  # Change this to your MySQL password
- MYSQL_DB = 'sports_management'
- SECRET_KEY = "" # write your secret-key here 


### Usage
#### Run the backend:
- python app.py

#### Run the frontend:
- npm start












