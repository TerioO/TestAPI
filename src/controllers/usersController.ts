import createHttpError from "http-errors"
import User, { UserInterface } from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";
import Todo from "../models/Todo";
import mongoose from "mongoose";
import { RequestHandler } from "express"

interface PaginationQuery {
    page: string,
    limit: string,
    sort: string,
    select: string
}
export const getUsers: RequestHandler<unknown, unknown, unknown, PaginationQuery> = async (req, res, next) => {
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
        const users = await User.find({ })
            .skip((page-1)*limit)
            .limit(limit)
            .sort(sort)
            .select(select)
            .lean()
            .exec();
        if(users.length === 0) throw createHttpError(404, "No users found.");
        res.status(200).json({ users });
    }
    catch(error){
        next(error)
    }
} 

export const getUser: RequestHandler = async (req, res, next) => {
    const { userId } = req.params;
    try {
        if(!mongoose.isValidObjectId(userId)) throw createHttpError(400, "Invalid user id.");
        const foundUser = await User.findById(userId).lean().exec();
        if(!foundUser) throw createHttpError(404, "No user found.");
        res.status(200).json({ user: foundUser });
    }
    catch(error){
        next(error)
    }
} 

export const createUser: RequestHandler<unknown, unknown, UserInterface, unknown> = async (req, res, next) => {
    const { username, birthday, createdAt, updatedAt } = req.body;
    const dates = { birthday, createdAt, updatedAt };
    try {
        if(!username) throw createHttpError(400, "Missing field: username");
        Object.entries(dates).forEach(([key, value]) => {
            if(value && !Date.parse(value?.toString())) throw createHttpError(400, `Invalid date string: ${key}`);
        })
        const duplicate = await User.findOne({ username }).lean().exec();
        if(duplicate) throw createHttpError(400, "Username already taken.");
        const newUser = await User.create({ username, birthday, createdAt, updatedAt });
        res.status(201).json({ user: newUser });
    }
    catch(error){
        next(error)
    }
} 

interface UpdateBody {
    username?: string,
    birthday?: Date
}
interface UpdateParams { 
    userId: string 
}
export const updateUser: RequestHandler<UpdateParams, unknown, UpdateBody, unknown> = async (req, res, next) => {
    const { username, birthday } = req.body;
    const { userId } = req.params;
    try {
        if(!mongoose.isValidObjectId(userId)) throw createHttpError(400, "Invalid user id.");
        if(!username && !birthday) throw createHttpError(400, "Missing field: username or birthday");
        if(birthday && Date.parse(birthday.toString())) throw createHttpError(400, "Invalid date string: birthday");
        const user = await User.findById(userId).exec();
        if(!user) throw createHttpError(404, "User not found.");
        if(birthday) user.birthday = birthday;
        if(username) {
            const duplicate = await User.findOne({ username }).lean().exec();
            if(duplicate) throw createHttpError(400, "Username already taken.")
            user.username = username;
        }
        user.updatedAt = new Date();
        const updatedUser = await user.save();
        res.status(200).json({ user: updatedUser });
    }
    catch(error){
        next(error)
    }
} 


export const deleteUser: RequestHandler = async (req, res, next) => {
    const { userId } = req.params;
    try {
        if(!mongoose.isValidObjectId(userId)) throw createHttpError(400, "Invalid user id.");
        const result = await User.deleteOne({ _id: userId });
        if(result.deletedCount === 0) throw createHttpError(404, "User not found.");
        await Post.deleteMany({ userId });
        await Todo.deleteMany({ userId });
        await Comment.deleteMany({ "user.userId": userId });
        res.status(200).json({ message: "User deleted along with every user data." });
    }
    catch(error){
        next(error)
    }
} 