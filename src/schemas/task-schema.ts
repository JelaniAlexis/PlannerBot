import mongoose from "mongoose";

const schema = new mongoose.Schema({
    taskname: {
        type: String,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    userID: {
        type: Number,
        required: true
    }
});

export default mongoose.model('tasks', schema);