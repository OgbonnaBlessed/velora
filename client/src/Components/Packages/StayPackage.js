import React, { useState } from 'react';
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';
import OriginInput from '../Common/Inputs/OriginInput';
import { locations } from '../../Data/Locations';
import DestinationInput from '../Common/Inputs/DestinationInput';
import DateRangePicker from '../Common/Date Picker/DateRangePicker';
import TravelersInput from '../Common/Inputs/TravelerInput';
import { useSelector } from 'react-redux';

const StayPackage = () => {
    // Use Redux to get the current user from the global state
    const { currentUser } = useSelector((state) => state.user);
    
    // Use state for managing form data and error messages
    const [errors, setErrors] = useState({ origin: '', destination: '' });
    const [addPlaceToStay, setAddPlaceToStay] = useState(false); // Manage the state of the checkbox for "add place to stay"
    const [formData, setFormData] = useState({
        origin: '',  // Starting point of the trip
        destination: '', // End point of the trip
        departureDate: dayjs().format('YYYY-MM-DD'), // Set departure date to today by default
        returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'), // Set return date to 2 days from today by default
        adults: 1, // Default number of adults is 1
        rooms: 1, // Default number of rooms is 1
    });

    const navigate = useNavigate(); // Hook to programmatically navigate to different routes

    // Function to handle changes in date picker (start and end date)
    const handleDateChange = ([startDate, endDate]) => {
        setFormData((prev) => ({
            ...prev,
            departureDate: startDate.format('YYYY-MM-DD'),
            returnDate: endDate.format('YYYY-MM-DD'),
        }));
    };

    // Function to handle changes in input fields, trims the input values
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    }

    // Function to handle form submission and validation
    const handleSearch = () => {
        let hasError = false;
        const newErrors = { origin: '', destination: '' };

        // Check if the user is signed in (if not, show an error)
        if (!currentUser) {
            newErrors.origin = 'You are not signed in.';
            hasError = true;
        }

        // Check if the origin is selected
        if (!formData.origin) {
            newErrors.origin = 'Please select an origin.';
            hasError = true;
        }

        // Check if the destination is selected
        if (!formData.destination) {
            newErrors.destination = 'Please select a destination.';
            hasError = true;
        }

        // Ensure origin and destination are not the same
        if (formData.destination && formData.origin && formData.origin === formData.destination) {
            newErrors.destination = 'Origin and destination cannot be the same.';
            hasError = true;
        }

        // If there are errors, display them for a few seconds
        if (hasError) {
            setErrors(newErrors);
            setTimeout(() => {
                setErrors({ origin: '', destination: '' });
            }, 3000); // Clear errors after 3 seconds
            return;
        }

        // Navigate to the hotel search page with the form data as state
        navigate('/hotel-search', { state: { 
            origin: formData.origin,
            destination: formData.destination,
            departureDate: formData.departureDate,
            returnDate: formData.returnDate,
            adults: formData.adults,
            rooms: formData.rooms,
        }}); // Navigate to search page with state
    };

  return (
    <div className="flex flex-col gap-8 w-full">
        <div className="xl:flex xl:gap-3 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center">
            {/* Origin Input */}
            <div className="relative flex-1">
                <OriginInput
                    formData={formData}
                    setFormData={setFormData}
                    locations={locations}
                />
                {/* Display error message for origin if any */}
                {errors.origin && (
                    <p className="text-red-500 text-[0.7rem] absolute mt-1">
                    {errors.origin}
                    </p>
                )}
            </div>

            {/* Destination Input */}
            <div className="relative flex-1">
                <DestinationInput
                    formData={formData}
                    setFormData={setFormData}
                    locations={locations}
                />
                {/* Display error message for destination if any */}
                {errors.destination && (
                    <p className="text-red-500 text-[0.7rem] absolute mt-1">
                        {errors.destination}
                    </p>
                )}
            </div>

            {/* Date Picker for Departure and Return Date */}
            <DateRangePicker
                onDateChange={handleDateChange}
                defaultDates={[
                    dayjs(formData.departureDate),
                    dayjs(formData.returnDate),
                ]}
            />

            {/* Travelers Input for number of adults and rooms */}
            <TravelersInput 
                formData={formData} 
                setFormData={setFormData} 
            />

            {/* Search Button */}
            <button 
                type="button" 
                onClick={handleSearch} // Trigger the handleSearch function when clicked
                className="bg-[#48aadf] rounded-full font-semibold text-white cursor-pointer px-8 py-3 h-fit w-fit self-center"
            >
                Search
            </button>
        </div>
        
        {/* Add Place to Stay Checkbox */}
        <div className='flex items-center gap-10'>
            <div className="flex items-center font-Grotesk">
                <input 
                    type="checkbox" 
                    id="addPlaceToStay" 
                    checked={addPlaceToStay} 
                    onClick={() => setAddPlaceToStay(!addPlaceToStay)} // Toggle the checkbox state when clicked
                    onChange={handleChange} // Update form data with the new checkbox state
                    className="hidden" // Hide the default checkbox
                />
                <label 
                    htmlFor="addPlaceToStay" 
                    className="flex items-center cursor-pointer"
                >
                    <div 
                        className={`relative w-4 h-4 flex items-center justify-center rounded border-2 transition-all duration-300 ease-in-out
                            ${addPlaceToStay 
                                ? 'border-[#4078bc] bg-[#4078bc]' // Style when checked
                                : 'border-gray-300' // Style when unchecked
                            }`
                        }
                    >
                        {/* Icon shown inside the checkbox when checked */}
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
                                strokeLinejoin="round" d="M5 13l4 4L19 7" 
                            />
                        </svg>
                    </div>
                    {/* Label text */}
                    <span className="ml-2 text-black text-sm">I only need a place to stay for part of my trip</span>
                </label>
            </div>
        </div>
    </div>
  );
};

export default StayPackage;