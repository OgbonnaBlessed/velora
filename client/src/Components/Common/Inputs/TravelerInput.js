import React, { useState, useEffect, useRef } from 'react'
import { FaUserAlt } from 'react-icons/fa';

const TravelersInput = ({ formData, setFormData }) => {
    const [rooms, setRooms] = useState([{ adults: 1, children: 0 }]);
    const [travelersInput, setTravelersInput] = useState('1 traveler, 1 room');
    const [travelerModalOpen, setTravelerModalOpen] = useState(false);
    const travelerRef = useRef();

    const addRoom = () => {
        if (rooms.length < 3) {
            setRooms([...rooms, { adults: 1, children: 0 }]);
        }
    };

    const removeRoom = (index) => {
        const updatedRooms = rooms.filter((_, i) => i !== index);
        setRooms(updatedRooms);
    };

    const handleRoomChange = (index, type, value) => {
        setRooms((prevRooms) => {
            const updatedRooms = [...prevRooms];
            updatedRooms[index][type] = value;
            return updatedRooms;
        });
    };

    const submitTravelers = () => {
        const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
        const totalChildren = rooms.reduce((sum, room) => sum + room.children, 0);
        const totalTravelers = totalAdults + totalChildren;

        // Update parent formData state
        setFormData((prev) => ({
            ...prev,
            adults: totalTravelers,
            rooms: rooms.length
        }));

        // Update input display
        setTravelersInput(
            `${totalTravelers} traveler${totalTravelers > 1 ? 's' : ''}, ${rooms.length} room${rooms.length > 1 ? 's' : ''}`
        );
        setTravelerModalOpen(false);
    };

    useEffect(() => {
        setTravelersInput(
            `${formData.adults} traveler${formData.adults > 1 ? 's' : ''}, ${formData.rooms} room${formData.rooms > 1 ? 's' : ''}`
        );
    }, [formData]);

    const handleOutsideClick = (event) => {
        if (travelerRef.current && !travelerRef.current.contains(event.target)) {
            setTravelerModalOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div
            className="border rounded-xl p-3 flex items-center flex-1 relative"
            ref={travelerRef}
        >
            <FaUserAlt className="text-xl" />
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
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span>Adults</span>
                                <div className="flex gap-3 items-center">
                                    <button
                                        className={`border border-gray-50 font-semibold text-xl px-3 pb-1 rounded-full
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
                                        className={`border border-gray-50 font-semibold text-lg px-2.5 pb-1 rounded-full
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
                            <div className="flex justify-between items-center">
                                <span>Children</span>
                                <div className="flex gap-3 items-center">
                                    <button
                                        className={`border border-gray-50 font-semibold text-xl px-3 pb-1 rounded-full
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
                                        className={`border border-gray-50 font-semibold text-lg px-3 pb-1 rounded-full
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
                    type="button"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default TravelersInput;