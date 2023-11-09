import express from "express";
import * as handlers from "../controllers/postsControllers";

const router = express.Router();

router.route("/")
    .get(handlers.getPosts)
    .post(handlers.createPost)

router.route("/:postId")
    .get(handlers.getPost)
    .patch(handlers.updatePost)
    .delete(handlers.deletePost)

export default router;