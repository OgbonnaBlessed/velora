// Import necessary dependencies from React and other modules
import React, { useState } from 'react';  // React for building components, useState for managing component state
import dayjs from 'dayjs';  // dayjs for date manipulation
import { useNavigate } from 'react-router-dom';  // useNavigate for navigation
import OriginInput from '../Common/Inputs/OriginInput';  // Input component for selecting the origin location
import { locations } from '../../Data/Locations';  // Array of available locations
import DestinationInput from '../Common/Inputs/DestinationInput';  // Input component for selecting the destination location
import DateRangePicker from '../Common/Inputs/DateRangePicker';  // Custom date range picker component
import TravelersInput from '../Common/Inputs/TravelerInput';  // Input component for selecting the number of travelers
import { useSelector } from 'react-redux';  // useSelector for accessing global state (current user)

// RoundTrip component
const RoundTrip = () => {
  // Destructure the currentUser from the Redux store
  const { currentUser } = useSelector((state) => state.user);

  // State to handle form input errors
  const [errors, setErrors] = useState({ origin: '', destination: '' });

  // State to handle form data (origin, destination, dates, travelers, rooms)
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: dayjs().format('YYYY-MM-DD'),  // default departure date (today)
    returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),  // default return date (2 days later)
    adults: 1,  // default number of adults
    rooms: 1,  // default number of rooms
  });

  // useNavigate hook for programmatic navigation
  const navigate = useNavigate();

  // State to manage checkbox selections (for adding accommodation or car)
  const [addPlaceToStay, setAddPlaceToStay] = useState(false);
  const [addCar, setAddCar] = useState(false);

  // Handle form input changes (updates form data)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }

  // Handle date range selection
  const handleDateChange = ([startDate, endDate]) => {
    setFormData((prev) => ({
      ...prev,
      departureDate: startDate.format('YYYY-MM-DD'),
      returnDate: endDate.format('YYYY-MM-DD'),
    }));
  };

  // Handle search button click event
  const handleSearch = () => {
    let hasError = false;  // Flag to check if there are any validation errors
    const newErrors = { origin: '', destination: '' };  // Initialize error messages

    // Check if user is logged in
    if (!currentUser) {
      newErrors.origin = 'You are not signed in.';  // Set error if not signed in
      hasError = true;
    }

    // Validate origin input
    if (!formData.origin) {
      newErrors.origin = 'Please select an origin.';  // Set error if origin is not selected
      hasError = true;
    }

    // Validate destination input
    if (!formData.destination) {
      newErrors.destination = 'Please select a destination.';  // Set error if destination is not selected
      hasError = true;
    }

    // Check if origin and destination are the same
    if (formData.destination && formData.origin && formData.origin === formData.destination) {
      newErrors.destination = 'Origin and destination cannot be the same.';  // Set error if same
      hasError = true;
    }

    // If there are errors, update the errors state and clear them after 3 seconds
    if (hasError) {
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({ origin: '', destination: '' });
      }, 3000);
      return;
    }

    // Navigate to the flight search page with the form data as state
    navigate('/flight-search', { state: { 
      origin: formData.origin,
      destination: formData.destination,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate,
      adults: formData.adults,
      rooms: formData.rooms,
    }}); // Navigate to the flight search page
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Form layout */}
      <div className="xl:flex xl:gap-3 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center">
      
        {/* Origin Input */}
        <div className="relative">
          <OriginInput
            formData={formData}
            setFormData={setFormData}
            locations={locations}  // Pass available locations
          />
          {/* Display error if origin is not selected */}
          {errors.origin && (
            <p className="text-red-500 text-[0.7rem] absolute mt-1">
              {errors.origin}
            </p>
          )}
        </div>

        {/* Destination Input */}
        <div className="relative">
          <DestinationInput
            formData={formData}
            setFormData={setFormData}
            locations={locations}  // Pass available locations
          />
          {/* Display error if destination is not selected */}
          {errors.destination && (
            <p className="text-red-500 text-[0.7rem] absolute mt-1">
              {errors.destination}
            </p>
          )}
        </div>

        {/* Date Range Picker */}
        <DateRangePicker
          onDateChange={handleDateChange}  // Handle date range change
          defaultDates={[
            dayjs(formData.departureDate),
            dayjs(formData.returnDate),
          ]}
        />

        {/* Travelers Input */}
        <TravelersInput 
          formData={formData} 
          setFormData={setFormData}  // Update form data when travelers are changed
        />

        {/* Search Button */}
        <button 
          type="button" 
          onClick={handleSearch}  // Trigger search when clicked
          className="bg-[#48aadf] hover:bg-[#48aadf]/80 active:scale-90 rounded-full font-semibold text-white cursor-pointer px-8 py-3 h-fit w-fit self-center"
        >
          Search
        </button>
      </div>

      {/* Additional Options: Add Place to Stay & Add Car */}
      <div className='flex items-center gap-10 font-Grotesk'>
      
        {/* Add Place to Stay Checkbox */}
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="addPlaceToStay" 
            checked={addPlaceToStay} 
            onClick={() => setAddPlaceToStay(!addPlaceToStay)}  // Toggle the state of addPlaceToStay
            onChange={handleChange}
            className="hidden"  // Hide the default checkbox
          />
          <label 
            htmlFor="addPlaceToStay" 
            className="flex items-center cursor-pointer"
          >
            {/* Custom styled checkbox */}
            <div 
              className={`relative w-4 h-4 flex items-center justify-center rounded border-2 transition-all duration-300 ease-in-out
                ${addPlaceToStay ? 'border-[#4078bc] bg-[#4078bc]' : 'border-gray-300'}
              `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`absolute w-3.5 h-3.5 text-white transition-opacity duration-300 
                  ${addPlaceToStay ? 'opacity-100' : 'opacity-0'}`}
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
          </label>
        </div>

        {/* Add Car Checkbox */}
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="addCar" 
            checked={addCar} 
            onClick={() => setAddCar(!addCar)}  // Toggle the state of addCar
            onChange={handleChange}
            className="hidden"  // Hide the default checkbox
          />
          <label 
            htmlFor="addCar" 
            className="flex items-center cursor-pointer"
          >
            {/* Custom styled checkbox */}
            <div 
              className={`relative w-4 h-4 flex items-center justify-center rounded border-2 
                ${addCar ? 'border-[#4078bc] bg-[#4078bc]' : 'border-gray-300'} transition-all duration-300 ease-in-out`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`absolute w-3.5 h-3.5 text-white transition-opacity duration-300 
                  ${addCar ? 'opacity-100' : 'opacity-0'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="ml-2 text-black text-sm">Add a Car</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default RoundTrip;