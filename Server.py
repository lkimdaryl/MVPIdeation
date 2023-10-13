# Necessary Imports
import datetime

from fastapi import FastAPI, Request, Form        # The main FastAPI import and Request object
from fastapi.responses import HTMLResponse        # Used for returning HTML responses (JSON is default)
from fastapi.templating import Jinja2Templates    # Used for generating HTML from templatized files
from fastapi.staticfiles import StaticFiles       # Used for making static resources available to server
import uvicorn                                    # Used for running the app directly through Python
import mysql.connector as mysql                   # Used for interacting with the MySQL database
import os                                         # Used for interacting with the system environment
from dotenv import load_dotenv                    # Used to read the credentials
from starlette.responses import RedirectResponse
import hashlib
import jwt
from init_db import db             #Import helper module of database functions!
from fastapi import Cookie, HTTPException
import pprint
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# Configuration

load_dotenv("credentials.env")

db_host = os.environ['MYSQL_HOST']
db_user = os.environ['MYSQL_USER']
db_pass = os.environ['MYSQL_PASSWORD']
db_name = os.environ['MYSQL_DATABASE']

app = FastAPI()                                     # Specify the "app" that will run the routing
# views = Jinja2Templates(directory='.')            # Specify where the HTML files are located
static_files = StaticFiles(directory='public')      # Specify where the static files are located
app.mount("/public", static_files, name="public")   # Mount the static directory

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# route to home page
@app.get("/")
def get_home() -> HTMLResponse:
    with open("index.html") as html:
        return HTMLResponse(content=html.read())

#route to login page
@app.get("/login")
def get_login() -> HTMLResponse:
    with open("login.html") as html:
        return HTMLResponse(content=html.read())

#route to signup page
@app.get("/signup")
def get_signup() -> HTMLResponse:
    with open("signup.html") as html:
        return HTMLResponse(content=html.read())

# route to profile page
# @app.get("/profile")
# def get_profile() -> HTMLResponse:
#     with open("profile.html") as html:
#         return HTMLResponse(content=html.read())

# route to profile page
@app.get("/profile")
def read_profile(token: str = Cookie(None)) -> HTMLResponse:
    print("from profile page token: ", token)
    if not token:
        # If the cookie is not present, raise an HTTPException with status code 401
        # indicating that the user is unauthorized
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        with open("profile.html") as html:
            return HTMLResponse(content=html.read())
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Profile not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

#route to MVP update page
@app.get("/mvp")
def get_mvp(token: str = Cookie(None)) -> HTMLResponse:
    print("from mvp page token: ", token)
    if not token:
        # If the cookie is not present, raise an HTTPException with status code 401
        # indicating that the user is unauthorized
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        with open("mvp.html") as html:
            return HTMLResponse(content=html.read())
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Profile not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


#route to Leaderboard page
@app.get("/leaderboard")
def get_leaderboard(token: str = Cookie(None)) -> HTMLResponse:
    print("from leaderboard page token: ", token)
    if not token:
        # If the cookie is not present, raise an HTTPException with status code 401
        # indicating that the user is unauthorized
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        with open("leaderboard.html") as html:
            return HTMLResponse(content=html.read())
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Profile not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# Define helper functions for CRUD operations
# CREATE SQL query
def db_create_user(first_name:str,
                   last_name:str,
                   username:str,
                   password:str,
                   email:str,
                   pid:int ) -> int:

    try:
        db = mysql.connect(host=db_host, database=db_name, user=db_user, passwd=db_pass)
        cursor = db.cursor()
        query = f"INSERT INTO users (firstname, lastname, username, password, email, PID ) " \
              f"values ('{first_name}','{last_name}','{username}', '{password}','{email}','{pid}')"

        cursor.execute(query)

        id=cursor.lastrowid
        db.commit()
        db.close()

        return id

    except Exception as e:
        print(f"Error adding user {username}: {e}")
        return False


# SELECT SQL query
def db_select_users(pid: int = None) -> dict:

    try:
        db = mysql.connect(host=db_host, database=db_name, user=db_user, passwd=db_pass)
        cursor = db.cursor()

        if pid is None:
            query = "SELECT * FROM users;"
            cursor.execute(query)
        else:
            query = f"SELECT * FROM users WHERE pid = {pid};"
            cursor.execute(query)

        records = cursor.fetchall()
        db.close()
        # print({"user": records})
        return {"user": records}

    except Exception as e:
        print(f"Error selecting user {pid}: {e}")
        return {"error": "User not found"}

def db_select_username(username: str = None) -> dict:
    try:
        db = mysql.connect(host=db_host, database=db_name, user=db_user, passwd=db_pass)
        cursor = db.cursor()
        query = f"SELECT * FROM users WHERE username = '{username}';"
        cursor.execute(query)
        record = cursor.fetchone()
        db.close()

        if record is not None:  # check if record exists
            user = {"user_id": record[0], "first_name": record[1], "last_name": record[2], "username": record[3], "email": record[5], "password": record[4], "pid": record[6]}
            # print(user)
            return user
        else:
            return {}

    except Exception as e:
        print(f"Error selecting user {username}: {e}")
        return {"error": "An error occurred while selecting the user"}


# UPDATE SQL query
def db_update_username(old_username:str,
                       new_username:str ) -> bool:

    try:
        # Connect to the MySQL database
        db = mysql.connect(user=db_user, password=db_pass, host=db_host, database=db_name)
        cursor = db.cursor()

        # Update the user in the database
        query = f"UPDATE users SET username='{new_username}' WHERE username='{old_username}'"
        cursor.execute(query)
        db.commit()

        # Close the connection to the database
        cursor.close()
        db.close()

        # Return True if a row was affected, False otherwise
        return cursor.rowcount > 0

    except Exception as e:
        print(f"Error updating user {old_username}: {e}")
        return False

def db_update_email(username:str,
                   email:str) -> bool:

    try:
        # Connect to the MySQL database
        db = mysql.connect(user=db_user, password=db_pass, host=db_host, database=db_name)
        cursor = db.cursor()

        # Update the user in the database
        query = f"UPDATE users SET email='{email}' WHERE username='{username}'"
        cursor.execute(query)
        db.commit()

        # Close the connection to the database
        cursor.close()
        db.close()

        # Return True if a row was affected, False otherwise
        return cursor.rowcount > 0

    except Exception as e:
        print(f"Error updating user {username}: {e}")
        return False

def db_update_password(username:str,
                   password:str) -> bool:

    try:
        # Connect to the MySQL database
        db = mysql.connect(user=db_user, password=db_pass, host=db_host, database=db_name)
        cursor = db.cursor()

        # Update the user in the database
        query = f"UPDATE users SET password='{password}' WHERE username='{username}'"
        cursor.execute(query)
        db.commit()

        # Close the connection to the database
        cursor.close()
        db.close()

        # Return True if a row was affected, False otherwise
        return cursor.rowcount > 0

    except Exception as e:
        print(f"Error updating user {username}: {e}")
        return False

# DELETE SQL query
def db_delete_user(pid:int) -> bool:

    try:
        db = mysql.connect(host=db_host, database=db_name, user=db_user, passwd=db_pass)
        cursor = db.cursor()
        records = db_select_users()
        if pid in records():
            query = f"DELETE FROM users WHERE PID={pid};"
            cursor.execute(query)
        else:
            return False

        cursor.close()
        db.close()
        return True

    except Exception as e:
        print(f"Error deleting user {pid}: {e}")
        return False
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# Helper functions
def generate_token(username: str, password: str):
    # Define a payload (information to be encoded in the token)
    payload = {'username':username,
               'timestamp': str(datetime.datetime.utcnow())
               }

    # Define a secret key (used to sign the token)
    secret_key = password

    # Encode the payload using the secret key
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    # print(token)

    return token

def decode_token(token: str, password: str) -> dict:
    try:
        # Decode the token using the secret key
        decoded_payload = jwt.decode(token.encode(), password, algorithms=['HS256'])
        # print(decoded_payload)
        return decoded_payload
    except jwt.exceptions.InvalidTokenError as e:
        print(f"Invalid token: {e}")
        return {}

def hash(password: str):

    # Create a SHA256 hash object
    hash_object = hashlib.sha256()
    # Convert the password string to bytes and update the hash object
    hash_object.update(password.encode())
    # Get the hexadecimal representation of the hash value
    hash_hex = hash_object.hexdigest()

    return hash_hex

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

# RESTful User Routes

# GET /users
# Used to query a collection of all users
@app.get('/users')
def get_users() -> dict:
    data = db_select_users();

    if data is None:
        return {'users':[]}

    # fetch all rows and store as list of dicts
    users = []
    for row in data['user']:
        user = {
            'id' : row[0],
            'first_name': row[1],
            'last_name': row[2],
            'username': row[3],
            'password': row[4],
            'email': row[5],
            'pid': row[6],
            'created_at': row[7]
        }
        users.append(user)

    # pprint.pprint({'users':users})
    return {'users':users}


# GET /users/{username}
# Used to query a single user
@app.get('/users/{username}')
def get_user(username: str) -> dict:

    data = db_select_username(username)

    if data is None:
        return {}

    user = {
        'id' : data['user_id'],
        'first_name': data['first_name'],
        'last_name': data['last_name'],
        'username': data['username'],
        'password': data['password'],
        'email': data['email'],
        'pid': data['pid']
    }
    # print(user)

    return user

# GET /pswd
@app.post("/pswd")
async def get_hash_pswd(request:Request) -> dict:
    try:
        form = await request.json()
        # print(form)
        password = hash(form['password'])
        return {'password': password}
    except:
        print("hashing password unsuccessful")
        return {}

# POST /validate
# User is attempting to log in so validate
@app.post('/validate')
async def post_user(request:Request):# -> dict:
    try:
        form = await request.json()
        # print(form)

        # Extract the username and password
        username = form['username']
        password = hash(form['password'])
        # Access the database and determine the authentication status of the user
        user = db_select_username(username)

        if not user or user["password"] != password:
            # If the user is not authenticated, refuse login entry and return an error message
            return {'status': 'fail'}

        # If the user is authenticated, create a token for the user
        token = generate_token(username, password)
        print(token)
        response = RedirectResponse(url='/mvp')
        response.set_cookie(key="token", value=token, path="/")
        # print(response)

        # response = {'password': password,
        #             'token': token}
        return {'status': response};
    except:
        return {'error': 'Validation was unsuccessful'}

# POST /users
# Used to create a new user
@app.post("/create_user")
async def post_user(request: Request) -> dict:
    # Retrieve data asynchronously from the 'request' object
    try:
        form = await request.json()
        # print(form)

        # Extract the first and last name, username, password, email
        # and pid from the POST body
        firstname = form['firstname']
        lastname = form['lastname']
        email = form['email']
        pid = form['PID']
        username = form['username']
        password = hash(form['password'])

        data = db_select_users(pid);

        if len(data['user']) == 0:
            # Create a new user in the database
            db_create_user(firstname,
                           lastname,
                           username,
                           password,
                           email,
                           pid )
        else:
            return {"error": "User already exist."}

        response = RedirectResponse(url='/login')
        # print(response)
        return {'response':response}
    except:
        return {"error": "Something went wrong."}


# PUT /users/{username}
#Used to update a user
@app.put('/users/username/{username}')
async def put_user(username: str, request: Request) -> dict:

    # Retrieve data asynchronously from the 'request' object
    form = await request.json()

    # Extract the username from the form
    new_username = form['username']

    # Using the update function previously defined to update username
    result = db_update_username(username,new_username)
    # print(result)

    return {'success': result}

@app.put('/users/email/{username}')
async def put_user(username: str, request: Request) -> dict:

    # Retrieve data asynchronously from the 'request' object
    form = await request.json()

    # Extract the email from the form
    new_email = form['email']

    # Using the update function previously defined to email
    result = db_update_email(username,new_email)

    return {'success: ': result}

@app.put('/users/password/{username}')
async def put_user(username: str, request: Request) -> dict:

    # Retrieve data asynchronously from the 'request' object
    form = await request.json()

    # Extract the password from the form
    new_password = hash(form['password'])

    # Using the update function previously defined to update password
    result = db_update_password(username, new_password)

    return {'success: ': result}

# DELETE /users/{user_id}
@app.delete('/users/{user_id}')
def delete_user(user_id: int) -> dict:
    # Uing the delete function previously defined to delete a user
    result = db_delete_user({user_id})

    return {'success': result}


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=6520)