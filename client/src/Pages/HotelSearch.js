// Importing necessary libraries and components
import { LucideMessageSquareWarning } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners'; // For the loading spinner
import { locations } from '../Data/Locations'; // Presumably a list of locations for the destination input
import DestinationInput from '../Components/Common/Inputs/DestinationInput'; // Component for inputting destination
import TravelersInput from '../Components/Common/Inputs/TravelerInput'; // Component for inputting traveler details
import DateRangePicker from '../Components/Common/Inputs/DateRangePicker'; // Date picker for selecting dates
import { useLocation } from 'react-router-dom'; // Hook to access router state
import dayjs from 'dayjs'; // For date manipulation
import HotelList from '../Components/Common/HotelList'; // Component to display list of hotels
import { useSelector } from 'react-redux'; // To access Redux state
import { AnimatePresence, motion } from 'framer-motion'; // For animations

function HotelSearch() {
    // Access location state from react-router to get previous search data if available
    const location = useLocation();
    const { currentUser } = useSelector((state) => state.user); // Accessing current user from Redux store
    
    // State variables to hold form data, hotels, errors, loading state, and trigger search
    const [hotels, setHotels] = useState('');
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({ origin: '', destination: '' });
    const [triggerSearch, setTriggerSearch] = useState(false); // Flag to trigger the search automatically
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        destination: '',
        departureDate: dayjs().format('YYYY-MM-DD'), // Default departure date is today
        returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'), // Default return date is 2 days from today
        adults: 1,
        rooms: 1,
    });

    // Effect hook to handle if location state is passed (i.e., when navigating with state)
    useEffect(() => {
        if (location.state) {
            console.log(location.state); // Log the location state for debugging
            setFormData({
                destination: location.state.destination,
                departureDate: location.state.departureDate,
                returnDate: location.state.returnDate,
                adults: location.state.adults,
                rooms: location.state.rooms,
            });
            setTriggerSearch(true); // Trigger search automatically after setting form data
        }
    }, [location.state]);

    // Effect hook to trigger the search after the form data is set or location state is available
    useEffect(() => {
        if (triggerSearch && formData.destination) {
            handleSubmit(); // Trigger the submit function to fetch hotels
            setTriggerSearch(false); // Reset triggerSearch flag after submission
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerSearch]);

    // Function to handle changes in date range
    const handleDateChange = ([startDate, endDate]) => {
        setFormData((prev) => ({
            ...prev,
            departureDate: startDate.format('YYYY-MM-DD'),
            returnDate: endDate.format('YYYY-MM-DD'),
        }));
    };

    // Function to handle the form submission and fetch hotels
    const handleSubmit = async (e) => {
        if (e) e.preventDefault(); // Prevent default form submission behavior
        setError(null); // Reset previous errors
        
        let hasError = false;
        const newErrors = { destination: '' };
        
        // Check if destination is provided
        if (!formData.destination) {
            newErrors.destination = 'Please select a destination.';
            hasError = true;
        }
        
        // If there's an error, show it and stop the form submission
        if (hasError) {
            setErrors(newErrors);
            setTimeout(() => {
                setErrors({ destination: '' });
            }, 3000); // Clear error after 3 seconds
            return;
        }
        
        try {
            setLoading(true); // Start loading
            // Prepare payload for the API request
            const payload = {
                userId: currentUser._id, // Send user ID from Redux store
                destination: formData.destination, // IATA code or city name
                checkInDate: formData.departureDate,
                checkOutDate: formData.returnDate,
                adults: parseInt(formData.adults, 10),
                rooms: parseInt(formData.rooms, 10),
            };
            
            // Send POST request to the backend to search for hotels
            const response = await fetch(`/api/flight/search-hotels`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            // Parse the response
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Failed to fetch hotels. Please try again.');
            }
            
            setHotels(data); // Set fetched hotel data
            console.log(data); // Log the fetched data for debugging
        } catch (error) {
            console.error('Error fetching hotels:', error);
            setError(error.message); // Set error message in state
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    // Helper function to format date/time for display
    const formatTime = (date) =>
        new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
    }).format(new Date(date));

    return (
        <motion.div 
            initial={{ opacity: 0 }} // Initial animation state: invisible
            animate={{ opacity: 1 }} // Animate to visible
            exit={{ opacity: 0 }} // When exiting, make invisible
            transition={{
                duration: .5, // Animation duration
                ease: "easeInOut" // Easing function for smooth animation
            }}
            className='flex flex-col gap-5 px-4 sm:px-6 lg:px-20 pt-28 md:pt-36 pb-10 bg-white'
        >
            <form 
                onSubmit={(e) => handleSubmit(e)} // Handle form submission
                className="xl:flex xl:gap-3 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center"
            >
                {/* Destination input */}
                <div className="relative flex-1">
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

                {/* Date Picker for selecting departure and return dates */}
                <DateRangePicker
                    onDateChange={handleDateChange} // Handle date changes
                    defaultDates={[
                        dayjs(formData.departureDate),
                        dayjs(formData.returnDate),
                    ]}
                />

                {/* Travelers input for selecting number of adults and rooms */}
                <TravelersInput 
                    formData={formData} 
                    setFormData={setFormData} 
                />

                {/* Search button to submit the form */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`${ loading ? 'bg-[#48aadf]/80 cursor-not-allowed' : 'bg-[#48aadf] hover:bg-[#48aadf]/80 active:scale-90 cursor-pointer' } rounded-full font-semibold text-white px-8 py-3 h-fit w-fit self-center transition-all duration-300 ease-in-out`}
                >
                    Search
                </button>
            </form>

            <div>
                {/* Loading spinner while fetching data */}
                {loading
                ?   <div className='min-h-64 w-full flex items-center justify-center'>
                        <BounceLoader
                            color="#48aadf" // Customize the color
                            loading={loading} 
                        />
                    </div>
                : error 
                ?   // Error message if something goes wrong during the fetch
                    <motion.div 
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{
                            duration: .5,
                            ease: "easeInOut"
                        }}
                        className='flex flex-col gap-5 items-center font-Poppins font-semibold min-h-64 w-full justify-center'
                    >
                        <div className='flex flex-col gap items-center'>
                            <LucideMessageSquareWarning />
                            <p className='text-lg'>
                                We are currently having issues at our end
                            </p>
                            <p className='font-normal font-sans'>Please try again later</p>
                        </div>
                    </motion.div>

                :   // Display hotels if no errors
                    <HotelList
                        hotels={hotels} // Pass hotel data to the HotelList component
                        formatTime={formatTime} // Pass formatTime helper for time formatting
                    />
                }
            </div>
        </motion.div>
    );
}

export default HotelSearch;