import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BookingCompleted = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: .5,
        ease: "easeInOut"
      }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-[#48aadf] text-white px-4"
    >
      <div className="flex flex-col items-center gap-4 bg-white p-6 md:p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <div className="relative w-20 h-20 flex items-center justify-center rounded-full">
          {/* Circle animation */}
          <div className="absolute inset-0 animate-scale-circle bg-green-500 rounded-full opacity-20"></div>
          {/* Check icon */}
          <FaCheckCircle className="text-green-500 text-5xl md:text-6xl animate-tick" />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
          Booking Completed!
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Your booking has been successfully completed. We have sent the details to your email.
        </p>
        <Link
          to="/"
          className="mt-4 px-4 py-2 md:px-6 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg transition duration-200"
        >
          Go to Homepage
        </Link>
      </div>
    </motion.div>
  );
};

export default BookingCompleted;