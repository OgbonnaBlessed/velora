import express from 'express';
import { deleteSearchData, getSearchData, hotelDetails, searchFlights, searchHotels } from '../controllers/flight.controller.js';

const router = express.Router();

// Route for searching flights
router.post('/search-flights', searchFlights);
router.post('/search-hotels', searchHotels);

// Route for fetching user-specific search data
router.get('/search-data/:userId', getSearchData);
router.delete('/search-data/:id', deleteSearchData);
router.get('/hotel-details/:hotelId', hotelDetails);

export default router;