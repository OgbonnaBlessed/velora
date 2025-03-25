import React, { useState } from 'react'; 
// Import React and useState hook to manage component state.
import OriginInput from '../Common/Inputs/OriginInput'; 
// Import the OriginInput component to handle input for the origin location.
import { locations } from '../../Data/Locations'; 
// Import a list of locations (from the locations data) for use in input fields.
import DestinationInput from '../Common/Inputs/DestinationInput'; 
// Import the DestinationInput component to handle input for the destination location.
import DateRangePicker from '../Common/Inputs/DateRangePicker'; 
// Import the DateRangePicker component for handling the travel dates selection.
import TravelersInput from '../Common/Inputs/TravelerInput'; 
// Import the TravelersInput component to handle inputs related to the number of travelers.
import { useNavigate } from 'react-router-dom'; 
// Import the useNavigate hook from react-router-dom for navigating to different pages.
import dayjs from 'dayjs'; 
// Import the dayjs library for handling and formatting dates.
import { useSelector } from 'react-redux'; 
import { AnimatePresence, motion } from 'framer-motion';
// Import useSelector hook to access state from Redux.

const OneWay = () => {
  const { currentUser } = useSelector((state) => state.user); 
  // Retrieve the currentUser from Redux store to check if the user is logged in.
  
  const [addPlaceToStay, setAddPlaceToStay] = useState(false); 
  // useState hook to manage the state of the checkbox for adding a place to stay.
  
  const [errors, setErrors] = useState({ origin: '', destination: '' }); 
  // useState hook to manage form errors related to the origin and destination inputs.
  
  const [formData, setFormData] = useState({
    // useState hook to store the form data for origin, destination, dates, adults, and rooms.
    origin: '',
    destination: '',
    departureDate: dayjs().format('YYYY-MM-DD'), // Default to today's date.
    returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'), // Default return date is 2 days later.
    adults: 1,
    rooms: 1,
  });

  const navigate = useNavigate(); 
  // useNavigate hook for navigating to different routes, in this case, the flight search page.

  const handleDateChange = ([startDate, endDate]) => {
    // Handles changes in the date range picker and updates departure and return dates.
    setFormData((prev) => ({
      ...prev,
      departureDate: startDate.format('YYYY-MM-DD'),
      returnDate: endDate.format('YYYY-MM-DD'),
    }));
  };

  const handleChange = (e) => {
    // Updates form data for other input fields (origin, destination, etc.) when their values change.
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSearch = () => {
    // Handles the search button click and validates the form data.
    let hasError = false;
    const newErrors = { origin: '', destination: '' };

    // Check if user is signed in.
    if (!currentUser) {
      newErrors.origin = 'You are not signed in';
      hasError = true;
    }

    // Check if origin is provided.
    if (!formData.origin) {
      newErrors.origin = 'Please select an origin';
      hasError = true;
    }

    // Check if destination is provided.
    if (!formData.destination) {
      newErrors.destination = 'Please select a destination';
      hasError = true;
    }

    // Check if origin and destination are the same.
    if (formData.destination && formData.origin && formData.origin === formData.destination) {
      newErrors.destination = 'Origin and destination cannot be the same';
      hasError = true;
    }

    // If there are errors, set error messages and clear them after 3 seconds.
    if (hasError) {
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({ origin: '', destination: '' });
      }, 3000);
      return; // Stop the function execution if errors exist.
    }

    // Navigate to the flight search page with the form data as state.
    navigate('/flight-search', { state: { 
      origin: formData.origin,
      destination: formData.destination,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate,
      adults: formData.adults,
      rooms: formData.rooms,
    }});
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Main wrapper div with flex column layout and some spacing. */}
      
      <div className="xl:flex xl:gap-3 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center">
        {/* Grid layout to display input fields for origin, destination, dates, and travelers. */}
        
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

        {/* Date Picker for selecting departure and return dates */}
        <DateRangePicker
          onDateChange={handleDateChange}
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

        {/* Search Button to trigger the search functionality */}
        <button 
          type="button" 
          onClick={handleSearch} // Add onClick handler to initiate the search
          className="bg-[#48aadf] hover:bg-[#48aadf]/80 active:scale-90 rounded-full font-semibold text-white cursor-pointer px-8 py-3 h-fit w-fit self-center transition-all duration-300 ease-in-out"
        >
          Search
        </button>
      </div>
      
      <div className='flex items-center gap-10'>
        {/* Add Place to Stay checkbox section */}
        <div className="flex items-center font-Grotesk">
          <input 
            type="checkbox" 
            id="addPlaceToStay" 
            checked={addPlaceToStay} 
            onClick={() => setAddPlaceToStay(!addPlaceToStay)} 
            onChange={handleChange}
            className="hidden" // Hide default checkbox style
          />
          <label 
            htmlFor="addPlaceToStay" 
            className="flex items-center cursor-pointer"
          >
            {/* Styled checkbox with SVG check mark */}
            <div 
              className={`relative w-4 h-4 flex items-center justify-center rounded border-2 transition-all duration-300 ease-in-out
                ${addPlaceToStay 
                  ? 'border-[#4078bc] bg-[#4078bc]' 
                  : 'border-gray-300'
                }`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`absolute w-3.5 h-3.5 text-white transition-opacity duration-300 
                  ${addPlaceToStay ? 'opacity-100' : 'opacity-0'}`
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
            <span className="ml-2 text-black text-sm">Add a place to stay</span>
            {/* Text next to checkbox */}
          </label>
        </div>
      </div>
    </div>
  );
};

export default OneWay;
// Export the OneWay component for use in other parts of the application.