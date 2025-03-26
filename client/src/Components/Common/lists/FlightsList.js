import React from 'react'; 
// Importing React to enable JSX syntax and component functionality.
import FlightFilters from '../filters/FlightFilters'; 
// Importing the Filters component for displaying the flight filters.
import FlightCard from '../Cards/FlightCard'; 
// Importing the FlightCard component to display individual flight cards.
import { Search } from 'lucide-react'; 
// Importing the Search icon from lucide-react for visual feedback when no flights are found.
import { motion } from 'framer-motion'; 
// Importing motion from framer-motion to apply animations to the components.

const FlightsList = ({ flights, formatTime, getFlightDuration }) => {
    // The FlightsList component takes in flights, formatTime, and getFlightDuration as props.

    // Check if flights data is empty or not available
    if (!flights || flights?.data?.length === 0) {
        // Return a 'no flights found' message if no flights are found
        return (
            <motion.div 
                initial={{ opacity: 0, y: -50 }} 
                // Initial state: set opacity to 0 and y-axis to 0
                animate={{ opacity: 1, y: 0 }} 
                // Animation: gradually make the component visible and move it upwards
                exit={{ opacity: 0, y: -50 }} 
                // Exit animation: hide the component and reset y-axis position
                transition={{
                    duration: .5, 
                    // Transition duration set to 0.5 seconds
                    ease: "easeInOut"
                    // Apply an 'easeInOut' transition effect for smooth animation
                }}
                className="flex flex-col gap-5 items-center font-Poppins font-semibold min-h-64 w-full justify-center"
                // Apply Tailwind CSS classes for styling the 'no flights found' message container
            >
                <div className="flex flex-col gap items-center">
                    <Search className='mb-2'/>
                    {/* Display the search icon */}
                    <p className="text-lg">Sorry, no flights found.</p>
                    {/* Message to inform the user no flights were found */}
                    <p className="font-normal font-sans">
                        Kindly change your selected parameters to view available flights.
                    </p>
                    {/* Additional information on how to view available flights */}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            // Initial state: set opacity to 0 and y-axis to -50 for animation
            animate={{ opacity: 1, y: 0 }} 
            // Animation: smoothly appear with no vertical movement
            exit={{ opacity: 0, y: -50 }} 
            // Exit state: gradually disappear and move downwards
            transition={{
                duration: .5, 
                // Transition duration of 0.5 seconds
                ease: "easeInOut"
                // Smooth transition effect
            }}
            className="flex flex-col gap-12 w-full md:mt-8 mt-5"
            // Styling for the main container using Tailwind CSS
        >
            <FlightFilters
                handleSubmit={(filters) => {
                    console.log(filters); 
                    // When the filters are submitted, log the filters to the console
                }}
            />
            {/* Filters component for flight filtering options */}

            <div className="flex flex-col gap-5 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between gap-10">
                    {/* Grid layout for flight cards, responsive for different screen sizes */}
                    {flights?.data?.map((flight, index) => (
                        // Loop through the flights data and display a FlightCard for each flight
                        <FlightCard
                            key={index} 
                            // Use the index as the key for each FlightCard (for rendering optimization)
                            flight={flight} 
                            // Pass the individual flight data to the FlightCard component
                            formatTime={formatTime} 
                            // Pass the formatTime function as a prop to FlightCard
                            getFlightDuration={getFlightDuration} 
                            // Pass the getFlightDuration function as a prop to FlightCard
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default FlightsList;
// Export the FlightsList component for use in other parts of the application.