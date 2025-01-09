// This file isn't completed yet, hence, there isn't detailed comments for it.

import React, { useEffect, useRef, useState } from 'react'; // Import necessary React hooks for managing component state and effects.
import { FaMapMarkerAlt, FaRegCalendarAlt } from 'react-icons/fa'; // Importing map marker and calendar icons for UI.
import dayjs from 'dayjs'; // Import dayjs for managing and formatting dates.
import { DatePicker } from 'antd'; // Import DatePicker from Ant Design for date selection.
import { TimePicker } from 'antd'; // Import TimePicker from Ant Design for time selection.
import { AiOutlineClockCircle } from 'react-icons/ai'; // Import clock icon.
const format = 'HH:mm'; // Format for displaying time.

const AirportToHotel = () => {
    // State hooks for managing the component's states.
    const [focused1, setFocused1] = useState(false); // For tracking if the destination input field is focused.
    const [focused2, setFocused2] = useState(false); // For tracking if the origin input field is focused.
    const [departureDate, setDepartureDate] = useState(''); // For storing the departure date.
    const [travelerModalOpen, setTravelerModalOpen] = useState(false); // To control the visibility of the traveler modal.
    const [travelersInput, setTravelersInput] = useState('1 traveler, 1 room'); // For displaying the current traveler count.
    const [rooms, setRooms] = useState([{ adults: 1, children: 0 }]); // List to store rooms and their respective adult/child counts.
    const [destination, setDestination] = useState(''); // Stores the destination input.
    const [origin, setOrigin] = useState(''); // Stores the origin input.
    const [isDestinationListVisible, setIsDestinationListVisible] = useState(false); // For toggling the destination list visibility.
    const [isOriginListVisible, setIsOriginListVisible] = useState(false); // For toggling the origin list visibility.
    const [selectedDestination, setSelectedDestination] = useState(''); // Stores the selected destination.
    const [selectedOrigin, setSelectedOrigin] = useState(''); // Stores the selected origin.
    const [states] = useState([ // Predefined list of states used for the destination and origin suggestions.
        "California", "Texas", "Florida", "New York", "Pennsylvania", "Illinois", "Ohio", "Georgia", "North Carolina", "Michigan",
        "New Jersey", "Virginia", "Washington", "Arizona", "Massachusetts", "Tennessee", "Indiana", "Missouri", "Maryland", "Wisconsin"
    ]);

    // Refs for tracking specific DOM elements.
    const travelerRef = useRef();
    const dateRef = useRef();
    const destinationRef = useRef();
    const originRef = useRef();

    const today = dayjs(); // Get today's date using dayjs.
    const twoDaysLater = today.add(2, "day"); // Get the date 2 days from today.

    // Function to handle clicks outside specific elements to close dropdowns/modal.
    const handleOutsideClick = (event) => {
        if (travelerRef.current && !travelerRef.current.contains(event.target)) {
            setTravelerModalOpen(false); // Close traveler modal if clicked outside.
        }

        if (destinationRef.current && !destinationRef.current.contains(event.target)) {
            setIsDestinationListVisible(false); // Close destination list if clicked outside.
        }

        if (originRef.current && !originRef.current.contains(event.target)) {
            setIsOriginListVisible(false); // Close origin list if clicked outside.
        }
    };

    // Set up event listener for outside clicks when the component mounts and remove it when unmounting.
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    // Functions to toggle the visibility of the origin and destination lists.
    const toggleDestinationList = () => {
        setFocused1(true);
        setIsDestinationListVisible(true);
    };

    const toggleOriginList = () => {
        setFocused2(true);
        setIsOriginListVisible(true);
    };

    // Functions to handle selecting a destination or origin.
    const selectDestination = (destination) => {
        setSelectedDestination(destination);
        setIsDestinationListVisible(false); // Hide the destination list.
        setDestination(destination); // Set the selected destination value to the input.
    };

    const selectOrigin = (origin) => {
        setSelectedOrigin(origin);
        setIsOriginListVisible(false); // Hide the origin list.
        setOrigin(origin); // Set the selected origin value to the input.
    };

    // Set default date range on component mount.
    useEffect(() => {
        const today = new Date();
        const twoDaysLater = new Date();
        twoDaysLater.setDate(today.getDate() + 2);

        setDepartureDate(`${today} - ${twoDaysLater}`);
    }, []);

    // Hook to monitor changes in the destination and origin inputs.
    useEffect(() => {
        if (destination.trim()) {
            setFocused1(true); // Set destination field as focused if there is any input.
        } else {
            setFocused1(false); // Unfocus destination field if empty.
        }
    }, [destination]);

    useEffect(() => {
        if (origin.trim()) {
            setFocused2(true); // Set origin field as focused if there is any input.
        } else {
            setFocused2(false); // Unfocus origin field if empty.
        }
    }, [origin]);

    // Functions to handle input changes for destination, origin, and date.
    const handleDestinationChange = (e) => {
        setDestination(e.target.value); // Set destination state to the input value.
    };

    const handleOriginChange = (e) => {
        setOrigin(e.target.value); // Set origin state to the input value.
    };

    const handleDateChange = (selectedDates) => {
        // The function for handling date change is currently commented out, could be used for future improvements.
    };

    // Function to update room information (adults/children).
    const handleRoomChange = (index, type, value) => {
        const updatedRooms = [...rooms]; // Create a copy of the rooms state.
        updatedRooms[index][type] = value; // Update the specific room with the new value.
        setRooms(updatedRooms); // Set the updated rooms list.
    };

    // Function to add a new room if there are fewer than 3 rooms.
    const addRoom = () => {
        if (rooms.length < 3) {
            setRooms([...rooms, { adults: 1, children: 0 }]); // Add a new room with default values.
        }
    };

    // Function to remove a room by its index.
    const removeRoom = (index) => {
        const updatedRooms = rooms.filter((_, i) => i !== index); // Filter out the room to remove.
        setRooms(updatedRooms); // Set the updated rooms list.
    };

    // Function to submit traveler information (calculate the total travelers and rooms).
    const submitTravelers = () => {
        const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0); // Sum up all adults in the rooms.
        const totalChildren = rooms.reduce((sum, room) => sum + room.children, 0); // Sum up all children in the rooms.
        setTravelersInput(
            `${totalAdults + totalChildren} traveler${(totalAdults + totalChildren) > 1 ? 's' : ''}, ${rooms.length} room${rooms.length > 1 ? 's' : ''}`
        ); // Display the total traveler count and room count.
        setTravelerModalOpen(false); // Close the traveler modal.
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Main grid for form fields */}
            <div className="xl:grid-cols-3 xl:gap-3 grid gap-4 md:gap-6 md:grid-cols-2 items-center">
    
                {/* Origin Input Section */}
                <div className='relative' ref={originRef}>
                    {/* Border and input styling */}
                    <div className="border rounded-xl p-3 flex items-center flex-1">
                        <FaMapMarkerAlt className="text-xl" /> {/* Icon for the input */}
                        <div className="w-full h-full relative">
                            {/* Label for Airport input field with transition effects */}
                            <label
                                htmlFor="origin"
                                className={`absolute left-3 text-sm font-Poppins cursor-text transition-all duration-500 ease-in-out 
                                    ${focused2 
                                    ? 'top-[0.1rem] scale-75 -translate-x-1 transform -translate-y-1/2' 
                                    : 'top-1/2 transform -translate-y-1/2'
                                }`}
                            >
                                Airport
                            </label>
                            {/* Airport input field */}
                            <input
                                type="text"
                                id="origin"
                                value={origin}
                                onFocus={toggleOriginList} // Trigger list on focus
                                onBlur={(e) => !e.target.value && setFocused2(false)} // Reset focus if input is empty
                                onChange={handleOriginChange} // Handle input changes
                                className="px-3 pt-2 w-full"
                                autoComplete="off"
                            />
                        </div>
                    </div>
    
                    {/* Dropdown for selecting origin location */}
                    <div 
                        className={`absolute top-16 bg-white max-h-64 overflow-y-auto shadow shadow-gray-300 rounded-lg w-64 transition-all duration-300 ease-in-out z-10
                            ${isOriginListVisible 
                                ? 'translate-y-0 pointer-events-auto opacity-1' 
                                : '-translate-y-5 pointer-events-none opacity-0'
                            }`}
                    >
                        <ul>
                            {/* Filtered list of states based on input */}
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
    
                {/* Destination Input Section */}
                <div className='relative' ref={destinationRef}>
                    <div className="border rounded-xl p-3 flex items-center flex-1">
                        <FaMapMarkerAlt className="text-xl" />
                        <div className="w-full h-full relative">
                            {/* Label for Hotel input field with transition effects */}
                            <label
                                htmlFor="destination"
                                className={`absolute left-3 text-sm font-Poppins cursor-text transition-all duration-500 ease-in-out 
                                    ${focused1 
                                        ? 'top-[0.1rem] scale-75 -translate-x-1 transform -translate-y-1/2' 
                                        : 'top-1/2 transform -translate-y-1/2'
                                    }`}
                            >
                                Hotel
                            </label>
                            {/* Hotel input field */}
                            <input
                                type="text"
                                id="destination"
                                value={destination}
                                onFocus={toggleDestinationList} // Trigger list on focus
                                onBlur={(e) => !e.target.value && setFocused1(false)} // Reset focus if input is empty
                                onChange={handleDestinationChange} // Handle input changes
                                className="px-3 pt-2 w-full"
                                autoComplete="off"
                            />
                        </div>
                    </div>
    
                    {/* Dropdown for selecting destination location */}
                    <div 
                        className={`absolute top-16 bg-white max-h-64 overflow-y-auto shadow shadow-gray-300 rounded-lg w-64 transition-all duration-300 ease-in-out z-10
                            ${isDestinationListVisible 
                                ? 'translate-y-0 pointer-events-auto opacity-1' 
                                : '-translate-y-5 pointer-events-none opacity-0'
                            }`}
                    >
                        <ul>
                            {/* Filtered list of states based on input */}
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
    
                {/* Travelers Input Section */}
                <div className="border rounded-xl p-3 flex items-center flex-1 relative" ref={travelerRef}>
                    <FaMapMarkerAlt className="text-xl" />
                    <div className="w-full h-full relative">
                        {/* Label for Travelers input field */}
                        <label
                            htmlFor="travelers"
                            className="absolute left-3 text-sm cursor-text top-[0.1rem] scale-75 -translate-x-2 transform -translate-y-1/2 font-Poppins"
                        >
                            Travelers
                        </label>
                        {/* Travelers input field */}
                        <input
                            type="text"
                            id="travelers"
                            value={travelersInput}
                            onFocus={() => setTravelerModalOpen(true)} // Open traveler modal on focus
                            className="px-3 pt-2 w-full bg-transparent"
                            autoComplete="off"
                            readOnly // Make the input field read-only
                        />
                    </div>
                    {/* Modal for selecting number of travelers */}
                    <div 
                        className={`absolute top-16 left-0 font-sans z-20 bg-white p-4 shadow shadow-gray-300 rounded-xl text-sm w-52 flex flex-col gap-4 transition-all duration-300 ease-in-out
                            ${travelerModalOpen 
                                ? 'translate-y-0 opacity-1 pointer-events-auto' 
                                : '-translate-y-5 opacity-0 pointer-events-none'
                            }`}
                    >
                        {/* Iterate over rooms to display number of adults/children for each room */}
                        {rooms.map((room, index) => (
                            <div 
                                key={index} 
                                className="flex flex-col gap-3"
                            >
                                <h4 className="font-bold">Room {index + 1}</h4>
                                <div className='flex flex-col gap-2'>
                                    <div className="flex justify-between items-center">
                                        <span>Adults</span>
                                        <div className='flex gap-3 items-center'>
                                            {/* Button to decrease adults count */}
                                            <button
                                                className={`border border-gray-50 font-semibold text-2xl w-8 h-8 flex items-center justify-center rounded-full 
                                                    ${rooms[index].adults === 1 
                                                        ? 'bg-gray-50 text-gray-300 cursor-no-drop' 
                                                        : 'bg-white text-black'
                                                    }`}
                                                onClick={() => handleRoomChange(index, 'adults', Math.max(1, rooms[index].adults - 1))}
                                            >
                                                -
                                            </button>
                                            <span>{rooms[index].adults}</span>
                                            {/* Button to increase adults count */}
                                            <button
                                                className={`border border-gray-50 font-semibold text-lg w-8 h-8 flex items-center justify-center rounded-full 
                                                    ${rooms[index].adults === 14 
                                                        ? 'bg-gray-50 text-gray-300 cursor-no-drop' 
                                                        : 'bg-white text-black'
                                                    }`}
                                                onClick={() => handleRoomChange(index, 'adults', Math.min(14, rooms[index].adults + 1))}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Children</span>
                                        <button
                                            className={`border border-gray-50 font-semibold text-2xl w-8 h-8 flex items-center justify-center rounded-full 
                                                ${rooms[index].children === 0 ? 'bg-gray-50 text-gray-300 cursor-no-drop' : 'bg-white text-black'}`}
                                            onClick={() => handleRoomChange(index, 'children', Math.max(0, rooms[index].children - 1))}
                                        >
                                            -
                                        </button>
                                        <span>{rooms[index].children}</span>
                                        <button
                                            className={`border border-gray-50 font-semibold text-lg w-8 h-8 flex items-center justify-center rounded-full 
                                                ${rooms[index].children === 6 
                                                    ? 'bg-gray-50 text-gray-300 cursor-no-drop' 
                                                    : 'bg-white text-black'
                                                }`}
                                            onClick={() => handleRoomChange(index, 'children', Math.min(6, rooms[index].children + 1))}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                {index > 0 && (
                                    <button
                                        className="text-[#48aadf] text-sm py-2 self-end"
                                        onClick={() => removeRoom(index)} // Remove room if there are multiple rooms
                                    >
                                        Remove Room
                                    </button>
                                )}
                            </div>
                        ))}
                        {/* Allow user to add a new room if there are less than 3 rooms */}
                        {rooms.length < 3 && (
                            <p 
                                className="text-[#48aadf] cursor-pointer" 
                                onClick={addRoom} // Add new room functionality
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

            {/* Date Picker Section */}
            <div 
                className="border rounded-xl p-3 flex items-center flex-1" 
                ref={dateRef}
            >
                <FaRegCalendarAlt className="text-xl" />
                <div className="w-full h-full relative">
                    <label
                        htmlFor="date"
                        className="absolute left-3 text-sm font-Poppins cursor-text top-[0.1rem] scale-75 -translate-x-4 transform -translate-y-1/2"
                    >
                        Flight arrival date
                    </label>
                    <DatePicker
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

            <div className="border rounded-xl p-3 flex items-center">
                <AiOutlineClockCircle className="text-xl" />
                <div className="w-full h-full relative">
                    <label
                        htmlFor="flight-arrival-time"
                        className="absolute left-3 text-sm font-Poppins cursor-text top-[0.1rem] scale-75 -translate-x-3 transform -translate-y-1/2"
                    >
                        Flight arrival time
                    </label>
                    <TimePicker 
                        id='flight-arrival-time'
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

export default AirportToHotel;