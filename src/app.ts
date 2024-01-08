import express from "express";
// import { connectDB } from "./config/connectDB";
import cors from "cors";
// Middleware:
import { errorHandler } from "./middleware/errorHandler";
// Routers:
import usersRouter from "./routes/usersRouter";
import postsRouter from "./routes/postsRouter";
import commentsRouter from "./routes/commentRouter";
import todosRouter from "./routes/todosRouter";

// Init:
export function getApp() {
    const app = express();
    // Middleware:
    app.use(cors()); // Allow all CORS requests
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routers:
    app.use("/users", usersRouter);
    app.use("/posts", postsRouter);
    app.use("/comments", commentsRouter);
    app.use("/todos", todosRouter);

    // 404:
    app.use("*", (req, res) => {
        res.status(404);
        if (req.accepts("application/json")) res.json({ message: "Not Found." });
        else if (req.accepts("html")) res.send("A 404.html page doesn't exist yet");
    })

    // Error Handler:
    app.use(errorHandler)
    return app;
}