import mongoose from "mongoose"

export interface CommentInterface {
    postId: string,
    userId: string,
    body: string,
    createdAt?: Date
}

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    }
})

export default mongoose.model<CommentInterface>("Comment", commentSchema);