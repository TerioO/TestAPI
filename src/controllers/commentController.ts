import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import dayjs from "dayjs";
import Comment from "../models/Comment";
import User from "../models/User";
import Post from "../models/Post";

export interface CreateCommentInterface {
    postId: string,
    userId: string,
    body: string,
    createdAt?: Date
}
export const createComment: RequestHandler<unknown, unknown, CreateCommentInterface, unknown> = async (req, res, next) => {
    const { postId, userId, body, createdAt } = req.body;
    try {
        if(!postId || !userId || !body) throw createHttpError(400, "Missing fields: postId, userId, body");
        if(!mongoose.isValidObjectId(postId)) throw createHttpError(400, "Invalid postId")
        if(!mongoose.isValidObjectId(userId)) throw createHttpError(400, "Invalid userId")
        if(createdAt && !dayjs(createdAt).isValid()) throw createHttpError(400, "Invalid date format.")
        const foundUser = await User.findById(userId).lean().exec();
        if(!foundUser) throw createHttpError(404, "User not found, cannot create comment.");
        const user = {
            userId: foundUser._id,
            username: foundUser.username
        }
        const foundPost = await Post.findById(postId).lean().exec();
        if(!foundPost) throw createHttpError(404, "Post not found, cannot create comment.");
        const comment = await Comment.create({ postId, user, body, createdAt });
        res.status(201).json({ comment });
    }
    catch(error){
        next(error)
    }
}

interface PostsCommentsBody {
    postId: string
}
interface PaginationQuery {
    page: string,
    limit: string,
    sort: string,
    select: string
}
export const getPostsComments: RequestHandler<unknown, unknown, PostsCommentsBody, PaginationQuery> = async (req, res, next) => {
    const { postId } = req.body;
    let limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 20;
    let page;
    if(!req.query.page){
        page = 1;
        limit = 0;
    }
    else {
        page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    }
    const select = req.query.select ? req.query.select : {};
    const sort = req.query.sort ? req.query.sort : undefined;
    try {
        if(!postId) throw createHttpError(400, "Missing field: postId")
        if(!mongoose.isValidObjectId(postId)) throw createHttpError(400, "Invalid postId");
        const comments = await Comment.find({ postId })
            .skip((page-1)*limit)
            .limit(limit)
            .sort(sort)
            .select(select)
            .lean()
            .exec()
        if(comments.length === 0) throw createHttpError(404, "No comments found.");
        res.status(200).json({ comments });
    }
    catch(error){
        next(error)
    }
}

interface DeleteCommentBody {
    id: string
}
export const deleteComment: RequestHandler<unknown, unknown, DeleteCommentBody, unknown> = async (req, res, next) => {
    const { id } = req.body;
    try {
        if(!id) throw createHttpError(400, "Missing field: id");
        if(!mongoose.isValidObjectId(id)) throw createHttpError(400, "Invalid id string")
        const result = await Comment.deleteOne({ _id: id });
        if(result.deletedCount === 0) throw createHttpError(404, "Comment not found.");
        res.status(200).json({ message: `Comment with id: ${id} deleted.` });
    }
    catch(error){
        next(error)
    }
}
