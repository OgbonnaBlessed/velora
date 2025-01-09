import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component for navigation between routes
import ScrollToTop from './ScrollToTop'; // Import a utility component to scroll to the top of the page when navigated
import { motion } from 'framer-motion'; // Import the motion component for animations

/**
 * ProfileReviews Component
 * Displays a user-friendly message encouraging users to leave their first review,
 * along with a link to book their next adventure.
 */
const ProfileReviews = () => {
  return (
    <motion.div 
        // Animation for the container: fade in on mount, fade out on unmount
        initial={{ opacity: 0 }} // Start with 0 opacity for fade-in effect
        animate={{ opacity: 1 }} // Animate to full opacity
        exit={{ opacity: 0 }} // Fade out effect when component unmounts
        transition={{
            duration: .5, // Animation duration of 0.5 seconds
            ease: "easeInOut" // Smooth easing for the transition
        }}
        className='bg-blue-100 rounded-3xl p-14 flex-1 flex flex-col gap-10' // Styling for the container
    >
        {/* Utility component to ensure the page scrolls to the top when this component is mounted */}
        <ScrollToTop/>

        {/* Centered message encouraging the user to take an action */}
        <div className='flex flex-col items-center sm:gap-3 gap-1'>
            {/* Display a motivational message in bold, responsive font sizes */}
            <p className='sm:text-2xl text-xl font-semibold'>
                Your first review awaits...
            </p>

            {/* Link to redirect users to the home page to book their next adventure */}
            <Link
                to='/' // Route for navigation; redirects to the home page
                className='text-[#48aadf] hover:underline max-sm:text-sm' // Styled with a custom color and underline on hover
            >
                book your next adventure
            </Link>
        </div>
    </motion.div>
  )
}

export default ProfileReviews; // Export the ProfileReviews component for use in other parts of the app