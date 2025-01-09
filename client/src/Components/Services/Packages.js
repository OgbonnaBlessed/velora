import React, { useEffect, useRef, useState } from 'react'; 
import FlightPackage from '../Packages/FlightPackage'; // Importing the FlightPackage component
import CarPackage from '../Packages/CarPackage'; // Importing the CarPackage component
import StayPackage from '../Packages/StayPackage'; // Importing the StayPackage component
import { Search } from 'lucide-react'; // Importing the Search icon
import { MdArrowDropDown } from 'react-icons/md'; // Importing the down arrow icon

const Packages = () => {
  // State to track if the Stay package is selected
  const [stay, setStay] = useState(false);
  // State to track if the Flight package is selected
  const [flight, setFlight] = useState(false);
  // State to track if the Car package is selected
  const [car, setCar] = useState(false);
  // State for selected flight class, defaults to 'Economy'
  const [flightClass, setFlightClass] = useState('Economy');
  // State to toggle the visibility of the flight class modal
  const [flightClassModal, setFlightClassModal] = useState(false);
  // Reference to handle clicks outside the flight class modal
  const flightClassModalRef = useRef();

  // Function to toggle the visibility of the flight class modal
  const toggleFlightClassModal = () => {
    setFlightClassModal(!flightClassModal);
  };

  // Function to set the selected flight class and close the modal
  const selectFlightClass = (newClass) => {
    setFlightClass(newClass);
    setFlightClassModal(false);
  };

  // Function to handle clicks outside the modal to close it
  const handleOutsideClick = (event) => {
    if (flightClassModalRef.current && !flightClassModalRef.current.contains(event.target)) {
      setFlightClassModal(false);
    }
  };

  // Add event listener for detecting outside clicks to close the modal
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Function to determine and display the appropriate package based on the selections
  const getDisplayedPackage = () => {
    const selected = [stay, flight, car].filter(Boolean).length; // Count how many packages have been selected

    // If fewer than 2 packages are selected, display a message prompting the user to select two or more items
    if (selected < 2) {
      return (
        <p className="flex flex-col gap-1 items-center">
          <Search />
          <p className='font-[500] font-Poppins text-sm'>Please select two or more items</p>
          <p className='text-sm'>To start building your trip, select two or more items</p>
        </p>
      );
    }

    // Display the appropriate package based on the selected combinations
    if (stay && flight && car) {
      return <StayPackage />; // Show StayPackage when all three are selected
    }

    if (stay && flight) {
      return <StayPackage />; // Show StayPackage when only stay and flight are selected
    }

    if (stay && car) {
      return <CarPackage />; // Show CarPackage when only stay and car are selected
    }

    if (flight && car) {
      return <FlightPackage />; // Show FlightPackage when only flight and car are selected
    }

    return null; // If no valid combination, return null
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-8">
      <div className="flex items-center sm:gap-4 gap-3 text-[0.75rem] text-nowrap flex-wrap w-fit text-[#000000e3] relative font-Grotesk font-semibold">
        {/* Stay Package Toggle */}
        <p
          onClick={() => setStay(!stay)} // Toggle stay selection on click
          className={`border rounded-full px-4 py-2 w-fit font-Grotesk cursor-pointer transition-all duration-300 ease-in-out 
            ${stay && 'bg-blue-100'}` // Apply background color if stay is selected
          }
        >
          Stay {stay ? 'added' : ''}
        </p>

        {/* Flight Package Toggle */}
        <p
          onClick={() => setFlight(!flight)} // Toggle flight selection on click
          className={`border rounded-full px-4 py-2 w-fit font-Grotesk cursor-pointer transition-all duration-300 ease-in-out 
            ${flight && 'bg-blue-100'}` // Apply background color if flight is selected
          }
        >
          Flight {flight ? 'added' : ''}
        </p>

        {/* Car Package Toggle */}
        <p
          onClick={() => setCar(!car)} // Toggle car selection on click
          className={`border rounded-full px-4 py-2 w-fit self-baseline max-[400px]:left-0 font-Grotesk cursor-pointer transition-all duration-300 ease-in-out
            ${car && 'bg-blue-100'}` // Apply background color if car is selected
          }
        >
          Car {car ? 'added' : ''}
        </p>

        {/* Flight Class Modal Toggle (Visible when Flight and Stay or Flight and Car are selected) */}
        {((flight && stay) || (flight && car)) &&
          <div 
            className='relative w-fit font-serif'
            ref={flightClassModalRef} // Reference for detecting clicks outside the modal
          >
            <div 
              className='bg-blue-100 border-b-2 border-b-gray-300 px-5 py-2 text-sm cursor-pointer font-[500] text-[#000000e3] flex items-center gap-2 text-nowrap'
              onClick={toggleFlightClassModal} // Toggle flight class modal visibility
            >
              <p>{flightClass}</p> {/* Display the selected flight class */}
              <MdArrowDropDown/> {/* Down arrow icon */}
            </div>

            {/* Flight Class Modal */}
            <div 
              className={`bg-white shadow shadow-gray-300 rounded-xl flex flex-col absolute top-[2.8rem] font-serif font-[400] text-nowrap py-3 transform left-1/2 -translate-x-1/2 text-sm transition-all duration-300 ease-in-out z-20
                ${flightClassModal 
                  ? 'translate-y-0 opacity-1 pointer-events-auto' // Show modal if it's open
                  : '-translate-y-5 opacity-0 pointer-events-none' // Hide modal if it's closed
                }`
              }
            >
              {/* Flight Class Options */}
              <p 
                className='px-5 py-2 text-black hover:bg-gray-100 flex items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out'
                onClick={() => selectFlightClass('Economy')} // Set class to 'Economy'
              >
                Economy
              </p>
              <p
                className='px-5 py-2 hover:bg-gray-100 flex items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out'
                onClick={() => selectFlightClass('Premium economy')} // Set class to 'Premium economy'
              >
                Premium economy
              </p>
              <p
                className='px-5 py-2 hover:bg-gray-100 flex items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out'
                onClick={() => selectFlightClass('First class')} // Set class to 'First class'
              >
                First class
              </p>
              <p
                className='px-5 py-2 hover:bg-gray-100 flex items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out'
                onClick={() => selectFlightClass('Business class')} // Set class to 'Business class'
              >
                Business class
              </p>
            </div>
          </div>
        }
      </div>

      {/* Display the appropriate package based on the user's selections */}
      <div>
        {getDisplayedPackage()}
      </div>
    </div>
  );
};

export default Packages;