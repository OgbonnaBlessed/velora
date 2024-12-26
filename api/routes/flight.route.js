import express from 'express';
import { searchFlights, searchHotels } from '../controllers/Flight.controller.js';

const router = express.Router();

// Route for searching flights
router.post('/search-flights', searchFlights);
router.post('/search-hotels', searchHotels);

export default router;