// This file isn't completed yet, hence, there isn't detailed comments for it.

import React, { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaRegCalendarAlt } from 'react-icons/fa';
import dayjs from 'dayjs'
import { TimePicker } from 'antd';
import { DatePicker } from 'antd'
import { AiOutlineClockCircle } from 'react-icons/ai';
import OriginInput from '../Common/Inputs/OriginInput';
import { locations } from '../../Data/Locations';
import { useSelector } from 'react-redux';
import DestinationInput from '../Common/Inputs/DestinationInput';
import DateRangePicker from '../Common/Inputs/DateRangePicker';
import PickUp from '../Common/Inputs/PickUp';
import DropOff from '../Common/Inputs/DropOff';
const { RangePicker } = DatePicker;

const format = 'HH:mm';

const RentalCars = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [errors, setErrors] = useState({ origin: '', destination: '' });
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        departureDate: dayjs().format('YYYY-MM-DD'),  // default departure date (today)
        returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),  // default return date (2 days later)
        adults: 1,  // default number of adults
        rooms: 1,  // default number of rooms
    });
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
            <div className="xl:grid-cols-3 xl:gap-3 grid gap-4 md:gap-6 md:grid-cols-2 items-center">
                <div className='relative'>
                    <OriginInput 
                        formData={formData}
                        setFormData={setFormData}
                        locations={locations}  // Pass available locations
                        label="Pick up"
                    />
                    {errors.origin && (
                        <p className="text-red-500 text-[0.7rem] absolute mt-1">
                            {errors.origin}
                        </p>
                    )}
                </div>

                <div className="relative">
                    <DestinationInput
                        formData={formData}
                        setFormData={setFormData}
                        locations={locations}  // Pass available locations
                        label="Drop off"
                    />
                    {/* Display error if destination is not selected */}
                    {errors.destination && (
                        <p className="text-red-500 text-[0.7rem] absolute mt-1">
                            {errors.destination}
                        </p>
                    )}
                </div>

                <DateRangePicker
                    onDateChange={handleDateChange}  // Handle date range change
                    defaultDates={[
                        dayjs(formData.departureDate),
                        dayjs(formData.returnDate),
                    ]}
                />

                <PickUp />
                
                <DropOff />

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