import env from "./validateEnv";
import mongoose from "mongoose";
import { Express } from "express";

export const connectDB = (app: Express) => {
    mongoose.connect(env.MONGO_URI, { dbName: env.MONGO_DBNAME })
        .then(() => {
            app.listen(env.PORT, () => {
                console.log(`Connected to DB and listening on PORT: ${env.PORT}`);
            })
        })
        .catch((error) => console.log(error))
}