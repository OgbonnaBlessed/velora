import React, { useState, useEffect, useRef } from 'react'
import { FaUserAlt } from 'react-icons/fa';

const TravelersInput = ({ formData, setFormData }) => {
    // State to store the list of rooms, with each room having adults and children count
    const [rooms, setRooms] = useState([{ adults: 1, children: 0 }]);
    // State to store the text display for input field
    const [travelersInput, setTravelersInput] = useState('1 traveler, 1 room');
    // State to handle modal visibility when selecting traveler details
    const [travelerModalOpen, setTravelerModalOpen] = useState(false);
    // Reference for outside click detection to close modal when clicked outside
    const travelerRef = useRef();

    // Function to add a new room (up to a maximum of 3 rooms)
    const addRoom = () => {
        if (rooms.length < 3) {
            setRooms([...rooms, { adults: 1, children: 0 }]);
        }
    };

    // Function to remove a specific room from the list
    const removeRoom = (index) => {
        const updatedRooms = rooms.filter((_, i) => i !== index);
        setRooms(updatedRooms);
    };

    // Function to handle changes in the number of adults or children in a specific room
    const handleRoomChange = (index, type, value) => {
        setRooms((prevRooms) => {
            const updatedRooms = [...prevRooms];
            updatedRooms[index][type] = value;
            return updatedRooms;
        });
    };

    // Function to submit the traveler details and update form data and the display input
    const submitTravelers = () => {
        // Calculate total number of adults and children
        const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
        const totalChildren = rooms.reduce((sum, room) => sum + room.children, 0);
        const totalTravelers = totalAdults + totalChildren;

        // Update the parent formData with the new travelers count and room count
        setFormData((prev) => ({
            ...prev,
            adults: totalTravelers,
            rooms: rooms.length
        }));

        // Update the text input display
        setTravelersInput(
            `${totalTravelers} traveler${totalTravelers > 1 ? 's' : ''}, ${rooms.length} room${rooms.length > 1 ? 's' : ''}`
        );
        // Close the modal after submitting
        setTravelerModalOpen(false);
    };

    // Effect hook to update the travelers input text whenever the formData changes
    useEffect(() => {
        setTravelersInput(
            `${formData.adults} traveler${formData.adults > 1 ? 's' : ''}, ${formData.rooms} room${formData.rooms > 1 ? 's' : ''}`
        );
    }, [formData]);

    // Function to detect click outside the modal to close it
    const handleOutsideClick = (event) => {
        if (travelerRef.current && !travelerRef.current.contains(event.target)) {
            setTravelerModalOpen(false);
        }
    };

    // Effect hook to add and clean up the outside click event listener
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div
            className="border rounded-xl p-3 flex items-center flex-1 relative"
            ref={travelerRef}  // Attach the ref to the outer div for outside click detection
        >
            <FaUserAlt className="text-xl" />  {/* Icon for traveler input field */}
            <div className="w-full h-full relative">
                {/* Label for the input field */}
                <label
                    htmlFor="travelers"
                    className="absolute left-3 text-sm font-Poppins cursor-text top-[0.1rem] scale-75 -translate-x-2 transform -translate-y-1/2"
                >
                    Travelers
                </label>
                {/* Read-only input that displays traveler and room details */}
                <input
                    type="text"
                    id="travelers"
                    value={travelersInput}
                    onFocus={() => setTravelerModalOpen(true)}  // Open modal when input is focused
                    className="px-3 pt-2 w-full bg-transparent"
                    autoComplete="off"
                    readOnly  // Prevent editing directly in the input
                />
            </div>
            {/* Traveler details modal */}
            <div
                className={`absolute top-16 left-0 z-20 bg-white p-4 shadow shadow-gray-300 rounded-xl text-sm w-52 flex flex-col gap-4 transition-all duration-300 ease-in-out
                    ${travelerModalOpen
                        ? 'translate-y-0 opacity-1 pointer-events-auto'
                        : '-translate-y-5 opacity-0 pointer-events-none'
                    }
                `}
            >
                {/* Loop through rooms to display options for each room */}
                {rooms.map((room, index) => (
                    <div key={index} className="flex flex-col gap-3">
                        <h4 className="font-bold">Room {index + 1}</h4>
                        <div className="flex flex-col gap-2">
                            {/* Adults input for the room */}
                            <div className="flex justify-between items-center">
                                <span>Adults</span>
                                <div className="flex gap-3 items-center">
                                    <button
                                        className={`border border-gray-50 w-8 h-8 flex items-center justify-center font-semibold text-xl rounded-full
                                            ${rooms[index].adults === 1 
                                                ? 'bg-gray-50 text-gray-300 cursor-no-drop' 
                                                : 'bg-white text-black'
                                            }`
                                        }
                                        onClick={() =>
                                            handleRoomChange(index, 'adults', Math.max(1, rooms[index].adults - 1))
                                        }
                                        type="button"
                                    >
                                        -
                                    </button>
                                    <span>{rooms[index].adults}</span>
                                    <button
                                        className={`border border-gray-50 font-semibold text-lg w-8 h-8 flex items-center justify-center rounded-full
                                            ${rooms[index].adults === 14 
                                                ? 'bg-gray-50 text-gray-300 cursor-no-drop' 
                                                : 'bg-white text-black'
                                            }`
                                        }
                                        onClick={() =>
                                            handleRoomChange(index, 'adults', Math.min(14, rooms[index].adults + 1))
                                        }
                                        type="button"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            {/* Children input for the room */}
                            <div className="flex justify-between items-center">
                                <span>Children</span>
                                <div className="flex gap-3 items-center">
                                    <button
                                        className={`border border-gray-50 w-8 h-8 flex items-center justify-center font-semibold text-xl rounded-full
                                            ${rooms[index].children === 0 
                                                ? 'bg-gray-50 text-gray-300 cursor-no-drop' 
                                                : 'bg-white text-black'
                                            }`
                                        }
                                        onClick={() =>
                                            handleRoomChange(index, 'children', Math.max(0, rooms[index].children - 1))
                                        }
                                        type="button"
                                    >
                                        -
                                    </button>
                                    <span>{rooms[index].children}</span>
                                    <button
                                        className={`border border-gray-50 font-semibold text-lg w-8 h-8 flex items-center justify-center rounded-full
                                            ${rooms[index].children === 6 
                                                ? 'bg-gray-50 text-gray-300 cursor-no-drop' 
                                                : 'bg-white text-black'
                                            }`
                                        }
                                        onClick={() =>
                                            handleRoomChange(index, 'children', Math.min(6, rooms[index].children + 1))
                                        }
                                        type="button"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Button to remove a room (only if there is more than one room) */}
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
                {/* Display "Add another room" option if the number of rooms is less than 3 */}
                {rooms.length < 3 && (
                    <p 
                        className="text-[#48aadf] cursor-pointer" 
                        onClick={addRoom}
                    >
                        Add another room
                    </p>
                )}
                {/* Button to finalize the traveler details */}
                <button
                    onClick={submitTravelers}
                    className="bg-[#48aadf] text-white px-5 py-2 rounded-full font-semibold cursor-pointer"
                    type="button"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default TravelersInput;