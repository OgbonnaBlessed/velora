// Import necessary modules
import express from 'express'; // Import Express for routing
// Import controller functions to handle requests
import { 
    signup, 
    signin, 
    google, 
    handlePasswordResetRequest, 
    verifyCode, 
    resetPassword, 
    verifyOTP, 
    resendOTP, 
    resendCode, 
    getConnectedDevices, 
    logoutDevice, 
    confirmEmail, 
    getConnectedAccounts 
} from '../controllers/auth.controller.js'; // Controller functions for authentication
// Import the middleware to verify the user's token
import { verifyToken } from '../utils/verifyUser.js'; 

const router = express.Router(); // Create a new Express router instance

// Define routes and their associated controller functions
router.post('/signup', signup); // Route for user signup
router.post('/verify-otp', verifyOTP); // Route for verifying OTP during signup/signin
router.post('/resend-otp', resendOTP); // Route to resend OTP to the user
router.post('/signin', signin); // Route for user login/signin
router.post('/google', google); // Route for Google login/signup
router.post('/password-reset', handlePasswordResetRequest); // Route to handle password reset requests
router.post('/verify-code', verifyCode); // Route for verifying reset password code
router.post('/confirm-email', confirmEmail); // Route for confirming email address
router.post('/resend-code', resendCode); // Route to resend verification code to email
router.post('/reset-password', resetPassword); // Route to reset password after verification
router.get('/connected-devices', verifyToken, getConnectedDevices); // Route to get list of connected devices (protected by token verification)
router.post('/logout-device', verifyToken, logoutDevice); // Route to logout from a device (protected by token verification)
router.get('/connected-accounts', verifyToken, getConnectedAccounts); // Route to get list of connected accounts (protected by token verification)

export default router; // Export the router to be used in other parts of the application