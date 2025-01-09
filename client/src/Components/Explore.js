// Importing necessary components and libraries
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Icons for navigation
import React, { useEffect, useRef, useState } from 'react'; // React hooks for managing state and effects
import { LazyLoadImage } from 'react-lazy-load-image-component'; // Component for lazy-loading images
import 'react-lazy-load-image-component/src/effects/blur.css'; // Blur effect for lazy-loaded images
import { useNavigate } from 'react-router-dom'; // Hook for programmatic navigation
import { explore } from '../Data/Locations'; // Data source containing location information
import { BlurhashCanvas } from 'react-blurhash'; // Component for rendering placeholder while images load
import dayjs from 'dayjs'; // Library for handling dates

const Explore = () => {
    const navigate = useNavigate(); // Hook to navigate between routes
    const [exploreLoadedImages] = useState({}); // State to track loaded images
    const exploreContainerRef = useRef(null); // Ref to access the scrollable container
    const [exploreScroll, setExploreScroll] = useState({ prev: false, next: true }); // State to manage scroll navigation buttons

    const [activeImages, setActiveImages] = useState(
        explore.map(() => 0) // Initialize an array with 0 for each explore item
    );

    // Function to handle image change for the sliding container
    const handleImageChange = (index, direction) => {
        setActiveImages((prev) => {
            const updatedImages = [...prev];
            const totalImages = explore[index].images.length;

            // Move index forward or backward and wrap around using modulo
            updatedImages[index] = (updatedImages[index] + direction + totalImages) % totalImages;

            return updatedImages;
        });
    };

    // Function to handle scroll state (previous/next buttons visibility)
    const handleScroll = (containerRef, setScrollState) => {
        const container = containerRef.current; // Access the container using ref
        const maxScrollLeft = container.scrollWidth - container.clientWidth; // Maximum scrollable distance

        setScrollState({
            prev: container.scrollLeft > 0, // Show 'prev' button if scrolled right
            next: container.scrollLeft < maxScrollLeft, // Show 'next' button if scrollable content remains
        });
    };

    // Function to scroll the container by a certain amount
    const scrollContainer = (containerRef, direction) => {
        const container = containerRef.current;
        const scrollAmount = container.clientWidth * direction; // Scroll by the width of the container
        container.scrollBy({ left: scrollAmount, behavior: "smooth" }); // Smooth scrolling
    };

    // Effect to handle scroll state changes on resize and initial render
    useEffect(() => {
        const handleResizeAndScroll = () => {
            handleScroll(exploreContainerRef, setExploreScroll);
        };

        window.addEventListener("resize", handleResizeAndScroll); // Update on window resize
        handleResizeAndScroll(); // Initial call on render

        return () => {
            window.removeEventListener("resize", handleResizeAndScroll); // Cleanup event listener
        };
    }, []);

    // Function to navigate to the hotel search page with selected location details
    const navigateToHotelSearch = (location) => {
        navigate('/hotel-search', {
            state: {
                destination: location, // Pass location as destination
                departureDate: dayjs().format('YYYY-MM-DD'), // Today's date as departure date
                returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'), // Two days later as return date
                adults: 1, // Default number of adults
                rooms: 1, // Default number of rooms
            },
        });
    };

    return (
        <div className='explore-outer-container'>
            {/* Section Header */}
            <h1 className='md:text-3xl text-xl font-bold'>Explore these unique stays</h1>

            {/* Previous Icon - Visible only if scrolling backward is possible */}
            {exploreScroll.prev && (
                <div
                    className="icon_button former_slide former"
                    onClick={() => scrollContainer(exploreContainerRef, -1)} // Scroll left
                >
                    <ChevronLeft />
                </div>
            )}

            {/* Images Container */}
            <div
                className="explore-inner-container"
                ref={exploreContainerRef} // Reference to this container
                onScroll={() => handleScroll(exploreContainerRef, setExploreScroll)} // Update scroll state on scroll
            >
                {explore.map((explore, i) => (
                    <div
                        key={i}
                        className="explore-container flex flex-col gap-5"
                    >
                        {/* Full Image Section */}
                        <div className='img-box'>
                            {/* Blurhash Placeholder for loading effect */}
                            {!exploreLoadedImages[i] && (
                                <BlurhashCanvas
                                    hash={explore.blurhash}
                                    width={333}
                                    height={320}
                                    punch={1}
                                    className="absolute inset-0 w-full h-full blurhash-fade"
                                />
                            )}

                            {/* Left Navigation for Sliding Images */}
                            <div
                                className='angle-left'
                                onClick={() => handleImageChange(i, -1)} // Navigate to the previous image
                            >
                                <ChevronLeft className='p-0.5' />
                            </div>

                            {/* Sliding Images Container */}
                            <div
                                className="sliding-container bg-[#dbeafe]"
                                style={{ transform: `translateX(-${activeImages[i] * 100}%)` }} // Slide based on active image index
                            >
                                {explore.images.map((image, imgIndex) => (
                                    <div
                                        className='img'
                                        key={imgIndex}
                                    >
                                        {/* Lazy Load Images */}
                                        <LazyLoadImage
                                            src={image}
                                            alt={`Explore ${imgIndex}`}
                                            effect="blur" // Blur effect while loading
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Right Navigation for Sliding Images */}
                            <div
                                className='angle-right'
                                onClick={() => handleImageChange(i, 1)} // Navigate to the next image
                            >
                                <ChevronRight className='p-0.5' />
                            </div>
                        </div>

                        {/* Location Details */}
                        <div
                            className='flex flex-col gap-3 cursor-pointer'
                            onClick={() => navigateToHotelSearch(explore.location)} // Navigate to hotel search on click
                        >
                            <div className='flex flex-col gap-1'>
                                {/* Rating and Reviews */}
                                <div className='flex gap-2 items-center text-sm font-semibold'>
                                    <div className='bg-blue-600 rounded-[0.25rem] px-2 py-1 text-white font-semibold text-sm'>
                                        {explore.rating}
                                    </div>
                                    <div>{explore.tag}</div>
                                    <div>({explore.count} reviews)</div>
                                </div>

                                {/* Explore Name and Location */}
                                <div className='font-serif text-lg'>{explore.name}</div>
                                <div className='text-sm font-serif'>{explore.location}</div>
                            </div>

                            {/* Pricing and Discounts */}
                            <div className='flex flex-col gap-1'>
                                <div className='flex gap-2 items-center text-xl font-semibold font-Grotesk'>
                                    <div>{explore.newPrice}</div>
                                    <div className='text-gray-500 line-through'>{explore.oldPrice}</div>
                                </div>
                                <div className='text-sm font-Grotesk'>{explore.pricePerNight} per night</div>
                                <div className='text-sm font-Grotesk'>{explore.newPrice} total</div>
                                <div className='bg-blue-600 rounded-[0.25rem] px-2 py-1 text-white font-semibold text-sm w-fit'>
                                    {explore.discount} off
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Next Icon - Visible only if scrolling forward is possible */}
            {exploreScroll.next && (
                <div
                    className="icon_button next_slide later"
                    onClick={() => scrollContainer(exploreContainerRef, 1)} // Scroll right
                >
                    <ChevronRight />
                </div>
            )}
        </div>
    );
};

export default Explore;