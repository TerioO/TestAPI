import express from "express";
import * as handlers from "../controllers/todosController";

const router = express.Router();

router.route("/")
    .get(handlers.getTodos)
    .post(handlers.createTodo)

router.route("/:todoId")
    .get(handlers.getTodo)
    .patch(handlers.updateTodo)
    .delete(handlers.deleteTodo)

export default router