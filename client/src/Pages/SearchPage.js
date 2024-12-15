import { ChevronDown, LucideMessageSquareWarning, Search } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { BounceLoader } from 'react-spinners'
import { FaMapMarkerAlt, FaRegCalendarAlt } from 'react-icons/fa';
import { locations } from '../Data/Locations'
import dayjs from 'dayjs'
import { DatePicker } from 'antd'
import Filters from '../Components/Common/Filters';
const { RangePicker } = DatePicker;

function SearchPage() {
  const dummyFlights = {
    data: [
      {
        itineraries: [
          {
            segments: [
              {
                departure: { at: "2024-12-15T08:30:00", cityName: "New York" },
                arrival: { at: "2024-12-15T12:30:00", cityName: "Los Angeles" },
                carrierCode: "AA"
              }
            ]
          }
        ],
        price: { currency: "USD", total: "450" }
      },
      {
        itineraries: [
          {
            segments: [
              {
                departure: { at: "2024-12-15T14:00:00", cityName: "Chicago" },
                arrival: { at: "2024-12-15T18:00:00", cityName: "Houston" },
                carrierCode: "UA"
              }
            ]
          }
        ],
        price: { currency: "USD", total: "300" }
      },
      {
        itineraries: [
          {
            segments: [
              {
                departure: { at: "2024-12-15T09:15:00", cityName: "Miami" },
                arrival: { at: "2024-12-15T13:30:00", cityName: "Atlanta" },
                carrierCode: "DL"
              }
            ]
          }
        ],
        price: { currency: "USD", total: "250" }
      },
      {
        itineraries: [
          {
            segments: [
              {
                departure: { at: "2024-12-15T07:00:00", cityName: "San Francisco" },
                arrival: { at: "2024-12-15T10:45:00", cityName: "Seattle" },
                carrierCode: "AS"
              }
            ]
          }
        ],
        price: { currency: "USD", total: "200" }
      },
      {
        itineraries: [
          {
            segments: [
              {
                departure: { at: "2024-12-15T06:30:00", cityName: "Dallas" },
                arrival: { at: "2024-12-15T09:15:00", cityName: "Denver" },
                carrierCode: "AA"
              }
            ]
          }
        ],
        price: { currency: "USD", total: "220" }
      },
      {
        itineraries: [
          {
            segments: [
              {
                departure: { at: "2024-12-15T11:00:00", cityName: "Boston" },
                arrival: { at: "2024-12-15T15:30:00", cityName: "Orlando" },
                carrierCode: "JB"
              }
            ]
          }
        ],
        price: { currency: "USD", total: "280" }
      },
      {
        itineraries: [
          {
            segments: [
              {
                departure: { at: "2024-12-15T13:45:00", cityName: "Detroit" },
                arrival: { at: "2024-12-15T16:45:00", cityName: "Phoenix" },
                carrierCode: "SW"
              }
            ]
          }
        ],
        price: { currency: "USD", total: "310" }
      },
      {
        itineraries: [
          {
            segments: [
              {
                departure: { at: "2024-12-15T16:00:00", cityName: "Las Vegas" },
                arrival: { at: "2024-12-15T19:15:00", cityName: "Salt Lake City" },
                carrierCode: "DL"
              }
            ]
          }
        ],
        price: { currency: "USD", total: "240" }
      },
      {
        itineraries: [
          {
            segments: [
              {
                departure: { at: "2024-12-15T12:00:00", cityName: "Philadelphia" },
                arrival: { at: "2024-12-15T16:30:00", cityName: "Charlotte" },
                carrierCode: "AA"
              }
            ]
          }
        ],
        price: { currency: "USD", total: "270" }
      },
      {
        itineraries: [
          {
            segments: [
              {
                departure: { at: "2024-12-15T10:30:00", cityName: "Portland" },
                arrival: { at: "2024-12-15T13:15:00", cityName: "San Diego" },
                carrierCode: "AS"
              }
            ]
          }
        ],
        price: { currency: "USD", total: "290" }
      },
      {
        itineraries: [
          {
            segments: [
              {
                departure: { at: "2024-12-15T18:30:00", cityName: "Austin" },
                arrival: { at: "2024-12-15T21:00:00", cityName: "Minneapolis" },
                carrierCode: "SW"
              }
            ]
          }
        ],
        price: { currency: "USD", total: "260" }
      },
      {
        itineraries: [
          {
            segments: [
              {
                departure: { at: "2024-12-15T20:00:00", cityName: "Baltimore" },
                arrival: { at: "2024-12-15T23:30:00", cityName: "Indianapolis" },
                carrierCode: "UA"
              }
            ]
          }
        ],
        price: { currency: "USD", total: "320" }
      },
      {
        itineraries: [
          {
            segments: [
              {
                departure: { at: "2024-12-15T19:00:00", cityName: "Tampa" },
                arrival: { at: "2024-12-15T21:45:00", cityName: "Cleveland" },
                carrierCode: "DL"
              }
            ]
          }
        ],
        price: { currency: "USD", total: "250" }
      },
      {
        itineraries: [
          {
            segments: [
              {
                departure: { at: "2024-12-15T15:00:00", cityName: "Nashville" },
                arrival: { at: "2024-12-15T18:00:00", cityName: "Kansas City" },
                carrierCode: "AA"
              }
            ]
          }
        ],
        price: { currency: "USD", total: "310" }
      },
      {
        itineraries: [
          {
            segments: [
              {
                departure: { at: "2024-12-15T09:00:00", cityName: "St. Louis" },
                arrival: { at: "2024-12-15T11:30:00", cityName: "Memphis" },
                carrierCode: "SW"
              }
            ]
          }
        ],
        price: { currency: "USD", total: "200" }
      }
    ]
  };
  const { currentUser } = useSelector((state) => state.user);
  const [flights, setFlights] = useState(dummyFlights);
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
  const [focused1, setFocused1] = useState(false);
  const [focused2, setFocused2] = useState(false);
  const [departureDate, setDepartureDate] = useState('');
  const [travelerModalOpen, setTravelerModalOpen] = useState(false);
  const [travelersInput, setTravelersInput] = useState('1 traveler, 1 room');
  const [rooms, setRooms] = useState([{ adults: 1, children: 0 }]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [filteredOrigins, setFilteredOrigins] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [isOriginListVisible, setIsOriginListVisible] = useState(false);
  const [isDestinationListVisible, setIsDestinationListVisible] = useState(false);
  const travelerRef = useRef();
  const dateRef = useRef();
  const destinationRef = useRef();
  const originRef = useRef();

  const today = dayjs();
  const twoDaysLater = today.add(2, "day");

  const handleOutsideClick = (event) => {
    if (travelerRef.current && !travelerRef.current.contains(event.target)) {
      setTravelerModalOpen(false);
    }

    if (destinationRef.current && !destinationRef.current.contains(event.target)) {
      setIsDestinationListVisible(false);
    }

    if (originRef.current && !originRef.current.contains(event.target)) {
      setIsOriginListVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const toggleDestinationList = () => {
    setFocused1(true);
    setFilteredDestinations(locations);
    setIsDestinationListVisible(true);
  };

  const toggleOriginList = () => {
    setFocused2(true);
    setFilteredOrigins(locations);
    setIsOriginListVisible(true);
  };

  const selectOrigin = (selectedOrigin) => {
    setFormData((prev) => ({
      ...prev,
      origin: selectedOrigin,
    }));
    setOrigin(selectedOrigin);
    setFilteredOrigins([]);
    setIsOriginListVisible(false);
  };
  
  const selectDestination = (selectedDestination) => {
    setFormData((prev) => ({
      ...prev,
      destination: selectedDestination,
    }));
    setDestination(selectedDestination);
    setFilteredDestinations([]);
    setIsDestinationListVisible(false);
  };

  // Set default date range
  useEffect(() => {
    const today = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(today.getDate() + 2);

    setDepartureDate(`${today} - ${twoDaysLater}`);
  }, []);

  // Add this useEffect below your existing states and functions
  useEffect(() => {
    if (destination) {
      setFocused1(true);
    } else {
      setFocused1(false);
    }
  }, [destination]);

  useEffect(() => {
    if (origin) {
      setFocused2(true);
    } else {
      setFocused2(false);
    }
  }, [origin]);

  const handleOriginChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      origin: value,
    }));

    const trimmedValue = value.trim();
    setFilteredOrigins(
      trimmedValue === ""
      ? locations
      : locations.filter(
        (location) =>
          location.city && // Ensure state is defined
          location.city.toLowerCase().includes(trimmedValue.toLowerCase())
      )
    );
    setIsOriginListVisible(true);
  };
  
  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      destination: value,
    }));

    const trimmedValue = value.trim();
    setFilteredDestinations(
      trimmedValue === ""
      ? locations
      : locations.filter(
        (location) =>
          location.city && // Ensure state is defined
          location.city.toLowerCase().includes(trimmedValue.toLowerCase())
      )
    );
    setIsDestinationListVisible(true);
  };

  // Handle Date Range Change
  const handleDateChange = (selectedDates) => {
    if (selectedDates.length === 2) {
      const [startDate, endDate] = selectedDates;
      setFormData((prev) => ({
        ...prev,
        departureDate: startDate.format('YYYY-MM-DD'),
        returnDate: endDate.format('YYYY-MM-DD'),
      }));
    }
  };

  const handleRoomChange = (index, type, value) => {
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms];
      updatedRooms[index][type] = value;
      return updatedRooms;
    });
  };

  const addRoom = () => {
    if (rooms.length < 3) {
      setRooms([...rooms, { adults: 1, children: 0 }]);
    }
  };

  const removeRoom = (index) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
  };

  // Handle Travelers Change
  const submitTravelers = () => {
    const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
    const totalChildren = rooms.reduce((sum, room) => sum + room.children, 0);
    setFormData((prev) => ({
      ...prev,
      adults: totalAdults + totalChildren,
    }));
    setTravelersInput(
      `${totalAdults + totalChildren} traveler${
        totalAdults + totalChildren > 1 ? 's' : ''
      }, ${rooms.length} room${rooms.length > 1 ? 's' : ''}`
    );
    setTravelerModalOpen(false);
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
    <div className='flex flex-col gap-5 px-4 sm:px-6 lg:px-20 pt-36 pb-10'>
      <form 
        onSubmit={handleSubmit}
        className="xl:flex xl:gap-3 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center"
      >
        <div 
          className='relative' 
          ref={originRef}
        >
          <div className="border rounded-xl p-3 flex items-center flex-1">
            <FaMapMarkerAlt className="text-xl" />
            <div className="w-full h-full relative">
              <label
                htmlFor="origin"
                className={`absolute left-3 text-sm font-Poppins cursor-text transition-all duration-500 ease-in-out 
                  ${focused2 
                    ? 'top-[0.1rem] scale-75 -translate-x-3 transform -translate-y-1/2' 
                    : 'top-1/2 transform -translate-y-1/2'
                  }`
                }
              >
                From where?
              </label>
              <input
                type="text"
                id="origin"
                value={formData.origin}
                onFocus={toggleOriginList}
                onBlur={(e) => !e.target.value && setFocused2(false)} // Reset if input is empty
                onChange={handleOriginChange}
                className="px-3 pt-2 w-full"
                autoComplete="off"
              />
            </div>
          </div>

          <div 
            className={`absolute top-16 bg-white max-h-64 overflow-y-auto shadow shadow-gray-300 rounded-lg w-64 transition-all duration-300 ease-in-out z-10
              ${isOriginListVisible 
                ? 'translate-y-0 pointer-events-auto opacity-1' 
                : '-translate-y-5 pointer-events-none opacity-0'
              }`
            }
          >
            <ul>
              {filteredOrigins.length > 0 
              ? (filteredOrigins.map((location, index) => (
                <li
                  key={index}
                  onClick={() => selectOrigin(location.city)}
                  className="cursor-pointer hover:bg-gray-200 px-3 py-2"
                >
                  {location.city}
                </li>
              )))
              : (
                <li className='px-3 py-2 text-[#48aadf] select-none text-center'>
                  No Location Found
                </li>
              )}
            </ul>
          </div>
        </div>

        <div 
          className='relative' 
          ref={destinationRef}
        >
          <div className="border rounded-xl p-3 flex items-center flex-1">
            <FaMapMarkerAlt className="text-xl" />
            <div className="w-full h-full relative">
              <label
                htmlFor="destination"
                className={`absolute left-3 text-sm font-Poppins cursor-text transition-all duration-500 ease-in-out 
                  ${focused1 
                    ? 'top-[0.1rem] scale-75 -translate-x-2 transform -translate-y-1/2' 
                    : 'top-1/2 transform -translate-y-1/2'
                  }`
                }
              >
                Where to?
              </label>
              <input
                type="text"
                id="destination"
                value={formData.destination}
                onFocus={toggleDestinationList}
                onBlur={(e) => !e.target.value && setFocused1(false)} // Reset if input is empty
                onChange={handleDestinationChange}
                className="px-3 pt-2 w-full"
                autoComplete="off"
              />
            </div>
          </div>

          <div 
            className={`absolute top-16 bg-white max-h-64 overflow-y-auto shadow shadow-gray-300 rounded-lg w-64 transition-all duration-300 ease-in-out z-10
              ${isDestinationListVisible 
                ? 'translate-y-0 pointer-events-auto opacity-1' 
                : '-translate-y-5 pointer-events-none opacity-0'
              }`
            }
          >
            <ul>
            {filteredDestinations.length > 0 
              ? (filteredDestinations.map((location, index) => (
                <li
                  key={index}
                  onClick={() => selectDestination(location.city)}
                  className="cursor-pointer hover:bg-gray-200 px-3 py-2"
                >
                  {location.city}
                </li>
              )))
              : (
                <li className='px-3 py-2 text-[#48aadf] select-none text-center'>
                  No Location Found
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Date Picker */}
        <div 
          className="border rounded-xl p-3 flex items-center flex-1" 
          ref={dateRef}
        >
          <FaRegCalendarAlt className="text-xl" />
          <div className="w-full h-full relative">
            <label
              htmlFor="date"
              className="absolute left-3 text-sm font-Poppins cursor-text top-[0.1rem] scale-75 -translate-x-1 transform -translate-y-1/2"
            >
              Date
            </label>
            <RangePicker
              suffixIcon={null}
              format={"MMM DD"}
              defaultValue={[today, twoDaysLater]}
              minDate={today}
              allowClear={false} // Optional: allows clearing the input
              inputReadOnly={true}
              onChange={handleDateChange}
              popupClassName="responsive-calendar" // Apply custom class for responsiveness
            />
          </div>
        </div>

        {/* Travelers Input */}
        <div 
          className="border rounded-xl p-3 flex items-center flex-1 relative" 
          ref={travelerRef}
        >
          <FaMapMarkerAlt className="text-xl" />
          <div className="w-full h-full relative">
            <label
              htmlFor="travelers"
              className="absolute left-3 text-sm font-Poppins cursor-text top-[0.1rem] scale-75 -translate-x-2 transform -translate-y-1/2"
            >
              Travelers
            </label>
            <input
              type="text"
              id="travelers"
              value={travelersInput}
              onFocus={() => setTravelerModalOpen(true)}
              className="px-3 pt-2 w-full"
              autoComplete="off"
              readOnly
            />
          </div>
          <div 
            className={`absolute top-16 left-0 z-20 bg-white p-4 shadow shadow-gray-300 rounded-xl text-sm w-52 flex flex-col gap-4 transition-all duration-300 ease-in-out
              ${travelerModalOpen 
                ? 'translate-y-0 opacity-1 pointer-events-auto' 
                : '-translate-y-5 opacity-0 pointer-events-none'
              }
            `}
          >
            {rooms.map((room, index) => (
              <div key={index} className="flex flex-col gap-3">
                <h4 className="font-bold">Room {index + 1}</h4>
                <div className='flex flex-col gap-2'>
                  <div className="flex justify-between items-center">
                    <span>Adults</span>
                    <div className='flex gap-3 items-center'>
                      <button
                        className={`border border-gray-50 font-semibold text-2xl px-3 pb-1 rounded-full 
                          ${rooms[index].adults === 1 
                            ? 'bg-gray-50 text-gray-300 cursor-no-drop' 
                            : 'bg-white text-black'
                          }`
                        }
                        onClick={() => handleRoomChange(index, 'adults', Math.max(1, rooms[index].adults - 1))}
                        type="button"
                      >
                        -
                      </button>
                      <span>{rooms[index].adults}</span>
                      <button
                        className={`border border-gray-50 font-semibold text- px-3 py-1.5 rounded-full 
                          ${rooms[index].adults === 14 
                            ? 'bg-gray-50 text-gray-300 cursor-no-drop' 
                            : 'bg-white text-black'
                          }`
                        }
                        onClick={() => handleRoomChange(index, 'adults', Math.min(14, rooms[index].adults + 1))}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Children</span>
                    <button
                      className={`border border-gray-50 font-semibold text-2xl px-3 pb-1 rounded-full 
                        ${rooms[index].children === 0 
                          ? 'bg-gray-50 text-gray-300 cursor-no-drop' 
                          : 'bg-white text-black'
                        }`
                      }
                      onClick={() => handleRoomChange(index, 'children', Math.max(0, rooms[index].children - 1))}
                      type="button"
                    >
                      -
                    </button>
                    <span>{rooms[index].children}</span>
                    <button
                      className={`border border-gray-50 font-semibold text- px-3 py-1.5 rounded-full 
                        ${rooms[index].children === 6 
                          ? 'bg-gray-50 text-gray-300 cursor-no-drop' 
                          : 'bg-white text-black'
                        }`
                      }
                      onClick={() => handleRoomChange(index, 'children', Math.min(6, rooms[index].children + 1))}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
                {index > 0 && (
                  <button
                    className="text-[#48aadf] text-sm py-2 self-end"
                    onClick={() => removeRoom(index)}
                    type="button"
                  >
                    Remove Room
                  </button>
                )}
              </div>
            ))}
            {rooms.length < 3 && (
              <p 
                className="text-[#48aadf] cursor-pointer" 
                onClick={addRoom}
              >
                Add another room
              </p>
            )}
            <button 
              onClick={submitTravelers} 
              className="bg-[#48aadf] text-white px-5 py-2 rounded-full font-semibold cursor-pointer"
              type='button'
            >
              Done
            </button>
          </div>
        </div>

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
        : <div>
            {flights && flights?.data?.length === 0 
            ? <div className='flex flex-col gap-5 items-center font-Poppins font-semibold min-h-screen w-full justify-center'>
                <div className='flex flex-col gap items-center'>
                  <Search/>
                  <p className='text-lg'>
                    Sorry, we couldn't find any flights from {formData.origin} to {formData.destination} on {formData.departureDate}
                  </p>
                  <p className='font-normal font-sans'>Kindly change your routes and dates to view available flights.</p>
                </div>
                <button className='px-8 py-3 bg-[#48aadf] font-semibold cursor-pointer rounded-full text-white'>
                  Edit search
                </button>
              </div>
            : <div className='flex flex-col gap-12 w-full md:mt-8 mt-5'>
                <Filters handleSubmit={(filters) => {
                  console.log(filters);
                }} />
                <div className='flex flex-col gap-5 w-full'>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between gap-10">
                    {flights?.data?.map((flight, index) => {
                      const segments = flight.itineraries[0].segments;
                      const airline = segments[0]?.carrierCode; // Assuming carrierCode maps to the airline name
                      const departureTime = formatTime(segments[0].departure.at);
                      const arrivalTime = formatTime(segments[segments.length - 1].arrival.at);
                      const flightDuration = getFlightDuration(flight);

                      // Convert total minutes to hours and remaining minutes
                      const hours = Math.floor(flightDuration / 60);
                      const minutes = flightDuration % 60;

                      return (
                        <div 
                          key={index} 
                          className="p-5 rounded-xl bg-blue-50 flex flex-col gap-5 shadow shadow-gray-300"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className='text-lg font-Roboto'>{`${departureTime} - ${arrivalTime}`}</p>
                              <p className='font-serif'>
                                {segments[0]?.departure.cityName} ~ {segments[segments.length - 1]?.arrival.cityName}
                              </p>
                              <p>{airline} Airline</p>
                              <div className="flex items-center gap-1">
                                <p>{flight.price.total}</p>
                                <p className="text-sm font-serif">{flight.price.currency}</p>
                              </div>
                            </div>
                            <div className='bg-white py-1 px-3 rounded-md text-[0.8rem] w-fit'>
                              {`${hours}h ${minutes}m`}
                            </div>
                          </div>
                          <button
                            type="button"
                            className='border-2 border-white px-5 py-1 bg-blue-50 w-fit self-center rounded-full font-semibold font-Grotesk text-sm'
                          >
                            Select
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  );
}

export default SearchPage;