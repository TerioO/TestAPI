import { RequestHandler } from "express";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import Post, { PostInterface } from "../models/Post";
import User from "../models/User";

interface PaginationQuery {
    page: string,
    limit: string,
    sort: string,
    select: string
}
export const getPosts: RequestHandler<unknown, unknown, unknown, PaginationQuery> = async (req, res, next) => {
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
        const posts = await Post.find({ })
            .skip((page-1)*limit)
            .limit(limit)
            .sort(sort)
            .select(select)
            .lean()
            .exec();
        if(posts.length === 0) throw createHttpError(404, "No posts found.");
        res.status(200).json({ posts });
    }
    catch(error){
        next(error)
    }
}

export const getPost: RequestHandler = async (req, res, next) => {
    const { postId } = req.params;
    try {
        if(!mongoose.isValidObjectId(postId)) throw createHttpError(400, "Invalid post id.");
        const foundPost = await Post.findById(postId).lean().exec();
        if(!foundPost) throw createHttpError(404, "Post not found.");
        const user = await User.findById(foundPost.userId).lean().select("username").exec();
        if(!user) throw createHttpError(404, "User not found.");
        res.status(200).json({ user, post: foundPost });
    }
    catch(error){
        next(error)
    }
}

export const createPost: RequestHandler<unknown, unknown, PostInterface, unknown> = async (req, res, next) => {
    const { userId, title, body, createdAt } = req.body;
    try {
        if(!title || !body || !userId) throw createHttpError(400, "Missing fields: title, body, userId");
        if(!mongoose.isValidObjectId(userId)) throw createHttpError(400, "Invalid user id.");
        if(createdAt && !Date.parse(createdAt.toString())) throw createHttpError(400, "Invalid date string.");
        const foundUser = await User.findById(userId).lean().exec();
        if(!foundUser) throw createHttpError(404, "User not found.");
        const post = await Post.create({ userId, title, body, createdAt });
        res.status(201).json({ post });
    }
    catch(error){
        next(error)
    }
}

export const updatePost: RequestHandler<{ postId: string }, unknown, PostInterface, unknown> = async (req, res, next) => {
    const { title, body } = req.body;
    const { postId } = req.params;
    try {
        if(!mongoose.isValidObjectId(postId)) throw createHttpError(400, "Invalid post id.");
        if(!title && !body) throw createHttpError(400, "Missing one of: title, body");
        const foundPost = await Post.findById(postId).exec();
        if(!foundPost) throw createHttpError(404, "Post not found.");
        if(title) foundPost.title = title;
        if(body) foundPost.body = body;
        foundPost.updatedAt = new Date();
        const post = await foundPost.save();
        res.status(200).json({ post });
    }
    catch(error){
        next(error)
    }
}

export const deletePost: RequestHandler = async (req, res, next) => {
    const { postId } = req.params;
    try {
        if(!mongoose.isValidObjectId(postId)) throw createHttpError(400, "Invalid post id.");
        const result = await Post.deleteOne({ _id: postId });
        if(result.deletedCount === 0) throw createHttpError(404, "Post not found.");
        res.status(200).json({ message: `Post with id: ${postId} deleted` });
    }
    catch(error){
        next(error)
    }
}