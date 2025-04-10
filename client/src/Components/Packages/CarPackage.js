import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs'
import OriginInput from '../Common/Inputs/OriginInput';
import { locations } from '../../Data/Locations';
import { useSelector } from 'react-redux';
import DestinationInput from '../Common/Inputs/DestinationInput';
import DateRangePicker from '../Common/Inputs/DateRangePicker';
import PickUp from '../Common/Inputs/PickUp';
import DropOff from '../Common/Inputs/DropOff';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PassengerInput from '../Common/Inputs/PassengerInput';

const CarPackage = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [errors, setErrors] = useState({ origin: '', destination: '' });
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        departureDate: dayjs().format('YYYY-MM-DD'),  // default departure date (today)
        returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),  // default return date (2 days later)
        pickupTime: dayjs().format('h:mm a'),
        dropoffTime: dayjs().add(2, 'hour').format('h:mm a'),
        passengers: 1,
        seats: 1,
    });
    const [isUserSelected, setIsUserSelected] = useState(false);
    const navigate = useNavigate();

    // Handle date range selection
    const handleDateChange = ([startDate, endDate]) => {
        setFormData((prev) => ({
            ...prev,
            departureDate: startDate.format('YYYY-MM-DD'),
            returnDate: endDate.format('YYYY-MM-DD'),
        }));
    };

    const handleSearch = () => {
        let hasError = false;  // Flag to check if there are any validation errors
        const newErrors = { origin: '', destination: '' };  // Initialize error messages
    
        // Check if user is logged in
        if (!currentUser) {
          newErrors.origin = 'You are not signed in';  // Set error if not signed in
          hasError = true;
        }
    
        // Validate origin input
        if (!formData.origin) {
          newErrors.origin = 'Please select an origin';  // Set error if origin is not selected
          hasError = true;
        }
    
        // Validate destination input
        if (!formData.destination) {
          newErrors.destination = 'Please select a destination';  // Set error if destination is not selected
          hasError = true;
        }
    
        // Check if origin and destination are the same
        if (formData.destination && formData.origin && formData.origin === formData.destination) {
          newErrors.destination = 'Origin and destination cannot be the same';  // Set error if same
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
        navigate('/car-search', { state: { 
            origin: formData.origin,
            destination: formData.destination,
            departureDate: formData.departureDate,
            returnDate: formData.returnDate,
            pickupTime: formData.pickupTime,
            dropoffTime: formData.dropoffTime,
            passengers: formData.passengers,
            seats: formData.seats,
        }}); // Navigate to the flight search page
    };

    useEffect(() => {
        if (!isUserSelected) {
            // Update time every minute if user hasn't selected manually
            const interval = setInterval(() => {
                setFormData((prev) => ({
                    ...prev,
                    pickupTime: dayjs().format('h:mm a'),
                    dropoffTime: dayjs().add(2, 'hours').format('h:mm a')
                }));
            }, 60000); // 1-minute interval

            return () => clearInterval(interval); // Cleanup on unmount
        }
    }, [isUserSelected]); // Run when user manually selects a time

    return (

        <div className="flex flex-col gap-8 w-full">
            <div className="xl:grid-cols-3 xl:gap-3 grid gap-4 md:gap-6 md:grid-cols-2 items-center">
                <div className='relative'>
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

                <div className="relative">
                    <DestinationInput
                        formData={formData}
                        setFormData={setFormData}
                        locations={locations}  // Pass available locations
                        label="Drop off"
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

                <DateRangePicker
                    onDateChange={handleDateChange}  // Handle date range change
                    defaultDates={[
                        dayjs(formData.departureDate),
                        dayjs(formData.returnDate),
                    ]}
                />

                <PickUp 
                    onTimeChange={(time) => {
                        setFormData((prev) => ({ ...prev, pickupTime: time }));
                        setIsUserSelected(true);
                    }}
                    value={formData.pickupTime}
                    label='Pick up time'
                />
                
                <DropOff 
                    onTimeChange={(time) => {
                        setFormData((prev) => ({ ...prev, dropoffTime: time }));
                        setIsUserSelected(true);
                    }}
                    value={formData.dropoffTime}
                    label='Drop off time'
                />

                {/* Passengers Input */}
                <PassengerInput
                    formData={formData} 
                    setFormData={setFormData} 
                />

                {/* Search Button */}
                <button 
                    type="button" 
                    onClick={handleSearch}
                    className="bg-[#48aadf] hover:bg-[#48aadf]/80 active:scale-90 rounded-full font-semibold text-white cursor-pointer px-8 py-3 h-fit w-fit self-center transition-all duration-300 ease-in-out"
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default CarPackage;