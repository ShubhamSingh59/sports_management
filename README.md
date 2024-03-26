# sports_management

Install Nodejs and npm for working of React.js frontend 

Install MySQL workbench 

Clone the repository
go to frontend  directory: Install node_modules by command: npm install 


Seting Up virtual envirnoment in backend directory: 
pip install virtualenv

python3 -m venv myenv

For macOS and linux:
source myvenv/bin/activate

For Windows:
myenv\Scripts\activate

pip3 install Flask

pip3 install flask-mysqldb

Create the database in your mysql workbench, use: sports_management.sql 
make an config.py file in backend directory
write the below 4 things in it: 
# config.py
MYSQL_HOST = 'localhost'
MYSQL_USER = 'root'  # Change this to your MySQL username
MYSQL_PASSWORD = ''  # Change this to your MySQL password
MYSQL_DB = 'sports_management'


Run the Backend:  python app.py 

Run the frontend: npm start 


