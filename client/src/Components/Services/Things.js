import React, { useState } from 'react'; // Importing React and useState for managing component state
import dayjs from 'dayjs' // Importing dayjs for date formatting and manipulation
import DestinationInput from '../Common/Inputs/DestinationInput'; // Importing DestinationInput component
import { locations } from '../../Data/Locations'; // Importing a list of locations (probably an array) for the input
import DateRangePicker from '../Common/Inputs/DateRangePicker'; // Importing the DateRangePicker component for selecting dates
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook from react-router-dom for page navigation
import { useSelector } from 'react-redux'; // Importing useSelector hook from redux for accessing the global store

const Things = () => {
  // Accessing the current user from the global store
  const { currentUser } = useSelector((state) => state.user);

  // Initializing state for form data and error messages
  const [errors, setErrors] = useState({ origin: '', destination: '' });
  const [formData, setFormData] = useState({
    origin: '', // Origin city for the trip
    destination: '', // Destination city for the trip
    departureDate: dayjs().format('YYYY-MM-DD'), // Default departure date is today
    returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'), // Default return date is 2 days after today
    adults: 1, // Default number of adults is 1
    rooms: 1, // Default number of rooms is 1
  });

  // Initialize the navigate function to programmatically navigate between routes
  const navigate = useNavigate();

  // Handle date changes from the DateRangePicker
  const handleDateChange = ([startDate, endDate]) => {
    setFormData((prev) => ({
      ...prev,
      departureDate: startDate.format('YYYY-MM-DD'), // Update departure date
      returnDate: endDate.format('YYYY-MM-DD'), // Update return date
    }));
  };

  // Handle search button click
  const handleSearch = () => {
    let hasError = false; // Flag to track if there are errors in the form
    const newErrors = { origin: '', destination: '' }; // New error state for origin and destination

    // Check if user is signed in (currentUser must be truthy)
    if (!currentUser) {
      newErrors.origin = 'You are not signed in.'; // Show error for origin if user is not signed in
      hasError = true;
    }

    // Check if the origin is empty
    if (!formData.origin) {
      newErrors.origin = 'Please select an origin.'; // Show error for missing origin
      hasError = true;
    }

    // Check if the destination is empty
    if (!formData.destination) {
      newErrors.destination = 'Please select a destination.'; // Show error for missing destination
      hasError = true;
    }

    // Check if the origin and destination are the same
    if (formData.destination && formData.origin && formData.origin === formData.destination) {
      newErrors.destination = 'Origin and destination cannot be the same.'; // Show error if both are the same
      hasError = true;
    }

    // If there are errors, set the error state and reset after 3 seconds
    if (hasError) {
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({ origin: '', destination: '' }); // Reset errors after 3 seconds
      }, 3000);
      return; // Exit function early if there are errors
    }

    // Navigate to the flight search page with the form data as state
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
    // Form for taking inputs from the user
    <div className='p-4 sm:p-6 md:p-8 flex flex-col gap-8 w-full'>
      <div className="xl:flex grid gap-6 lg:gap-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 items-center w-full">
        
        {/* Destination Input */}
        <div className="relative flex-1">
          <DestinationInput
            formData={formData} // Passing formData to the DestinationInput component
            setFormData={setFormData} // Passing setFormData to update the form data
            locations={locations} // Passing the list of locations for the input field
          />
          {/* Error message for destination */}
          {errors.destination && (
            <p className="text-red-500 text-[0.7rem] absolute mt-1">
              {errors.destination}
            </p>
          )}
        </div>

        {/* Date Picker */}
        <DateRangePicker
          onDateChange={handleDateChange} // Passing the handleDateChange function to update the dates
          defaultDates={[
            dayjs(formData.departureDate), // Default departure date
            dayjs(formData.returnDate), // Default return date
          ]}
        />

        {/* Search Button */}
        <button 
          type="button" 
          onClick={handleSearch} // Trigger the handleSearch function when the button is clicked
          className="bg-[#48aadf] rounded-full font-semibold text-white cursor-pointer px-8 py-3 h-fit w-fit self-center"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Things;