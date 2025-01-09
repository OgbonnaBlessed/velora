// Importing necessary modules and components
import { ArrowLeft } from 'lucide-react'; // Icon for the back arrow button
import React, { useEffect } from 'react'; // React and useEffect hook
import { useNavigate } from 'react-router-dom'; // Hook to handle page navigation
import { motion } from 'framer-motion'; // For animation on page load

const UpdateEmailSuccess = () => {
    const navigate = useNavigate(); // Hook to handle navigation

    // useEffect hook to handle the browser's back button and prevent going back to the previous page
    useEffect(() => {
        // handlePopState function that redirects to the sign-in page if back button is clicked
        const handlePopState = () => {
            navigate('/signin', { replace: true }); // Replace current entry in history with /signin
        };

        window.addEventListener('popstate', handlePopState); // Listen for popstate event (browser back button)

        // Cleanup the event listener when the component unmounts or the effect is re-run
        return () => {
            window.removeEventListener('popstate', handlePopState); // Remove the event listener when the component unmounts
        };
    }, [navigate]); // Dependency array with navigate to ensure it's always up-to-date

    return (
        // Motion.div is used to wrap the component with animations
        <motion.div 
            initial={{ opacity: 0 }} // Initial state of opacity
            animate={{ opacity: 1 }} // Animation to full opacity
            exit={{ opacity: 0 }} // When exiting, fade out
            transition={{
                duration: .5, // Duration of the animation
                ease: "easeInOut" // Animation easing
            }}
            className='bg-white fixed w-full h-full inset-0 z-[10000] flex justify-center'
        >
            <div className='pt-16 w-[30rem] max-w-[90%] flex flex-col gap-5'>
                {/* Back button with a left arrow */}
                <div
                    className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
                    onClick={() => {
                        navigate('/signin'); // Navigate to the sign-in page when clicked
                    }}
                >
                    <ArrowLeft /> {/* Render the arrow icon */}
                </div>

                {/* Logo section */}
                <div className='flex items-center justify-center gap-1 w-full mb-5'>
                    <img
                        src={`${process.env.PUBLIC_URL}/images/logo.png`} // Using the logo image from public folder
                        alt="Velora logo"
                        className='w-14 bg-black p-1 rounded-br-xl' // Styling for the logo
                    />
                </div>

                {/* Heading and description */}
                <h1 className='text-black font-medium text-2xl text-center'>
                    Your email has been successfully updated.
                </h1>
                <p className='text-center text-sm'>
                    Kindly sign in before you proceed further
                </p>

                {/* Sign-in button */}
                <button
                    className='bg-[#48aadf] rounded-full py-3 w-full text-white font-semibold cursor-pointer'
                    onClick={() => navigate('/signin')} // Navigate to the sign-in page on button click
                >
                    Sign in
                </button>
            </div>
        </motion.div>
    );
};

export default UpdateEmailSuccess; // Export the component to be used elsewhere