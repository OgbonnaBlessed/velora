// Import mongoose to interact with MongoDB
import mongoose from "mongoose";

// Session schema to track user login sessions and device information
const sessionSchema = new mongoose.Schema({
    deviceName: { type: String, default: 'Unknown Device' }, // Device name user is logging in from
    browser: { type: String, default: 'Unknown Browser' }, // Browser user is using for login
    os: { type: String, default: 'Unknown OS' }, // Operating system used by the device
    ip: { type: String }, // IP address of the user's device
    loggedInAt: { type: Date, default: Date.now }, // Date when the user logged in
    token: String, // Session token for the user
});

// Emergency contact schema for storing emergency contact details
const emergencyContactSchema = new mongoose.Schema({
    name: { 
        type: String, 
        default: 'Not provided' // Default value if name is not provided
    },
    countryCode: { 
        type: String, 
        default: '+1' // Default country code
    },
    phoneNumber: { 
        type: String, 
        default: 'Not provided' // Default value if phone number is not provided
    },
});

// Location schema to store user address details
const locationSchema = new mongoose.Schema({
    region: {
        type: String,
        default: 'United States' // Default region value
    },
    address: {
        type: String,
        default: 'Not provided' // Default value if address is not provided
    },
    city: {
        type: String,
        default: 'Not provided' // Default value if city is not provided
    },
    state: {
        type: String,
        default: 'Not provided' // Default value if state is not provided
    },
    zip: {
        type: String,
        default: 'Not provided' // Default value if zip code is not provided
    }
});

// Airport security information schema
const airportSecuritySchema = new mongoose.Schema({
    knownTravelarNumber: {
        type: String,
        default: 'Not provided' // Default value if the number is not provided
    },
    redressNumber: {
        type: String,
        default: 'Not provided' // Default value if the number is not provided
    },
});

// Travel document schema to store passport information
const travelDocumentSchema = new mongoose.Schema({
    country: {
        type: String,
        default: 'United States', // Default country value
    },
    passportNumber: {
        type: String,
        default: 'Not provided' // Default value if passport number is not provided
    },
    expirationDate: {
        type: String,
        default: 'Not provided' // Default value if expiration date is not provided
    }
});

// User preferences schema for travel preferences
const preferencesSchema = new mongoose.Schema({
    country: {
        type: String,
        default: 'United States' // Default country for preferences
    },
    seatPreference: {
        type: String,
        default: 'No preference' // Default seat preference
    },
    specialAssisstance: {
        type: String,
        default: 'None', // Default for special assistance
    }
})

// Credit card schema for storing payment card information
const cardSchema = new mongoose.Schema({
    cardName: {
        type: String,
        default: 'Not provided' // Default card name if not provided
    },
    cardNumber: {
        type: String, // Card number
    },
    expirationDate: {
        type: String,
        default: 'Not provided' // Default expiration date if not provided
    },
    securityCode: {
        type: String,
        default: 'Not provided' // Default security code if not provided
    }
});

// Main user schema to hold detailed user information
const userSchema = new mongoose.Schema ({
    firstName: {
        type: String,
        required: true, // First name is required
        unique: true, // First name must be unique
    },
    middleName: {
        type: String,   // Middle name is optional
    },
    lastName: {
        type: String,
        required: true, // Last name is required
        unique: true, // Last name must be unique
    },
    bio: {
        type: String,
        default: 'Not provided', // Default bio if not provided
    },
    DOB: {
        type: String,
        default: 'Not provided', // Default date of birth if not provided
    },
    gender: {
        type: String,
        default: 'Not provided', // Default gender if not provided
    },
    needs: {
        type: String,
        default: 'Not provided', // Default needs if not provided
    },
    number: {
        type: String,
        default: 'Not provided', // Default phone number if not provided
    },
    countryCode: {
        type: String,
        default: '+1', // Default country code
    },
    emergency: {
        type: emergencyContactSchema, // Emergency contact details
        default: null, // Default value is null if no emergency contact is provided
    },
    location: {
        type: locationSchema, // User's location details
        default: null, // Default value is null if no location is provided
    },
    airportSecurity: {
        type: airportSecuritySchema, // User's airport security details
        default: null, // Default value is null if no security details are provided
    },
    travelDocument: {
        type: travelDocumentSchema, // User's travel document details
        default: null, // Default value is null if no travel document is provided
    },
    preference: {
        type: preferencesSchema, // User's preferences for travel
        default: null // Default value is null if no preferences are provided
    },
    paymentCard: {
        type: cardSchema, // User's payment card details
        default: null // Default value is null if no payment card is provided
    },
    email: {
        type: String,
        required: true, // Email is required
        unique: true, // Email must be unique
    },
    password: {
        type: String,
        required: true, // Password is required
    },
    profilePicture: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/149/149071.png", // Default profile picture if none is provided
    },
    isAdmin: {
        type: Boolean,
        default: false, // Default is not an admin
    },
    connectedAccounts: [
        {
            provider: { type: String, required: true }, // Provider of the connected account (e.g., Google, Facebook)
            email: { type: String, required: true }, // Email of the connected account
            connectedAt: { type: Date, default: Date.now }, // Date when the account was connected
        },
    ],
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hotels' // References the hotel model for user's favorite hotels
    }],
    bookings: [{}], // List of bookings made by the user
    sessions: [sessionSchema], // Stores login session details
}, { timestamps: true }); // Automatically manage createdAt and updatedAt timestamps

// Create and export the user model
const User = mongoose.model('User', userSchema);

export default User;