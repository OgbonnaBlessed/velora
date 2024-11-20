import mongoose from "mongoose";

const userSchema = new mongoose.Schema ({
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
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hotels'
    }],
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hotels'
    }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;