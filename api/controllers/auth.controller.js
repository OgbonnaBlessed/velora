import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import TempUser from '../models/tempUser.model.js'; // Ensure TempUser model is defined for temporary storage

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
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your account',
            text: `Your verification code is ${otp}`
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
    const { email } = req.body;
  
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
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your new verification code',
      text: `Your new verification code is ${otp}`
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
            { expiresIn: keepMeSignedIn ? '7d' : '2m' }  // Set expiration based on "Keep Me Signed In"
        );

        const { password: pass, ...rest } = validUser._doc;

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Ensure secure flag in production
            maxAge: keepMeSignedIn ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 1000  // 7 days or 2 minutes
        }).status(200).json(rest);

    } catch (error) {
        next(error);
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
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset your password',
            text: `Your password reset verification code is: ${verificationCode}`,
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