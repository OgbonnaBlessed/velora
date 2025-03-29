// Import necessary modules
import express from 'express'; // Express for routing
// Import controller functions for user management and bookings
import { test, updateUser, deleteUser, signout, getUsers, getUser, getBookmarks, addBookmark, removeBookmark, bookings, bookHotel, cancelBooking, bookCar } from '../controllers/user.controller.js'; 
// Import the token verification middleware for user authentication
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router(); // Create a new Express router instance

// Test route
// GET request to /test endpoint to check if the API is working
router.get('/test', test);

// User management routes
// PUT request to update a user's details, requires token verification
router.put('/update/:userId', verifyToken, updateUser);
// DELETE request to delete a user, requires token verification
router.delete('/delete/:userId', verifyToken, deleteUser);
// POST request to sign out the user
router.post('/signout', signout);
// GET request to fetch all users, requires token verification
router.get('/getusers', verifyToken, getUsers);
// GET request to fetch a specific user by userId
router.get('/:userId', getUser);

// Booking routes
// POST request to make a booking for a user, requires token verification
router.post('/book/:userId', verifyToken, bookings);
// POST request to book a hotel for a user, requires token verification
router.post('/book-hotel/:userId', verifyToken, bookHotel);
router.post('/book-car/:userId',verifyToken, bookCar);
// DELETE request to cancel a user's booking by bookingId
router.delete('/:userId/bookings/:bookingId', cancelBooking); // Cancel booking

// Bookmark routes
// POST request to add a bookmark for a user, requires token verification
router.post('/:userId/bookmark/:postId', verifyToken, addBookmark);
// DELETE request to remove a bookmark for a user, requires token verification
router.delete('/:userId/bookmark/:postId', verifyToken, removeBookmark);
// GET request to fetch all bookmarks for a user, requires token verification
router.get('/:userId/bookmarks', verifyToken, getBookmarks);

// Export the router to be used in other parts of the application
export default router;