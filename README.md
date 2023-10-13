This repository contains the source code for a FastAPI web application, which serves a simple social network. It allows 
users to sign up, log in, view profiles, view leaderboards, and update their MVPs. It also supports authentication and 
authorization using JWT tokens. The project uses a MySQL database to store user information.

Prerequisites:   
Python 3.x installed    
pip package manager installed   
MySQL server installed  


Set the required environment variables in a .env file.     
MYSQL_HOST=<your_mysql_host>         
MYSQL_USER=<your_mysql_username>     
MYSQL_PASSWORD=<your_mysql_password>     
MYSQL_DATABASE=<your_mysql_database_name>        

Create the necessary database tables by running the following command.  
python init_db.py   

Start the application by running the following command.
uvicorn main:app --reload
Navigate to http://localhost:6520 to access the application.

Usage   
The following endpoints are available in the application:

/ - Home page   
/login - Log in page    
/signup - Sign up page  
/profile/{username} - User profile page 
/mvp - MVP update page  
/leaderboard - Leaderboard page 

The application uses JWT tokens for authentication and authorization. When a user logs in, a token is generated and 
returned to the client. This token must be included in the Authorization header of subsequent requests that require 
authentication.