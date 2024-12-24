import React, { useEffect, useRef, useState } from 'react';
import Stays from '../Components/Services/Stays';
import Flights from '../Components/Services/Flights';
import Packages from '../Components/Services/Packages';
import Things from '../Components/Services/Things';
import Cars from '../Components/Services/Cars';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../redux/tab/tabSlice';

const Home = () => {
  const dispatch = useDispatch()
  const activeTab = useSelector((state) => state.tab.activeTab); // Get the active tab from Redux
  const indicatorRef = useRef();
  const tabContainerRef = useRef();

  const OpenTab = (tabName) => {
    dispatch(setActiveTab(tabName.toLowerCase().replace(/\s+/g, "-")));
  };

  useEffect(() => {
    const tabs = tabContainerRef.current?.querySelectorAll("p");
    const activeTabElement = Array.from(tabs).find(
      (tab) =>
        tab.textContent.toLowerCase().replace(/\s+/g, "-") === activeTab
    );

    if (activeTabElement && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      indicatorRef.current.style.width = `${offsetWidth}px`;
      indicatorRef.current.style.left = `${offsetLeft}px`;
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-5 px-4 sm:px-6 lg:px-20 pt-36 pb-10">
      <div className="border rounded-2xl w-full">
        <div
          className="flex justify-center items-center border-b text-nowrap overflow-x-auto remove-scroll-bar font-semibold text-[#000000e3] text-[0.9rem] relative font-Grotesk"
          ref={tabContainerRef}
        >
          <p
            className="py-3 px-4 cursor-pointer transition-all duration-500 ease-in-out max-[500px]:ml-20 max-[400px]:ml-32"
            onClick={() => OpenTab('Stays')}
          >
            Stays
          </p>
          <p
            className="py-3 px-4 cursor-pointer transition-all duration-500 ease-in-out"
            onClick={() => OpenTab('Flights')}
          >
            Flights
          </p>
          <p
            className="py-3 px-4 cursor-pointer transition-all duration-500 ease-in-out"
            onClick={() => OpenTab('Cars')}
          >
            Cars
          </p>
          <p
            className="py-3 px-4 cursor-pointer transition-all duration-500 ease-in-out"
            onClick={() => OpenTab('Packages')}
          >
            Packages
          </p>
          <p
            className="py-3 px-4 cursor-pointer transition-all duration-500 ease-in-out max-[500px]:mr-5"
            onClick={() => OpenTab('Things to do')}
          >
            Things to do
          </p>

          {/* Underline Indicator */}
          <div
            ref={indicatorRef}
            className="absolute bottom-0 h-[2px] bg-[#48aadf] rounded-full transition-all duration-300 ease-in-out"
          />
        </div>

        {/* Tab Contents */}
        {activeTab === 'stays' && <Stays />}
        {activeTab === 'flights' && <Flights />}
        {activeTab === 'cars' && <Cars />}
        {activeTab === 'packages' && <Packages />}
        {activeTab === 'things-to-do' && <Things />}
      </div>
    </div>
  );
};

export default Home;