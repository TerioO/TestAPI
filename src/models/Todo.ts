import mongoose from "mongoose"

export interface TodoInterface {
    userId: string,
    title: string,
    body: string,
    completed: boolean,
    deadline: Date
}
const todoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
    }
})

export default mongoose.model<TodoInterface>("Todo", todoSchema)