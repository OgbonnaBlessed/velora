import React, { useState, useRef, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const DestinationInput = ({ formData, setFormData, locations }) => {
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [isDestinationListVisible, setIsDestinationListVisible] = useState(false);
    const [focused, setFocused] = useState(false);
    const destinationRef = useRef();

    const toggleDestinationList = () => {
        setFocused(true);
        const sortedLocations = [...locations].sort((a, b) =>
            a.city.localeCompare(b.city)
        );
        setFilteredDestinations(sortedLocations);
        setIsDestinationListVisible(true);
    };

    const selectDestination = (selectedDestination) => {
        setFormData((prev) => ({ ...prev, destination: selectedDestination }));
        setFilteredDestinations([]);
        setIsDestinationListVisible(false);
    };

    const handleDestinationChange = (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, destination: value }));
        const sortedLocations = [...locations].sort((a, b) =>
            a.city.localeCompare(b.city)
        );
        setFilteredDestinations(
            value.trim() === ""
                ? sortedLocations
                : sortedLocations.filter((location) =>  location.city?.toLowerCase().includes(value.trim().toLowerCase()))
        );
        setIsDestinationListVisible(true);
    };

    useEffect(() => {
        if (formData.destination) {
            setFocused(true);
        } else {
            setFocused(false);
        }
    }, [formData.destination]);

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

    return (
        <div className='relative' ref={destinationRef}>
            <div className="border rounded-xl p-3 flex items-center flex-1">
                <FaMapMarkerAlt className="text-xl" />
                <div className="w-full h-full relative">
                    <label
                        htmlFor="destination"
                        className={`absolute left-3 text-sm font-Poppins cursor-text transition-all duration-500 ease-in-out 
                            ${focused
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
                        onBlur={(e) => !e.target.value && setFocused(false)} // Reset if input is empty
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
    );
};

export default DestinationInput;