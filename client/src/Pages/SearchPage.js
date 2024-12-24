import { LucideMessageSquareWarning } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners'
import { locations } from '../Data/Locations'
import OriginInput from '../Components/Common/Inputs/OriginInput';
import DestinationInput from '../Components/Common/Inputs/DestinationInput';
import TravelersInput from '../Components/Common/Inputs/TravelerInput';
import DateRangePicker from '../Components/Common/Date Picker/DateRangePicker';
import FlightsList from '../Components/Common/FlightsList';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

function SearchPage() {
  const location = useLocation();
  const [flights, setFlights] = useState('');
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({ origin: '', destination: '' });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: dayjs().format('YYYY-MM-DD'),
    returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    adults: 1,
    rooms: 1,
  });

  useEffect(() => {
    if (location.state) {
      setFormData({
        origin: location.state.origin,
        destination: location.state.destination,
        departureDate: location.state.departureDate,
        returnDate: location.state.returnDate,
        adults: location.state.adults,
        rooms: location.state.rooms,
      });
    }
  }, [location.state]);
  
  useEffect(() => {
    if (formData.origin && formData.destination) {
      handleSubmit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleDateChange = ([startDate, endDate]) => {
    setFormData((prev) => ({
      ...prev,
      departureDate: startDate.format('YYYY-MM-DD'),
      returnDate: endDate.format('YYYY-MM-DD'),
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true); // Show loading indicator
    setError(null); // Clear previous errors

    let hasError = false;
    const newErrors = { origin: '', destination: '' };

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
  
    try {
      const payload = {
        origin: formData.origin,
        destination: formData.destination,
        departureDate: formData.departureDate,
        returnDate: formData.returnDate,
        adults: parseInt(formData.adults, 10),
      };
  
      const response = await fetch('/api/flight/search-flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to fetch flights. Please try again.');
      }
  
      setFlights(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate total duration in minutes
  const getFlightDuration = (flight) => {
    const segments = flight.itineraries[0]?.segments;
    const departureTime = new Date(segments[0].departure.at).getTime();
    const arrivalTime = new Date(segments[segments.length - 1].arrival.at).getTime();
    return (arrivalTime - departureTime) / (1000 * 60); // Convert to minutes
  };

  // Helper to format time
  const formatTime = (date) =>
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
  }).format(new Date(date));

  return (
    <div className='flex flex-col gap-5 px-4 sm:px-6 lg:px-20 pt-28 md:pt-36 pb-10'>
      <form 
        onSubmit={(e) => handleSubmit(e)}
        className="xl:flex xl:gap-3 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center"
      >
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
          type="submit" 
          className="bg-[#48aadf] rounded-full font-semibold text-white cursor-pointer px-8 py-3 h-fit w-fit self-center"
        >
          Search
        </button>
      </form>
      <div>
        {loading
        ? <div className='min-h-64 w-full flex items-center justify-center'>
            <BounceLoader
              color="#48aadf" // Customize the color
              loading={loading} 
            />
          </div>
        : error 
        ? <div className='flex flex-col gap-5 items-center font-Poppins font-semibold min-h-64 w-full justify-center'>
            <div className='flex flex-col gap items-center'>
              <LucideMessageSquareWarning />
              <p className='text-lg'>
                We are currently having issues at our end
              </p>
              <p className='font-normal font-sans'>Please try again later</p>
            </div>
          </div>

        : // Flights Display
          <FlightsList
            flights={flights}
            formatTime={formatTime}
            getFlightDuration={getFlightDuration}
          />
        }
      </div>
    </div>
  );
}

export default SearchPage;