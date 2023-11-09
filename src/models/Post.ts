import mongoose from "mongoose"

export interface PostInterface {
    userId: string,
    title: string,
    body: string,
    createdAt?: Date,
    updatedAt?: Date
}

const postSchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        required: true,
        default: new Date()
    }
});

export default mongoose.model<PostInterface>("Post", postSchema);