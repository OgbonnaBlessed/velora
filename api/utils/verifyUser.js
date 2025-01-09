// Import necessary modules
import jwt from "jsonwebtoken"; // Import jsonwebtoken for token verification
import { errorHandler } from './error.js'; // Import custom error handler

// Middleware to verify JSON Web Token (JWT)
export const verifyToken = (req, res, next) => {
    // Retrieve the token from the cookies
    const token = req.cookies.access_token;

    // If no token is found, return a 401 Unauthorized error
    if (!token) {
        return next(errorHandler(401, 'You are not signed in')); // Handle missing token error
    }

    // Verify the token using the JWT secret
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // If token verification fails, return a 401 Invalid Token error
            return next(errorHandler(401, 'Invalid token'));
        }
        // Attach the decoded user information to the request object
        req.user = user;
        
        // Proceed to the next middleware or route handler
        next();
    });
};