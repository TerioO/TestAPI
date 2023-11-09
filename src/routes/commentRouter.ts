import express from "express";
import * as handlers from "../controllers/commentController";

const router = express.Router();

router.route("/")
    .get(handlers.getPostsComments)
    .post(handlers.createComment)
    .delete(handlers.deleteComment)

export default router;