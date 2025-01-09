// This file isn't completed yet, hence, there isn't detailed comments for it.

import React, { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaRegCalendarAlt } from 'react-icons/fa';
import 'flatpickr/dist/flatpickr.css'; // Import Flatpickr styles
import { Plus } from 'lucide-react'
import dayjs from 'dayjs'
import { DatePicker } from 'antd'
const { RangePicker } = DatePicker;

const MultiCity = () => {
  const [travelerModalOpen, setTravelerModalOpen] = useState(false);
  const [travelersInput, setTravelersInput] = useState('1 traveler, 1 room');
  const [rooms, setRooms] = useState([{ adults: 1, children: 0 }]);
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('');
  const [states] = useState([
    "California", "Texas", "Florida", "New York", "Pennsylvania", "Illinois", "Ohio", "Georgia", "North Carolina", "Michigan",
    "New Jersey", "Virginia", "Washington", "Arizona", "Massachusetts", "Tennessee", "Indiana", "Missouri", "Maryland", "Wisconsin"
  ]);
  const travelerRef = useRef();
  const dateRefs = useRef([]);
  const originRefs = useRef([]);
  const destinationRefs = useRef([]);
  const [flights, setFlights] = useState([
    {
      id: 1,
      origin: '',
      destination: '',
      departureDate: [new Date(), new Date(new Date().setDate(new Date().getDate() + 2))],
      isOriginListVisible: false,
      isDestinationListVisible: false,
    },
    {
      id: 2,
      origin: '',
      destination: '',
      departureDate: [new Date(), new Date(new Date().setDate(new Date().getDate() + 2))],
      isOriginListVisible: false,
      isDestinationListVisible: false,
    },
  ]);

  const today = dayjs();
  const twoDaysLater = today.add(2, "day");

  const addFlight = () => {
    if (flights.length < 5) {
      setFlights([
        ...flights,
        {
          id: flights.length + 1,
          origin: '',
          destination: '',
          departureDate: [new Date(), new Date(new Date().setDate(new Date().getDate() + 2))],
          isOriginListVisible: false,
          isDestinationListVisible: false,
        },
      ]);
    }
  };
  
  const removeFlight = (id) => {
    setFlights(flights.filter((flight) => flight.id !== id));
  };

  const updateFlight = (id, field, value) => {
    setFlights(
      flights.map((flight) =>
        flight.id === id ? { ...flight, [field]: value } : flight
      )
    );
  };

  const handleOutsideClick = (event) => {
    if (travelerRef.current && !travelerRef.current.contains(event.target)) {
      setTravelerModalOpen(false);
    }

    setFlights((prev) =>
      prev.map((flight) => ({
        ...flight,
        isOriginListVisible: originRefs.current[flight.id]?.contains(event.target)
          ? flight.isOriginListVisible
          : false,
        isDestinationListVisible: destinationRefs.current[flight.id]?.contains(
          event.target
        )
          ? flight.isDestinationListVisible
          : false,
      }))
    );
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const selectDestination = (id, value) => {
    setFlights((prev) =>
      prev.map((flight) =>
        flight.id === id ? { ...flight, destination: value, isDestinationListVisible: false } : flight
      )
    );
  };

  const selectOrigin = (id, value) => {
    setFlights((prev) =>
      prev.map((flight) =>
        flight.id === id ? { ...flight, origin: value, isOriginListVisible: false } : flight
      )
    );
  };

  // Filter states based on user input in the destination field
  const handleDestinationChange = (id, value) => {
    setFlights((prev) =>
      prev.map((flight) =>
        flight.id === id ? { ...flight, destination: value, isDestinationListVisible: true } : flight
      )
    );
  };

  const handleOriginChange = (id, value) => {
    setFlights((prev) =>
      prev.map((flight) =>
        flight.id === id ? { ...flight, origin: value, isOriginListVisible: true } : flight
      )
    );
  };

  const handleDateChange = (flightId, selectedDates) => {
    setFlights((prevFlights) =>
      prevFlights.map((flight) =>
        flight.id === flightId ? { ...flight, departureDate: selectedDates } : flight
      )
    );
  };

  const handleRoomChange = (index, type, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][type] = value;
    setRooms(updatedRooms);
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

  const submitTravelers = () => {
    const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
    const totalChildren = rooms.reduce((sum, room) => sum + room.children, 0);
    setTravelersInput(
      `${totalAdults + totalChildren} traveler${(totalAdults + totalChildren) > 1 ? 's' : ''}, ${rooms.length} room${rooms.length > 1 ? 's' : ''}`
    );
    setTravelerModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Travelers Input */}
      <div 
        className="border rounded-xl p-3 flex items-center max-sm:flex-1 sm:w-fit relative" 
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
        <div className={`absolute top-16 left-0 z-20 bg-white p-4 shadow shadow-gray-300 rounded-xl text-sm w-52 flex flex-col gap-4 transition-all duration-300 ease-in-out
            ${travelerModalOpen ? 'translate-y-0 opacity-1 pointer-events-auto' : '-translate-y-5 opacity-0 pointer-events-none'}
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
                        ${rooms[index].adults === 1 ? 'bg-gray-50 text-gray-300 cursor-no-drop' : 'bg-white text-black'}`
                      }
                      onClick={() => handleRoomChange(index, 'adults', Math.max(1, rooms[index].adults - 1))}
                    >
                      -
                    </button>
                    <span>{rooms[index].adults}</span>
                    <button
                      className={`border border-gray-50 font-semibold text- px-3 py-1.5 rounded-full 
                        ${rooms[index].adults === 14 ? 'bg-gray-50 text-gray-300 cursor-no-drop' : 'bg-white text-black'}`
                      }
                      onClick={() => handleRoomChange(index, 'adults', Math.min(14, rooms[index].adults + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Children</span>
                  <button
                    className={`border border-gray-50 font-semibold text-2xl px-3 pb-1 rounded-full 
                      ${rooms[index].children === 0 ? 'bg-gray-50 text-gray-300 cursor-no-drop' : 'bg-white text-black'}`
                    }
                    onClick={() => handleRoomChange(index, 'children', Math.max(0, rooms[index].children - 1))}
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
                  >
                    +
                  </button>
                </div>
              </div>
              {index > 0 && (
                <button
                  className="text-[#48aadf] text-sm py-2 self-end"
                  onClick={() => removeRoom(index)}
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
          >
            Done
          </button>
        </div>
      </div>
      {flights.map((flight) => (
        <div 
          className='flex flex-col gap-2'
          key={flight.id}
        >
          <h1 className='font-semibold text-lg'>Flight {flight.id}</h1>
          <div className="xl:flex xl:gap-3 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center">
            <div 
              className='relative max-w-full flex-1' 
              ref={(el) => (originRefs.current[flight.id] = el)}
            >
              <div className="border rounded-xl p-3 flex items-center w-full">
                <FaMapMarkerAlt className="text-xl" />
                <div className="w-full h-full relative">
                  <label
                    htmlFor={`origin-${flight.id}`}
                    className={`absolute left-3 text-sm font-Poppins cursor-text transition-all duration-500 ease-in-out 
                      ${flight.isOriginListVisible || flight.origin !== ''
                        ? 'top-[0.1rem] scale-75 -translate-x-3 transform -translate-y-1/2' 
                        : 'top-1/2 transform -translate-y-1/2'
                      }`
                    }
                  >
                    From where?
                  </label>
                  <input
                    type="text"
                    id={`origin-${flight.id}`}
                    value={flight.origin}
                    onFocus={() =>
                      setFlights((prev) =>
                        prev.map((f) =>
                          f.id === flight.id ? { ...f, isOriginListVisible: true } : f
                        )
                      )
                    }
                    onChange={(e) => handleOriginChange(flight.id, e.target.value)}
                    className="px-3 pt-2 w-full"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className={`absolute top-16 bg-white max-h-64 overflow-y-auto shadow shadow-gray-300 rounded-lg w-64 transition-all duration-300 ease-in-out z-10
                ${flight.isOriginListVisible 
                  ? 'translate-y-0 pointer-events-auto opacity-1' 
                  : '-translate-y-5 pointer-events-none opacity-0'}`
                }
              >
                <ul>
                  {states.filter(state => state.toLowerCase().includes(origin.toLowerCase())).length 
                  ? states.filter(state => state.toLowerCase().includes(origin.toLowerCase())).map((state, i) => (
                      <li 
                        onClick={() => selectOrigin(flight.id, state)}
                        key={i}
                        className='px-5 py-2 hover:bg-gray-100 flex items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out'
                      >
                        <FaMapMarkerAlt />
                        <p>{state}</p>
                      </li>
                    )) 
                  : <li className="px-5 py-2 text-[#48aadf] text-center">
                      No Location Found
                    </li>
                  }
                </ul>
              </div>
            </div>

            <div 
              className='relative flex-1 max-w-full' 
              ref={(el) => (destinationRefs.current[flight.id] = el)}
            >
              <div className="border rounded-xl p-3 flex items-center w-full">
                <FaMapMarkerAlt className="text-xl" />
                <div className="w-full h-full relative">
                  <label
                    htmlFor={`destination-${flight.id}`}
                    className={`absolute left-3 text-sm font-Poppins cursor-text transition-all duration-500 ease-in-out 
                      ${flight.isDestinationListVisible || flight.destination !== ''
                        ? 'top-[0.1rem] scale-75 -translate-x-2 transform -translate-y-1/2' 
                        : 'top-1/2 transform -translate-y-1/2'
                      }`
                    }
                  >
                    Where to?
                  </label>
                  <input
                    type="text"
                    id={`destination-${flight.id}`}
                    value={flight.destination}
                    onChange={(e) => handleDestinationChange(flight.id, e.target.value)}
                    onFocus={() =>
                      setFlights((prev) =>
                        prev.map((f) =>
                          f.id === flight.id ? { ...f, isDestinationListVisible: true } : f
                        )
                      )
                    }
                    className="px-3 pt-2 w-full"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className={`absolute top-16 bg-white max-h-64 overflow-y-auto shadow shadow-gray-300 rounded-lg w-64 transition-all duration-300 ease-in-out z-10
                ${flight.isDestinationListVisible
                  ? 'translate-y-0 pointer-events-auto opacity-1' 
                  : '-translate-y-5 pointer-events-none opacity-0'}`
                }
              >
                <ul>
                  {states.filter(state => state.toLowerCase().includes(destination.toLowerCase())).length 
                  ? states.filter(state => state.toLowerCase().includes(destination.toLowerCase())).map((state, i) => (
                      <li 
                        onClick={() => selectDestination(flight.id, state)}
                        key={i}
                        className='px-5 py-2 hover:bg-gray-100 flex items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out'
                      >
                        <FaMapMarkerAlt />
                        <p>{state}</p>
                      </li>
                    )) 
                  : <li className="px-5 py-2 text-[#48aadf] text-center">
                      No Location Found
                    </li>
                  }
                </ul>
              </div>
            </div>

            {/* Date Picker */}
            <div 
              className="border rounded-xl p-3 flex items-center flex-1" 
              ref={(el) => (dateRefs.current[flight.id] = el)}
            >
              <FaRegCalendarAlt className="text-xl" />
              <div className="w-full h-full relative">
                <label
                  htmlFor={`date`}
                  className={`absolute left-3 text-sm font-Poppins cursor-text top-[0.1rem] scale-75 -translate-x-1 transform -translate-y-1/2`}
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
                  onChange={(dates) => handleDateChange(flight.id, dates)}
                  popupClassName="responsive-calendar" // Apply custom class for responsiveness
                />
              </div>
            </div>
          </div>
          {flight.id > 2 && (
            <p 
              className='text-sm text-[#48aadf] font-semibold font-Grotesk cursor-pointer self-end'
              onClick={() => removeFlight(flight.id)}
            >
              Remove flight
            </p>
          )}
        </div>
      ))}
      <div className='flex items-center justify-between'>
        {flights.length < 5 && (
          <div 
            className='flex items-center gap-1 text-[#48aadf] cursor-pointer font-Grotesk'
            onClick={addFlight}
          >
            <p>Add Flight</p>
            <Plus className='p-1'/>
          </div>
        )}

        {/* Search Button */}
        <button 
          type="button" 
          className="bg-[#48aadf] rounded-full font-semibold text-white cursor-pointer px-8 py-3 h-fit w-fit self-center"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default MultiCity;