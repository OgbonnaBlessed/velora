import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js"
import User from "../models/user.model.js"
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid';

export const test = (req, res) => {
    res.json({ message: "API is working."})
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this profile'));
    }

    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'))
        }

        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
        }

        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username can not contain spaces'))
        }

        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lower case'))
        }

        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username can only contain letters and numbers'))
        }

    }
    
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: req.body,
        }, {new: true });

        // Exclude password in response
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
        
    }
}

export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this user'));
    }

    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
}

export const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('User has been signed out');
    } catch (error) {
        next(error);
    }
}

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You not allowed to see all users'))
    }
    try {
        const  startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest; 
        })

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        })

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        })

    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return next(errorHandler(404, 'User not found!'))
        }
        const { password, ...rest } = user._doc;
        res.status(200).json(rest);
        
    } catch (error) {
        next(error);
    }
}

// Add a bookmark
export const addBookmark = async (req, res, next) => {
    const { userId, postId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return next(errorHandler(404, "User not found!"));

        // Check if post is already bookmarked
        if (user.bookmarks.includes(postId)) {
            return res.status(400).json({ message: "Post already bookmarked" });
        }

        // Add the post to the user's bookmarks
        user.bookmarks.push(postId);
        await user.save();

        res.status(200).json({ message: "Post bookmarked successfully", bookmarks: user.bookmarks });
    } catch (error) {
        next(error);
    }
};

// Remove a bookmark
export const removeBookmark = async (req, res, next) => {
    const { userId, postId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return next(errorHandler(404, "User not found!"));

        // Check if post is in bookmarks
        if (!user.bookmarks.includes(postId)) {
            return res.status(400).json({ message: "Post not found in bookmarks" });
        }

        // Remove the post from the user's bookmarks
        user.bookmarks = user.bookmarks.filter(bookmark => bookmark.toString() !== postId);
        await user.save();

        res.status(200).json({ message: "Post removed from bookmarks", bookmarks: user.bookmarks });
    } catch (error) {
        next(error);
    }
};

// Get all bookmarks for a user
export const getBookmarks = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('bookmarks');  // Populate the bookmarks with Post details
        if (!user) return next(errorHandler(404, "User not found!"));

        res.status(200).json({
            bookmarks: user.bookmarks,
            totalBookmarks: user.bookmarks.length,
        });
        
    } catch (error) {
        next(error);
    }
};

// Handle user flight bookings
export const bookings = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to book for this user'));
    }

    const { formData, flight } = req.body; // Ensure you are getting flight details and formData
  
    try {
        // Add a unique ID to the booking
        const bookingWithId = { ...flight, id: uuidv4() };

        // Once booking is successful, update the user document with the booking details
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $push: { bookings: bookingWithId }, // Add booking details to the bookings array
                $set: { ...formData }, // Update the user data (if applicable)
            },
            { new: true }
        );

        // Helper to format time
        const formatTime = (date) =>
            new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
        }).format(new Date(date));

        const formatDate = (dateString) => {
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
        };

        const formatWord = (word) => {
            return word.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
        };

        // Helper to calculate total duration in minutes
        const getFlightDuration = (flight) => {
            const segments = flight.itineraries[0]?.segments;
            const departureTime = new Date(segments[0].departure.at).getTime();
            const arrivalTime = new Date(segments[segments.length - 1].arrival.at).getTime();
            return (arrivalTime - departureTime) / (1000 * 60); // Convert to minutes
        };

        // Helper to calculate the arrival time by adding the flight duration to the departure time
        const getArrivalDate = (flight) => {
            const segments = flight.itineraries[0]?.segments;
            const departureTime = new Date(segments[0].departure.at).getTime();
            const flightDurationInMinutes = getFlightDuration(flight);
            
            // Adding flight duration to the departure time (in milliseconds)
            const arrivalTime = departureTime + (flightDurationInMinutes * 60 * 1000); 
            return new Date(arrivalTime);
        };

        const arrivalDate = getArrivalDate(flight);

        // Send booking confirmation email
        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: `"Velora" <${process.env.EMAIL_USER}>`,
            to: updatedUser.email,
            subject: 'Booking Confirmation',
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

        await transporter.sendMail(mailOptions);
    
        // Exclude password in response
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    
    } catch (error) {
        next(error);
    }
};

// Handle user hotel bookings
export const bookHotel = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to book for this user'));
    }
  
    const { formData, hotelDetails, total } = req.body; // Ensure you are getting flight details and formData
    
    try {
        // Add a unique ID to the booking
        const bookingWithId = { ...hotelDetails, id: uuidv4() };

        // Once booking is successful, update the user document with the booking details
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $push: { bookings: bookingWithId }, // Add booking details to the bookings array
                $set: { ...formData }, // Update the user data (if applicable)
            },
            { new: true }
        );
  
        // Helper to format time
        const formatTime = (date) =>
            new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
        }).format(new Date(date));
  
        const formatDate = (dateString) => {
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
        };
  
        // Send booking confirmation email
        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
  
        const mailOptions = {
            from: `"Velora" <${process.env.EMAIL_USER}>`,
            to: updatedUser.email,
            subject: 'Booking Confirmation',
            html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
                    <h2 style="color: #48aadf;">Booking Confirmation</h2>
                    <p style="font-size: 1.1em;">Thank you for booking with Velora!</p>
                </div>
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
                <div style="background-color: #48aadf; color: #ffffff; text-align: center; padding: 10px;">
                    <p style="margin: 0;">&copy; 2024 Velora. All rights reserved.</p>
                </div>
            </div>`,
        };

        await transporter.sendMail(mailOptions);
    
        // Exclude password in response
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
      
    } catch (error) {
        next(error);
    }
};

// Cancel flight booking
export const cancelBooking = async (req, res, next) => {
    const { userId, bookingId } = req.params;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $pull: { bookings: { id: bookingId } }, // Remove the booking with the given ID
            },
            { new: true }
        );

        if (!updatedUser) {
            return next(errorHandler(404, 'User or booking not found'));
        }

        res.status(200).json({ message: 'Booking canceled successfully', updatedUser });
    } catch (error) {
        next(error);
    }
};