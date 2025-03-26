import { LucideMessageSquareWarning } from 'lucide-react'; // Importing an icon for warning messages
import React, { useEffect, useState } from 'react'; // Importing React and hooks
import { BounceLoader } from 'react-spinners'; // Importing a loading spinner component
import { locations } from '../Data/Locations'; // Importing the locations data (presumably a list of places)
import OriginInput from '../Components/Common/Inputs/OriginInput'; // Importing the Origin Input Component
import DestinationInput from '../Components/Common/Inputs/DestinationInput'; // Importing the Destination Input Component
import TravelersInput from '../Components/Common/Inputs/TravelerInput'; // Importing the Travelers Input Component
import DateRangePicker from '../Components/Common/Inputs/DateRangePicker'; // Importing the Date Range Picker Component
import FlightsList from '../Components/Common/lists/FlightsList'; // Importing the Flights List Component
import { useLocation } from 'react-router-dom'; // Hook to get the location from the router
import dayjs from 'dayjs'; // Dayjs for date manipulation
import { useSelector } from 'react-redux'; // Hook to access the Redux store
import { AnimatePresence, motion } from 'framer-motion'; // Framer Motion for animations

function SearchPage() {
  // Accessing the current user from the Redux store
  const { currentUser } = useSelector((state) => state.user);
  
  // Get the location object from the router
  const location = useLocation();

  // Setting state variables
  const [flights, setFlights] = useState(''); // To store flight data
  const [error, setError] = useState(null); // To handle general error
  const [errors, setErrors] = useState({ origin: '', destination: '' }); // To handle field-specific errors
  const [loading, setLoading] = useState(false); // To control loading state
  const [triggerSearch, setTriggerSearch] = useState(false); // To trigger search based on props or initial state
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: dayjs().format('YYYY-MM-DD'),
    returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    adults: 1,
    rooms: 1,
  });

  // useEffect hook to update formData based on location state (if provided)
  useEffect(() => {
    if (location.state) {
      setFormData({
        origin: location.state.origin,
        destination: location.state.destination,
        departureDate: location.state.departureDate,
        returnDate: location.state.returnDate,
        adults: location.state.adults,
        rooms: location.state.rooms,
      });
      setTriggerSearch(true); // Trigger the search if location state exists
    }
  }, [location.state]);

  // useEffect hook to trigger search when required
  useEffect(() => {
    if (triggerSearch && formData.origin && formData.destination) {
      handleSubmit(); // Call submit when required fields are set
      setTriggerSearch(false); // Reset the trigger after search
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerSearch]);

  // Handle changes in date range picker (departure and return dates)
  const handleDateChange = ([startDate, endDate]) => {
    setFormData((prev) => ({
      ...prev,
      departureDate: startDate.format('YYYY-MM-DD'),
      returnDate: endDate.format('YYYY-MM-DD'),
    }));
  };

  // Handle form submission for flight search
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent default form submission behavior
    setError(null); // Reset any previous errors
    
    let hasError = false; // Flag to track form validation errors
    const newErrors = { origin: '', destination: '' };
    
    // Validate origin and destination inputs
    if (!formData.origin) {
      newErrors.origin = 'Please select an origin.';
      hasError = true;
    }
    
    if (!formData.destination) {
      newErrors.destination = 'Please select a destination.';
      hasError = true;
    }

    // Ensure origin and destination are not the same
    if (formData.destination && formData.origin && formData.origin === formData.destination) {
      newErrors.destination = 'Origin and destination cannot be the same.';
      hasError = true;
    }
    
    // If there are errors, display them and stop the form submission
    if (hasError) {
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({ origin: '', destination: '' }); // Clear errors after 3 seconds
      }, 3000);
      return;
    }
    
    // Proceed with API request to fetch flight data
    try {
      setLoading(true); // Show the loading indicator
      const payload = {
        userId: currentUser._id, // User ID from the Redux store
        origin: formData.origin,
        destination: formData.destination,
        departureDate: formData.departureDate,
        returnDate: formData.returnDate,
        adults: parseInt(formData.adults, 10),
      };

      // Sending POST request to fetch flight data
      const response = await fetch('/api/flight/search-flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json(); // Parsing the response data
      if (!response.ok) {
        throw new Error('Failed to fetch flights. Please try again.');
      }

      setFlights(data); // Set flight data in state
      console.log(data); // Log the fetched data for debugging
    } catch (error) {
      console.error('Error fetching flights:', error);
      setError(error.message); // Set error message in state
    } finally {
      setLoading(false); // Hide the loading indicator once done
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
        className="xl:flex xl:gap-3 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center"
      >
        {/* Origin Input */}
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

        {/* Destination Input */}
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

        {/* Date Range Picker */}
        <DateRangePicker
          onDateChange={handleDateChange} // Handle date changes in the picker
          defaultDates={[
            dayjs(formData.departureDate),
            dayjs(formData.returnDate),
          ]}
        />

        {/* Travelers Input */}
        <TravelersInput 
          formData={formData} 
          setFormData={setFormData} 
        />

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className={`${ loading ? 'bg-[#48aadf]/80 cursor-not-allowed' : 'bg-[#48aadf] hover:bg-[#48aadf]/80 active:scale-90 cursor-pointer' } rounded-full font-semibold text-white px-8 py-3 h-fit w-fit self-center transition-all duration-300 ease-in-out`}
        >
          Search
        </button>
      </form>

      {/* Loading, Error, or Flight Results Display */}
      <div>
        {loading
        ? <div className='min-h-64 w-full flex items-center justify-center'>
            <BounceLoader
              color="#48aadf" // Customize the color of the loader
              loading={loading} 
            />
          </div>
        : error 
        ? <motion.div 
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

        : // Flights Display
          <FlightsList
            flights={flights} // Pass flights data to the FlightsList component
            formatTime={formatTime} // Pass time formatting function
            getFlightDuration={getFlightDuration} // Pass flight duration function
          />
        }
      </div>
    </motion.div>
  );
}

export default SearchPage;