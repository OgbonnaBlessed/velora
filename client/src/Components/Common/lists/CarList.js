import React from 'react'; 
// Importing the carCard component to display individual car cards.
import { Search } from 'lucide-react'; 
// Importing the Search icon from lucide-react for visual feedback when no cars are found.
import { motion } from 'framer-motion'; 
import CarCard from '../Cards/CarCard';
import CarFilters from '../filters/CarFilters';
// Importing motion from framer-motion to apply animations to the components.

const CarList = ({ cars, getCarDuration }) => {
    // The CarList component takes in cars, formatTime, and getCarDuration as props.

    // Check if cars data is empty or not available
    if (!cars || cars?.length === 0) {
        // Return a 'no cars found' message if no cars are found
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
                // Apply Tailwind CSS classes for styling the 'no cars found' message container
            >
                <div className="flex flex-col gap items-center">
                    <Search className='mb-2'/>
                    {/* Display the search icon */}
                    <p className="text-lg">Sorry, no cars found.</p>
                    {/* Message to inform the user no cars were found */}
                    <p className="font-normal font-sans">
                        Kindly change your selected parameters to view available cars.
                    </p>
                    {/* Additional information on how to view available cars */}
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
            <CarFilters
                handleSubmit={(filters) => {
                    console.log(filters); 
                    // When the filters are submitted, log the filters to the console
                }}
            />
            {/* Filters component for car filtering options */}

            <div className="flex flex-col gap-5 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between gap-10">
                    {/* Grid layout for car cards, responsive for different screen sizes */}
                    {cars?.map((car) => (
                        // Loop through the cars data and display a carCard for each car
                        <CarCard
                            key={car.id} 
                            // Use the index as the key for each carCard (for rendering optimization)
                            car={car}
                            getCarDuration={getCarDuration} 
                            // Pass the getcarDuration function as a prop to carCard
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default CarList;
// Export the CarList component for use in other parts of the application.