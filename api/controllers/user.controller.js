// Importing necessary modules
import bcryptjs from "bcryptjs" // To handle password hashing
import { errorHandler } from "../utils/error.js" // Custom error handler utility
import User from "../models/user.model.js" // Importing the User model for interacting with the database
import nodemailer from 'nodemailer' // Nodemailer for email handling (though not used in this file)
import { v4 as uuidv4 } from 'uuid'; // For generating unique identifiers (UUIDs, though not used in this file)


// A simple test route to check if the API is working
export const test = (req, res) => {
    res.json({ message: "API is working."}); // Responds with a message
}

// Function to update user information
export const updateUser = async (req, res, next) => {
    // Check if the user is trying to update their own profile
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this profile')); // Forbidden if the user doesn't match
    }

    // If a password is provided, validate and hash it
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters')) // Ensure password is at least 6 characters
        }

        // Hash the password before saving it to the database
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // If a username is provided, validate it
    if (req.body.username) {
        // Ensure the username length is between 7 and 20 characters
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
        }

        // Ensure username does not contain spaces
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username can not contain spaces'))
        }

        // Ensure the username is in lowercase
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lower case'))
        }

        // Ensure username only contains letters and numbers
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username can only contain letters and numbers'))
        }
    }
    
    // Attempt to update the user in the database
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: req.body, // Set updated fields in the body
        }, {new: true }); // Return the updated document

        // Exclude the password from the response
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest); // Send back updated user details without password

    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
}

// Function to delete a user
export const deleteUser = async (req, res, next) => {
    // Check if the user is authorized to delete the profile (must be an admin or the user themselves)
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this user')); // Forbidden if not authorized
    }

    try {
        // Find the user by ID and delete
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted'); // Respond with success message
    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
}

// Function to sign out the user by clearing the access token cookie
export const signout = (req, res, next) => {
    try {
        // Clear the 'access_token' cookie and send a sign out message
        res.clearCookie('access_token').status(200).json('User has been signed out');
    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
}

// Function to get a list of users (only for admins)
export const getUsers = async (req, res, next) => {
    // Ensure only admins can view all users
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to see all users')); // Forbidden if not an admin
    }

    try {
        // Pagination and sorting
        const  startIndex = parseInt(req.query.startIndex) || 0; // Default to starting from index 0
        const limit = parseInt(req.query.limit) || 9; // Limit the number of users returned
        const sortDirection = req.query.sort === 'asc' ? 1 : -1; // Sort by creation date, ascending or descending

        // Fetch users based on the pagination and sorting parameters
        const users = await User.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);

        // Exclude password from each user in the list
        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest; // Return user data without password
        })

        // Get the total number of users in the database
        const totalUsers = await User.countDocuments();

        // Get the count of users who registered within the last month
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }, // Count users created after one month ago
        })

        // Send back the list of users, total users, and users from the last month
        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        })

    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
}

// Function to get a specific user's details
export const getUser = async (req, res, next) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.params.userId);

        // If the user doesn't exist, return an error
        if (!user) {
            return next(errorHandler(404, 'User not found!')); // Not found if user does not exist
        }

        // Exclude password from the response
        const { password, ...rest } = user._doc;
        res.status(200).json(rest); // Send back user details without password
        
    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
}

// Add a bookmark
export const addBookmark = async (req, res, next) => {
    const { userId, postId } = req.params; // Extract userId and postId from request parameters

    try {
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) return next(errorHandler(404, "User not found!")); // If user is not found, return an error response

        // Check if the post is already bookmarked by this user
        if (user.bookmarks.includes(postId)) {
            return res.status(400).json({ message: "Post already bookmarked" }); // If post is already bookmarked, send a response indicating so
        }

        // Add the postId to the user's bookmarks array
        user.bookmarks.push(postId);
        await user.save(); // Save the updated user document

        // Send a success response with the updated bookmarks array
        res.status(200).json({ message: "Post bookmarked successfully", bookmarks: user.bookmarks });
    } catch (error) {
        next(error); // Catch and pass any errors to the error handler
    }
};

// Remove a bookmark
export const removeBookmark = async (req, res, next) => {
    const { userId, postId } = req.params; // Extract userId and postId from request parameters

    try {
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) return next(errorHandler(404, "User not found!")); // If user is not found, return an error response

        // Check if the post is in the user's bookmarks
        if (!user.bookmarks.includes(postId)) {
            return res.status(400).json({ message: "Post not found in bookmarks" }); // If post is not in bookmarks, return an error message
        }

        // Remove the postId from the user's bookmarks array
        user.bookmarks = user.bookmarks.filter(bookmark => bookmark.toString() !== postId);
        await user.save(); // Save the updated user document

        // Send a success response with the updated bookmarks array
        res.status(200).json({ message: "Post removed from bookmarks", bookmarks: user.bookmarks });
    } catch (error) {
        next(error); // Catch and pass any errors to the error handler
    }
};

// Get all bookmarks for a user
export const getBookmarks = async (req, res, next) => {
    const { userId } = req.params; // Extract userId from request parameters

    try {
        // Find the user by userId and populate the bookmarks field with post details
        const user = await User.findById(userId).populate('bookmarks');
        if (!user) return next(errorHandler(404, "User not found!")); // If user is not found, return an error response

        // Send a success response with the user's bookmarks and the total number of bookmarks
        res.status(200).json({
            bookmarks: user.bookmarks, // The list of all bookmarks (posts)
            totalBookmarks: user.bookmarks.length, // The total count of bookmarks
        });
        
    } catch (error) {
        next(error); // Catch and pass any errors to the error handler
    }
};

// Handle user flight bookings
export const bookings = async (req, res, next) => {
    // Check if the user is trying to book for themselves
    if (req.user.id !== req.params.userId) {
        // If the user doesn't have permission to book for the given user, return a 403 error
        return next(errorHandler(403, 'You are not allowed to book for this user'));
    }

    const { formData, flight } = req.body; // Extract flight details and form data from the request body

    try {
        // Generate a unique ID for the booking using uuid
        const bookingWithId = { ...flight, id: uuidv4() };

        // Update the user's document by adding the booking details to their bookings array and updating their personal data (if applicable)
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $push: { bookings: bookingWithId }, // Add the new booking to the user's bookings array
                $set: { ...formData }, // Update user data (such as contact info) with the provided formData
            },
            { new: true } // Return the updated user document
        );

        // Helper function to format time in a 12-hour clock format (e.g., 3:30 PM)
        const formatTime = (date) =>
            new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
        }).format(new Date(date));

        // Helper function to format date (e.g., Jan 1, 2024)
        const formatDate = (dateString) => {
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
        };

        // Helper function to capitalize the first letter of each word in a string
        const formatWord = (word) => {
            return word.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
        };

        // Helper function to calculate the total duration of the flight in minutes
        const getFlightDuration = (flight) => {
            const segments = flight.itineraries[0]?.segments; // Get flight segments
            const departureTime = new Date(segments[0].departure.at).getTime(); // Get departure time in milliseconds
            const arrivalTime = new Date(segments[segments.length - 1].arrival.at).getTime(); // Get arrival time in milliseconds
            return (arrivalTime - departureTime) / (1000 * 60); // Return duration in minutes
        };

        // Helper function to calculate the arrival date by adding the flight duration to the departure time
        const getArrivalDate = (flight) => {
            const segments = flight.itineraries[0]?.segments; // Get flight segments
            const departureTime = new Date(segments[0].departure.at).getTime(); // Get departure time in milliseconds
            const flightDurationInMinutes = getFlightDuration(flight); // Get flight duration in minutes
            
            // Calculate the arrival time by adding the duration to the departure time
            const arrivalTime = departureTime + (flightDurationInMinutes * 60 * 1000); 
            return new Date(arrivalTime); // Return the arrival time as a Date object
        };

        const arrivalDate = getArrivalDate(flight); // Get the arrival date using the helper function

        // Set up the email transporter using SMTP to send booking confirmation
        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.EMAIL_USER, // Email username from environment variables
                pass: process.env.EMAIL_PASS, // Email password from environment variables
            },
            tls: {
                rejectUnauthorized: false, // Allow self-signed certificates
            },
        });

        // Define the email content and structure (HTML formatted)
        const mailOptions = {
            from: `"Velora" <${process.env.EMAIL_USER}>`, // Sender email address
            to: updatedUser.email, // Recipient email (the user's email)
            subject: 'Booking Confirmation', // Subject line
            html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
                    <h2 style="color: #48aadf;">Booking Confirmation</h2>
                    <p style="font-size: 1.1em;">Thank you for booking with Velora!</p>
                </div>
                <div style="padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px; margin: 20px auto; max-width: 600px;">
                    <p><strong>Dear ${formData.firstName} ${formData.lastName},</strong></p>
                    <p>We are pleased to confirm your flight booking. Here are your flight details:</p>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Flight Number:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${flight.id}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Origin:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">
                                ${formatWord(flight.itineraries[0].segments[0].departure.cityName)}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Destination:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">
                                ${formatWord(flight.itineraries[0].segments.slice(-1)[0].arrival.cityName)}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Departure:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">
                                ${formatDate(flight.itineraries[0].segments[0].departure.at)} at ${formatTime(flight.itineraries[0].segments[0].departure.at)}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Arrival:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">
                                ${formatDate(arrivalDate)}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total Price:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">
                                ${flight.price.currency} ${flight.price.total}
                            </td>
                        </tr>
                    </table>
                    <p>We wish you a pleasant journey! If you have any questions, please feel free to contact us.</p>
                </div>
                <div style="background-color: #48aadf; color: #ffffff; text-align: center; padding: 10px;">
                    <p style="margin: 0;">&copy; 2024 Velora. All rights reserved.</p>
                </div>
            </div>`,
        };

        // Send the booking confirmation email
        await transporter.sendMail(mailOptions);
    
        // Exclude the password from the response and send the updated user details (excluding sensitive information)
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest); // Return the updated user information as a response
    
    } catch (error) {
        next(error); // Pass any errors to the error handler
    }
};

// Handle user hotel bookings
export const bookHotel = async (req, res, next) => {
    // Check if the user trying to make the booking is the same as the one whose ID is in the URL
    // If not, send a 403 error indicating unauthorized access
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to book for this user'));
    }

    // Destructure formData, hotelDetails, and total from the request body
    // formData holds user data, hotelDetails holds hotel information, and total holds the booking cost
    const { formData, hotelDetails, total } = req.body;

    try {
        // Add a unique ID to the booking using uuidv4
        const bookingWithId = { ...hotelDetails, id: uuidv4() };

        // Update the user's document by adding the booking details to their bookings array and updating their formData
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId, // User to update (based on userId in URL)
            {
                $push: { bookings: bookingWithId }, // Push the booking details into the user's bookings array
                $set: { ...formData }, // Update any other user details passed through formData (e.g., address, phone number)
            },
            { new: true } // Return the updated user document
        );

        // Helper function to format time (e.g., arrival time, check-in time)
        const formatTime = (date) =>
            new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            }).format(new Date(date));

        // Helper function to format dates (e.g., check-in and check-out dates)
        const formatDate = (dateString) => {
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
        };

        // Set up the nodemailer transporter to send a booking confirmation email
        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com', // SMTP server for sending the email
            port: 465, // Secure SMTP port
            secure: true, // Use SSL
            auth: {
                user: process.env.EMAIL_USER, // Email user from environment variable
                pass: process.env.EMAIL_PASS, // Email password from environment variable
            },
            tls: {
                rejectUnauthorized: false, // Disable unauthorized certificate checks (usually required for self-signed certificates)
            },
        });

        // Define the email content (HTML template) to be sent
        const mailOptions = {
            from: `"Velora" <${process.env.EMAIL_USER}>`, // Sender email
            to: updatedUser.email, // Recipient email (user's email)
            subject: 'Booking Confirmation', // Email subject
            html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <!-- Email Header -->
                <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
                    <h2 style="color: #48aadf;">Booking Confirmation</h2>
                    <p style="font-size: 1.1em;">Thank you for booking with Velora!</p>
                </div>
                
                <!-- Email Body -->
                <div style="padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px; margin: 20px auto; max-width: 600px;">
                    <p><strong>Dear ${formData.firstName} ${formData.lastName},</strong></p>
                    <p>We are pleased to confirm your hotel booking. Here are your hotel details:</p>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Hotel ID:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${hotelDetails?.data[0]?.hotel?.hotelId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Hotel Name:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">
                                ${hotelDetails?.data[0]?.hotel?.name}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Check In Date:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">
                                ${formatDate(hotelDetails?.data[0].offers[0]?.checkInDate)}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Check Out Date:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">
                                ${formatDate(hotelDetails?.data[0].offers[0]?.checkOutDate)}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Arrival:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">
                                ${formatTime(hotelDetails?.data[0].offers[0]?.policies?.cancellations[0]?.deadline)}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Guests:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">
                                ${hotelDetails?.data[0].offers[0]?.guests?.adults} ${hotelDetails?.data[0].offers[0]?.guests?.adults > 1 ? 'Adults' : 'Adult'}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total Price:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">
                                ${total.toFixed(2)} ${hotelDetails?.data[0].offers[0]?.price?.currency}
                            </td>
                        </tr>
                    </table>
                    <p>We wish you a pleasant stay! If you have any questions, please feel free to contact us.</p>
                </div>
                
                <!-- Email Footer -->
                <div style="background-color: #48aadf; color: #ffffff; text-align: center; padding: 10px;">
                    <p style="margin: 0;">&copy; 2024 Velora. All rights reserved.</p>
                </div>
            </div>`,
        };

        // Send the booking confirmation email
        await transporter.sendMail(mailOptions);
    
        // Exclude the password from the user response before sending it to the client
        const { password, ...rest } = updatedUser._doc;

        // Send the updated user data (without the password) as a response
        res.status(200).json(rest);
      
    } catch (error) {
        // Handle any errors that occur during the booking process
        next(error);
    }
};

// Cancel flight booking
export const cancelBooking = async (req, res, next) => {
    // Extracting userId and bookingId from the request parameters
    const { userId, bookingId } = req.params;

    try {
        // Update the user document by removing the booking with the given bookingId
        const updatedUser = await User.findByIdAndUpdate(
            userId, // The user whose booking is being canceled
            {
                // Pull (remove) the booking from the bookings array that matches the bookingId
                $pull: { bookings: { id: bookingId } }, 
            },
            { new: true } // Return the updated user document after the update
        );

        // If the user or booking wasn't found, return an error message
        if (!updatedUser) {
            // Error handling if no user or booking was found
            return next(errorHandler(404, 'User or booking not found'));
        }

        // If the cancellation is successful, send a success response with the updated user info
        res.status(200).json({ message: 'Booking canceled successfully', updatedUser });
    } catch (error) {
        // In case of any error during the process, pass the error to the next middleware (error handler)
        next(error);
    }
};