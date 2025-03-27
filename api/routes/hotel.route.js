import express from 'express'; // Import Express for routing
import { hotelDetails, searchHotels } from '../controllers/hotel.controller.js';

const router = express.Router(); // Create a new Express router instance

// Route for fetching detailed hotel information based on hotel ID
router.get('/hotel-details/:hotelId', hotelDetails); // GET request to get details of a hotel by hotel ID

// Route for searching hotels, which invokes the searchHotels controller
router.post('/search-hotels', searchHotels); // POST request to search hotels

// Export the router for use in other parts of the application
export default router;