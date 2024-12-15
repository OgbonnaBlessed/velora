import React, { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaRegCalendarAlt } from 'react-icons/fa';
import dayjs from 'dayjs'
import { TimePicker } from 'antd';
import { DatePicker } from 'antd'
import { AiOutlineClockCircle } from 'react-icons/ai';
const { RangePicker } = DatePicker;

const format = 'HH:mm';

const RentalCars = () => {
    const [focused1, setFocused1] = useState(false);
    const [focused2, setFocused2] = useState(false);
    const [departureDate, setDepartureDate] = useState('');
    const [travelerModalOpen, setTravelerModalOpen] = useState(false);
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
    const travelerRef = useRef();
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

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="xl:flex xl:gap-3 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center">
                <div 
                    className='relative' 
                    ref={originRef}
                >
                    <div className="border rounded-xl p-3 flex items-center">
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
                            Pick-up
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
                            :   <li className="px-5 py-2 text-[#48aadf] text-center">
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
                    <div className="border rounded-xl p-3 flex items-center">
                        <FaMapMarkerAlt className="text-xl" />
                        <div className="w-full h-full relative">
                            <label
                                htmlFor="destination"
                                className={`absolute left-3 text-sm font-Poppins cursor-text transition-all duration-500 ease-in-out 
                                    ${focused1 
                                        ? 'top-[0.1rem] scale-75 -translate-x-4 transform -translate-y-1/2' 
                                        : 'top-1/2 transform -translate-y-1/2'
                                    }`
                                }
                            >
                                Same as pick-up
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
                            :   <li className="px-5 py-2 text-[#48aadf] text-center">
                                    No Location Found
                                </li>
                            }
                        </ul>
                    </div>
                </div>

                {/* Date Picker */}
                <div className="border rounded-xl p-3 flex items-center">
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
                            inputReadOnly={true}
                            format={"MMM DD"}
                            defaultValue={[today, twoDaysLater]}
                            minDate={today}
                            allowClear={false} // Optional: allows clearing the input
                            readOnly
                            onChange={handleDateChange}
                            popupClassName="responsive-calendar" // Apply custom class for responsiveness
                        />
                    </div>
                </div>
                <div className="border rounded-xl p-3 flex items-center">
                    <AiOutlineClockCircle className="text-xl" />
                    <div className="w-full h-full relative">
                        <label
                            htmlFor="pick-up-time"
                            className="absolute left-3 text-sm font-Poppins text-nowrap cursor-text top-[0.1rem] scale-75 -translate-x-3 transform -translate-y-1/2"
                        >
                            Pick up time
                        </label>
                        <TimePicker 
                            id='pick-up-time'
                            use12Hours
                            inputReadOnly={true}
                            suffixIcon={null}
                            defaultValue={dayjs('10:00', format)} 
                            format={format} 
                        />
                    </div>
                </div>
                <div className="border rounded-xl p-3 flex items-center">
                    <AiOutlineClockCircle className="text-xl" />
                    <div className="w-full h-full relative">
                        <label
                            htmlFor="drop-off-time"
                            className={`absolute left-3 text-sm font-Poppins cursor-text top-[0.1rem] scale-75 -translate-x-3 transform -translate-y-1/2 text-nowrap`}
                        >
                            Drop off time
                        </label>
                        <TimePicker 
                            id='drop-off-time'
                            use12Hours
                            inputReadOnly={true}
                            suffixIcon={null}
                            defaultValue={dayjs('10:00', format)} 
                            format={format} 
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

export default RentalCars;