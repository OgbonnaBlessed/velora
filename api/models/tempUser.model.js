// Import mongoose library to interact with MongoDB
import mongoose from "mongoose";

// Define a schema for temporary user data (used for user registration and OTP-based validation)
const tempUserSchema = new mongoose.Schema({
    // First name of the user
    firstName: {
        type: String, // String type for first name
        required: true, // Ensures firstName is provided
        unique: true, // Ensures firstName is unique
    },
    // Last name of the user
    lastName: {
        type: String, // String type for last name
        required: true, // Ensures lastName is provided
        unique: true, // Ensures lastName is unique
    },
    // User's bio
    bio: {
        type: String, // String type for bio
        default: 'Not provided', // Default value if bio is not provided
    },
    // Date of birth
    DOB: {
        type: String, // String type for date of birth (can be modified to Date type if needed)
        default: 'Not provided', // Default value if DOB is not provided
    },
    // Gender of the user
    gender: {
        type: String, // String type for gender
        default: 'Not provided', // Default value if gender is not provided
    },
    // User's specific needs (could refer to accommodations, preferences, etc.)
    needs: {
        type: String, // String type for needs
        default: 'Not provided', // Default value if needs are not provided
    },
    // Phone number of the user
    number: {
        type: String, // String type for phone number
        default: 'Not provided', // Default value if number is not provided
    },
    // Emergency contacts (array of strings)
    emergency: [{
        type: String, // Array of strings for emergency contacts
        default: 'Not provided', // Default value if emergency contacts are not provided
    }],
    // User's address
    address: {
        type: String, // String type for address
        default: 'Not provided', // Default value if address is not provided
    },
    // Email of the user (must be unique and required)
    email: {
        type: String, // String type for email
        required: true, // Ensures email is provided
        unique: true, // Ensures email is unique
    },
    // Password for the user account (required for registration)
    password: {
        type: String, // String type for password
        required: true, // Ensures password is provided
    },
    // Profile picture URL (default image if not provided)
    profilePicture: {
        type: String, // String type for profile picture URL
        default: "https://cdn-icons-png.flaticon.com/128/149/149071.png", // Default image URL
    },
    // Flag to determine if the user is an admin (default: false)
    isAdmin: {
        type: Boolean, // Boolean type for admin status
        default: false, // Default value is false
    },
    // OTP code for verification during registration process
    otp: {
        type: String, // String type for OTP
        required: true, // Ensures OTP is provided
    },
    // OTP expiration time (document will be deleted when expired)
    otpExpires: {
        type: Date, // Date type for OTP expiration
        required: true, // Ensures otpExpires is provided
        index: { expires: '0s' }, // Automatically deletes the document when the OTP expires
    },
}, { timestamps: true }); // Timestamps automatically manage createdAt and updatedAt fields

// Create the TempUser model based on the schema and export it
const TempUser = mongoose.model('TempUser', tempUserSchema);

export default TempUser;