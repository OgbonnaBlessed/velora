import React, { useState, useRef, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const AirportInput = ({ formData, setFormData, airports, label }) => {
    const [filteredOrigins, setFilteredOrigins] = useState([]);
    const [isOriginListVisible, setIsOriginListVisible] = useState(false);
    const [focused, setFocused] = useState(false);
    const [inputValue, setInputValue] = useState(''); // To store and display the airport name
    const originRef = useRef();

    // Toggle and sort the origin list
    const toggleOriginList = () => {
        setFocused(true);
        const sortedLocations = [...airports].sort((a, b) =>
            a.airport.localeCompare(b.airport)
        );
        setFilteredOrigins(sortedLocations);
        setIsOriginListVisible(true);
    };

    // Handle the selection of an origin
    const selectOrigin = (selectedOrigin) => {
        setInputValue(`${selectedOrigin.airport}, ${selectedOrigin.city}`); // Display airport name in input
        setFormData((prev) => ({ ...prev, origin: selectedOrigin.city })); // Save city to formData
        setFilteredOrigins([]);
        setIsOriginListVisible(false);
    };

    // Handle input change
    const handleOriginChange = (e) => {
        const value = e.target.value;
        setInputValue(value); // Update the input value
        const sortedLocations = [...airports].sort((a, b) =>
            a.airport.localeCompare(b.airport)
        );
        setFilteredOrigins(
            value.trim() === ""
                ? sortedLocations
                : sortedLocations.filter((location) =>
                    location.airport?.toLowerCase().includes(value.trim().toLowerCase())
                )
        );
        setIsOriginListVisible(true);
    };

    // Sync focus state with formData origin
    useEffect(() => {
        if (formData.origin) {
            setFocused(true);
        } else {
            setFocused(false);
        }
    }, [formData.origin]);

    // Handle outside click
    const handleOutsideClick = (event) => {
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

    return (
        <div className='relative' ref={originRef}>
            <div className="border rounded-xl p-3 flex items-center gap-3 flex-1">
                <FaMapMarkerAlt className="text-xl" />
                <div className="w-full h-full relative">
                    <label
                        htmlFor="origin"
                        className={`absolute left-0 text-sm font-Poppins cursor-text transition-all duration-500 ease-in-out 
                            ${focused
                                ? '-top-1 scale-90 text-xs origin-left'
                                : 'top-1/2 transform -translate-y-1/2 text-base'
                            }`
                        }
                    >
                        {label}
                    </label>
                    <input
                        type="text"
                        id="origin"
                        value={inputValue} // Show airport name
                        onFocus={toggleOriginList}
                        onBlur={(e) => !e.target.value && setFocused(false)}
                        onChange={handleOriginChange}
                        className="pt-2 w-full bg-transparent focus:outline-none"
                        autoComplete="off"
                    />
                </div>
            </div>

            {/* Origin list dropdown */}
            <div
                className={`absolute top-16 bg-white max-h-64 overflow-y-auto shadow shadow-gray-300 rounded-lg w-64 transition-all duration-300 ease-in-out z-10 font-Roboto
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
                                onClick={() => selectOrigin(location)} // Pass the entire object
                                className="cursor-pointer hover:bg-gray-200 px-3 py-2"
                            >
                                {location.airport}, {location.city}
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

export default AirportInput;