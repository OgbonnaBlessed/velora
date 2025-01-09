import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import TempUser from '../models/tempUser.model.js'; // Ensure TempUser model is defined for temporary storage
import DeviceDetector from 'device-detector-js';
import { UAParser } from 'ua-parser-js'
import { v4 as uuidv4 } from 'uuid';

// Store verification codes temporarily (could also use Redis or a database table)
const verificationCodes = {};

// Function to Sign Up a User
export const signup = async (req, res, next) => {
    // Destructure the request body to get user details
    const { firstName, lastName, email, password } = req.body;

    // Validate if all required fields are provided and not empty
    if (!firstName || !lastName || !email || !password || firstName === '' || lastName === '' || email === '' || password === '') {
        return next(errorHandler(400, 'All fields are required')); // Return error if fields are missing
    }

    try {
        // Check if the email already exists in the database
        const validUser = await User.findOne({ email });
        if (validUser) {
            return next(errorHandler(400, 'Email already exists')); // Return error if email already exists
        }

        // Hash the user's password for security before saving it to the database
        const hashedPassword = bcryptjs.hashSync(password, 10);

        // Generate a random 4-digit OTP for email verification
        const otp = crypto.randomInt(1000, 9999);
  
        // Save the user's data along with the OTP and expiry time in the TempUser collection
        await TempUser.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            otp,
            otpExpires: Date.now() + 10 * 60 * 1000 // Set OTP to expire in 10 minutes
        });

        // Set up email transport using nodemailer to send OTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 465, // or 587
            secure: true, // true for 465, false for 587
            auth: {
                user: process.env.EMAIL_USER, // Use environment variables for email credentials
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, // Allow self-signed certificates
            },
        });
    
        // Prepare the email content, including OTP and registration message
        const mailOptions = {
            from: `"Velora" <${process.env.EMAIL_USER}>`, // Sender email
            to: email, // Receiver email
            subject: 'Verify your account', // Subject of the email
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <div style="text-align: center; padding-bottom: 20px;">
                    <h2 style="color: #333;">Welcome to Velora!</h2>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; color: #333;">Dear ${firstName},</p>
                <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for signing up. To complete your registration, please use the verification code below:</p>
                
                <div style="background-color: #48aadf; padding: 15px 30px; border-radius: 5px; color: #fff; font-size: 18px; text-align: center; font-weight: bold; margin: 20px 0;">
                    ${otp}
                </div>

                <p style="font-size: 16px; line-height: 1.6; color: #333;"><strong>Note:</strong> This code will expire in 10 minutes.</p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #333;">If you did not request this, please ignore this message.</p>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="#" style="background-color: #48aadf; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-size: 16px; font-weight: bold;">Complete Registration</a>
                </div>
                
                <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">Thank you for choosing Velora.</p>
                
                <div style="background-color: #48aadf; color: #ffffff; text-align: center; padding: 10px; margin-top: 40px;">
                    <p style="margin: 0; font-size: 14px;">&copy; 2024 Velora. All rights reserved.</p>
                </div>
            </div>`
        };
    
        // Send the email with the OTP to the user's email address
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error(err); // Log error if sending email fails
                return res.status(500).json({ success: false, message: 'Error sending OTP' }); // Respond with an error
            }
    
            res.status(200).json({ success: true, message: 'OTP sent to your email' }); // Respond with success message
        });
    } catch (error) {
        next(error); // Call the error handler if any exception occurs
    }
};

// Function to Verify User's OTP
export const verifyOTP = async (req, res, next) => {
    const { email, code } = req.body; // Destructure email and code (OTP) from the request body

    try {
        // Find the temporary user by email in the TempUser collection
        const tempUser = await TempUser.findOne({ email });

        // If no temporary user is found, return an error indicating invalid OTP
        if (!tempUser) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // Check if the OTP provided matches and if it has not expired
        if (tempUser.otp !== code || tempUser.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Create a new user in the User collection with the data from the temporary user
        await User.create({
            firstName: tempUser.firstName,
            lastName: tempUser.lastName,
            email: tempUser.email,
            password: tempUser.password
        });

        // Delete the temporary user data after successful verification and account creation
        await TempUser.deleteOne({ email });

        // Respond with a success message indicating the account was created
        res.status(200).json({ success: true, message: 'Verification successful, account created' });

    } catch (error) {
        next(error); // Pass any error to the next middleware for handling
    }
};

// Function to Resend OTP To Sign Up a User
export const resendOTP = async (req, res) => {
    const { email, firstName } = req.body; // Extract the email and firstName from the request body

    // Find the temporary user associated with the provided email
    const tempUser = await TempUser.findOne({ email });

    // If no user is found, respond with an error message
    if (!tempUser) {
      return res.status(400).json({ success: false, message: 'No account found for this email' });
    }

    // Generate a new OTP (4-digit random number) and set an expiration time (10 minutes from now)
    const otp = crypto.randomInt(1000, 9999);
    tempUser.otp = otp;
    tempUser.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await tempUser.save(); // Save the updated temporary user data

    // Create a transporter for sending emails using SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com', // SMTP host for Yahoo mail
        port: 465, // Use port 465 for secure connection
        secure: true, // Set to true for 465, use false for 587
        auth: {
            user: process.env.EMAIL_USER, // Your email user (from environment variable)
            pass: process.env.EMAIL_PASS, // Your email password (from environment variable)
        },
        tls: {
            rejectUnauthorized: false, // Allow insecure TLS connections (use with caution)
        },
    });

    // Define the email content (HTML) to be sent
    const mailOptions = {
      from: `"Velora" <${process.env.EMAIL_USER}>`, // From address
      to: email, // Recipient email address
      subject: 'Your new verification code', // Subject of the email
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <div style="text-align: center; padding-bottom: 20px;">
                <h2 style="color: #333;">Velora Account Verification</h2>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">Dear ${firstName},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">We received a request to resend your verification code. Please find the new verification code below:</p>
            
            <div style="background-color: #48aadf; padding: 15px 30px; border-radius: 5px; color: #fff; font-size: 18px; text-align: center; font-weight: bold; margin: 20px 0;">
                ${otp} <!-- Display the newly generated OTP here -->
            </div>
    
            <p style="font-size: 16px; line-height: 1.6; color: #333;"><strong>Note:</strong> This code will expire in 10 minutes.</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">If you did not request this, please ignore this message.</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for choosing Velora.</p>
            
            <div style="background-color: #48aadf; color: #ffffff; text-align: center; padding: 10px; margin-top: 40px;">
                <p style="margin: 0; font-size: 14px;">&copy; 2024 Velora. All rights reserved.</p>
            </div>
        </div>`
    };

    // Send the email with the new OTP
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err); // Log any error that occurs during sending
            return res.status(500).json({ success: false, message: 'Error resending OTP' }); // Respond with an error if sending fails
        }
    
        // Respond with a success message indicating the new OTP was sent
        res.status(200).json({ success: true, message: 'New OTP sent' });
    });
};

// Function to Sign Up a User
export const signin = async (req, res, next) => {
    const { email, password, keepMeSignedIn } = req.body; // Destructure email, password, and keepMeSignedIn from the request body

    // Check if both email and password are provided; if not, return an error
    if (!email || !password) {
        return next(errorHandler(400, 'All fields are required')); // If any field is missing, trigger an error handler
    }

    // If "keepMeSignedIn" is true, the user will stay signed in for a longer period (7 days)
    keepMeSignedIn ? `${email}` : ''; // This line seems redundant, no effect, could be removed

    try {
        // Look for the user in the database using the provided email
        const validUser = await User.findOne({ email });

        // If the user is not found, return an error
        if (!validUser) {
            return next(errorHandler(404, 'Invalid credentials')); // Invalid credentials error
        }

        // Compare the provided password with the hashed password in the database
        const validPassword = bcryptjs.compareSync(password, validUser.password);

        // If the password doesn't match, return an error
        if (!validPassword) {
            return next(errorHandler(404, 'Invalid credentials')); // Invalid credentials error
        }

        // Generate a JWT token for the authenticated user
        const token = jwt.sign(
            { id: validUser._id, isAdmin: validUser.isAdmin }, // Payload with user ID and admin status
            process.env.JWT_SECRET, // Secret key from environment variables
            { expiresIn: keepMeSignedIn ? '7d' : '1d' }  // Set token expiration to 7 days if "keepMeSignedIn" is true, else 1 day
        );

        // Decode the token to check the expiration date
        const decoded = jwt.decode(token);
        console.log('Token Expiration:', new Date(decoded.exp * 1000)) // Log the expiration date of the token

        // Exclude the password field from the user data that will be sent in the response
        const { password: pass, ...rest } = validUser._doc;

        // Extract device and browser details from the request headers
        const userAgent = req.headers['user-agent']; // Get the user-agent from the headers
        const deviceDetector = new DeviceDetector(); // Initialize device detector
        const device = deviceDetector.parse(userAgent); // Parse the device information from the user-agent string

        const uaParser = new UAParser(userAgent); // Initialize UAParser to get OS and browser information
        const os = uaParser.getOS().name; // Extract OS name
        const browser = uaParser.getBrowser().name; // Extract browser name

        // Generate a unique session token using UUID
        const sessionToken = uuidv4(); 

        // Create an object with session details, including device, browser, OS, and IP address
        const sessionDetails = {
            deviceName: device.device?.model || 'Unknown Device', // Device model (or 'Unknown Device' if not found)
            browser: browser || 'Unknown Browser', // Browser name (or 'Unknown Browser' if not found)
            os: os || 'Unknown OS', // OS name (or 'Unknown OS' if not found)
            ip: req.ip, // User's IP address
            loggedInAt: new Date(), // Current login time
            token: sessionToken, // Session token
        };

        // Add the session details to the user's sessions array and save the user data
        validUser.sessions.push(sessionDetails);
        await validUser.save();

        // Set the JWT token as a cookie in the response with specific security settings
        res.cookie('access_token', token, {
            httpOnly: true, // Set cookie as HTTP only to prevent access from JavaScript
            secure: process.env.NODE_ENV === 'production',  // Set the secure flag in production
            maxAge: keepMeSignedIn ? 7 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 60 * 1000  // Set expiration of the cookie (7 days or 1 day)
        }).status(200).json(rest); // Send the response with status 200 and user data (excluding password)

    } catch (error) {
        next(error); // If any error occurs during the signin process, pass it to the error handler
    }
};

// Function to retrieve the connected devices for a user
export const getConnectedDevices = async (req, res) => {
    try {
        // Find the user by their ID
        const user = await User.findById(req.user.id);

        // If the user is not found, return a 404 error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Sort the user's sessions by the login time (loggedInAt) in descending order (latest first)
        const sortedSessions = user.sessions.sort((a, b) => new Date(b.loggedInAt) - new Date(a.loggedInAt));

        // Identify the current session (the latest session)
        const currentSession = sortedSessions[0];

        // Map through the sorted sessions and mark the latest session as the current one
        const devices = sortedSessions.map(session => ({
            ...session._doc, // Spread the session data
            isCurrentSession: session.token === currentSession.token, // Flag if this session is the latest
        }));

        // Send the list of connected devices (sessions) in the response
        res.status(200).json({ devices });
    } catch (error) {
        // If an error occurs, send a 500 server error response
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to log out a device by removing the session based on the provided token
export const logoutDevice = async (req, res) => {
    const { token } = req.body; // Get the session token of the device to log out
    try {
        // Find the user by their ID
        const user = await User.findById(req.user.id);

        // If the user is not found, return a 404 error
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Find the index of the session that matches the provided token
        const sessionIndex = user.sessions.findIndex((session) => session.token === token);

        // If no session matches the token, return a 404 error
        if (sessionIndex === -1) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Remove the session from the user's sessions array
        user.sessions.splice(sessionIndex, 1);

        // Save the updated user data (after removing the session)
        await user.save();

        // Send a success message indicating the device has been logged out
        res.status(200).json({ message: 'Device logged out successfully' });
    } catch (error) {
        // If an error occurs, send a 500 server error response
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller method for handling Google authentication
export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;

    try {
        // Check if a user already exists with the given email
        const user = await User.findOne({ email });

        if (user) {
            // If the user exists, generate a JWT token and send it back with user details
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc; // Exclude password from the response

            res.status(200).cookie('access_token', token, {
                httpOnly: true, // Ensure the token is not accessible via JavaScript
            }).json(rest); // Send the user data (without password) in the response

        } else {
            // If the user doesn't exist, create a new user

            // Generate a random password for the new user
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10); // Hash the password

            // Split the name into first and last names
            const [firstName, ...lastNameArr] = name.split(' ');
            const lastName = lastNameArr.join(' ') || ''; // Handle cases where there is no last name

            // Create a new user document
            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl, // Use the Google profile picture URL
            });

            // Save the new user to the database
            await newUser.save();

            // Generate a JWT token for the new user
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc; // Exclude password from the response

            // Send back the user data (without password) and the JWT token
            res.status(200).cookie('access_token', token, {
                httpOnly: true, // Ensure the token is not accessible via JavaScript
            }).json(rest);
        }

    } catch (error) {
        next(error); // Handle errors by passing them to the next middleware
    }
}

// Controller method for handling password reset request
export const handlePasswordResetRequest = async (req, res, next) => {
    const { email } = req.body;

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // Generate a 4-digit random verification code
        const verificationCode = crypto.randomInt(1000, 9999).toString();

        // Save the verification code temporarily (could be improved with Redis or similar)
        verificationCodes[email] = {
            code: verificationCode,
            expires: Date.now() + 20 * 60 * 1000 // Set expiration time (10 minutes)
        };

        // Set up the email transport using SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 465, // or 587
            secure: true, // true for 465, false for 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, // Avoid certificate verification issues
            },
        });

        // Set up email options
        const mailOptions = {
            from: `"Velora" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Reset your password',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <div style="text-align: center; padding-bottom: 20px;">
                    <h2 style="color: #333;">Velora Password Reset</h2>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; color: #333;">We received a request to reset your password. To proceed, please use the verification code below:</p>
                
                <div style="background-color: #48aadf; padding: 15px 30px; border-radius: 5px; color: #fff; font-size: 18px; text-align: center; font-weight: bold; margin: 20px 0;">
                    ${verificationCode}
                </div>
        
                <p style="font-size: 16px; line-height: 1.6; color: #333;"><strong>Note:</strong> This code will expire in 10 minutes.</p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #333;">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for choosing Velora.</p>
                
                <div style="background-color: #48aadf; color: #ffffff; text-align: center; padding: 10px; margin-top: 40px;">
                    <p style="margin: 0; font-size: 14px;">&copy; 2024 Velora. All rights reserved.</p>
                </div>
            </div>`
        };

        // Send the email with the verification code
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Failed to send email" });
            }
            res.status(200).json({ success: true, message: "Verification code sent to your email." });
        });
        
    } catch (error) {
        next(error); // Handle errors by passing them to the next middleware
    }
};

// Controller method for confirming the user's email address
export const confirmEmail = async (req, res, next) => {
    const { email } = req.body;

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // Generate a 4-digit random verification code
        const verificationCode = crypto.randomInt(1000, 9999).toString();

        // Save the verification code temporarily (could be improved with Redis or similar)
        verificationCodes[email] = {
            code: verificationCode,
            expires: Date.now() + 20 * 60 * 1000 // Set expiration time (10 minutes)
        };

        // Set up the email transport using SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 465, // or 587
            secure: true, // true for 465, false for 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, // Avoid certificate verification issues
            },
        });

        // Set up email options
        const mailOptions = {
            from: `"Velora" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Confirm your email',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <div style="text-align: center; padding-bottom: 20px;">
                    <h2 style="color: #333;">Velora Email Confirmation</h2>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for registering with Velora. To complete your registration and confirm your email address, please use the verification code below:</p>
                
                <div style="background-color: #48aadf; padding: 15px 30px; border-radius: 5px; color: #fff; font-size: 18px; text-align: center; font-weight: bold; margin: 20px 0;">
                    ${verificationCode}
                </div>
        
                <p style="font-size: 16px; line-height: 1.6; color: #333;"><strong>Note:</strong> This code will expire in 10 minutes.</p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #333;">If you did not register for an account with Velora, please disregard this email.</p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for choosing Velora.</p>
                
                <div style="background-color: #48aadf; color: #ffffff; text-align: center; padding: 10px; margin-top: 40px;">
                    <p style="margin: 0; font-size: 14px;">&copy; 2024 Velora. All rights reserved.</p>
                </div>
            </div>`
        };

        // Send the email with the verification code
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Failed to send email" });
            }
            res.status(200).json({ success: true, message: "Verification code sent to your email." });
        });
        
    } catch (error) {
        next(error); // Handle errors by passing them to the next middleware
    }
};

// Function to resend a verification code to the user's email
export const resendCode = async (req, res, next) => {
    const { email } = req.body; // Extract email from the request body

    try {
        // Find user by email in the database
        const user = await User.findOne({ email });

        // If user does not exist, return an error response
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // Check if the OTP is still valid (if it is, do not resend)
        if (user.otpExpires > Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP is still valid. Please wait for it to expire.' });
        }

        // Generate a new 4-digit verification code
        const verificationCode = crypto.randomInt(1000, 9999).toString();
        
        // Temporarily store the verification code and its expiration time (in memory)
        // Consider using a more scalable solution like Redis or a database with TTL for production
        verificationCodes[email] = {
            code: verificationCode,
            expires: Date.now() + 20 * 60 * 1000 // 10 minutes expiration time
        };

        // Configure the email transport service (using Yahoo SMTP server in this example)
        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 465, // or 587
            secure: true, // true for 465, false for 587
            auth: {
                user: process.env.EMAIL_USER, // Use the email from environment variables
                pass: process.env.EMAIL_PASS, // Use the password from environment variables
            },
            tls: {
                rejectUnauthorized: false, // Allows insecure connections (can be improved for production)
            },
        });

        // Email options for sending the verification code to the user
        const mailOptions = {
            from: `"Velora" <${process.env.EMAIL_USER}>`, // Sender's email
            to: email, // Recipient's email
            subject: 'Confirm your email', // Email subject
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <div style="text-align: center; padding-bottom: 20px;">
                    <h2 style="color: #333;">Velora Email Confirmation</h2>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for registering with Velora. To complete your registration and confirm your email address, please use the verification code below:</p>
                
                <div style="background-color: #48aadf; padding: 15px 30px; border-radius: 5px; color: #fff; font-size: 18px; text-align: center; font-weight: bold; margin: 20px 0;">
                    ${verificationCode} <!-- The generated verification code -->
                </div>
        
                <p style="font-size: 16px; line-height: 1.6; color: #333;"><strong>Note:</strong> This code will expire in 10 minutes.</p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #333;">If you did not register for an account with Velora, please disregard this email.</p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for choosing Velora.</p>
                
                <div style="background-color: #48aadf; color: #ffffff; text-align: center; padding: 10px; margin-top: 40px;">
                    <p style="margin: 0; font-size: 14px;">&copy; 2024 Velora. All rights reserved.</p>
                </div>
            </div>`
        };

        // Send the email using the configured transporter
        transporter.sendMail(mailOptions, (error, info) => {
            // If an error occurs, log the error and send a failure response
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Failed to send code" });
            }
            // If the email is sent successfully, return a success message
            res.status(200).json({ success: true, message: "Code sent to your email." });
        });
        
    } catch (error) {
        // Catch any other errors that occur during the process and pass them to the error handling middleware
        next(error);
    }
};

// Function to verify the code entered by the user
export const verifyCode = (req, res) => {
    const { email, code } = req.body; // Extract email and code from the request body
  
    // Retrieve the stored verification code information from the verificationCodes object
    const storedCodeInfo = verificationCodes[email];
  
    // If the code does not exist or is expired, return an error
    if (!storedCodeInfo || storedCodeInfo.expires < Date.now()) {
      return res.status(400).json({ message: 'Verification code expired or invalid.' });
    }
  
    // If the provided code does not match the stored code, return an error
    if (storedCodeInfo.code !== code) {
      return res.status(400).json({ message: 'Incorrect verification code.' });
    }
  
    // If the code is valid, return a success message
    return res.status(200).json({ message: 'Code verified. You can now reset your password.' });
};

// 3. Reset Password - Function to handle password reset requests
export const resetPassword = async (req, res, next) => {
    try {
        // Extract the email and new password from the request body
        const { email, newPassword } = req.body;

        // Verify if the email is associated with a user in the database
        const user = await User.findOne({ email });
        if (!user) {
            // If the user is not found, return a 404 error
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password using bcryptjs with a salt for security
        const salt = await bcryptjs.genSalt(10); // 10 rounds of salting
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        // Update the user's password field with the hashed new password
        user.password = hashedPassword;
        await user.save(); // Save the updated user data to the database

        // Clear the stored verification code after successful password reset to prevent reuse
        delete verificationCodes[email];

        // Return a success response to inform the user the password has been reset
        return res.status(200).json({ message: 'Password reset successful. You can now sign in with your new password.' });
    } catch (error) {
        // If an error occurs, pass it to the error handling middleware
        next(error);
    }
};

// 4. Get Connected Accounts - Function to retrieve the connected accounts of the current user
export const getConnectedAccounts = async (req, res, next) => {
    try {
        // Find the user based on the ID from the authentication token
        const user = await User.findById(req.user.id).select('connectedAccounts');
        
        // If the user is not found, return a 404 error
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Return the list of connected accounts (or an empty array if none are found)
        res.status(200).json({
            success: true,
            connectedAccounts: user.connectedAccounts || [],
        });
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error fetching connected accounts:", error);
        
        // Return a 500 error response in case of any internal server issues
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};