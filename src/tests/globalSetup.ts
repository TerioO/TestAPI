import { Config } from "@jest/types";
// import { getApp } from "../app";
// import { testConfig } from "../config/testConfig";
// import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = async function setup(globalConfig: Config.GlobalConfig, projectConfig: Config.ProjectConfig) {
    try {
        // await mongoose.connect(testConfig.MONGO_URI, { dbName: testConfig.MONGO_DBNAME })
        // globalThis._SERVER_ = getApp().listen(testConfig.PORT)
    }
    catch (error) {
        console.log(error);
    }
}
