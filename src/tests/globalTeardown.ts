import mongoose from "mongoose";
import { testConfig } from "../config/testConfig";

module.exports = async function teardown(){
    try {
        console.log(`\n[Running globalTeardown: Dropping "${testConfig.MONGO_DBNAME}" database]\n`)
        // Delete the test database after all test have finished:
        await mongoose.connect(testConfig.MONGO_URI, { dbName: testConfig.MONGO_DBNAME })
        await mongoose.connection.db.dropDatabase({ dbName: testConfig.MONGO_DBNAME })
        await mongoose.disconnect();
        // globalThis._SERVER_ && globalThis._SERVER_.close();
    }
    catch(error){
        console.log(error);
    }
}
