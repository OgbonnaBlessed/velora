import React, { useState } from 'react';
import 'flatpickr/dist/flatpickr.css'; 
import { Plus } from 'lucide-react';
import dayjs from 'dayjs';
import OriginInput2 from '../Common/Inputs/OriginInput2';
import DestinationInput2 from '../Common/Inputs/DestinationInput2';
import { locations } from '../../Data/Locations';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import TravelersInput2 from '../Common/Inputs/TravelerInput2';
import DateRangePicker from '../Common/Inputs/DateRangePicker';

const MultiCity = () => {
  const { currentUser } = useSelector((state) => state.user); 
  const navigate = useNavigate(); 

  const [flights, setFlights] = useState([
    {
      id: 1,
      origin: '',
      destination: '',
      departureDate: dayjs().format('YYYY-MM-DD'),
      returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
      travelers: 1,
      rooms: 1,
      errors: {},
    },
    {
      id: 2,
      origin: '',
      destination: '',
      departureDate: dayjs().format('YYYY-MM-DD'),
      returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
      travelers: 1,
      rooms: 1,
      errors: {},
    },
  ]);

  const addFlight = () => {
    if (flights.length < 5) {
      setFlights([
        ...flights,
        { 
          id: flights.length + 1, 
          origin: '', 
          destination: '', 
          departureDate: dayjs().format('YYYY-MM-DD'), 
          returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
          travelers: 1,
          rooms: 1,
          errors: {} 
        },
      ]);
    }
  };

  const removeFlight = (id) => {
    setFlights(flights.filter((flight) => flight.id !== id));
  };

  const handleFlightChange = (id, field, value) => {
    setFlights((prevFlights) =>
      prevFlights.map((flight) => 
        flight.id === id ? { ...flight, [field]: value } : flight
      )
    );
  };

  // Function to handle date change for a specific flight
  const handleDateChange = (id, [startDate, endDate]) => {
    setFlights((prevFlights) =>
      prevFlights.map((flight) =>
        flight.id === id
          ? {
              ...flight,
              departureDate: startDate.format('YYYY-MM-DD'),
              returnDate: endDate.format('YYYY-MM-DD'),
            }
          : flight
      )
    );
  };

  // Function to update travelers data
  const handleTravelersChange = (travelers, rooms) => {
    setFlights((prevFlights) =>
      prevFlights.map((flight) => ({
        ...flight,
        travelers,
        rooms,
      }))
    );
  };

  const handleSearch = () => {
    let hasError = false;
    const flightPairs = new Set();
  
    const updatedFlights = flights.map((flight) => {
      const newErrors = {};
  
      if (!currentUser) {
        newErrors.origin = 'You are not signed in';
        hasError = true;
      }
  
      if (!flight.origin) {
        newErrors.origin = 'Please select an origin';
        hasError = true;
      }
  
      if (!flight.destination) {
        newErrors.destination = 'Please select a destination';
        hasError = true;
      }
  
      if (flight.origin && flight.destination && flight.origin === flight.destination) {
        newErrors.destination = 'Origin and destination cannot be the same';
        hasError = true;
      }
  
      // Create a unique key for the flight combination
      const routeKey = `${flight.origin}-${flight.destination}`;
      if (flightPairs.has(routeKey)) {
        newErrors.origin = 'This route has already been added';
        newErrors.destination = 'This route has already been added';
        hasError = true;
      } else if (flight.origin && flight.destination) {
        flightPairs.add(routeKey);
      }
  
      // Set a timeout to clear the errors for this flight after 3 seconds
      if (Object.keys(newErrors).length > 0) {
        setTimeout(() => {
          setFlights((prevFlights) =>
            prevFlights.map((f) =>
              f.id === flight.id ? { ...f, errors: {} } : f
            )
          );
        }, 3000);
      }
  
      return { ...flight, errors: newErrors };
    });
  
    setFlights(updatedFlights);
  
    if (hasError) return;
  
    // Proceed to navigate if no errors
    navigate('/multi-city-search', { state: { flights } });
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="w-72 max-w-full">
        <TravelersInput2 handleTravelersChange={handleTravelersChange} />
      </div>

      {flights.map((flight) => (
        <div className="flex flex-col gap-2" key={flight.id}>
          <h1 className="font-semibold text-lg">Flight {flight.id}</h1>
          <div className="xl:grid-cols-3 xl:gap-3 grid gap-4 md:gap-6 md:grid-cols-2 items-center">
            <div className="relative">
              <OriginInput2
                id={flight.id}
                value={flight.origin}
                setValue={(value) => handleFlightChange(flight.id, 'origin', value)}
                locations={locations}
                label="From where?"
              />
              <AnimatePresence mode="wait">
                {flight.errors?.origin && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-xs absolute bottom-1 right-2"
                  >
                    {flight.errors.origin}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <DestinationInput2
                value={flight.destination}
                setValue={(value) => handleFlightChange(flight.id, 'destination', value)}
                locations={locations}
                label="Where to?"
              />
              <AnimatePresence mode="wait">
                {flight.errors?.destination && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-xs absolute bottom-1 right-2"
                  >
                    {flight.errors.destination}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <DateRangePicker
              id={flight.id}
              onDateChange={(dates) => handleDateChange(flight.id, dates)}
              defaultDates={[
                dayjs(flight.departureDate),
                dayjs(flight.returnDate),
              ]}
              label="Flight dates"
            />
          </div>

          {flight.id > 2 && (
            <p
              className="text-sm text-[#48aadf] font-semibold cursor-pointer self-end"
              onClick={() => removeFlight(flight.id)}
            >
              Remove flight
            </p>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between">
        {flights.length < 5 && (
          <div
            className="flex items-center gap-1 text-[#48aadf] cursor-pointer"
            onClick={addFlight}
          >
            <p>Add Flight</p>
            <Plus className="p-1" />
          </div>
        )}

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

export default MultiCity;