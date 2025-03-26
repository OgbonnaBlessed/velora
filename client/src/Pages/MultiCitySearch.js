/* eslint-disable react-hooks/exhaustive-deps */

import { LucideMessageSquareWarning, Plus } from 'lucide-react'; // Importing an icon for warning messages
import React, { useEffect, useState } from 'react'; // Importing React and hooks
import { BounceLoader } from 'react-spinners'; // Importing a loading spinner component
import { locations } from '../Data/Locations'; // Importing the locations data (presumably a list of places)
import DateRangePicker from '../Components/Common/Inputs/DateRangePicker'; // Importing the Date Range Picker Component
import FlightsList from '../Components/Common/FlightsList'; // Importing the Flights List Component
import { useLocation } from 'react-router-dom'; // Hook to get the location from the router
import dayjs from 'dayjs'; // Dayjs for date manipulation
import { useSelector } from 'react-redux'; // Hook to access the Redux store
import { motion, AnimatePresence } from 'framer-motion'; // Framer Motion for animations
import axios from 'axios';
import DestinationInput2 from '../Components/Common/Inputs/DestinationInput2';
import OriginInput2 from '../Components/Common/Inputs/OriginInput2';
import TravelersInput2 from '../Components/Common/Inputs/TravelerInput2';

function MultiCitySearch() {
    // Accessing the current user from the Redux store
    const { currentUser } = useSelector((state) => state.user);
    
    // Get the location object from the router
    const location = useLocation();

    // Setting state variables
    const [flights, setFlights] = useState([
        {
          id: 1,
          origin: '',
          destination: '',
          departureDate: dayjs().format('YYYY-MM-DD'),
          returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
          travelers: 1,
          rooms: 1,
          errors: {},
        },
        {
          id: 2,
          origin: '',
          destination: '',
          departureDate: dayjs().format('YYYY-MM-DD'),
          returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
          travelers: 1,
          rooms: 1,
          errors: {},
        },
    ]);
    console.log(flights);
    const [flightsData, setFlightsData] = useState('');
    const [error, setError] = useState(null); // To handle general error
    const [loading, setLoading] = useState(false); // To control loading state
    const [triggerSearch, setTriggerSearch] = useState(false); // To trigger search based on props or initial state

    useEffect(() => {
        if (location.state?.flights && location.state.flights.length > 0) {
            // Map the incoming flights to the correct state structure
            setFlights(location.state.flights.map((flight, index) => ({
                id: index + 1, // Ensure IDs are sequential
                origin: flight.origin,
                destination: flight.destination,
                departureDate: flight.departureDate,
                returnDate: flight.returnDate,
                travelers: flight.travelers,
                rooms: flight.rooms,
                errors: {}, // Reset errors for each flight
            })));
            setTriggerSearch(true);
        }
        // Dependency only on location.state to avoid continual re-rendering
    }, [location.state]);

    // useEffect hook to trigger search when required
    useEffect(() => {
        if (triggerSearch && flights.some(f => f.origin && f.destination)) {
            handleSubmit(); // Call submit when required fields are set
            setTriggerSearch(false); // Reset the trigger after search
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerSearch]);

    const addFlight = () => {
        if (flights.length < 5) {
            setFlights([
                ...flights,
                { 
                    id: flights.length + 1, 
                    origin: '', 
                    destination: '', 
                    departureDate: dayjs().format('YYYY-MM-DD'), 
                    returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
                    travelers: 1,
                    rooms: 1,
                    errors: {} 
                },
            ]);
        }
    };

    const removeFlight = (id) => {
        setFlights(flights.filter((flight) => flight.id !== id));
    };
    
    const handleFlightChange = (id, field, value) => {
        setFlights((prevFlights) =>
            prevFlights.map((flight) => 
                flight.id === id ? { ...flight, [field]: value } : flight
            )
        );
    };

    const handleDateChange = (id, [startDate, endDate]) => {
        setFlights((prevFlights) =>
            prevFlights.map((flight) =>
                flight.id === id
                    ? {
                        ...flight,
                        departureDate: startDate.format('YYYY-MM-DD'),
                        returnDate: endDate.format('YYYY-MM-DD'),
                      }
                    : flight
            )
        );
    };

    // Function to update travelers data
    const handleTravelersChange = (travelers, rooms) => {
        setFlights((prevFlights) =>
            prevFlights.map((flight) => ({
                ...flight,
                travelers,
                rooms,
            }))
        );
    };

    // Handle form submission for flight search
    const handleSubmit = async (e) => {
        if (e) e.preventDefault(); // Prevent default form submission behavior
        setError(null); // Reset any previous errors
        
        let hasError = false;
        const flightPairs = new Set();
        
        const updatedFlights = flights.map((flight) => {
            const newErrors = {};
        
            if (!currentUser) {
              newErrors.origin = 'You are not signed in';
              hasError = true;
            }
        
            if (!flight.origin) {
              newErrors.origin = 'Please select an origin';
              hasError = true;
            }
        
            if (!flight.destination) {
              newErrors.destination = 'Please select a destination';
              hasError = true;
            }
        
            if (flight.origin && flight.destination && flight.origin === flight.destination) {
              newErrors.destination = 'Origin and destination cannot be the same';
              hasError = true;
            }
        
            // Create a unique key for the flight combination
            const routeKey = `${flight.origin}-${flight.destination}`;
            if (flightPairs.has(routeKey)) {
              newErrors.origin = 'This route has already been added';
              newErrors.destination = 'This route has already been added';
              hasError = true;
            } else if (flight.origin && flight.destination) {
              flightPairs.add(routeKey);
            }
        
            // Set a timeout to clear the errors for this flight after 3 seconds
            if (Object.keys(newErrors).length > 0) {
                setTimeout(() => {
                    setFlights((prevFlights) =>
                        prevFlights.map((f) =>
                            f.id === flight.id ? { ...f, errors: {} } : f
                        )
                    );
                }, 3000);
            }
        
            return { ...flight, errors: newErrors };
        });
        
        setFlights(updatedFlights);
        
        if (hasError) return;

        try {
            setLoading(true);
            const response = await axios.post('api/flight/multi-city', { 
                userId: currentUser._id, 
                flights, 
                adults: 1 
            });
            
            setFlightsData(response.data);
            console.log("Flight data:", response.data); 

        } catch (error) {
            console.error('Error fetching flights:', error?.response?.data || error?.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to calculate the flight duration in minutes
    const getFlightDuration = (flight) => {
        const segments = flight.itineraries[0]?.segments;
        const departureTime = new Date(segments[0].departure.at).getTime();
        const arrivalTime = new Date(segments[segments.length - 1].arrival.at).getTime();
        return (arrivalTime - departureTime) / (1000 * 60); // Duration in minutes
    };

    // Helper function to format flight times into a readable format
    const formatTime = (date) =>
        new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(new Date(date));

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: .5,
                ease: "easeInOut"
            }}
            className='flex flex-col gap-5 px-4 sm:px-6 lg:px-20 pt-28 md:pt-36 pb-10 bg-white'
        >
            {/* Search form for flights */}
            <form 
                onSubmit={(e) => handleSubmit(e)}
                className="flex flex-col gap-8 w-full"
            >
                <div className="w-72 max-w-full">
                    <TravelersInput2 handleTravelersChange={handleTravelersChange} />
                </div>
            
                {flights.map((flight) => (
                    <div className="flex flex-col gap-2" key={flight.id}>
                        <h1 className="font-semibold text-lg">Flight {flight.id}</h1>
                        <div className="xl:grid-cols-3 xl:gap-3 grid gap-4 md:gap-6 md:grid-cols-2 items-center">
                            <div className="relative">
                                <OriginInput2
                                    id={flight.id}
                                    value={flight.origin}
                                    setValue={(value) => handleFlightChange(flight.id, 'origin', value)}
                                    locations={locations}
                                    label="From where?"
                                />
                                <AnimatePresence mode="wait">
                                    {flight.errors?.origin && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-red-500 text-xs absolute bottom-1 right-2"
                                        >
                                            {flight.errors.origin}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
            
                            <div className="relative">
                                <DestinationInput2
                                    value={flight.destination}
                                    setValue={(value) => handleFlightChange(flight.id, 'destination', value)}
                                    locations={locations}
                                    label="Where to?"
                                />
                                <AnimatePresence mode="wait">
                                    {flight.errors?.destination && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-red-500 text-xs absolute bottom-1 right-2"
                                        >
                                            {flight.errors.destination}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
            
                            <DateRangePicker
                                id={flight.id}
                                onDateChange={(dates) => handleDateChange(flight.id, dates)}
                                defaultDates={[
                                    dayjs(flight.departureDate),
                                    dayjs(flight.returnDate),
                                ]}
                                label="Flight dates"
                            />
                        </div>
            
                        {flight.id > 2 && (
                            <p
                                className="text-sm text-[#48aadf] font-semibold cursor-pointer self-end"
                                onClick={() => removeFlight(flight.id)}
                            >
                                Remove flight
                            </p>
                        )}
                    </div>
                ))}
            
                <div className="flex items-center justify-between">
                    {flights.length < 5 && (
                        <div
                            className="flex items-center gap-1 text-[#48aadf] cursor-pointer"
                            onClick={addFlight}
                        >
                            <p>Add Flight</p>
                            <Plus className="p-1" />
                        </div>
                    )}
        
                    <button
                        type="submit"
                        disabled={loading}
                        className={`${ loading ? 'bg-[#48aadf]/80 cursor-not-allowed' : 'bg-[#48aadf] hover:bg-[#48aadf]/80 active:scale-90 cursor-pointer' } rounded-full font-semibold text-white px-8 py-3 h-fit w-fit self-center transition-all duration-300 ease-in-out`}
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Loading, Error, or Flight Results Display */}
            <div>
                {loading ? (
                    <div className='min-h-64 w-full flex items-center justify-center'>
                        <BounceLoader
                            color="#48aadf" // Customize the color of the loader
                            loading={loading} 
                        />
                    </div>
                ) : error ? (
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

                ) : (
                    // Flights Display
                    <FlightsList
                        flights={flightsData} // Pass flights data to the FlightsList component
                        formatTime={formatTime} // Pass time formatting function
                        getFlightDuration={getFlightDuration} // Pass flight duration function
                    />
                )}
            </div>
        </motion.div>
    );
}

export default MultiCitySearch;