import React, { useEffect, useRef, useState } from 'react' // Importing necessary hooks from React
import { MdArrowDropDown } from 'react-icons/md' // Importing an icon for dropdown from react-icons library
import RoundTrip from '../FlightClass/RoundTrip'; // Importing components for different flight classes
import OneWay from '../FlightClass/OneWay';
import MultiCity from '../FlightClass/MultiCity';

const Flights = () => {
  // State to control which tab is visible
  const [visible, setVisible] = useState('round-trip');
  
  // State to manage the selected flight class (Economy, First class, etc.)
  const [flightClass, setFlightClass] = useState('Economy');
  
  // State to toggle the visibility of the flight class selection modal
  const [flightClassModal, setFlightClassModal] = useState(false);
  
  // Refs for managing DOM elements directly, for handling modal and tab indicator
  const flightClassModalRef = useRef();
  const indicatorRef = useRef();
  const tabContainerRef = useRef();

  // Toggle the visibility of the flight class modal when clicked
  const toggleFlightClassModal = () => {
    setFlightClassModal(!flightClassModal); // Toggle the state between true/false
  }

  // Update the flight class state and close the modal
  const selectFlightClass = (newClass) => {
    setFlightClass(newClass); // Set the selected flight class
    setFlightClassModal(false); // Close the modal once a class is selected
  }

  // Change the active tab based on the tab name passed as an argument
  const OpenTab = (tabname) => {
    setVisible(tabname); // Set the tab to be visible
  }

  // Close the flight class modal if a click occurs outside of it
  const handleOutsideClick = (event) => {
    // Check if the click is outside of the flight class modal
    if (flightClassModalRef.current && !flightClassModalRef.current.contains(event.target)) {
      setFlightClassModal(false); // Close the modal if outside click
    }
  };

  // Listen for outside clicks and handle the modal visibility
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick); // Event listener for detecting outside clicks
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick); // Cleanup the event listener on unmount
    };
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  // Update the indicator position and size when the 'visible' tab changes
  useEffect(() => {
    const tabs = tabContainerRef.current?.querySelectorAll('p'); // Get all the <p> elements inside the tab container
    const activeTab = Array.from(tabs).find(tab => tab.textContent.toLowerCase().replace(' ', '-') === visible); // Find the active tab based on the 'visible' state

    if (activeTab && indicatorRef.current) {
      // Get the position and width of the active tab
      const { offsetLeft, offsetWidth } = activeTab;
      // Set the width and position of the indicator (underline) to match the active tab
      indicatorRef.current.style.width = `${offsetWidth}px`;
      indicatorRef.current.style.left = `${offsetLeft}px`;
    }
  }, [visible]); // Re-run this effect whenever the 'visible' state changes

  return (
    <div className='p-4 sm:p-6 md:p-8 flex flex-col gap-8'> {/* Main container for the page */}
      <div className='flex flex-col gap-5'> {/* Inner container for the flight selection */}
        <div className='flex sm:items-center gap-5 max-sm:flex-col'> {/* Tab container */}
          <div 
            className='flex items-center text-[0.915rem] border-b text-nowrap w-fit text-sm font-semibold text-[#000000e3] relative font-Grotesk'
            ref={tabContainerRef}
          >
            {/* Tab for Round Trip */}
            <p 
              className="py-2 px-4 cursor-pointer transition-all duration-500 ease-in-out"
              onClick={() => OpenTab('round-trip')}
            >
              Round Trip
            </p>
            
            {/* Tab for One-way flight */}
            <p
              className="py-2 px-4 cursor-pointer transition-all duration-500 ease-in-out"
              onClick={() => OpenTab('one-way')}
            >
              One-way
            </p>
            
            {/* Tab for Multi-city flight */}
            <p
              className="py-2 px-4 cursor-pointer transition-all duration-500 ease-in-out"
              onClick={() => OpenTab('multi-city')}
            >
              Multi-city
            </p>

            {/* Underline Indicator */}
            <div
              ref={indicatorRef}
              className="absolute bottom-0 h-[0.27rem] bg-[#48aadf] rounded-t-full transition-all duration-300 ease-in-out"
            />
          </div>
          
          {/* Flight Class Dropdown */}
          <div 
            className='relative w-fit font-serif'
            ref={flightClassModalRef}
          >
            <div 
              className='bg-blue-100 border-b-2 border-b-gray-300 px-5 py-2 text-sm cursor-pointer font-[500] text-[#000000e3] flex items-center gap-2 text-nowrap'
              onClick={toggleFlightClassModal} // Toggle modal visibility when clicked
            >
              <p>{flightClass}</p> {/* Display the current flight class */}
              <MdArrowDropDown/> {/* Dropdown arrow icon */}
            </div>
            {/* Flight Class Modal */}
            <div 
              className={`bg-white shadow shadow-gray-300 rounded-xl flex flex-col absolute top-[2.8rem] font-serif text-nowrap py-3 transform left-1/2 -translate-x-1/2 text-sm transition-all duration-300 ease-in-out z-20
                ${flightClassModal 
                  ? 'translate-y-0 opacity-1 pointer-events-auto' // Modal visible
                  : '-translate-y-5 opacity-0 pointer-events-none' // Modal hidden
                }`
              }
            >
              {/* Each option for selecting a flight class */}
              <p 
                className='px-5 py-2 text-black hover:bg-gray-100 flex items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out'
                onClick={() => selectFlightClass('Economy')} // Select Economy class
              >
                Economy
              </p>
              <p
                className='px-5 py-2 hover:bg-gray-100 flex items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out'
                onClick={() => selectFlightClass('Premium economy')} // Select Premium economy class
              >
                Premium economy
              </p>
              <p
                className='px-5 py-2 hover:bg-gray-100 flex items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out'
                onClick={() => selectFlightClass('First class')} // Select First class
              >
                First class
              </p>
              <p
                className='px-5 py-2 hover:bg-gray-100 flex items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out'
                onClick={() => selectFlightClass('Business class')} // Select Business class
              >
                Business class
              </p>
            </div>
          </div>
        </div>

        {/* Tab Contents */}
        {/* Render content based on the active tab */}
        {visible === 'round-trip' && <RoundTrip />} {/* Round Trip content */}
        {visible === 'one-way' && <OneWay />} {/* One-way content */}
        {visible === 'multi-city' && <MultiCity />} {/* Multi-city content */}
      </div>
    </div>
  )
}

export default Flights;