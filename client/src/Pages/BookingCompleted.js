import React from "react";
import { FaCheckCircle } from "react-icons/fa"; // Importing check circle icon from react-icons
import { Link } from "react-router-dom"; // Importing Link for routing to the homepage
import { motion } from "framer-motion"; // Importing motion from framer-motion for animations

const BookingCompleted = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} // Initial opacity when the component appears
      animate={{ opacity: 1 }} // Final opacity when the component is fully visible
      exit={{ opacity: 0 }} // Fade out opacity when the component is removed from the screen
      transition={{
        duration: .5, // Transition duration of 0.5 seconds
        ease: "easeInOut" // Easing function for smooth transition
      }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-[#48aadf] text-white px-4"
      // Full screen minimum height with a gradient background and center alignment
    >
      <div className="flex flex-col items-center gap-4 bg-white p-6 md:p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        {/* Container for the booking completed message */}
        
        <div className="relative w-20 h-20 flex items-center justify-center rounded-full">
          {/* Circle container for the check icon */}
          
          <div className="absolute inset-0 animate-scale-circle bg-green-500 rounded-full opacity-20"></div>
          {/* Animated background circle that scales and has a green background with reduced opacity */}

          <FaCheckCircle className="text-green-500 text-5xl md:text-6xl animate-tick" />
          {/* Checkmark icon with green color and animation */}
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
          Booking Completed!
        </h1>
        {/* Heading to display the booking completion message */}

        <p className="text-gray-600 text-base md:text-lg">
          Your booking has been successfully completed. We have sent the details to your email.
        </p>
        {/* Paragraph describing that the booking was successful and email has been sent */}

        <Link
          to="/" // Link to navigate back to the homepage
          className="mt-4 px-4 py-2 md:px-6 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg transition duration-200"
          // Styled button to go to the homepage
        >
          Go to Homepage
        </Link>
      </div>
    </motion.div>
  );
};

export default BookingCompleted;