import React, { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaRegCalendarAlt } from 'react-icons/fa';
import dayjs from 'dayjs'
import { DatePicker } from 'antd'
const { RangePicker } = DatePicker;

const OneWay = () => {
  const [focused1, setFocused1] = useState(false);
  const [focused2, setFocused2] = useState(false);
  const [departureDate, setDepartureDate] = useState('');
  const [travelerModalOpen, setTravelerModalOpen] = useState(false);
  const [travelersInput, setTravelersInput] = useState('1 traveler, 1 room');
  const [rooms, setRooms] = useState([{ adults: 1, children: 0 }]);
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('');
  const [isDestinationListVisible, setIsDestinationListVisible] = useState(false);
  const [isOriginListVisible, setIsOriginListVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [states] = useState([
    "California", "Texas", "Florida", "New York", "Pennsylvania", "Illinois", "Ohio", "Georgia", "North Carolina", "Michigan",
    "New Jersey", "Virginia", "Washington", "Arizona", "Massachusetts", "Tennessee", "Indiana", "Missouri", "Maryland", "Wisconsin"
  ]);
  const [addPlaceToStay, setAddPlaceToStay] = useState(false);
  const [formData, setFormData] = useState({});
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
    setIsDestinationListVisible(true);
  };

  const toggleOriginList = () => {
    setFocused2(true);
    setIsOriginListVisible(true);
  };

  const selectDestination = (destination) => {
    setSelectedDestination(destination);
    setIsDestinationListVisible(false);
    setDestination(destination); // Set the destination input value to the selected location
  };

  const selectOrigin = (origin) => {
    setSelectedOrigin(origin);
    setIsOriginListVisible(false);
    setOrigin(origin); // Set the destination input value to the selected location
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
    if (destination.trim()) {
      setFocused1(true);
    } else {
      setFocused1(false);
    }
  }, [destination]);

  useEffect(() => {
    if (origin.trim()) {
      setFocused2(true);
    } else {
      setFocused2(false);
    }
  }, [origin]);

  // Filter states based on user input in the destination field
  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleOriginChange = (e) => {
    setOrigin(e.target.value);
  };

  const handleDateChange = (selectedDates) => {
    // if (selectedDates.length === 2) {

    //   // const [startDate, endDate] = selectedDates;
    //   // setDepartureDate(`${startDate} - ${endDate}`);
    // }
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="xl:flex xl:gap-3 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center">
        <div 
          className='relative' 
          ref={originRef}
        >
          <div className="border rounded-xl p-3 flex items-center flex-1">
            <FaMapMarkerAlt className="text-xl" />
            <div className="w-full h-full relative">
              <label
                htmlFor="origin"
                className={`absolute left-3 text-sm font-Poppins cursor-text transition-all duration-500 ease-in-out ${
                  focused2 
                    ? 'top-[0.1rem] scale-75 -translate-x-2 transform -translate-y-1/2' 
                    : 'top-1/2 transform -translate-y-1/2'
                }`}
              >
                From where?
              </label>
              <input
                type="text"
                id="origin"
                value={origin}
                onFocus={toggleOriginList}
                onBlur={(e) => !e.target.value && setFocused2(false)} // Reset if input is empty
                onChange={handleOriginChange}
                className="px-3 pt-2 w-full"
                autoComplete="off"
              />
            </div>
          </div>

          <div className={`absolute top-16 bg-white max-h-64 overflow-y-auto shadow shadow-gray-300 rounded-lg w-64 transition-all duration-300 ease-in-out z-10
            ${isOriginListVisible 
              ? 'translate-y-0 pointer-events-auto opacity-1' 
              : '-translate-y-5 pointer-events-none opacity-0'}`
            }
          >
            <ul>
              {states.filter(state => state.toLowerCase().includes(origin.toLowerCase())).length 
              ? states.filter(state => state.toLowerCase().includes(origin.toLowerCase())).map((state, i) => (
                  <li 
                    onClick={() => selectOrigin(state)} 
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
          className='relative' 
          ref={destinationRef}
        >
          <div className="border rounded-xl p-3 flex items-center flex-1">
            <FaMapMarkerAlt className="text-xl" />
            <div className="w-full h-full relative">
              <label
                htmlFor="destination"
                className={`absolute left-3 text-sm font-Poppins cursor-text transition-all duration-500 ease-in-out ${
                  focused1 ? 'top-[0.1rem] scale-75 -translate-x-1 transform -translate-y-1/2' : 'top-1/2 transform -translate-y-1/2'
                }`}
              >
                Where to?
              </label>
              <input
                type="text"
                id="destination"
                value={destination}
                onFocus={toggleDestinationList}
                onBlur={(e) => !e.target.value && setFocused1(false)} // Reset if input is empty
                onChange={handleDestinationChange}
                className="px-3 pt-2 w-full"
                autoComplete="off"
              />
            </div>
          </div>

          <div className={`absolute top-16 bg-white max-h-64 overflow-y-auto shadow shadow-gray-300 rounded-lg w-64 transition-all duration-300 ease-in-out z-10
            ${isDestinationListVisible 
              ? 'translate-y-0 pointer-events-auto opacity-1' 
              : '-translate-y-5 pointer-events-none opacity-0'}`
            }
          >
            <ul>
              {states.filter(state => state.toLowerCase().includes(destination.toLowerCase())).length 
              ? states.filter(state => state.toLowerCase().includes(destination.toLowerCase())).map((state, i) => (
                  <li 
                    onClick={() => selectDestination(state)} 
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
          ref={dateRef}
        >
          <FaRegCalendarAlt className="text-xl" />
          <div className="w-full h-full relative">
            <label
              htmlFor="date"
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
              className={`absolute left-3 text-sm font-Poppins cursor-text top-[0.1rem] scale-75 -translate-x-1 transform -translate-y-1/2`}
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

        {/* Search Button */}
        <button 
          type="button" 
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
            <div className={`relative w-4 h-4 flex items-center justify-center rounded border-2 
                ${addPlaceToStay ? 'border-[#4078bc] bg-[#4078bc]' : 'border-gray-300'} transition-all duration-300 ease-in-out`
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="ml-2 text-black text-sm">Add a place to stay</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default OneWay;