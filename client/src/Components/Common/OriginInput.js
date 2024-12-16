import React, { useState, useRef, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const OriginInput = ({ formData, setFormData, locations }) => {
    const [filteredOrigins, setFilteredOrigins] = useState([]);
    const [isOriginListVisible, setIsOriginListVisible] = useState(false);
    const [focused, setFocused] = useState(false);
    const originRef = useRef();

    const toggleOriginList = () => {
        setFocused(true);
        setFilteredOrigins(locations);
        setIsOriginListVisible(true);
    };

    const selectOrigin = (selectedOrigin) => {
        setFormData((prev) => ({ ...prev, origin: selectedOrigin }));
        setFilteredOrigins([]);
        setIsOriginListVisible(false);
    };

    const handleOriginChange = (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, origin: value }));
        setFilteredOrigins(
        value.trim() === ""
            ? locations
            : locations.filter((location) =>
                location.city?.toLowerCase().includes(value.trim().toLowerCase())
            )
        );
        setIsOriginListVisible(true);
    };

    useEffect(() => {
        if (formData.origin) {
            setFocused(true);
        } else {
            setFocused(false);
        }
    }, [formData.origin]);

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
    <div 
        className='relative' 
        ref={originRef}
    >
        <div className="border rounded-xl p-3 flex items-center flex-1">
            <FaMapMarkerAlt className="text-xl" />
            <div className="w-full h-full relative">
                <label
                    htmlFor="origin"
                    className={`absolute left-3 text-sm font-Poppins cursor-text transition-all duration-500 ease-in-out 
                        ${focused
                            ? 'top-[0.1rem] scale-75 -translate-x-3 transform -translate-y-1/2' 
                            : 'top-1/2 transform -translate-y-1/2'
                        }`
                    }
                >
                    From where?
                </label>
                <input
                    type="text"
                    id="origin"
                    value={formData.origin}
                    onFocus={toggleOriginList}
                    onBlur={(e) => !e.target.value && setFocused(false)} // Reset if input is empty
                    onChange={handleOriginChange}
                    className="px-3 pt-2 w-full"
                    autoComplete="off"
                />
            </div>
        </div>

        <div 
            className={`absolute top-16 bg-white max-h-64 overflow-y-auto shadow shadow-gray-300 rounded-lg w-64 transition-all duration-300 ease-in-out z-10
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
                        onClick={() => selectOrigin(location.city)}
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

export default OriginInput;