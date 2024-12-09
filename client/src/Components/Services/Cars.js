import React, { useEffect, useRef, useState } from 'react'
import RentalCars from '../Cars/RentalCars';
import AirportTransportation from '../Cars/AirportTransportation';

const Cars = () => {
  const [visible, setVisible] = useState('rental-cars');
  const indicatorRef = useRef();
  const tabContainerRef = useRef();

  const OpenTab = (tabname) => {
    setVisible(tabname);
  }

  useEffect(() => {
    const tabs = tabContainerRef.current?.querySelectorAll('p');
    const activeTab = Array.from(tabs).find(
      (tab) => tab.textContent.toLowerCase().replace(/\s+/g, '-') === visible
    );

    if (activeTab && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = activeTab;
      indicatorRef.current.style.width = `${offsetWidth}px`;
      indicatorRef.current.style.left = `${offsetLeft}px`;
    }
  }, [visible]);

  return (
    <div className='p-4 sm:p-6 md:p-8 flex flex-col gap-8 font-Grotesk'>
      <div className='flex flex-col gap-5'>
        <div className='flex sm:items-center gap-5 max-sm:flex-col'>
          <div 
            className='flex items-center text-[0.915rem] border-b text-nowrap w-fit text-sm font-semibold text-[#000000e3] relative'
            ref={tabContainerRef}
          >
            <p 
              className="py-2 px-4 cursor-pointer transition-all duration-500 ease-in-out"
              onClick={() => OpenTab('rental-cars')}
            >
              Rental cars
            </p>
            <p
              className="py-2 px-4 cursor-pointer transition-all duration-500 ease-in-out"
              onClick={() => OpenTab('airport-transportation')}
            >
              Airport transportation
            </p>

            {/* Underline Indicator */}
            <div
              ref={indicatorRef}
              className="absolute bottom-0 h-[2px] bg-[#48aadf] rounded-full transition-all duration-300 ease-in-out"
            />
          </div>
        </div>

        {/* Tab Contents */}
        {visible === 'rental-cars' && <RentalCars />}
        {visible === 'airport-transportation' && <AirportTransportation />}
      </div>
    </div>
  )
}

export default Cars