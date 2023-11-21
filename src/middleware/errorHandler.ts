import { Request, Response, NextFunction } from "express";
import { isHttpError } from "http-errors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = async (error: unknown, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = "Unknown Server Error.";
    if(isHttpError(error)){
        statusCode = error.statusCode;
        message = error.message;
    }
    else if(error instanceof Error) {
        message = error.message;
        statusCode = 400;
    }
    else console.log(error)
    res.status(statusCode).json({ message, isError: true });
}