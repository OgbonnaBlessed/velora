import React, { useEffect, useRef, useState } from 'react'
import { MdArrowDropDown } from 'react-icons/md'
import RoundTrip from '../FlightClass/RoundTrip';
import OneWay from '../FlightClass/OneWay';
import MultiCity from '../FlightClass/MultiCity';

const Flights = () => {
  const [visible, setVisible] = useState('round-trip');
  const [flightClass, setFlightClass] = useState('Economy');
  const [flightClassModal, setFlightClassModal] = useState(false);
  const flightClassModalRef = useRef();
  const indicatorRef = useRef();
  const tabContainerRef = useRef();

  const toggleFlightClassModal = () => {
    setFlightClassModal(!flightClassModal);
  }

  const selectFlightClass = (newClass) => {
    setFlightClass(newClass);
    setFlightClassModal(false);
  }

  const OpenTab = (tabname) => {
    setVisible(tabname);
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

  useEffect(() => {
    const tabs = tabContainerRef.current?.querySelectorAll('p');
    const activeTab = Array.from(tabs).find(tab => tab.textContent.toLowerCase().replace(' ', '-') === visible);

    if (activeTab && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = activeTab;
      indicatorRef.current.style.width = `${offsetWidth}px`;
      indicatorRef.current.style.left = `${offsetLeft}px`;
    }
  }, [visible]);

  return (
    <div className='p-4 sm:p-6 md:p-8 flex flex-col gap-8'>
      <div className='flex flex-col gap-5'>
        <div className='flex sm:items-center gap-5 max-sm:flex-col'>
          <div 
            className='flex items-center text-[0.915rem] border-b text-nowrap w-fit text-sm font-semibold text-[#000000e3] relative font-Grotesk'
            ref={tabContainerRef}
          >
            <p 
              className="py-2 px-4 cursor-pointer transition-all duration-500 ease-in-out"
              onClick={() => OpenTab('round-trip')}
            >
              Round Trip
            </p>
            <p
              className="py-2 px-4 cursor-pointer transition-all duration-500 ease-in-out"
              onClick={() => OpenTab('one-way')}
            >
              One-way
            </p>
            <p
              className="py-2 px-4 cursor-pointer transition-all duration-500 ease-in-out"
              onClick={() => OpenTab('multi-city')}
            >
              Multi-city
            </p>

            {/* Underline Indicator */}
            <div
              ref={indicatorRef}
              className="absolute bottom-0 h-[2px] bg-[#48aadf] rounded-full transition-all duration-300 ease-in-out"
            />
          </div>
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
                className={`bg-white shadow shadow-gray-300 rounded-xl flex flex-col absolute top-[2.8rem] font-serif text-nowrap py-3 transform left-1/2 -translate-x-1/2 text-sm transition-all duration-300 ease-in-out z-20
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
        </div>

        {/* Tab Contents */}
        {visible === 'round-trip' && <RoundTrip />}
        {visible === 'one-way' && <OneWay />}
        {visible === 'multi-city' && <MultiCity />}
      </div>
    </div>
  )
}

export default Flights