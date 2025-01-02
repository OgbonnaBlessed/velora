import express from 'express';
import { deleteSearchData, getSearchData, searchFlights, searchHotels } from '../controllers/Flight.controller.js';

const router = express.Router();

// Route for searching flights
router.post('/search-flights', searchFlights);
router.post('/search-hotels', searchHotels);

// Route for fetching user-specific search data
router.get('/search-data/:userId', getSearchData);
router.delete('/search-data/:id', deleteSearchData);

export default router;