import React, { useState, useRef, useEffect } from 'react'; // Importing React hooks (useState, useRef, useEffect) for state management, DOM referencing, and lifecycle handling
import { FaMapMarkerAlt } from 'react-icons/fa'; // Importing the map marker icon from react-icons

// The HotelInput component allows users to input and select a destination
const HotelInput = ({ formData, setFormData, hotels, label }) => {
    // State variables for filtered destinations, visibility of the dropdown, and whether the input is focused
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [isDestinationListVisible, setIsDestinationListVisible] = useState(false);
    const [inputValue, setInputValue] = useState(''); // To store and display the hotel name
    const [focused, setFocused] = useState(false);
    
    // Ref to keep track of the destination input field to detect outside clicks
    const destinationRef = useRef();

    // useEffect hook to set the default destination value in the input field
    useEffect(() => {
        const defaultCity = formData.destination; // Get the default destination city from formData
        if (defaultCity && hotels.length) { // Check if there is a default city and hotels data is present
            const defaultHotel = hotels.find(hotel => hotel.city.toLowerCase() === defaultCity.toLowerCase()); // Find the default hotel
            if (defaultHotel) { // If the default hotel is found
                setInputValue(`${defaultHotel.name}, ${defaultHotel.city}`); // Display the hotel name in the input field
                setFormData(prev => ({ ...prev, destination: defaultHotel.city })); // Update the form data with the default destination
            }
        }
    }, [setFormData, hotels, formData.destination]); // Run the effect when formData.destination changes

    // Function to toggle the visibility of the destination list and sort locations
    const toggleDestinationList = () => {
        setFocused(true); // Set input to focused when user starts typing
        const sortedLocations = [...hotels].sort((a, b) =>
            a.name.localeCompare(b.name) // Sort locations alphabetically by city name
        );
        setFilteredDestinations(sortedLocations); // Set the sorted list of locations to be filtered
        setIsDestinationListVisible(true); // Show the destination list dropdown
    };

    // Function to handle selecting a destination from the list
    const selectDestination = (selectedDestination) => {
        setInputValue(`${selectedDestination.name}, ${selectedDestination.city}`); // Display airport name in input
        setFormData((prev) => ({ ...prev, destination: selectedDestination.city })); // Update form data with the selected destination
        setFilteredDestinations([]); // Clear the filtered destination list after selection
        setIsDestinationListVisible(false); // Hide the destination list after selection
    };

    // Function to handle changes in the destination input field
    const handleDestinationChange = (e) => {
        const value = e.target.value; // Get the current value of the input field
        setInputValue(value);
        const sortedLocations = [...hotels].sort((a, b) =>
            a.name.localeCompare(b.name) // Sort locations alphabetically by city name
        );
        setFilteredDestinations(
            value.trim() === "" // If input is empty, show all locations
                ? sortedLocations
                : sortedLocations.filter((location) =>  // Filter locations based on input value
                    location.name?.toLowerCase().includes(value.trim().toLowerCase()) // Case-insensitive filter for city names
                )
        );
        setIsDestinationListVisible(true); // Show the destination list dropdown while typing
    };

    // useEffect hook to focus the label when there's a destination value in the formData
    useEffect(() => {
        if (formData.destination) {
            setFocused(true); // Set input as focused if there is a destination in formData
        } else {
            setFocused(false); // Remove focus styling if no destination is present
        }
    }, [formData.destination]); // Effect runs when formData.destination changes

    // Function to handle outside clicks, hiding the destination list if clicked outside the input
    const handleOutsideClick = (event) => {
        if (destinationRef.current && !destinationRef.current.contains(event.target)) {
            setIsDestinationListVisible(false); // Hide the dropdown if clicked outside
        }
    };

    // useEffect hook to add and remove the event listener for detecting outside clicks
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick); // Listen for mouse clicks outside the component
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick); // Clean up event listener on component unmount
        };
    }, []); // This effect only runs once when the component is mounted

    return (
        <div className='relative' ref={destinationRef}> {/* Wrapper div for the input and dropdown */}
            {/* Main input field with map marker icon */}
            <div className="border rounded-xl p-3 flex items-center gap-3 flex-1">
                <FaMapMarkerAlt className="text-xl" /> {/* Map marker icon */}
                <div className="w-full h-full relative">
                    {/* Label for the destination input with dynamic positioning based on focus */}
                    <label
                        htmlFor="destination"
                        className={`absolute left-0 text-sm font-Poppins cursor-text transition-all duration-500 ease-in-out 
                            ${focused
                                ? '-top-1 scale-90 text-xs origin-left' // Focused state
                                : 'top-1/2 transform -translate-y-1/2 text-base' // Unfocused state
                            }`
                        }
                    >
                        {label} {/* Label text */}
                    </label>
                    {/* Destination input field */}
                    <input
                        type="text"
                        id="destination"
                        value={inputValue} // Controlled input value from formData
                        onFocus={toggleDestinationList} // Show the list when input is focused
                        onBlur={(e) => !e.target.value && setFocused(false)} // Remove focus if input is empty on blur
                        onChange={handleDestinationChange} // Handle changes in input field
                        className="pt-2 w-full bg-transparent font-sans font-normal" // Styling for the input field
                        autoComplete="off" // Disable browser autocomplete
                    />
                </div>
            </div>

            {/* Destination list dropdown */}
            <div 
                className={`absolute top-16 bg-white max-h-64 overflow-y-auto shadow shadow-gray-300 rounded-lg w-64 transition-all duration-300 ease-in-out z-20 font-Roboto
                    ${isDestinationListVisible 
                        ? 'translate-y-0 pointer-events-auto opacity-1' // Visible state of the list
                        : '-translate-y-5 pointer-events-none opacity-0' // Hidden state of the list
                    }`
                }
            >
                <ul>
                    {filteredDestinations.length > 0 
                        ? (filteredDestinations.map((location, index) => (
                        <li
                            key={index}
                            onClick={() => selectDestination(location)} // Select destination on click
                            className="cursor-pointer hover:bg-gray-200 px-3 py-2"
                        >
                            {location.name}, {location.city} {/* Display location city name */}
                        </li>
                        )))
                        : (
                        <li className='px-3 py-2 text-[#48aadf] select-none text-center'>
                            No Location Found {/* Message when no locations match */}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default HotelInput; // Exporting the component for use in other parts of the application