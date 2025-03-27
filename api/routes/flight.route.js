// Import necessary modules
import express from 'express'; // Import Express for routing
// Import controller functions for handling flight and hotel related operations
import {  
    searchFlights, 
    searchMultiCityFlights
} from '../controllers/flight.controller.js'; // Controller functions for flight and hotel operations

const router = express.Router(); // Create a new Express router instance

// Route for searching flights, which invokes the searchFlights controller
router.post('/search-flights', searchFlights); // POST request to search flights

router.post('/multi-city', searchMultiCityFlights);

// Export the router for use in other parts of the application
export default router;