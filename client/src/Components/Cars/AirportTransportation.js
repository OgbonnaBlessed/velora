// This file isn't completed yet, hence, there isn't detailed comments for it.

import React, { useState } from 'react'; // Import React and useState hook for state management
import AirportToHotel from '../AirportTransport/AirportToHotel'; // Import component for airport to hotel transport
import HotelToAirport from '../AirportTransport/HotelToAirport'; // Import component for hotel to airport transport
import CarRoundTrip from '../AirportTransport/CarRoundTrip'; // Import component for round-trip transport

const AirportTransportation = () => {
    // State to manage which tab is visible (initially set to 'airport-to-hotel')
    const [visible, setVisible] = useState('airport-to-hotel');

    // Function to change the visible tab when a tab is clicked
    const OpenTab = (tabname) => {
        setVisible(tabname); // Update the 'visible' state to the clicked tab's name
    }

    return (
        <div>
            <div className='flex flex-col gap-5'>
                {/* Tab Headers */}
                <div className='flex sm:items-center gap-5 max-sm:flex-col'>
                    {/* The three clickable tab headers */}
                    <div className='grid sm:grid-cols-3 grid-cols-2 items-center gap-3 text-[0.75rem] text-nowrap w-fit text-[#000000e3] relative font-Grotesk font-semibold'>
                        {/* Tab 1: Airport to hotel */}
                        <p 
                            className={`py-2 px-4 w-fit border cursor-pointer rounded-full transition-all duration-500 ease-in-out 
                                ${visible === 'airport-to-hotel' && 'bg-blue-100'}`} // Add bg-blue-100 class if the tab is selected
                            onClick={() => OpenTab('airport-to-hotel')} // Call OpenTab with 'airport-to-hotel' when clicked
                        >
                            Aiport to hotel
                        </p>

                        {/* Tab 2: Hotel to airport */}
                        <p
                            className={`py-2 px-4 w-fit border cursor-pointer rounded-full transition-all duration-500 ease-in-out 
                                ${visible === 'hotel-to-airport' && 'bg-blue-100'}`} // Add bg-blue-100 class if the tab is selected
                            onClick={() => OpenTab('hotel-to-airport')} // Call OpenTab with 'hotel-to-airport' when clicked
                        >
                            Hotel to airport
                        </p>

                        {/* Tab 3: Round trip */}
                        <p
                            className={`py-2 px-4 w-fit border cursor-pointer rounded-full transition-all duration-500 ease-in-out 
                                ${visible === 'round-trip' && 'bg-blue-100'}`} // Add bg-blue-100 class if the tab is selected
                            onClick={() => OpenTab('round-trip')} // Call OpenTab with 'round-trip' when clicked
                        >
                            Round trip
                        </p>
                    </div>
                </div>

                {/* Tab Contents */}
                {/* Render the respective component based on the visible tab */}
                {visible === 'airport-to-hotel' && <AirportToHotel />} {/* Show the AirportToHotel component when 'airport-to-hotel' is selected */}
                {visible === 'hotel-to-airport' && <HotelToAirport />} {/* Show the HotelToAirport component when 'hotel-to-airport' is selected */}
                {visible === 'round-trip' && <CarRoundTrip />} {/* Show the CarRoundTrip component when 'round-trip' is selected */}
            </div>
        </div>
    )
}

export default AirportTransportation; // Export the AirportTransportation component for use in other parts of the application