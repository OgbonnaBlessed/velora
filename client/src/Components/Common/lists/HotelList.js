import React from 'react'; 
// Importing React to enable JSX syntax and component functionality.
import HotelCard from '../Cards/HotelCard'; 
// Importing the HotelCard component to display individual hotel cards.
import { motion } from 'framer-motion'; 
import HotelFilters from '../filters/HotelFilters';
// Importing motion from framer-motion to add animations to the components.

const HotelList = ({ hotels }) => {
    // The HotelList component receives a prop hotels which contains the list of hotels.

    // Check if the hotels data is empty or not available
    if (!hotels?.data?.length) {
        // If no hotels are found, return a message saying no hotels are available
        return (
            <motion.div 
                initial={{ opacity: 0, y: -50 }} 
                // Initial state: opacity is set to 0 (invisible) and y-axis position is 0
                animate={{ opacity: 1, y: 0 }} 
                // Animation: gradually increase opacity to 1 (visible) and move up by 50px
                exit={{ opacity: 0, y: -50 }} 
                // Exit animation: fade out and reset y-axis position to 0
                transition={{
                    duration: .5, 
                    // Transition duration is set to 0.5 seconds
                    ease: "easeInOut"
                    // Apply an 'easeInOut' transition effect for smooth entry and exit
                }}
                className="text-center"
                // Tailwind CSS class to center the message in the container
            >
                <p>No hotels found. Please adjust your search criteria.</p>
                {/* Display a message indicating that no hotels were found */}
            </motion.div>
        );
    }
  
    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            // Initial state: opacity is set to 0 (invisible) and y-axis position is 50px
            animate={{ opacity: 1, y: 0 }} 
            // Animation: gradually increase opacity to 1 (visible) and move the element to its normal position (y=0)
            exit={{ opacity: 0, y: 50 }} 
            // Exit state: fade out and move the element 50px down
            transition={{
                duration: .5, 
                // Transition duration is set to 0.5 seconds
                ease: "easeInOut"
                // Apply an 'easeInOut' transition effect for smooth animation
            }}
            className="flex flex-col gap-12 w-full md:mt-8 mt-5"
        >
            <HotelFilters
                handleSubmit={(filters) => {
                    console.log(filters); 
                    // When the filters are submitted, log the filters to the console
                }}
            />

            <div className="flex flex-col gap-5 w-full">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Loop through the hotels data and render a HotelCard for each hotel */}
                    {hotels.data.map((hotel, index) => (
                        <HotelCard key={index} hotel={hotel} />
                        // Pass the hotel data to each HotelCard component and use the index as the key
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default HotelList;
// Export the HotelList component for use in other parts of the application.