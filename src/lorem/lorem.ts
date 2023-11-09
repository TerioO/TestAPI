/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from "dotenv"
dotenv.config({ path: "../../.env" })
import env from "../config/validateEnv";
import { addUsers } from "./addUsers";
import { addPosts } from "./addPosts";
import { addComments } from "./addComments";
import { addTodos } from "./addTodos";

export const BASE_URI = `http://localhost:${env.PORT}`;

const fillDB = async () => {
    await addUsers(20);
    await addPosts();
    await addComments(undefined, undefined, undefined, undefined, 1);
    await addTodos(undefined, undefined, 5);
}

fillDB();