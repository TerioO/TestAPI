@echo off
ECHO [ Importing database for testing, dbName="_Test_API" ]  
ECHO:
mongoimport "mongodb://127.0.0.1:27017" --db="_Test_API" --collection="users" --file="./src/tests/db/TestAPI.users.json" --jsonArray
mongoimport "mongodb://127.0.0.1:27017" --db="_Test_API" --collection="posts" --file="./src/tests/db/TestAPI.posts.json" --jsonArray
mongoimport "mongodb://127.0.0.1:27017" --db="_Test_API" --collection="comments" --file="./src/tests/db/TestAPI.comments.json" --jsonArray
mongoimport "mongodb://127.0.0.1:27017" --db="_Test_API" --collection="todos" --file="./src/tests/db/TestAPI.todos.json" --jsonArray
ECHO:
ECHO [ Starting tests ]
ECHO:
jest