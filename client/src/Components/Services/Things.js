import React, { useState } from 'react';
import dayjs from 'dayjs'
import DestinationInput from '../Common/Inputs/DestinationInput';
import { locations } from '../../Data/Locations';
import DateRangePicker from '../Common/Date Picker/DateRangePicker';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OneWay = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [errors, setErrors] = useState({ origin: '', destination: '' });
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

    navigate('/flight-search', { state: { 
      origin: formData.origin,
      destination: formData.destination,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate,
      adults: formData.adults,
      rooms: formData.rooms,
    }}); // Navigate to search page with state
  };

  return (
    <div className='p-4 sm:p-6 md:p-8 flex flex-col gap-8 w-full'>
      <div className="xl:flex grid gap-6 lg:gap-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 items-center w-full">
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

        {/* Search Button */}
        <button 
          type="button" 
          onClick={handleSearch}
          className="bg-[#48aadf] rounded-full font-semibold text-white cursor-pointer px-8 py-3 h-fit w-fit self-center"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default OneWay;