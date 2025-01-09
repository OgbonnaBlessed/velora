import { ArrowLeft } from 'lucide-react'; // Importing an arrow icon from the lucide-react library
import React, { useEffect, useState } from 'react'; // Importing React and necessary hooks
import { useSelector } from 'react-redux'; // To access the Redux store state
import { useNavigate } from 'react-router-dom'; // To programmatically navigate between pages
import { SyncLoader } from 'react-spinners'; // Loading spinner component to show while verifying
import { motion } from 'framer-motion'; // For smooth animations

const VerifyEmail = () => {
    // Accessing the current user from the Redux store
    const { currentUser } = useSelector((state) => state.user);

    // Managing state for modal messages, timer countdown, loading, OTP input, and button behavior
    const [modalMessage, setModalMessage] = useState(null);
    const [timer, setTimer] = useState(30); // Initializing the countdown timer to 30 seconds
    const [canResend, setCanResend] = useState(false); // To enable or disable the resend button
    const [loading, setLoading] = useState(false); // To manage the loading state during the verification process
    const [otp, setOtp] = useState(''); // State to store the OTP entered by the user
    const [isFocused2, setIsFocused2] = useState(false); // To handle input focus state for the OTP field

    const navigate = useNavigate(); // Hook for navigation

    // Function to handle the resend of the OTP code
    const handleResendCode = async () => {
        try {
            const response = await fetch('/api/auth/resend-code', {
                method: 'POST',
                body: JSON.stringify({ email: currentUser.email }), // Sending the current user's email to request a new code
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            // If the resend is successful, reset the timer and disable the resend button for the next interval
            if (result.success === true) {
                setTimer(30); // Reset the timer to 30 seconds
                setCanResend(false); // Disable the resend button
            } else {
                setModalMessage(result.message); // Display the error message if resend fails
            }
        } catch (error) {
            console.error('Error resending OTP:', error); // Log any errors during the resend process
            setModalMessage(error.message); // Show the error message to the user
        }
    };

    // Function to handle OTP verification
    const handleVerifyCode = async () => {
        if (otp.length !== 4) { // Check if the entered OTP is valid (must be 4 digits)
            setModalMessage('Kindly enter a valid code'); // Show an error message if the OTP is invalid
            return;
        }
    
        try {
            setLoading(true); // Set loading state to true while verifying the code

            const res = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: currentUser.email, code: otp }), // Sending email and OTP to the backend for verification
            });
        
            const data = await res.json();
        
            if (res.ok) { // If the response is successful, navigate to the password reset page
                navigate('/password-reset');
            } else {
                console.error('Verification failed:', data.message); // Log any verification errors
                setModalMessage(data.message); // Show the verification failure message
            }
    
            setLoading(false); // Reset loading state after the process
        } catch (error) {
            console.error('Error verifying code:', error); // Log any errors during the verification process
        }
    };

    // Function to update OTP state when the user types in the input field
    const handleOtpChange = (e) => {
        setOtp(e.target.value); // Update the OTP state with the user's input
    };

    // useEffect hook to manage the countdown timer for the resend functionality
    useEffect(() => {
        if (timer === 0) { // When the timer reaches zero, enable the resend button
            setCanResend(true);
            return;
        }

        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1); // Decrease the timer by 1 every second
        }, 1000);

        return () => clearInterval(interval); // Cleanup the interval on component unmount or state change
    }, [timer]); // Dependency array to rerun the effect when the timer changes

    // Automatically hide the modal message after 3 seconds
    useEffect(() => {
        if (modalMessage) { // If there's a modal message, set a timeout to clear it
            const timer = setTimeout(() => {
                setModalMessage(null); // Clear the message after 3 seconds
            }, 3000); // 3 seconds

            return () => clearTimeout(timer); // Cleanup the timeout if the component unmounts or the message changes
        }
    }, [modalMessage]); // Dependency array to rerun the effect when the modalMessage changes

  return (
    <motion.div
        initial={{ opacity: 0 }} // Set initial opacity for the animation
        animate={{ opacity: 1 }} // Set final opacity for the animation
        exit={{ opacity: 0 }} // Set exit opacity for the animation
        transition={{
            duration: .5, // Animation duration
            ease: "easeInOut" // Animation easing function
        }}
    >
        <div className='bg-white fixed w-full h-full inset-0 z-[10000] flex justify-center'>
            <div className='pt-16 w-[30rem] max-w-[90%] flex flex-col gap-5'>
                <div 
                    className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
                    onClick={() => {
                        navigate(-1); // Go back to the previous page
                    }}
                >
                    <ArrowLeft />
                </div>

                <div className='flex items-center justify-center gap-1 w-full mb-5'>
                    <img 
                        src={`${process.env.PUBLIC_URL}/images/logo.png`} 
                        alt="Velora logo" 
                        className='w-14 bg-black p-1 rounded-br-md'
                    />
                </div>

                <>
                    <h1 className='text-2xl font-semibold'>Let's confirm your email</h1>
                    <p className='text-sm'>
                        To continue, enter the secure code we sent to <b>{currentUser.email}</b>. Check junk mail if it's not in your inbox
                    </p>
                    <div className='rounded-xl w-full h-14 relative'>
                        <label
                            htmlFor="token"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text 
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
                            onFocus={() => setIsFocused2(true)} // Handle focus event
                            onChange={handleOtpChange} // Handle change event for OTP input
                            autoComplete='off'
                            onBlur={(e) => !e.target.value && setIsFocused2(false)} // Reset focus if input is empty
                        />
                    </div>
                    <p 
                        className={`text-[0.7rem] text-red-500 transform transition-all duration-700 ease-in-out 
                            ${modalMessage 
                                ? 'opacity-1 translate-y-0 pointer-events-auto' 
                                : 'opacity-0 -translate-y-5 pointer-events-none'
                            }`
                        }
                    >
                        {/* Display modal message if present */}
                        {modalMessage} 
                    </p>
                    <button
                        disabled={loading} // Disable the button while loading
                        className={`w-full h-12 text-white rounded-full border-none outline-none flex items-center justify-center gap-2 transition-all duration-300 ease-in-out font-semibold
                            ${loading 
                                ? 'bg-[#48aadf96] cursor-not-allowed' 
                                : 'bg-[#48aadf] cursor-pointer'
                            }`
                        }
                        onClick={handleVerifyCode} // Trigger OTP verification
                    >
                    {loading 
                        ?   <SyncLoader 
                                color="#fff" // Customize the color of the loader
                                loading={loading} 
                                size={7} // Set loader size
                                margin={2} // Set margin between loader circles
                            />
                        : 'Continue'
                    }
                    </button>
                    {canResend 
                    ?  <button
                            className='w-full rounded-full py-3 cursor-pointer font-semibold hover:bg-blue-100 text-[#48aadf] transition-all duration-300 ease-in-out'
                            onClick={handleResendCode} // Resend OTP when clicked
                        >
                            Resend another secured code
                        </button>
                    :   <p className='text-center font-semibold'>
                            Your can request for a new code in {timer}s
                        </p>
                    }
                </>
            </div>
        </div>
    </motion.div>
  );
}

export default VerifyEmail; // Export the component