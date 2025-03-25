import React, { useState, useRef, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Functional component for the 'Origin' input field
const OriginInput = ({ formData, setFormData, locations, label }) => {
    // State for filtered origins based on user input
    const [filteredOrigins, setFilteredOrigins] = useState([]);
    // State for controlling the visibility of the origin list
    const [isOriginListVisible, setIsOriginListVisible] = useState(false);
    // State for tracking if the input field is focused
    const [focused, setFocused] = useState(false);
    // Reference to the origin input field (used to detect clicks outside)
    const originRef = useRef();

    // Function to toggle the origin list visibility and sort the locations
    const toggleOriginList = () => {
        setFocused(true); // Set focus state to true when the list is toggled
        const sortedLocations = [...locations].sort((a, b) =>
            a.city.localeCompare(b.city) // Sorting cities alphabetically
        );
        setFilteredOrigins(sortedLocations); // Set filtered list of origins
        setIsOriginListVisible(true); // Show the origin list
    };

    // Function to handle the selection of an origin
    const selectOrigin = (selectedOrigin) => {
        setFormData((prev) => ({ ...prev, origin: selectedOrigin })); // Update form data with the selected origin
        setFilteredOrigins([]); // Clear the filtered list once an origin is selected
        setIsOriginListVisible(false); // Hide the origin list
    };

    // Function to handle input changes and filter the origin list
    const handleOriginChange = (e) => {
        const value = e.target.value; // Get the input value
        setFormData((prev) => ({ ...prev, origin: value })); // Update form data with the current input value
        const sortedLocations = [...locations].sort((a, b) =>
            a.city.localeCompare(b.city) // Sorting cities alphabetically
        );
        // Filter the locations based on the input value
        setFilteredOrigins(
            value.trim() === ""
                ? sortedLocations // If input is empty, show all sorted locations
                : sortedLocations.filter((location) =>  location.city?.toLowerCase().includes(value.trim().toLowerCase())) // Filter locations based on the input value
        );
        setIsOriginListVisible(true); // Show the origin list when the user types
    };

    // Effect hook to track changes in the form data's origin
    useEffect(() => {
        if (formData.origin) {
            setFocused(true); // If origin is selected, focus on the input
        } else {
            setFocused(false); // If origin is not selected, unfocus the input
        }
    }, [formData.origin]);

    // Function to detect clicks outside the input field and hide the origin list
    const handleOutsideClick = (event) => {
        if (originRef.current && !originRef.current.contains(event.target)) {
            setIsOriginListVisible(false); // Hide origin list when clicking outside the input field
        }
    };

    // Effect hook to add event listener for detecting outside clicks
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick); // Listen for outside clicks
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick); // Clean up the event listener on unmount
        };
    }, []);

    return (
        <div 
            className='relative' 
            ref={originRef} // Attach the ref to the div for detecting outside clicks
        >
            <div className="border rounded-xl p-3 flex items-center gap-3 flex-1">
                <FaMapMarkerAlt className="text-xl" /> {/* Icon for the input field */}
                <div className="w-full h-full relative">
                    <label
                        htmlFor="origin"
                        className={`absolute left-0 text-sm font-Poppins cursor-text transition-all duration-500 ease-in-out 
                            ${focused
                                ? '-top-1 scale-90 text-xs origin-left' // Styles for the label when focused
                                : 'top-1/2 transform -translate-y-1/2 text-base' // Styles for the label when not focused
                            }`
                        }
                    >
                        {label}
                    </label>
                    <input
                        type="text"
                        id="origin"
                        value={formData.origin} // Input value bound to form data's origin
                        onFocus={toggleOriginList} // Trigger list toggle when input is focused
                        onBlur={(e) => !e.target.value && setFocused(false)} // Reset focus if input is empty
                        onChange={handleOriginChange} // Handle input changes
                        className="pt-2 w-full bg-transparent focus:outline-none font-sans font-normal"
                        autoComplete="off" // Disable autocomplete for the input
                    />
                </div>
            </div>

            {/* Origin list dropdown */}
            <div 
                className={`absolute top-16 bg-white max-h-64 overflow-y-auto shadow shadow-gray-300 rounded-lg w-64 transition-all duration-300 ease-in-out z-10 font-Roboto
                    ${isOriginListVisible 
                        ? 'translate-y-0 pointer-events-auto opacity-1' // Show the list when visible
                        : '-translate-y-5 pointer-events-none opacity-0' // Hide the list when not visible
                    }`
                }
            >
                <ul>
                    {/* Render the filtered origins if available */}
                    {filteredOrigins.length > 0 
                    ? (filteredOrigins.map((location, index) => (
                        <li
                            key={index}
                            onClick={() => selectOrigin(location.city)} // Select an origin when clicked
                            className="cursor-pointer hover:bg-gray-200 px-3 py-2"
                        >
                            {location.city} {/* Display the city name */}
                        </li>
                    )))
                    : (
                        <li className='px-3 py-2 text-[#48aadf] select-none text-center'>
                            No Location Found {/* Message when no locations match the input */}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default OriginInput;