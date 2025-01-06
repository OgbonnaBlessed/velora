import { LucideMessageSquareWarning } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners'
import { locations } from '../Data/Locations'
import DestinationInput from '../Components/Common/Inputs/DestinationInput';
import TravelersInput from '../Components/Common/Inputs/TravelerInput';
import DateRangePicker from '../Components/Common/Date Picker/DateRangePicker';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import HotelList from '../Components/Common/HotelList';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

function HotelSearch() {
    const location = useLocation();
    const { currentUser } = useSelector((state) => state.user);
    const [hotels, setHotels] = useState('');
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({ origin: '', destination: '' });
    const [triggerSearch, setTriggerSearch] = useState(false); // New flag
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        destination: '',
        departureDate: dayjs().format('YYYY-MM-DD'),
        returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
        adults: 1,
        rooms: 1,
    });

    useEffect(() => {
        if (location.state) {
            console.log(location.state)
            setFormData({
                destination: location.state.destination,
                departureDate: location.state.departureDate,
                returnDate: location.state.returnDate,
                adults: location.state.adults,
                rooms: location.state.rooms,
            });
            setTriggerSearch(true); // Trigger search on mount when data is passed
        }
    }, [location.state]);
    
    useEffect(() => {
        if (triggerSearch && formData.destination) {
            handleSubmit();
            setTriggerSearch(false); // Reset the flag after submission
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerSearch]);

    const handleDateChange = ([startDate, endDate]) => {
        setFormData((prev) => ({
            ...prev,
            departureDate: startDate.format('YYYY-MM-DD'),
            returnDate: endDate.format('YYYY-MM-DD'),
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);

        let hasError = false;
        const newErrors = { destination: '' };
    
        if (!formData.destination) {
            newErrors.destination = 'Please select a destination.';
            hasError = true;
        }
    
        if (hasError) {
            setErrors(newErrors);
            setTimeout(() => {
                setErrors({ destination: '' });
            }, 3000);
            return;
        }
      
        try {
            const payload = {
                userId: currentUser._id,
                destination: formData.destination, // Assuming destination is the IATA code of the city
                checkInDate: formData.departureDate,
                checkOutDate: formData.returnDate,
                adults: parseInt(formData.adults, 10),
                rooms: parseInt(formData.rooms, 10),
            };
            
            const response = await fetch('/api/flight/search-hotels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
      
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Failed to fetch hotels. Please try again.');
            }
      
            setHotels(data);
            console.log(data)
        } catch (error) {
            console.error('Error fetching hotels:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper to format time
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
        className='flex flex-col gap-5 px-4 sm:px-6 lg:px-20 pt-28 md:pt-36 pb-10'
    >
        <form 
            onSubmit={(e) => handleSubmit(e)}
            className="xl:flex xl:gap-3 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center"
        >
            <div className="relative flex-1">
                <DestinationInput
                    formData={formData}
                    setFormData={setFormData}
                    locations={locations}
                />
                {errors.destination && (
                    <p className="text-red-500 text-[0.7rem] absolute mt-1">
                    {errors.destination}
                    </p>
                )}
            </div>

            {/* Date Picker */}
            <DateRangePicker
                onDateChange={handleDateChange}
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

            {/* Search Button */}
            <button 
                type="submit" 
                className="bg-[#48aadf] rounded-full font-semibold text-white cursor-pointer px-8 py-3 h-fit w-fit self-center"
            >
                Search
            </button>
        </form>
        <div>
            {loading
            ?   <div className='min-h-64 w-full flex items-center justify-center'>
                    <BounceLoader
                        color="#48aadf" // Customize the color
                        loading={loading} 
                    />
                </div>
            : error 
            ?   <motion.div 
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -50 }}
                    exit={{ opacity: 0, y: 0 }}
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

            :   // Hotels Display
                <HotelList
                    hotels={hotels}
                    formatTime={formatTime}
                />
            }
        </div>
    </motion.div>
  );
}

export default HotelSearch;