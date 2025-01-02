import mongoose from 'mongoose';

const SearchDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    searchType: {
        type: String,
        enum: ['flights', 'stays'],
        required: true,
    },
    origin: String,
    destination: String,
    departureDate: Date,
    returnDate: Date,
    numberOfTravelers: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('SearchData', SearchDataSchema);