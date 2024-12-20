import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    deviceName: { type: String, default: 'Unknown Device' },
    browser: { type: String, default: 'Unknown Browser' },
    os: { type: String, default: 'Unknown OS' },
    ip: { type: String },
    loggedInAt: { type: Date, default: Date.now },
    token: String,
});

const emergencyContactSchema = new mongoose.Schema({
    name: { 
        type: String, 
        default: 'Not provided' 
    },
    countryCode: { 
        type: String, 
        default: '+1' 
    },
    phoneNumber: { 
        type: String, 
        default: 'Not provided' 
    },
});

const locationSchema = new mongoose.Schema({
    region: {
        type: String,
        default: 'United states'
    },
    address: {
        type: String,
        default: 'Not provided'
    },
    city: {
        type: String,
        default: 'Not provided'
    },
    state: {
        type: String,
        default: 'Not provided'
    },
    zip: {
        type: String,
        default: 'Not provided'
    }
});

const airportSecuritySchema = new mongoose.Schema({
    knownTravelarNumber: {
        type: String,
        default: 'Not provided'
    },
    redressNumber: {
        type: String,
        default: 'Not provided'
    },
});

const travelDocumentSchema = new mongoose.Schema({
    country: {
        type: String,
        default: 'United states',
    },
    passportNumber: {
        type: String,
        default: 'Not provided'
    },
    expirationDate: {
        type: String,
        default: 'Not provided'
    }
});

const preferencesSchema = new mongoose.Schema({
    country: {
        type: String,
        default: 'United states'
    },
    seatPreference: {
        type: String,
        default: 'No preference'
    },
    specialAssisstance: {
        type: String,
        default: 'None',
    }
})

const cardSchema = new mongoose.Schema({
    cardName: {
        type: String,
        default: 'Not provided'
    },
    cardNumber: {
        type: String,
    },
    expirationDate: {
        type: String,
        default: 'Not provided'
    },
    securityCode: {
        type: String,
        default: 'Not provided'
    }
});

const userSchema = new mongoose.Schema ({
    firstName: {
        type: String,
        required: true,
        unique: true,
    },
    middleName: {
        type: String,   
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
    countryCode: {
        type: String,
        default: '+1',
    },
    emergency: {
        type: emergencyContactSchema,
        default: null,
    },
    location: {
        type: locationSchema,
        default: null,
    },
    airportSecurity: {
        type: airportSecuritySchema,
        default: null,
    },
    travelDocument: {
        type: travelDocumentSchema,
        default: null,
    },
    preference: {
        type: preferencesSchema,
        default: null
    },
    paymentCard: {
        type: cardSchema,
        default: null
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
    connectedAccounts: [
        {
            provider: { type: String, required: true }, // e.g., Google, Facebook
            email: { type: String, required: true },
            connectedAt: { type: Date, default: Date.now },
        },
    ],
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hotels'
    }],
    bookings: [{}],
    sessions: [sessionSchema], // Add this field to track sessions
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;