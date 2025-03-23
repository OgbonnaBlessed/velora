// Import mongoose library to interact with MongoDB
import mongoose from 'mongoose';

// Define a schema for storing search data
const SearchDataSchema = new mongoose.Schema({
    // Reference to the User model, associates search data with a user
    userId: {
        type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type
        ref: 'User', // Refers to the 'User' model, establishing a relationship
        required: true, // Ensures userId is provided
    },
    // The type of search (either flights or stays)
    searchType: {
        type: String, // String type for the search type
        enum: ['flights', 'stays', 'cars'], // Only allow 'flights' or 'stays' as values
        required: true, // Ensures searchType is provided
    },
    // Details of the flight or stay search
    origin: String, // Starting point for flights
    destination: String, // Destination point for flights
    departureDate: Date, // Date of departure for flights
    returnDate: Date, // Date of return for round trips
    // The number of travelers in the search
    numberOfTravelers: {
        type: Number, // Number type for the count of travelers
        required: true, // Ensures numberOfTravelers is provided
    },
    // Automatically set the creation date to the current date/time
    createdAt: {
        type: Date,
        default: Date.now, // Default value is the current date/time
    },
});

// Export the SearchData model, which allows interacting with the 'SearchData' collection in MongoDB
export default mongoose.model('SearchData', SearchDataSchema);