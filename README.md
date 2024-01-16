
# TestAPI

An Express server with REST API for interacting with MongoDB on localhost.
Use this backend to learn frontend technologies where you need to interact with an API for rendering, caching logic, etc. (I personally was making this in order to learn RTK Query)

Check the demo: https://testapi-obnu.onrender.com/

## Getting Started

To run MongoDB locally, you must install the MongoDB Community Server and I would recommend also installing MongoDB Compass for the GUI.

For the project:

- Install dependencies
```bash
npm i
```
- Create a **.env** file at the root directory containing:
```dosini
PORT=portNumber (default = 3500)
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DBNAME=TestAPI (default = TestAPI)
GET_LIMIT=20 (default = 20)
```
- Start the server on localhost
```bash
npm run dev
```
- Run the following script to fill your database (check **src/lorem/lorem.ts** for the implementation)
```bash
npm run initDB
```

## About

The database will contain 4 collections:
- users
- todos
- posts
- comments


## Todo

1. [x]  Add documentation.
2. [x]  Deploy a showcase webpage.
3. [x]  Write some tests.
4. [ ]  More collections?