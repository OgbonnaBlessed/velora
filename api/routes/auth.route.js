import express from 'express'
import { signup, signin, google, handlePasswordResetRequest, verifyCode, resetPassword, verifyOTP, resendOTP } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/signin', signin);
router.post('/google', google);
router.post('/password-reset', handlePasswordResetRequest);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);

export default router;