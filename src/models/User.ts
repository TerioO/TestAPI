import mongoose from "mongoose";

export interface UserInterface {
    username: string,
    birthday?: Date,
    createdAt?: Date,
    updatedAt?: Date
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    birthday: {
        type: Date,
        required: true,
        default: new Date()
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
})

export default mongoose.model<UserInterface>("User", userSchema)