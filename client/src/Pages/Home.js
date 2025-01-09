import React, { useEffect, useRef } from 'react';
import Stays from '../Components/Services/Stays'; // Import Stays component
import Flights from '../Components/Services/Flights'; // Import Flights component
import Packages from '../Components/Services/Packages'; // Import Packages component
import Things from '../Components/Services/Things'; // Import Things to do component
import Cars from '../Components/Services/Cars'; // Import Cars component
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks for state management
import { setActiveTab } from '../redux/tab/tabSlice'; // Action to set active tab in Redux state
import SearchData from '../Components/SearchData'; // Import recent search data component
import 'react-lazy-load-image-component/src/effects/blur.css'; // Lazy loading effect
import { motion } from 'framer-motion'; // Import framer-motion for animations
import Favorites from '../Components/Favorites'; // Import Favorites component
import Destinations from '../Components/Destinations'; // Import Destinations component
import Explore from '../Components/Explore'; // Import Explore component

const Home = () => {
  // Dispatch and state hooks for Redux state management
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tab.activeTab); // Get the active tab from Redux state
  const indicatorRef = useRef(); // Reference for the indicator that moves under active tab
  const tabContainerRef = useRef(); // Reference for the tab container to track tab changes

  // Function to handle tab changes
  const OpenTab = (tabName) => {
    // Dispatch the active tab change with the tab name (transformed into lowercase and hyphenated)
    dispatch(setActiveTab(tabName.toLowerCase().replace(/\s+/g, "-")));
  };

  // useEffect hook to adjust the position and width of the indicator when the active tab changes
  useEffect(() => {
    const tabs = tabContainerRef.current?.querySelectorAll("p"); // Get all tab elements
    const activeTabElement = Array.from(tabs).find(
      (tab) =>
        tab.textContent.toLowerCase().replace(/\s+/g, "-") === activeTab // Find the active tab based on its name
    );

    // If the active tab element and indicator ref exist, adjust the indicator's position and width
    if (activeTabElement && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = activeTabElement; // Get the position and width of the active tab
      indicatorRef.current.style.width = `${offsetWidth}px`; // Set indicator width
      indicatorRef.current.style.left = `${offsetLeft}px`; // Set indicator position
    }
  }, [activeTab]); // Re-run the effect whenever the active tab changes

  return (
    <motion.div 
      initial={{ opacity: 0 }} // Initial opacity for fade-in effect
      animate={{ opacity: 1 }} // Final opacity for fade-in effect
      exit={{ opacity: 0 }} // Exit opacity for fade-out effect
      transition={{
        duration: .5, // Transition duration for fade effect
        ease: "easeInOut" // Ease-in and ease-out transition
      }}
      className="flex flex-col gap-16 px-4 sm:px-6 lg:px-20 sm:pt-36 pt-28 pb-10 bg-white"
    >

      {/* Home Navigation Component: Tabs for switching between services */}
      <div className="border rounded-2xl w-full">
        <div
          className="flex justify-center items-center border-b text-nowrap overflow-x-auto remove-scroll-bar font-semibold text-[#000000e3] text-[0.9rem] relative font-Grotesk"
          ref={tabContainerRef} // Reference to the tab container
        >
          {/* Tab buttons for different services */}
          <p
            className="py-3 px-4 cursor-pointer transition-all duration-500 ease-in-out max-[500px]:ml-20 max-[400px]:ml-32"
            onClick={() => OpenTab('Stays')} // Switch to 'Stays' tab
          >
            Stays
          </p>
          <p
            className="py-3 px-4 cursor-pointer transition-all duration-500 ease-in-out"
            onClick={() => OpenTab('Flights')} // Switch to 'Flights' tab
          >
            Flights
          </p>
          <p
            className="py-3 px-4 cursor-pointer transition-all duration-500 ease-in-out"
            onClick={() => OpenTab('Cars')} // Switch to 'Cars' tab
          >
            Cars
          </p>
          <p
            className="py-3 px-4 cursor-pointer transition-all duration-500 ease-in-out"
            onClick={() => OpenTab('Packages')} // Switch to 'Packages' tab
          >
            Packages
          </p>
          <p
            className="py-3 px-4 cursor-pointer transition-all duration-500 ease-in-out max-[500px]:mr-5"
            onClick={() => OpenTab('Things to do')} // Switch to 'Things to do' tab
          >
            Things to do
          </p>

          {/* Underline indicator to show the active tab */}
          <div
            ref={indicatorRef} // Reference for the underline indicator
            className="absolute bottom-0 h-[0.27rem] bg-[#48aadf] rounded-t-full transition-all duration-300 ease-in-out"
          />
        </div>

        {/* Tab Contents: Render content based on the active tab */}
        {activeTab === 'stays' && <Stays />} {/* Show Stays content when 'Stays' tab is active */}
        {activeTab === 'flights' && <Flights />} {/* Show Flights content when 'Flights' tab is active */}
        {activeTab === 'cars' && <Cars />} {/* Show Cars content when 'Cars' tab is active */}
        {activeTab === 'packages' && <Packages />} {/* Show Packages content when 'Packages' tab is active */}
        {activeTab === 'things-to-do' && <Things />} {/* Show Things to do content when 'Things to do' tab is active */}
      </div>

      {/* Recent Searches: Component for displaying recent search data */}
      <SearchData/>

      {/* Favorite Stays: Component for displaying favorite stays */}
      <Favorites/>

      {/* Destination Stays: Component for displaying destination-based stays */}
      <Destinations/>

      {/* Explore Stays: Component for exploring different stays */}
      <Explore/>

    </motion.div>
  );
};

export default Home;