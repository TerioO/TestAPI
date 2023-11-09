import "dotenv/config";
import { cleanEnv, str, num } from "envalid";

export default cleanEnv(process.env, {
    PORT: num({ default: 3500 }),
    MONGO_URI: str(),
    MONGO_DBNAME: str({ default: "TestAPI" })
})