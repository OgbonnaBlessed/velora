import React, { useState } from 'react'; // Import necessary React hooks
import dayjs from 'dayjs' // Import dayjs for date manipulation
import DestinationInput from '../Common/Inputs/DestinationInput'; // Destination input component
import { locations } from '../../Data/Locations'; // Import the locations data
import DateRangePicker from '../Common/Inputs/DateRangePicker'; // Date range picker component
import TravelersInput from '../Common/Inputs/TravelerInput'; // Travelers input component
import OriginInput from '../Common/Inputs/OriginInput'; // Origin input component
import { useNavigate } from 'react-router-dom'; // For navigation between pages
import { useSelector } from 'react-redux'; // Redux hook to get the current user from state
import { AnimatePresence, motion } from 'framer-motion';

const Stays = () => {
  // Extract the current user from the Redux state
  const { currentUser } = useSelector((state) => state.user);
  
  // State to manage error messages for origin and destination fields
  const [errors, setErrors] = useState({ origin: '', destination: '' });
  
  // State to track if flight and car add checkboxes are selected
  const [addFlight, setAddFight] = useState(false);
  const [addCar, setAddCar] = useState(false);

  // State to store form data, such as origin, destination, dates, and travelers
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: dayjs().format('YYYY-MM-DD'), // Set default departure date to today's date
    returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'), // Set default return date to 2 days from today
    adults: 1, // Default number of adults
    rooms: 1, // Default number of rooms
  });

  // Initialize navigation function from react-router-dom
  const navigate = useNavigate();

  // Function to handle date range selection (departure and return dates)
  const handleDateChange = ([startDate, endDate]) => {
    setFormData((prev) => ({
      ...prev,
      departureDate: startDate.format('YYYY-MM-DD'),
      returnDate: endDate.format('YYYY-MM-DD'),
    }));
  };

  // Function to handle changes in input fields (origin, destination, adults, etc.)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Function to validate inputs before submitting the form
  const handleSearch = () => {
    let hasError = false;
    const newErrors = { origin: '', destination: '' };

    // Check if user is logged in, and if not, set an error
    if (!currentUser) {
      newErrors.destination = 'You are not signed in';
      hasError = true;
    }

    // Validate if origin is selected when adding a flight
    if (addFlight === true && !formData.origin) {
      newErrors.origin = 'Please select an origin';
      hasError = true;
    }

    // Validate if destination is selected
    if (!formData.destination) {
      newErrors.destination = 'Please select a destination';
      hasError = true;
    }

    // Validate if origin and destination are the same
    if (addFlight === true && formData.destination && formData.origin && formData.origin === formData.destination) {
      newErrors.destination = 'Origin and destination cannot be the same';
      hasError = true;
    }

    // If there are errors, set the error messages and return early
    if (hasError) {
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({ origin: '', destination: '' });
      }, 3000); // Clear errors after 3 seconds
      return;
    }

    // Navigate to the hotel search page and pass form data via state
    navigate('/hotel-search', { state: { 
      origin: formData.origin,
      destination: formData.destination,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate,
      adults: formData.adults,
      rooms: formData.rooms,
    }}); 
  };

  return (
    <form className="p-4 sm:p-6 md:p-8 flex flex-col gap-8">
      <div className="xl:flex xl:gap-8 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center">
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

        {/* Date Range Picker Component */}
        <DateRangePicker
          onDateChange={handleDateChange}
          defaultDates={[
            dayjs(formData.departureDate),
            dayjs(formData.returnDate),
          ]}
        />

        {/* Travelers Input Component */}
        <TravelersInput 
          formData={formData} 
          setFormData={setFormData} 
        />

        {/* Search Button */}
        <button 
          type="button" 
          onClick={handleSearch} // Trigger search when clicked
          className="bg-[#48aadf] hover:bg-[#48aadf]/80 active:scale-90 rounded-full font-semibold text-white cursor-pointer px-8 py-3 h-fit w-fit self-center transition-all duration-300 ease-in-out"
        >
          Search
        </button>
      </div>
      
      <div className='flex items-center gap-10 font-Grotesk'>
        {/* Checkbox to add flight */}
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="addFlight" 
            checked={addFlight} 
            onClick={() => setAddFight(!addFlight)} // Toggle addFlight state
            onChange={handleChange}
            className="hidden" // Hide default checkbox
          />
          <label 
            htmlFor="addFlight" 
            className="flex items-center cursor-pointer"
          >
            <div className={`relative w-4 h-4 flex items-center justify-center rounded border-2 
                ${addFlight ? 'border-[#4078bc] bg-[#4078bc]' : 'border-gray-300'} transition-all duration-300 ease-in-out`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`absolute w-3.5 h-3.5 text-white transition-opacity duration-300 
                  ${addFlight ? 'opacity-100' : 'opacity-0'}`
                }
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="ml-2 text-black text-sm">Add Flight</span>
          </label>
        </div>

        {/* Checkbox to add car */}
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="addCar" 
            checked={addCar} 
            onClick={() => setAddCar(!addCar)} // Toggle addCar state
            onChange={handleChange}
            className="hidden" // Hide default checkbox
          />
          <label 
            htmlFor="addCar" 
            className="flex items-center cursor-pointer"
          >
            <div className={`relative w-4 h-4 flex items-center justify-center rounded border-2 transition-all duration-300 ease-in-out
                ${addCar 
                  ? 'border-[#4078bc] bg-[#4078bc]' 
                  : 'border-gray-300'
                }`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`absolute w-3.5 h-3.5 text-white transition-opacity duration-300 
                  ${addCar ? 'opacity-100' : 'opacity-0'}`
                }
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <span className="ml-2 text-black text-sm">Add Car</span>
          </label>
        </div>
      </div>

      {/* Show Origin Input if addFlight is true */}
      {addFlight &&
        <div className='relative w-72 max-w-full'>
          <OriginInput 
            formData={formData}
            setFormData={setFormData}
            locations={locations}  // Pass available locations
            label="Pick up"
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
      }
    </form>
  );
};

export default Stays;