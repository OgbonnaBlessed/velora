/* eslint-disable jsx-a11y/img-redundant-alt */

import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BounceLoader } from 'react-spinners';
import { airports, hotels } from '../../Data/Locations';
import { LucideMessageSquareWarning } from 'lucide-react';
import PassengerInput from '../../Components/Common/Inputs/PassengerInput';
import CarList from '../../Components/Common/lists/CarList';
import PickUp from '../../Components/Common/Inputs/PickUp';
import SingleDatePicker from '../../Components/Common/Inputs/SingleDatePicker';
import AirportInput from '../../Components/Common/Inputs/AirportInput';
import HotelInput from '../../Components/Common/Inputs/HotelInput';

const AirportToHotelCarSearch = () => {
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();

    const [cars, setCars] = useState([]); // State to store car data
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({ origin: '', destination: '' }); // To handle field-specific errors
    const [loading, setLoading] = useState(false);
    const [triggerSearch, setTriggerSearch] = useState(false); // To trigger search based on props or initial state
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        departureDate: dayjs().format('YYYY-MM-DD'),  // default departure date (today)
        pickupTime: dayjs().format('h:mm a'),
        passengers: 1,
        seats: 1,
    });
    
    const [isUserSelected, setIsUserSelected] = useState(false)
    
    // useEffect hook to update formData based on location state (if provided)
    useEffect(() => {
        if (location.state) {
            setFormData({
                origin: location.state.origin,
                destination: location.state.destination,
                departureDate: location.state.departureDate,
                pickupTime: location.state.pickupTime,
                passengers: location.state.passengers,
                seats: location.state.seats,
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

    // Handle date range selection
    const handleDateChange = (date) => {
        setFormData((prev) => ({
            ...prev,
            departureDate: date.format('YYYY-MM-DD')
        }));
    };

    // Function to handle date and time formatting
    const formatDateTime = (date, time) => {
        return `${dayjs(date).format('YYYY-MM-DD')}T${dayjs(time, 'h:mm a').format('HH:mm:ss')}`;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError(null);

        let hasError = false;
        const newErrors = { origin: '', destination: '' };

        if (!formData.origin) {
            newErrors.origin = 'Please select an airport';
            hasError = true;
        }
        if (!formData.destination) {
            newErrors.destination = 'Please select an hotel';
            hasError = true;
        }
        if (hasError) {
            setErrors(newErrors);
            setTimeout(() => setErrors({ origin: '', destination: '' }), 3000);
            return;
        }

        const returnDate = dayjs(formData.departureDate).add(2, 'day').format('YYYY-MM-DD');
        const dropoffTime = dayjs(formData.pickupTime, 'h:mm a').add(2, 'hour').format('h:mm a');

        const payload = {
            userId: currentUser._id,
            origin: formData.origin,
            destination: formData.destination,
            endCityName: formData.origin,
            transferType: "PRIVATE",
            startDateTime: formatDateTime(formData.departureDate, formData.pickupTime),
            endDateTime: formatDateTime(returnDate, dropoffTime),
            departureDate: formData.departureDate,
            returnDate,
            passengers: formData.passengers,
            passengerCharacteristics: [
                { passengerTypeCode: "ADT", age: 20 },
                { passengerTypeCode: "CHD", age: 10 }
            ]
        };

        try {
            setLoading(true);
            const response = await fetch('/api/car/airport-hotel-car-offers', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            if (Array.isArray(data)) {
                setCars(data);
                console.log(data);
            } else if (Array.isArray(data.data)){
                setCars(data.data);
                console.log(data.data);
            } else {
                console.log("unexpected response:", data);
            }
            
            setLoading(false);
        } catch (error) {
            console.error("Fetch error:", error);
            setError(error.message);
            setLoading(false);
        }
    };

    // Helper function to calculate the car duration in minutes
    const getCarDuration = (car) => {
        const departureTime = new Date(car?.start?.dateTime).getTime();
        const arrivalTime = new Date(car?.end?.dateTime).getTime();
        return (arrivalTime - departureTime) / (1000 * 60); // Duration in minutes
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
            {/* Search form for cars */}
            <form 
                onSubmit={(e) => handleSubmit(e)}
                className="xl:grid-cols-3 xl:gap-3 grid gap-4 md:gap-6 md:grid-cols-2 items-center"
            >
                {/* Origin Input Section */}
                <div className='relative'>
                    <AirportInput
                        formData={formData}
                        setFormData={setFormData}
                        airports={airports}  // Pass available locations
                        label="Airport"
                        fieldName="origin"
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
    
                {/* Destination Input Section */}
                <div className="relative">
                    <HotelInput
                        formData={formData}
                        setFormData={setFormData}
                        hotels={hotels}  // Pass available locations
                        label="Hotel"
                        fieldName="destination"
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
        
                {/* Date Picker Section */}
                <SingleDatePicker
                    onDateChange={handleDateChange}
                    defaultDate={dayjs(formData.departureDate)}
                    label="Flight arrival date"
                />

                <PickUp
                    onTimeChange={(time) => {
                        setFormData((prev) => ({ ...prev, pickupTime: time }));
                        setIsUserSelected(true);
                    }}
                    value={formData.pickupTime}
                    label="Flight arrival time"
                />
        
                {/* Passengers Input */}
                <PassengerInput
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
            <>
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
                ) : cars ? (
                    <CarList
                        cars={cars} // Pass the car data to the CarList component
                        getCarDuration={getCarDuration} // Pass the getCarDuration function to the CarList component
                    />
                ) : (
                    <p>Youve made a mistake</p>
                )}
            </>
        </motion.div>
    );
}

export default AirportToHotelCarSearch