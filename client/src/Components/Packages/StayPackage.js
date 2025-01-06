import React, { useState } from 'react';
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';
import OriginInput from '../Common/Inputs/OriginInput';
import { locations } from '../../Data/Locations';
import DestinationInput from '../Common/Inputs/DestinationInput';
import DateRangePicker from '../Common/Date Picker/DateRangePicker';
import TravelersInput from '../Common/Inputs/TravelerInput';
import { useSelector } from 'react-redux';

const OneWay = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [errors, setErrors] = useState({ origin: '', destination: '' });
    const [addPlaceToStay, setAddPlaceToStay] = useState(false);
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        departureDate: dayjs().format('YYYY-MM-DD'),
        returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
        adults: 1,
        rooms: 1,
    });
    const navigate = useNavigate();

    const handleDateChange = ([startDate, endDate]) => {
        setFormData((prev) => ({
            ...prev,
            departureDate: startDate.format('YYYY-MM-DD'),
            returnDate: endDate.format('YYYY-MM-DD'),
        }));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    }

    const handleSearch = () => {
        let hasError = false;
        const newErrors = { origin: '', destination: '' };

        if (!currentUser) {
            newErrors.origin = 'You are not signed in.';
            hasError = true;
        }

        if (!formData.origin) {
            newErrors.origin = 'Please select an origin.';
            hasError = true;
        }

        if (!formData.destination) {
            newErrors.destination = 'Please select a destination.';
            hasError = true;
        }

        if (formData.destination && formData.origin && formData.origin === formData.destination) {
            newErrors.destination = 'Origin and destination cannot be the same.';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            setTimeout(() => {
                setErrors({ origin: '', destination: '' });
            }, 3000);
            return;
        }

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
            <div className="relative flex-1">
                <OriginInput
                    formData={formData}
                    setFormData={setFormData}
                    locations={locations}
                />
                {errors.origin && (
                    <p className="text-red-500 text-[0.7rem] absolute mt-1">
                    {errors.origin}
                    </p>
                )}
            </div>

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
                type="button" 
                onClick={handleSearch}
                className="bg-[#48aadf] rounded-full font-semibold text-white cursor-pointer px-8 py-3 h-fit w-fit self-center"
            >
                Search
            </button>
        </div>
      <div className='flex items-center gap-10'>

        {/* Add Flight Checkbox */}
        <div className="flex items-center font-Grotesk">
            <input 
                type="checkbox" 
                id="addPlaceToStay" 
                checked={addPlaceToStay} 
                onClick={() => setAddPlaceToStay(!addPlaceToStay)} 
                onChange={handleChange}
                className="hidden" // Hide the default checkbox
            />
            <label 
                htmlFor="addPlaceToStay" 
                className="flex items-center cursor-pointer"
            >
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
                            strokeLinejoin="round" d="M5 13l4 4L19 7" 
                        />
                    </svg>
                </div>
                <span className="ml-2 text-black text-sm">I only need a place to stay for part of my trip</span>
            </label>
        </div>
      </div>
    </div>
  );
};

export default OneWay;