import React, { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaRegCalendarAlt } from 'react-icons/fa';
import dayjs from 'dayjs'
import { DatePicker } from 'antd'
const { RangePicker } = DatePicker;

const OneWay = () => {
  const [focused1, setFocused1] = useState(false);
  const [departureDate, setDepartureDate] = useState('');
  const [destination, setDestination] = useState('');
  const [isDestinationListVisible, setIsDestinationListVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [states] = useState([
    "California", "Texas", "Florida", "New York", "Pennsylvania", "Illinois", "Ohio", "Georgia", "North Carolina", "Michigan",
    "New Jersey", "Virginia", "Washington", "Arizona", "Massachusetts", "Tennessee", "Indiana", "Missouri", "Maryland", "Wisconsin"
  ]);
  const dateRef = useRef();
  const destinationRef = useRef();

  const today = dayjs();
  const twoDaysLater = today.add(2, "day");

  const handleOutsideClick = (event) => {
    if (destinationRef.current && !destinationRef.current.contains(event.target)) {
      setIsDestinationListVisible(false);
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

  const selectDestination = (destination) => {
    setSelectedDestination(destination);
    setIsDestinationListVisible(false);
    setDestination(destination); // Set the destination input value to the selected location
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

  // Filter states based on user input in the destination field
  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleDateChange = (selectedDates) => {
    // if (selectedDates.length === 2) {

    //   // const [startDate, endDate] = selectedDates;
    //   // setDepartureDate(`${startDate} - ${endDate}`);
    // }
  };

  return (
    <div className='p-4 sm:p-6 md:p-8 flex flex-col gap-8 w-full'>
      <div className="xl:flex grid gap-6 lg:gap-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 items-center w-full">
        <div 
          className='relative flex-1 w-full' 
          ref={destinationRef}
        >
          <div className="border rounded-xl p-3 flex items-center w-full">
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

export default OneWay;