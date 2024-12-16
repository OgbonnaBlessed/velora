import { LucideMessageSquareWarning, Search } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BounceLoader } from 'react-spinners'
import { locations } from '../Data/Locations'
import OriginInput from '../Components/Common/Inputs/OriginInput';
import DestinationInput from '../Components/Common/Inputs/DestinationInput';
import TravelersInput from '../Components/Common/Inputs/TravelerInput';
import DateRangePicker from '../Components/Common/Date Picker/DateRangePicker';
import FlightsList from '../Components/Common/FlightsList';

function SearchPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [flights, setFlights] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: new Date().toISOString().split('T')[0],
    returnDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
    adults: 1,
  });
  console.log(formData);

  const handleDateChange = ([startDate, endDate]) => {
    setFormData((prev) => ({
      ...prev,
      departureDate: startDate.format('YYYY-MM-DD'),
      returnDate: endDate.format('YYYY-MM-DD'),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading indicator
    setError(null); // Clear previous errors

    if (!formData.origin) {
      setError('Kindly select an origin');
      return;
    }

    if (!formData.destination) {
      setError('Kindly select a destination');
    }
  
    try {
      const payload = {
        origin: formData.origin,
        destination: formData.destination,
        departureDate: formData.departureDate,
        returnDate: formData.returnDate,
        adults: parseInt(formData.adults, 10),
        userId: currentUser?._id,
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
        onSubmit={handleSubmit}
        className="xl:flex xl:gap-3 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center"
      >
        <OriginInput
          formData={formData}
          setFormData={setFormData}
          locations={locations}
        />

        <DestinationInput
          formData={formData}
          setFormData={setFormData}
          locations={locations}
        />

        {/* Date Picker */}
        <DateRangePicker
          onDateChange={handleDateChange}
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
        ? <div className='min-h-screen w-full flex items-center justify-center'>
            <BounceLoader
              color="#48aadf" // Customize the color
              loading={loading} 
            />
          </div>
        : error 
        ? <div className='flex flex-col gap-5 items-center font-Poppins font-semibold min-h-screen w-full justify-center'>
            <div className='flex flex-col gap items-center'>
              <LucideMessageSquareWarning />
              <p className='text-lg'>
                We are currently having issues at our end
              </p>
              <p className='font-normal font-sans'>Please try again later</p>
            </div>
            <button className='px-8 py-3 bg-[#48aadf] font-semibold cursor-pointer rounded-full text-white'>
              Try again
            </button>
          </div>

          // Flights Display
        : <div>
            {flights && flights?.data?.length === 0 
            ? <div className='flex flex-col gap-5 items-center font-Poppins font-semibold min-h-screen w-full justify-center'>
                <div className='flex flex-col gap items-center'>
                  <Search/>
                  <p className='text-lg'>
                    Sorry, we couldn't find any flights from {formData.origin} to {formData.destination} on {formData.departureDate}
                  </p>
                  <p className='font-normal font-sans'>Kindly change your selected parameters to view available flights.</p>
                </div>
                <button className='px-8 py-3 bg-[#48aadf] font-semibold cursor-pointer rounded-full text-white'>
                  Edit search
                </button>
              </div>
           :  <FlightsList
                flights={flights}
                formatTime={formatTime}
                getFlightDuration={getFlightDuration}
              />
            }
          </div>
        }
      </div>
    </div>
  );
}

export default SearchPage;