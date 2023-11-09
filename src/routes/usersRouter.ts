import express from "express";
import * as handlers from "../controllers/usersController";

const router = express.Router();

router.route("/")
    .get(handlers.getUsers)
    .post(handlers.createUser)

router.route("/:userId")
    .get(handlers.getUser)
    .patch(handlers.updateUser)
    .delete(handlers.deleteUser)

export default router;