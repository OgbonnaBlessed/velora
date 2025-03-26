// Import necessary modules
import express from 'express'; // Import Express for routing
// Import controller functions for handling flight and hotel related operations
import { 
    deleteSearchData, 
    getSearchData, 
    hotelDetails, 
    searchFlights, 
    searchHotels, 
    searchMultiCityFlights
} from '../controllers/flight.controller.js'; // Controller functions for flight and hotel operations

const router = express.Router(); // Create a new Express router instance

// Route for searching flights, which invokes the searchFlights controller
router.post('/search-flights', searchFlights); // POST request to search flights

router.post('/multi-city', searchMultiCityFlights);

// Route for searching hotels, which invokes the searchHotels controller
router.post('/search-hotels', searchHotels); // POST request to search hotels

// Route for fetching user-specific search data by user ID
router.get('/search-data/:userId', getSearchData); // GET request to fetch search data by user ID

// Route for deleting search data by specific ID
router.delete('/search-data/:id', deleteSearchData); // DELETE request to remove search data by ID

// Route for fetching detailed hotel information based on hotel ID
router.get('/hotel-details/:hotelId', hotelDetails); // GET request to get details of a hotel by hotel ID

// Export the router for use in other parts of the application
export default router;