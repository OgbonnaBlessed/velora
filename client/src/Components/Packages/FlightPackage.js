import React, { useState } from 'react';
import dayjs from 'dayjs' // Importing dayjs for date manipulation
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook to navigate between pages
import OriginInput from '../Common/Inputs/OriginInput'; // Component to input origin
import { locations } from '../../Data/Locations'; // Importing locations data for use in OriginInput and DestinationInput
import DestinationInput from '../Common/Inputs/DestinationInput'; // Component to input destination
import DateRangePicker from '../Common/Inputs/DateRangePicker'; // Component for selecting dates
import TravelersInput from '../Common/Inputs/TravelerInput'; // Component to handle traveler input
import { useSelector } from 'react-redux'; // Importing useSelector to access Redux state
import { AnimatePresence, motion } from 'framer-motion';

const FlightPackage = () => {
    // Accessing currentUser from the Redux state to check if the user is signed in
    const { currentUser } = useSelector((state) => state.user);

    // Setting up state for errors (origin and destination) and form data
    const [errors, setErrors] = useState({ origin: '', destination: '' });
    const [formData, setFormData] = useState({
        origin: '', // Initial empty value for origin
        destination: '', // Initial empty value for destination
        departureDate: dayjs().format('YYYY-MM-DD'), // Set default departure date to today's date
        returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'), // Set default return date to two days from today
        adults: 1, // Default number of adults
        rooms: 1, // Default number of rooms
    });

    const navigate = useNavigate(); // useNavigate hook to programmatically navigate between pages

    // Handle date change and update the formData state with the new departure and return dates
    const handleDateChange = ([startDate, endDate]) => {
        setFormData((prev) => ({
            ...prev,
            departureDate: startDate.format('YYYY-MM-DD'), // Update departure date
            returnDate: endDate.format('YYYY-MM-DD'), // Update return date
        }));
    };

    // Handle form submission when the search button is clicked
    const handleSearch = () => {
        let hasError = false; // Flag to track if there are errors
        const newErrors = { origin: '', destination: '' }; // Object to hold error messages

        // If the user is not signed in, set an error for the origin field
        if (!currentUser) {
            newErrors.origin = 'You are not signed in';
            hasError = true; // Set error flag
        }

        // If origin is not selected, set an error message
        if (!formData.origin) {
            newErrors.origin = 'Please select an origin';
            hasError = true; // Set error flag
        }

        // If destination is not selected, set an error message
        if (!formData.destination) {
            newErrors.destination = 'Please select a destination';
            hasError = true; // Set error flag
        }

        // If origin and destination are the same, set an error message
        if (formData.destination && formData.origin && formData.origin === formData.destination) {
            newErrors.destination = 'Origin and destination cannot be the same';
            hasError = true; // Set error flag
        }

        // If any errors are present, set the error state and show them for 3 seconds
        if (hasError) {
            setErrors(newErrors);
            setTimeout(() => {
                setErrors({ origin: '', destination: '' }); // Clear errors after 3 seconds
            }, 3000);
            return; // Exit the function if there are errors
        }

        // Navigate to the 'flight-search' page with the form data passed as state
        navigate('/flight-search', { state: { 
            origin: formData.origin,
            destination: formData.destination,
            departureDate: formData.departureDate,
            returnDate: formData.returnDate,
            adults: formData.adults,
            rooms: formData.rooms,
        }}); // Navigate to flight search page
    };

  return (
    <div className="flex flex-col gap-8 w-full">
        <div className="xl:flex xl:gap-3 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center">
            {/* Origin Input Section */}
                <div className='relative'>
                    <OriginInput 
                        formData={formData}
                        setFormData={setFormData}
                        locations={locations}  // Pass available locations
                        label="From where?"
                    />
                    <AnimatePresence mode='wait'>
                        {errors.origin && (
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="text-red-500 text-xs bottom-1 right-2 absolute"
                            >
                                {errors.origin}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative">
                    <DestinationInput
                        formData={formData}
                        setFormData={setFormData}
                        locations={locations}  // Pass available locations
                        label="Where to?"
                    />
                    {/* Display error if destination is not selected */}
                    <AnimatePresence mode='wait'>
                        {errors.destination && (
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="text-red-500 text-xs bottom-1 right-2 absolute"
                            >
                                {errors.destination}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

            {/* Date Picker Component */}
            <DateRangePicker
                onDateChange={handleDateChange} // Handler for date changes
                defaultDates={[
                    dayjs(formData.departureDate), // Set default departure date
                    dayjs(formData.returnDate), // Set default return date
                ]}
            />

            {/* Travelers Input Component */}
            <TravelersInput 
                formData={formData} // Passing formData state to TravelersInput component
                setFormData={setFormData} // Passing setFormData function to TravelersInput component
            />

            {/* Search Button */}
            <button 
                type="button" 
                onClick={handleSearch} // On click, handle the search
                className="bg-[#48aadf] hover:bg-[#48aadf]/80 active:scale-90 rounded-full font-semibold text-white cursor-pointer px-8 py-3 h-fit w-fit self-center transition-all duration-300 ease-in-out"
            >
                Search
            </button>
        </div>
    </div>
  );
};

export default FlightPackage; // Export the FlightPackage component as the default export