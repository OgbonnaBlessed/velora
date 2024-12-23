import React, { useEffect, useRef, useState } from 'react';
import FlightPackage from '../Packages/FlightPackage';
import CarPackage from '../Packages/CarPackage';
import StayPackage from '../Packages/StayPackage';
import { Search } from 'lucide-react'
import { MdArrowDropDown } from 'react-icons/md'

const Packages = () => {
  const [stay, setStay] = useState(false);
  const [flight, setFlight] = useState(false);
  const [car, setCar] = useState(false);
  const [flightClass, setFlightClass] = useState('Economy');
  const [flightClassModal, setFlightClassModal] = useState(false);
  const flightClassModalRef = useRef();

  const toggleFlightClassModal = () => {
    setFlightClassModal(!flightClassModal);
  }

  const selectFlightClass = (newClass) => {
    setFlightClass(newClass);
    setFlightClassModal(false);
  }

  const handleOutsideClick = (event) => {
    if (flightClassModalRef.current && !flightClassModalRef.current.contains(event.target)) {
      setFlightClassModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Determine which package components to display
  const getDisplayedPackage = () => {
    const selected = [stay, flight, car].filter(Boolean).length;

    if (selected < 2) {
      return (
        <p className="flex flex-col gap-1 items-center">
          <Search/>
          <p className='font-[500] font-Poppins text-sm'>Please select two or more items</p>
          <p className='text-sm'>To start building your trip, select two or more items</p>
        </p>
      )
    }

    if (stay && flight && car) {
      return <StayPackage />; // Show StayPackage when all three are selected
    }

    if (stay && flight) {
      return <StayPackage />; // Show FlightPackage when stay and flight are selected
    }

    if (stay && car) {
      return <CarPackage />; // Show CarPackage when stay and car are selected
    }

    if (flight && car) {
      return <FlightPackage />; // Show FlightPackage when flight and car are selected
    }

    return null;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-8">
      <div className="flex items-center sm:gap-4 gap-3 text-[0.75rem] text-nowrap flex-wrap w-fit text-[#000000e3] relative font-Grotesk font-semibold">
        <p
          onClick={() => setStay(!stay)}
          className={`border rounded-full px-4 py-2 w-fit font-Grotesk cursor-pointer transition-all duration-300 ease-in-out 
            ${stay && 'bg-blue-100'}`
          }
        >
          Stay {stay ? 'added' : ''}
        </p>

        <p
          onClick={() => setFlight(!flight)}
          className={`border rounded-full px-4 py-2 w-fit font-Grotesk cursor-pointer transition-all duration-300 ease-in-out 
            ${flight && 'bg-blue-100'}`
          }
        >
          Flight {flight ? 'added' : ''}
        </p>

        <p
          onClick={() => setCar(!car)}
          className={`border rounded-full px-4 py-2 w-fit self-baseline max-[400px]:left-0 font-Grotesk cursor-pointer transition-all duration-300 ease-in-out
            ${car && 'bg-blue-100'}`
          }
        >
          Car {car ? 'added' : ''}
        </p>

        {((flight && stay) || (flight && car)) &&
          <div 
            className='relative w-fit font-serif'
            ref={flightClassModalRef}
          >
            <div 
              className='bg-blue-100 border-b-2 border-b-gray-300 px-5 py-2 text-sm cursor-pointer font-[500] text-[#000000e3] flex items-center gap-2 text-nowrap'
              onClick={toggleFlightClassModal}
            >
              <p>{flightClass}</p>
              <MdArrowDropDown/>
            </div>
              <div 
                className={`bg-white shadow shadow-gray-300 rounded-xl flex flex-col absolute top-[2.8rem] font-serif font-[400] text-nowrap py-3 transform left-1/2 -translate-x-1/2 text-sm transition-all duration-300 ease-in-out z-20
                  ${flightClassModal 
                    ? 'translate-y-0 opacity-1 pointer-events-auto' 
                    : '-translate-y-5 opacity-0 pointer-events-none'}`
                  }
              >
                <p 
                  className='px-5 py-2 text-black hover:bg-gray-100 flex items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out'
                  onClick={() => selectFlightClass('Economy')}
                >
                  Economy
                </p>
                <p
                  className='px-5 py-2 hover:bg-gray-100 flex items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out'
                  onClick={() => selectFlightClass('Premium economy')}
                >
                  Premium economy
                </p>
                <p
                  className='px-5 py-2 hover:bg-gray-100 flex items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out'
                  onClick={() => selectFlightClass('First class')}
                >
                  First class
                </p>
                <p
                  className='px-5 py-2 hover:bg-gray-100 flex items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out'
                  onClick={() => selectFlightClass('Business class')}
                >
                  Business class
                </p>
              </div>
          </div>
        }
      </div>

      <div>
        {getDisplayedPackage()}
      </div>
    </div>
  );
};

export default Packages;