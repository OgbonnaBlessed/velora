import React, { useEffect, useRef, useState } from 'react';
import Stays from '../Components/Services/Stays';
import Flights from '../Components/Services/Flights';
import Packages from '../Components/Services/Packages';
import Things from '../Components/Services/Things';
import Cars from '../Components/Services/Cars';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../redux/tab/tabSlice';
import { destinations, explore, favorites } from '../Data/Locations'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BlurhashCanvas } from 'react-blurhash';
import SearchData from '../Components/SearchData';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { throttle } from 'lodash'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { motion } from 'framer-motion';

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const activeTab = useSelector((state) => state.tab.activeTab); // Get the active tab from Redux
  const [favoritesLoadedImages, setFavoritesLoadedImages] = useState({});
  const [destinationsLoadedImages, setDestinationsLoadedImages] = useState({});
  const [exploreLoadedImages, setExploreLoadedImages] = useState({});
  const indicatorRef = useRef();
  const tabContainerRef = useRef();
  const favoriteRef = useRef(null);

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

  const stayContainerRef = useRef(null);
  const destinationContainerRef = useRef(null);
  const exploreContainerRef = useRef(null);

  const [stayScroll, setStayScroll] = useState({ prev: false, next: true });
  const [destinationScroll, setDestinationScroll] = useState({ prev: false, next: true });
  const [exploreScroll, setExploreScroll] = useState({ prev: false, next: true });
  const [activeImages, setActiveImages] = useState(
    explore.map(() => 0) // Initialize an array with 0 for each explore item
  );

  const handleImageChange = (index, direction) => {
    setActiveImages((prev) => {
      const updatedImages = [...prev];
      const totalImages = explore[index].images.length;
  
      // Move index forward or backward and wrap around using modulo
      updatedImages[index] = (updatedImages[index] + direction + totalImages) % totalImages;
  
      return updatedImages;
    });
  };

  const handleScroll = (containerRef, setScrollState) => {
    const container = containerRef.current;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    setScrollState({
      prev: container.scrollLeft > 0,
      next: container.scrollLeft < maxScrollLeft,
    });
  };

  const scrollContainer = (containerRef, direction) => {
    const container = containerRef.current;
    const scrollAmount = container.clientWidth * direction;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    const handleResizeAndScroll = () => {
      handleScroll(stayContainerRef, setStayScroll);
      handleScroll(destinationContainerRef, setDestinationScroll);
      handleScroll(exploreContainerRef, setExploreScroll);
    };

    window.addEventListener("resize", handleResizeAndScroll);
    handleResizeAndScroll();

    return () => {
      window.removeEventListener("resize", handleResizeAndScroll);
    };
  }, []);

  const handleImageLoad = (index, type) => {
    if (type === "favorites") {
      setFavoritesLoadedImages((prev) => ({ ...prev, [index]: true }));
    } else if (type === "destinations") {
      setDestinationsLoadedImages((prev) => ({ ...prev, [index]: true }));
    } else if (type === "explore") {
      setExploreLoadedImages((prev) => ({ ...prev, [index]: true }));
    }
  };

  const navigateToHotelSearch = (location) => {
    navigate('/hotel-search', {
      state: {
        destination: location,
        departureDate: dayjs().format('YYYY-MM-DD'),
        returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
        adults: 1,
        rooms: 1,
      },
    });
  };

  const handleScrollThrottled = throttle(() => {
    handleScroll(stayContainerRef, setStayScroll);
  }, 100); // Adjust delay as needed
  
  useEffect(() => {
    const container = stayContainerRef.current;
    container.addEventListener('scroll', handleScrollThrottled);
  
    return () => {
      container.removeEventListener('scroll', handleScrollThrottled);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: .5,
        ease: "easeInOut"
      }}
      className="flex flex-col gap-16 px-4 sm:px-6 lg:px-20 sm:pt-36 pt-28 pb-10"
    >

      {/* Home Navigation Component */}
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
            className="absolute bottom-0 h-[0.27rem] bg-[#48aadf] rounded-t-full transition-all duration-300 ease-in-out"
          />
        </div>

        {/* Tab Contents */}
        {activeTab === 'stays' && <Stays />}
        {activeTab === 'flights' && <Flights />}
        {activeTab === 'cars' && <Cars />}
        {activeTab === 'packages' && <Packages />}
        {activeTab === 'things-to-do' && <Things />}
      </div>

      {/* Recent Searches */}
      <SearchData/>

      {/* Favorite Stays */}
      <div 
        className='stay-outer-container'
        ref={favoriteRef}
      >
        <h1 className='md:text-3xl text-xl font-bold'>Discover your new favorite stay</h1>

        {/* Previous Icon */}
        {stayScroll.prev && (
          <div
            className="slide_button back"
            onClick={() => scrollContainer(stayContainerRef, -1)}
          >
            <ChevronLeft />
          </div>
        )}

        {/* Images Container */}
        <div 
          className="stay-inner-container"
          ref={stayContainerRef}
          onScroll={() => handleScroll(stayContainerRef, setStayScroll)}
        >
          {favorites.map((favorite, i) => (
            <div
              key={i}
              className="stay-container"
              onClick={() => navigateToHotelSearch(favorite.location)}
            >
              {/* Blurhash Placeholder */}
              {!favoritesLoadedImages[i] && (
                <BlurhashCanvas
                  hash={favorite.blurhash}
                  width={333}
                  height={320}
                  punch={1}
                  className="absolute inset-0 w-full h-full blurhash-fade"
                />
              )}

              {/* Full Image */}
              <LazyLoadImage
                src={favorite.img}
                alt={favorite.name}
                effect="blur"
                className={`object-cover transition-all duration-500 ${
                  favoritesLoadedImages[i] ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ width: 333, height: 320 }}
              />
              <p className="absolute font-semibold bottom-5 left-4 text-white text-shadow-md">
                {favorite.name}
              </p>
            </div>
          ))}
        </div>

        {/* Next Icon */}
        {stayScroll.next && (
          <div
            className="slide_button next"
            onClick={() => scrollContainer(stayContainerRef, 1)}
          >
            <ChevronRight />
          </div>
        )}
      </div>

      {/* Destination Stays */}
      <div className='destination-outer-container'>
        <h1 className='md:text-3xl text-xl font-bold'>Explore stays in trending destinations</h1>

        {/* Previous Icon */}
        {destinationScroll.prev && (
          <div
            className="change_button before"
            onClick={() => scrollContainer(destinationContainerRef, -1)}
          >
            <ChevronLeft />
          </div>
        )}

        {/* Images Container */}
        <div
          className="destination-inner-container"
          ref={destinationContainerRef} 
          onScroll={() => handleScroll(destinationContainerRef, setDestinationScroll)}
        >
          {destinations.map((destination, i) => (
            <div
              key={i}
              className="destination-container"
              onClick={() => navigateToHotelSearch(destination.state)}
            >
              <div className='relative w-full h-[60%] bg-[#dbeafe]'>
                {/* Blurhash Placeholder */}
                {!destinationsLoadedImages[i] && (
                  <BlurhashCanvas
                    hash={destination.blurhash}
                    width={333}
                    height={320}
                    punch={1}
                    className="absolute inset-0 w-full h-[60%] blurhash-fade"
                  />
                )}

                {/* Full Image */}
                <LazyLoadImage
                  src={destination.img}
                  alt={destination.name}
                  effect="blur"
                  className={`object-cover transition-all duration-500 ${
                    destinationsLoadedImages[i] ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ width: 333, height: 145 }}
                />
              </div>

              <div className='flex flex-col gap-1 px-2 font-Grotesk mt-5'>
                <p>
                  {destination.state}
                </p>
                <p>
                  {destination.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Next Icon */}
        {destinationScroll.next && (
          <div
            className="change_button after"
            onClick={() => scrollContainer(destinationContainerRef, 1)}
          >
            <ChevronRight />
          </div>
        )}
      </div>

      {/* Explore Stays */}
      <div className='explore-outer-container'>
        <h1 className='md:text-3xl text-xl font-bold'>Explore these unique stays</h1>

        {/* Previous Icon */}
        {exploreScroll.prev && (
          <div
            className="icon_button former_slide former"
            onClick={() => scrollContainer(exploreContainerRef, -1)}
          >
            <ChevronLeft />
          </div>
        )}

        {/* Images Container */}
        <div
          className="explore-inner-container"
          ref={exploreContainerRef} 
          onScroll={() => handleScroll(exploreContainerRef, setExploreScroll)}
        >
          {explore.map((explore, i) => (
            <div
              key={i}
              className="explore-container flex flex-col gap-5"
            >


              {/* Full Image */}
              <div className='img-box'>
                {/* Blurhash Placeholder */}
                {!exploreLoadedImages[i] && (
                  <BlurhashCanvas
                    hash={explore.blurhash}
                    width={333}
                    height={320}
                    punch={1}
                    className="absolute inset-0 w-full h-full blurhash-fade"
                  />
                )}
                <div 
                  className='angle-left'
                  onClick={() => handleImageChange(i, -1)}
                >
                  <ChevronLeft className='p-0.5'/>
                </div>
                <div
                  className="sliding-container bg-[#dbeafe]"
                  style={{ transform: `translateX(-${activeImages[i] * 100}%)` }}
                >
                  {explore.images.map((image, imgIndex) => (
                    <div 
                      className='img'
                      key={imgIndex}
                    >
                      <LazyLoadImage
                        src={image}
                        alt={`Explore ${imgIndex}`}
                        effect="blur"
                      />
                    </div>
                  ))}
                </div>
                <div 
                  className='angle-right'
                  onClick={() => handleImageChange(i, 1)}
                >
                  <ChevronRight className='p-0.5' />
                </div>
              </div>
              <div 
                className='flex flex-col gap-3 cursor-pointer'
                onClick={() => navigateToHotelSearch(explore.location)}
              >
                <div className='flex flex-col gap-1'>
                  <div className='flex gap-2 items-center text-sm font-semibold'>
                    <div className='bg-blue-600 rounded-[0.25rem] px-2 py-1 text-white font-semibold text-sm'>
                      {explore.rating}
                    </div>
                    <div>
                      {explore.tag}
                    </div>
                    <div>
                      ({explore.count} reviews)
                    </div>
                  </div>
                  <div className='font-serif text-lg'>
                    {explore.name}
                  </div>
                  <div className='text-sm font-serif'>
                    {explore.location}
                  </div>
                </div>
                <div className='flex flex-col gap-1'>
                  <div className='flex gap-2 items-center text-xl font-semibold font-Grotesk'>
                    <div className=''>
                      {explore.newPrice}
                    </div>
                    <div className='text-gray-500 line-through'>
                      {explore.oldPrice}
                    </div>
                  </div>
                  <div className='text-sm font-Grotesk'>
                    {explore.pricePerNight} per night
                  </div>
                  <div className='text-sm font-Grotesk'>
                    {explore.newPrice} total
                  </div>
                  <div className='bg-blue-600 rounded-[0.25rem] px-2 py-1 text-white font-semibold text-sm w-fit'>
                    {explore.discount} off
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next Icon */}
        {exploreScroll.next && (
          <div
            className="icon_button next_slide later"
            onClick={() => scrollContainer(exploreContainerRef, 1)}
          >
            <ChevronRight />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Home;