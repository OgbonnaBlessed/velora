import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        unique: true,
    },
    lastName: {
        type: String,
        required: true,
        unique: true,
    },
    bio: {
        type: String,
        default: 'Not provided',
    },
    DOB: {
        type: String,
        default: 'Not provided',
    },
    gender: {
        type: String,
        default: 'Not provided',
    },
    needs: {
        type: String,
        default: 'Not provided',
    },
    number: {
        type: String,
        default: 'Not provided',
    },
    emergency: [{
        type: String,
        default: 'Not provided',
    }],
    address: {
        type: String,
        default: 'Not provided',
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
        index: { expires: '0s' }, // This will automatically delete the document when the otpExpires is reached
    },
}, { timestamps: true });

const TempUser = mongoose.model('TempUser', tempUserSchema);

export default TempUser;