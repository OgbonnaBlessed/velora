import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        required: true,
    },
    otpExpires: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

const TempUser = mongoose.model('TempUser', tempUserSchema);

export default TempUser;