import { getApp } from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import { testConfig } from "../config/testConfig";
import http from "http";

interface TestSetup {
    app: Express;
    server: http.Server | undefined;
    init: (PORT: number) => void;
    end: () => void;
}

export const testSetup: TestSetup = {
    app: getApp(),
    server: undefined,
    async init(PORT){
        try {
            await mongoose.connect(testConfig.MONGO_URI, { dbName: testConfig.MONGO_DBNAME })
            this.server = this.app.listen(PORT);
        }
        catch(error){
            console.log(error)
        }
    },
    async end(){
        try {
            // await mongoose.connection.db.dropDatabase({ dbName: testConfig.MONGO_DBNAME })
            await mongoose.disconnect();
            this.server && this.server.close();
        }
        catch(error){
            console.log(error);
        }
    }
}