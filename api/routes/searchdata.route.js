import express from 'express'
import { deleteSearchData, getSearchData } from '../controllers/searchdata.controller.js';

const router = express.Router();

// Route for fetching user-specific search data by user ID
router.get('/search-data/:userId', getSearchData); // GET request to fetch search data by user ID

// Route for deleting search data by specific ID
router.delete('/search-data/:id', deleteSearchData); // DELETE request to remove search data by ID

export default router;