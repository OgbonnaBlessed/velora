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

export const signup = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password || firstName === '' || lastName === '' || email === '' || password === '') {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        // Check if the email already exists
        const validUser = await User.findOne({ email });
        if (validUser) {
            return next(errorHandler(400, 'Email already exists'));
        }

        // Hash the password
        const hashedPassword = bcryptjs.hashSync(password, 10);

        // Generate OTP
        const otp = crypto.randomInt(1000, 9999);
  
        // Save OTP and user data to the temporary user collection
        await TempUser.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            otp,
            otpExpires: Date.now() + 10 * 60 * 1000 // Expires in 10 minutes
        });

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 465, // or 587
            secure: true, // true for 465, false for 587
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
            to: email,
            subject: 'Verify your account',
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
    
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Error sending OTP' });
            }
    
            res.status(200).json({ success: true, message: 'OTP sent to your email' });
        });
    } catch (error) {
        next(error);
    }
};

export const verifyOTP = async (req, res, next) => {
    const { email, code } = req.body;

    try {
        // Find the temporary user by email
        const tempUser = await TempUser.findOne({ email });

        if (!tempUser) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // Check if OTP is valid and not expired
        if (tempUser.otp !== code || tempUser.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Create the actual user and delete temporary user data
        await User.create({
            firstName: tempUser.firstName,
            lastName: tempUser.lastName,
            email: tempUser.email,
            password: tempUser.password
        });

        await TempUser.deleteOne({ email });

        res.status(200).json({ success: true, message: 'Verification successful, account created' });

    } catch (error) {
        next(error);
    }
};

export const resendOTP = async (req, res) => {
    const { email, firstName } = req.body;
  
    // Find the temp user
    const tempUser = await TempUser.findOne({ email });
    
    if (!tempUser) {
      return res.status(400).json({ success: false, message: 'No account found for this email' });
    }
  
    // Generate a new OTP and update expiration
    const otp = crypto.randomInt(1000, 9999);
    tempUser.otp = otp;
    tempUser.otpExpires = Date.now() + 10 * 60 * 1000;
    await tempUser.save();
  
    // Send the new OTP via email
    const transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465, // or 587
        secure: true, // true for 465, false for 587
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
      to: email,
      subject: 'Your new verification code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <div style="text-align: center; padding-bottom: 20px;">
                <h2 style="color: #333;">Velora Account Verification</h2>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">Dear ${firstName},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">We received a request to resend your verification code. Please find the new verification code below:</p>
            
            <div style="background-color: #48aadf; padding: 15px 30px; border-radius: 5px; color: #fff; font-size: 18px; text-align: center; font-weight: bold; margin: 20px 0;">
                ${otp}
            </div>
    
            <p style="font-size: 16px; line-height: 1.6; color: #333;"><strong>Note:</strong> This code will expire in 10 minutes.</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">If you did not request this, please ignore this message.</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for choosing Velora.</p>
            
            <div style="background-color: #48aadf; color: #ffffff; text-align: center; padding: 10px; margin-top: 40px;">
                <p style="margin: 0; font-size: 14px;">&copy; 2024 Velora. All rights reserved.</p>
            </div>
        </div>`
    };
  
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error resending OTP' });
        }
    
        res.status(200).json({ success: true, message: 'New OTP sent' });
    });
};

export const signin = async (req, res, next) => {
    const { email, password, keepMeSignedIn } = req.body;

    if (!email || !password) {
        return next(errorHandler(400, 'All fields are required'));
    }

    keepMeSignedIn ? `${email}` : '';

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'Invalid credentials'));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(404, 'Invalid credentials'));
        }

        const token = jwt.sign(
            { id: validUser._id, isAdmin: validUser.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: keepMeSignedIn ? '7d' : '1d' }  // Set expiration based on "Keep Me Signed In"
        );
        const decoded = jwt.decode(token);
        console.log('Token Expiration:', new Date(decoded.exp * 1000))

        const { password: pass, ...rest } = validUser._doc;

        // Extract device details
        const userAgent = req.headers['user-agent'];
        const deviceDetector = new DeviceDetector();
        const device = deviceDetector.parse(userAgent);

        const uaParser = new UAParser(userAgent);
        const os = uaParser.getOS().name;
        const browser = uaParser.getBrowser().name;

        const sessionToken = uuidv4(); // Generate a unique session token
        const sessionDetails = {
            deviceName: device.device?.model || 'Unknown Device',
            browser: browser || 'Unknown Browser',
            os: os || 'Unknown OS',
            ip: req.ip,
            loggedInAt: new Date(),
            token: sessionToken, // Add the session token
        };

        // Add the session to the user's sessions
        validUser.sessions.push(sessionDetails);
        await validUser.save();

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Ensure secure flag in production
            maxAge: keepMeSignedIn ? 7 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 1000  // 7 days or 1 day
        }).status(200).json(rest);

    } catch (error) {
        next(error);
    }
};

export const getConnectedDevices = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Sort sessions by loggedInAt in descending order (latest first)
        const sortedSessions = user.sessions.sort((a, b) => new Date(b.loggedInAt) - new Date(a.loggedInAt));

        // Identify the current session as the one with the most recent loggedInAt
        const currentSession = sortedSessions[0];

        const devices = sortedSessions.map(session => ({
            ...session._doc,
            isCurrentSession: session.token === currentSession.token, // Mark the latest session as current
        }));

        res.status(200).json({ devices });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const logoutDevice = async (req, res) => {
    const { token } = req.body; // Token of the device to log out
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const sessionIndex = user.sessions.findIndex((session) => session.token === token);
        if (sessionIndex === -1) {
            return res.status(404).json({ message: 'Session not found' });
        }

        user.sessions.splice(sessionIndex, 1); // Remove the specific session
        await user.save();

        res.status(200).json({ message: 'Device logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;

            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);

        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            
            const [firstName, ...lastNameArr] = name.split(' ');
            const lastName = lastNameArr.join(' ') || ''; // In case there's no last name

            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });

            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        }

    } catch (error) {
        next(error);
    }
}

// Controller method for handling password reset request
export const handlePasswordResetRequest = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // Generate a 4-digit verification code
        const verificationCode = crypto.randomInt(1000, 9999).toString();
        
        // Save the verification code temporarily (this can be improved with a TTL using Redis or similar)
        verificationCodes[email] = {
            code: verificationCode,
            expires: Date.now() + 20 * 60 * 1000 // 10 minutes expiration
        };

        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 465, // or 587
            secure: true, // true for 465, false for 587
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

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Failed to send email" });
            }
            res.status(200).json({ success: true, message: "Verification code sent to your email." });
        });
        
    } catch (error) {
        next(error);
    }
};

export const confirmEmail = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // Generate a 4-digit verification code
        const verificationCode = crypto.randomInt(1000, 9999).toString();
        
        // Save the verification code temporarily (this can be improved with a TTL using Redis or similar)
        verificationCodes[email] = {
            code: verificationCode,
            expires: Date.now() + 20 * 60 * 1000 // 10 minutes expiration
        };

        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 465, // or 587
            secure: true, // true for 465, false for 587
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

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Failed to send email" });
            }
            res.status(200).json({ success: true, message: "Verification code sent to your email." });
        });
        
    } catch (error) {
        next(error);
    }
};

export const resendCode = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // Check if the OTP is expired (if it is, resend)
        if (user.otpExpires > Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP is still valid. Please wait for it to expire.' });
        }

        // Generate a 4-digit verification code
        const verificationCode = crypto.randomInt(1000, 9999).toString();
        
        // Save the verification code temporarily (this can be improved with a TTL using Redis or similar)
        verificationCodes[email] = {
            code: verificationCode,
            expires: Date.now() + 20 * 60 * 1000 // 10 minutes expiration
        };

        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 465, // or 587
            secure: true, // true for 465, false for 587
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

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Failed to send code" });
            }
            res.status(200).json({ success: true, message: "Code sent to your email." });
        });
        
    } catch (error) {
        next(error);
    }
};

export const verifyCode = (req, res) => {
    const { email, code } = req.body;
  
    const storedCodeInfo = verificationCodes[email];
  
    if (!storedCodeInfo || storedCodeInfo.expires < Date.now()) {
      return res.status(400).json({ message: 'Verification code expired or invalid.' });
    }
  
    if (storedCodeInfo.code !== code) {
      return res.status(400).json({ message: 'Incorrect verification code.' });
    }
  
    // Code is valid
    return res.status(200).json({ message: 'Code verified. You can now reset your password.' });
};

// 3. Reset Password
export const resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        // Verify if the email is associated with a user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        // Clear the verification code after successful password reset
        delete verificationCodes[email];

        return res.status(200).json({ message: 'Password reset successful. You can now sign in with your new password.' });
    } catch (error) {
        next(error);
    }
};

export const getConnectedAccounts = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('connectedAccounts');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Return connected accounts
        res.status(200).json({
            success: true,
            connectedAccounts: user.connectedAccounts || [],
        });
    } catch (error) {
        console.error("Error fetching connected accounts:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};