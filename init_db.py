# Necessary Imports
import mysql.connector as mysql                   # Used for interacting with the MySQL database
import os                                         # Used for interacting with the system environment
from dotenv import load_dotenv                    # Used to read the credentials


''' Environment Variables '''
load_dotenv("credentials.env")

# Read Database connection variables
db_host = os.environ['MYSQL_HOST']
db_user = os.environ['MYSQL_USER']
db_pass = os.environ['MYSQL_PASSWORD']
db_name = os.environ['MYSQL_DATABASE']


# Connect to the db and create a cursor object
db =mysql.connect(user=db_user, password=db_pass, host=db_host)
cursor = db.cursor()

cursor.execute("CREATE DATABASE if not exists leaderboard")
cursor.execute("USE leaderboard")

try:
   cursor.execute("""
   CREATE TABLE if not exists users (
        id              INT  AUTO_INCREMENT PRIMARY KEY,
        firstname       VARCHAR(50) NOT NULL,
        lastname        VARCHAR(50) NOT NULL,
        username        VARCHAR(50) NOT NULL,
        password        VARCHAR(100) NOT NULL,
        email           VARCHAR(50) NOT NULL,
        PID             INT NOT NULL,     
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
   );
 """)
except RuntimeError as err:
   print("runtime error: {0}".format(err))


cursor.close()
db.close()
