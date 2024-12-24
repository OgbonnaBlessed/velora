import React, { useState } from 'react';
import dayjs from 'dayjs'
import DestinationInput from '../Common/Inputs/DestinationInput';
import { locations } from '../../Data/Locations';
import DateRangePicker from '../Common/Date Picker/DateRangePicker';
import TravelersInput from '../Common/Inputs/TravelerInput';
import OriginInput from '../Common/Inputs/OriginInput';
import { useNavigate } from 'react-router-dom';

const Stays = () => {
  const [errors, setErrors] = useState({ origin: '', destination: '' });
  const [addFlight, setAddFight] = useState(false);
  const [addCar, setAddCar] = useState(false);
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

    if (addFlight === true && !formData.origin) {
      newErrors.origin = 'Please select an origin.';
      hasError = true;
    }

    if (!formData.destination) {
      newErrors.destination = 'Please select a destination.';
      hasError = true;
    }

    if (addFlight === true && formData.destination && formData.origin && formData.origin === formData.destination) {
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
    <form className="p-4 sm:p-6 md:p-8 flex flex-col gap-8">
      <div className="xl:flex xl:gap-8 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center">
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
          onClick={handleSearch} // Add onClick handler
          className="bg-[#48aadf] rounded-full font-semibold text-white cursor-pointer px-8 py-3 h-fit w-fit self-center"
        >
          Search
        </button>
      </div>
      <div className='flex items-center gap-10 font-Grotesk'>

        {/* Add Flight Checkbox */}
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="addFlight" 
            checked={addFlight} 
            onClick={() => setAddFight(!addFlight)} 
            onChange={handleChange}
            className="hidden" // Hide the default checkbox
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

        {/* Add Car Checkbox */}
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="addCar" 
            checked={addCar} 
            onClick={() => setAddCar(!addCar)} 
            onChange={handleChange}
            className="hidden" // Hide the default checkbox
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

      {addFlight &&
        <div className="relative w-72 max-w-full">
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
      }
    </form>
  );
};

export default Stays;