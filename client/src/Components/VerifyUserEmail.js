import { ArrowLeft } from 'lucide-react';  // Importing the ArrowLeft icon from lucide-react
import React, { useEffect, useState } from 'react'; // Importing React, useState, useEffect hooks
import { useSelector } from 'react-redux'; // Importing useSelector hook to access Redux state
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for routing
import { SyncLoader } from 'react-spinners'; // Importing SyncLoader spinner for loading state
import { motion } from 'framer-motion'; // Importing motion for animations

const VerifyUserEmail = () => {
    const { currentUser } = useSelector((state) => state.user); // Extracting the current user from the Redux store
    const [modalMessage, setModalMessage] = useState(null); // State for handling modal messages (error, success, etc.)
    const [timer, setTimer] = useState(30); // Countdown timer for enabling resend functionality (in seconds)
    const [canResend, setCanResend] = useState(false); // State to manage if the resend button can be clicked
    const [loading, setLoading] = useState(false); // State to manage loading state (spinner)
    const [otp, setOtp] = useState(''); // State to handle OTP input value
    const [isFocused2, setIsFocused2] = useState(false); // State to manage input focus for label animation
    const navigate = useNavigate(); // navigate hook for routing programmatically

    // Function to handle resending OTP code
    const handleResendCode = async () => {
        try {
            // Sending a POST request to the server to resend OTP code
            const response = await fetch('/api/auth/resend-code', {
                method: 'POST',
                body: JSON.stringify({ email: currentUser.email }), // Pass current user's email to resend code
                headers: { 'Content-Type': 'application/json' }, // Set content type to JSON
            });

            const result = await response.json(); // Parse the JSON response

            if (result.success === true) {
                setCanResend(false); // Disable resend button until the next timer
            } else {
                setModalMessage(result.message); // Display error message if resend fails
            }

        } catch (error) {
            console.error('Error resending OTP:', error); // Log error
            setModalMessage(error.message); // Display error message
        }
    };

    // Function to handle OTP verification
    const handleVerifyCode = async () => {
        if (otp.length !== 4) {
            setModalMessage('Kindly enter a valid code'); // Ensure OTP is exactly 4 digits
            return;
        }

        try {
            setLoading(true); // Set loading to true while verifying OTP

            // Sending POST request to verify the OTP code
            const res = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Set content type to JSON
                body: JSON.stringify({ email: currentUser.email, code: otp }), // Send OTP and email to server
            });

            const data = await res.json(); // Parse server response

            if (res.ok) {
                navigate('/update-email'); // Navigate to update email page on success
            } else {
                console.error('Verification failed:', data.message); // Log error on failure
                setModalMessage(data.message); // Display error message from the server
            }

            setLoading(false); // Set loading to false after response

        } catch (error) {
            console.error('Error verifying code:', error); // Log any error that occurs
        }
    };

    // Function to handle OTP input change
    const handleOtpChange = (e) => {
        setOtp(e.target.value); // Update OTP state when user types
    };

    // useEffect hook to handle countdown timer for resend functionality
    useEffect(() => {
        if (timer === 0) {
            setCanResend(true); // Enable resend button when the timer reaches 0
            return;
        }

        // Set an interval to decrease timer value by 1 every second
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        // Cleanup the interval on component unmount or when timer changes
        return () => clearInterval(interval);

    }, [timer]); // Dependency array with timer to update timer on change

    // useEffect hook to auto-hide modal message after 3 seconds
    useEffect(() => {
        if (modalMessage) {

            // Set a timeout to reset modal message after 3 seconds
            const timer = setTimeout(() => {
                setModalMessage(null); // Reset modal message
            }, 3000);

            // Cleanup the timeout if component unmounts or modalMessage changes
            return () => clearTimeout(timer);
        }
    }, [modalMessage]); // Dependency array with modalMessage to reset it when state changes

    return (
        <motion.div
            initial={{ opacity: 0 }} // Initial animation state for opacity
            animate={{ opacity: 1 }} // Animate to opacity 1
            exit={{ opacity: 0 }} // Fade out when exiting
            transition={{
                duration: 0.5, // Duration of the animation
                ease: "easeInOut" // Easing function for smooth transition
            }}
            className='bg-white fixed w-full h-full inset-0 z-[10000] flex justify-center'
        >
            <div className='pt-16 w-[30rem] max-w-[90%] flex flex-col gap-5'>
                {/* Back Button */}
                <div 
                    className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
                    onClick={() => {
                        navigate(-1); // Go back to previous page
                    }}
                >
                    <ArrowLeft />
                </div>

                {/* Logo Section */}
                <div className='flex items-center justify-center gap-1 w-full mb-5'>
                    <img 
                        src={`${process.env.PUBLIC_URL}/images/logo.png`} 
                        alt="Velora logo" 
                        className='w-14 bg-black p-1 rounded-br-xl'
                    />
                </div>

                {/* Main Content */}
                <>
                    <h1 className='text-2xl font-semibold'>Let's confirm your email</h1>
                    <p className='text-sm'>
                        To continue, enter the secure code we sent to <b>{currentUser.email}</b>. Check junk mail if it's not in your inbox
                    </p>

                    {/* OTP Input Field */}
                    <div className='rounded-xl w-full h-14 relative'>
                        <label
                            htmlFor="token"
                            className={`absolute left-5 transition-all duration-500 ease-in-out cursor-text 
                                ${isFocused2
                                    ? 'top-[0.05rem] scale-75 text-[#48aadf] transform -translate-x-2' // Label moves up and scales down when focused
                                    : 'top-1/2 transform -translate-y-1/2 text-black'
                                }`
                            }
                        >
                            4-digit code
                        </label>
                        <input
                            type="number"
                            id="token"
                            value={otp}
                            className="w-full shadow shadow-gray-400 rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused2(true)} // Animate label on focus
                            onChange={handleOtpChange} // Handle input change
                            autoComplete='off' // Disable autocomplete
                            onBlur={(e) => !e.target.value && setIsFocused2(false)} // Reset label if input is empty
                        />
                    </div>

                    {/* Modal Message (Error/Success) */}
                    <p 
                        className={`text-[0.7rem] text-red-500 transform transition-all duration-700 ease-in-out 
                            ${modalMessage 
                                ? 'opacity-1 translate-y-0 pointer-events-auto' 
                                : 'opacity-0 -translate-y-5 pointer-events-none'
                            }`
                        }
                    >
                        {modalMessage}
                    </p>

                    {/* Verify Code Button */}
                    <button
                        disabled={loading}
                        className={`w-full h-12 text-white rounded-full border-none outline-none flex items-center justify-center gap-2 transition-all duration-300 ease-in-out font-semibold
                            ${loading 
                                ? 'bg-[#48aadf96] cursor-not-allowed' 
                                : 'bg-[#48aadf] cursor-pointer'
                            }`
                        }
                        onClick={handleVerifyCode} // Handle OTP verification
                    >
                        {loading 
                            ?   <SyncLoader 
                                    color="#fff" // Customize the color
                                    loading={loading} 
                                    size={7} // Customize the size
                                    margin={2} // Customize the margin between circles
                                />
                            : 'Continue'
                        }
                    </button>

                    {/* Resend OTP Code */}
                    {canResend 
                    ?  <button
                            className='w-full rounded-full py-3 cursor-pointer font-semibold hover:bg-blue-100 text-[#48aadf] transition-all duration-300 ease-in-out'
                            onClick={() => {
                                setTimer(30); // Reset the timer to 30s after successful resend
                                handleResendCode(); // Call the resend code function
                            }}
                        >
                            Resend another secured code
                        </button>
                    :   <p className='text-center font-semibold'>
                            You can request for a new code in {timer}s
                        </p>
                    }
                </>
            </div>
        </motion.div>
    )
}

export default VerifyUserEmail;