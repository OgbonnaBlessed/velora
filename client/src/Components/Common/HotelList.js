import React from 'react';
import HotelCard from './Cards/HotelCard';
import { motion } from 'framer-motion';

const HotelList = ({ hotels }) => {
    if (!hotels?.data?.length) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -50 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{
                    duration: .5,
                    ease: "easeInOut"
                }}
                className="text-center"
            >
                <p>No hotels found. Please adjust your search criteria.</p>
            </motion.div>
        );
    }
  
    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{
                duration: .5,
                ease: "easeInOut"
            }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-6"
        >
            {hotels.data.map((hotel, index) => (
                <HotelCard key={index} hotel={hotel} />
            ))}
        </motion.div>
    );
  };

export default HotelList;