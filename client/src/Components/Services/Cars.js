import React, { useEffect, useRef, useState } from 'react'
import RentalCars from '../Cars/RentalCars';  // Importing RentalCars component
import AirportTransportation from '../Cars/AirportTransportation';  // Importing AirportTransportation component

const Cars = () => {
  // State to track the currently visible tab ('rental-cars' or 'airport-transportation')
  const [visible, setVisible] = useState('rental-cars');

  // Refs to keep track of the indicator (underline) and tab container for calculating positions
  const indicatorRef = useRef();
  const tabContainerRef = useRef();

  // Function to switch the tab based on the provided tab name
  const OpenTab = (tabname) => {
    setVisible(tabname);  // Update the visible tab based on user interaction
  }

  // useEffect hook to update the position of the underline indicator when the tab changes
  useEffect(() => {
    // Select all paragraph elements (tabs) within the tab container
    const tabs = tabContainerRef.current?.querySelectorAll('p');

    // Find the active tab based on the current visible state, converting to lowercase and hyphenating
    const activeTab = Array.from(tabs).find(
      (tab) => tab.textContent.toLowerCase().replace(/\s+/g, '-') === visible
    );

    // If an active tab is found and the indicator reference exists, update the indicator's position
    if (activeTab && indicatorRef.current) {
      // Get the position and width of the active tab
      const { offsetLeft, offsetWidth } = activeTab;

      // Set the indicator's width and left offset to match the active tab's size and position
      indicatorRef.current.style.width = `${offsetWidth}px`;
      indicatorRef.current.style.left = `${offsetLeft}px`;
    }
  }, [visible]);  // This effect runs when the 'visible' state changes

  return (
    <div className='p-4 sm:p-6 md:p-8 flex flex-col gap-8 font-Grotesk'>
      <div className='flex flex-col gap-5'>
        <div className='flex sm:items-center gap-5 max-sm:flex-col'>
          {/* Tab Container with event handling for changing tabs */}
          <div 
            className='flex items-center text-[0.915rem] border-b text-nowrap w-fit text-sm font-semibold text-[#000000e3] relative'
            ref={tabContainerRef}
          >
            {/* Rental Cars Tab */}
            <p 
              className="py-2 px-4 cursor-pointer transition-all duration-500 ease-in-out"
              onClick={() => OpenTab('rental-cars')}  // Set the visible tab to 'rental-cars'
            >
              Rental cars
            </p>

            {/* Airport Transportation Tab */}
            <p
              className="py-2 px-4 cursor-pointer transition-all duration-500 ease-in-out"
              onClick={() => OpenTab('airport-transportation')}  // Set the visible tab to 'airport-transportation'
            >
              Airport transportation
            </p>

            {/* Underline Indicator */}
            <div
              ref={indicatorRef}  // Ref to control the position and width of the underline
              className="absolute bottom-0 h-[0.27rem] bg-[#48aadf] rounded-t-full transition-all duration-300 ease-in-out"
            />
          </div>
        </div>

        {/* Render the content of the selected tab */}
        {visible === 'rental-cars' && <RentalCars />}  {/* Display RentalCars component if the 'rental-cars' tab is selected */}
        {visible === 'airport-transportation' && <AirportTransportation />}  {/* Display AirportTransportation component if the 'airport-transportation' tab is selected */}
      </div>
    </div>
  )
}

export default Cars