import env from "./config/validateEnv";
import mongoose from "mongoose";
import { getApp } from "./app";

const app = getApp();
mongoose.connect(env.MONGO_URI, { dbName: env.MONGO_DBNAME })
    .then(() => {
        app.listen(env.PORT, () => {
            console.log(`Connected to DB and listening on PORT: ${env.PORT}`);
        })
    })
    .catch((error) => console.log(error))