import express from 'express';
import { searchFlights } from '../controllers/Flight.controller.js';

const router = express.Router();

// Route for searching flights
router.post('/search-flights', searchFlights);

export default router;