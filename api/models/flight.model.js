import mongoose from 'mongoose';

const FlightSearchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Assumes a user model exists
    },
    searchData: {
        type: Object,
        required: true,
    },
    searchedAt: {
        type: Date,
        default: Date.now,
    },
});

const FlightSearch = mongoose.model('FlightSearch', FlightSearchSchema);

export default FlightSearch;