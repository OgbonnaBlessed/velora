import express from 'express'
import { signup, signin, google, handlePasswordResetRequest, verifyCode, resetPassword, verifyOTP, resendOTP, resendCode, getConnectedDevices, logoutDevice, confirmEmail } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/signin', signin);
router.post('/google', google);
router.post('/password-reset', handlePasswordResetRequest);
router.post('/verify-code', verifyCode);
router.post('/confirm-email', confirmEmail)
router.post('/resend-code', resendCode);
router.post('/reset-password', resetPassword);
router.get('/connected-devices', verifyToken, getConnectedDevices);
router.post('/logout-device', verifyToken, logoutDevice);

export default router;