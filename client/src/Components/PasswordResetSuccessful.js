import { ArrowLeft } from 'lucide-react'; // Importing the left arrow icon from the 'lucide-react' library for navigation
import React from 'react' // Importing React to use JSX and React features
import { useNavigate } from 'react-router-dom' // Importing the useNavigate hook from react-router-dom for navigation
import { motion } from 'framer-motion'; // Importing motion from framer-motion to animate components

// PasswordResetSuccessful component to show a success message after a password reset
const PasswordResetSuccessful = () => {
    // Using the useNavigate hook to navigate between routes programmatically
    const navigate = useNavigate();

    return (
        // The main container with framer-motion animations for fading in/out
        <motion.div 
            initial={{ opacity: 0 }} // Initial state: hidden (opacity 0)
            animate={{ opacity: 1 }} // Target state: fully visible (opacity 1)
            exit={{ opacity: 0 }} // Exit state: fade out (opacity 0)
            transition={{
                duration: .5, // Duration of the fade effect
                ease: "easeInOut" // Ease transition effect for smooth animation
            }}
            className='bg-white fixed w-full h-full inset-0 z-[10000] flex justify-center' 
            // Styling for full-screen white background with fixed position, centered content
        >
            <div className='pt-16 w-[30rem] max-w-[90%] flex flex-col gap-5'>
                {/* Back button with an ArrowLeft icon to navigate to the previous page */}
                <div 
                    className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]' 
                    onClick={() => {
                        navigate(-1); // Go back to the previous page when clicked
                    }}
                >
                    <ArrowLeft /> {/* Left arrow icon */}
                </div>

                {/* Logo container */}
                <div className='flex items-center justify-center gap-1 w-full mb-5'>
                    <img 
                        src={`${process.env.PUBLIC_URL}/images/logo.png`} 
                        alt="Velora logo" 
                        className='w-14 bg-black p-1 rounded-br-xl' 
                        // Logo image, placed with some padding and rounded corners
                    />
                </div>

                {/* Success message text */}
                <p className='text-black font-medium text-2xl text-center'>
                    Your password has been successfully changed.
                </p>

                {/* "OK" button to navigate to profile settings after resetting the password */}
                <button
                    className='bg-[#48aadf] rounded-full py-3 w-full text-white font-semibold cursor-pointer shrink-button'
                    onClick={() => navigate('/profile?tab=settings')} 
                    // Navigate to the profile settings page when clicked
                >
                    OK
                </button>
            </div>
        </motion.div>
    )
}

export default PasswordResetSuccessful; // Exporting the component for use in other parts of the app