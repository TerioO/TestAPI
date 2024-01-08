import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Todo, { TodoInterface } from "../models/Todo";
import User from "../models/User";
import mongoose from "mongoose";

interface PaginationQuery {
    page: string,
    limit: string,
    sort: string,
    select: string
}
export const getTodos: RequestHandler<unknown, unknown, unknown, PaginationQuery> = async (req, res, next) => {
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
        const todos = await Todo.find({ })
            .skip((page-1)*limit)
            .limit(limit)
            .sort(sort)
            .select(select)
            .lean()
            .exec();
        if(todos.length === 0) throw createHttpError(404, "No todos found.");
        res.status(200).json({ todos });
    }
    catch(error){
        next(error)
    }
}

export const getTodo: RequestHandler = async (req, res, next) => {
    const { todoId } = req.params;
    try {
        if(!mongoose.isValidObjectId(todoId)) throw createHttpError(400, "Invalid user id.");
        const foundTodo = await Todo.findById(todoId).lean().exec();
        if(!foundTodo) throw createHttpError(404, "No user found.");
        res.status(200).json({ todo: foundTodo });
    }
    catch(error){
        next(error)
    }
}

export const createTodo: RequestHandler<unknown, unknown, TodoInterface, unknown> = async (req, res, next) => {
    const { userId, title, body, deadline, completed } = req.body;
    try {
        if(!userId || !title || !body || !deadline) throw createHttpError(400, "Missing fields: userId, title, body, deadline")
        if(!mongoose.isValidObjectId(userId)) throw createHttpError(400, "Invalid userId")
        if(deadline && !Date.parse(deadline.toString())) throw createHttpError(400, "Invalid date string")
        const foundUser = await User.findById(userId).lean().exec();
        if(!foundUser) throw createHttpError(404, "User not found.");
        const todo = await Todo.create({ userId, title, body, deadline, completed });
        res.status(201).json({ todo });
    }
    catch(error){
        next(error)
    }
}

export const updateTodo: RequestHandler<{ todoId: string }, unknown, Partial<TodoInterface>, unknown> = async (req, res, next) => {
    const { title, body, deadline, completed } = req.body;
    const { todoId } = req.params;
    try {
        if(!title && !body && !deadline && !completed) throw createHttpError(400, "Missing one of: title, body, deadline, completed")
        if(deadline && !Date.parse(deadline.toString())) throw createHttpError(400, "Invalid date string")
        const todo = await Todo.findById(todoId).exec();
        if(!todo) throw createHttpError(404, "Todo not found.");
        if(title) todo.title = title;
        if(body) todo.body = body;
        if(deadline) todo.deadline = deadline;
        if(completed) todo.completed = completed;
        const updatedTodo = await todo.save();
        res.status(200).json({ todo: updatedTodo })
    }
    catch(error){
        next(error)
    }
}

export const deleteTodo: RequestHandler = async (req, res, next) => {
    const { todoId } = req.params;
    try {
        if(!todoId || !mongoose.isValidObjectId(todoId)) throw createHttpError(400, "Invalid todo id")
        const response = await Todo.deleteOne({ _id: todoId })
        if(response.deletedCount === 0) throw createHttpError(404, "Todo not found")
        res.status(200).json({ message: `Todo with id: ${todoId} deleted` })
    }
    catch(error){
        next(error)
    }
}