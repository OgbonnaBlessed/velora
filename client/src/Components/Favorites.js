import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'; // For lazy loading images
import 'react-lazy-load-image-component/src/effects/blur.css'; // For blur effect while images are loading
import { useNavigate } from 'react-router-dom'; // For navigation between pages
import { favorites } from '../Data/Locations'; // Importing the favorites data from a local file
import { BlurhashCanvas } from 'react-blurhash'; // For rendering a blurhash placeholder before images load
import dayjs from 'dayjs'; // For date manipulation

const Favorites = () => {
    const navigate = useNavigate(); // Use navigate hook to change routes programmatically
    const [favoritesLoadedImages] = useState({}); // State to track loaded images
    const favoriteRef = useRef(null); // Ref for the outer container of the component
    const stayContainerRef = useRef(null); // Ref for the container holding the favorite items
    const [stayScroll, setStayScroll] = useState({ prev: false, next: true }); // State to track the scroll position

    // Function to handle the scroll event and determine whether to show previous/next scroll buttons
    const handleScroll = (containerRef, setScrollState) => {
        const container = containerRef.current;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;

        setScrollState({
            prev: container.scrollLeft > 0, // If the scroll position is greater than 0, show the "previous" button
            next: container.scrollLeft < maxScrollLeft, // If the scroll position is less than the max scroll, show the "next" button
        });
    };

    // Function to scroll the container left or right by one screen width
    const scrollContainer = (containerRef, direction) => {
        const container = containerRef.current;
        const scrollAmount = container.clientWidth * direction; // Determine how much to scroll
        container.scrollBy({ left: scrollAmount, behavior: "smooth" }); // Smooth scrolling
    };
    
    // Effect hook to handle resizing and scrolling
    useEffect(() => {
        const handleResizeAndScroll = () => {
          handleScroll(stayContainerRef, setStayScroll); // Update scroll state on resize
        };
    
        window.addEventListener("resize", handleResizeAndScroll); // Add event listener for window resizing
        handleResizeAndScroll(); // Call on mount to set initial scroll state
    
        return () => {
          window.removeEventListener("resize", handleResizeAndScroll); // Cleanup the event listener on unmount
        };
    }, []);
    
    // Function to navigate to the hotel search page with the selected location and other parameters
    const navigateToHotelSearch = (location) => {
        navigate('/hotel-search', {
            state: {
                destination: location, // Set the destination as the location passed
                departureDate: dayjs().format('YYYY-MM-DD'), // Set today's date as the departure date
                returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'), // Set return date 2 days later
                adults: 1, // Default 1 adult
                rooms: 1, // Default 1 room
            },
        });
    };

    return (
        <div 
            className='stay-outer-container' // Main container for the favorites section
            ref={favoriteRef} // Attach the ref to the outer container
        >
            <h1 className='md:text-3xl text-xl font-bold'>Discover your new favorite stay</h1> {/* Title for the section */}

            {/* Previous Icon - Only visible if the scroll position allows scrolling left */}
            {stayScroll.prev && (
                <div
                    className="slide_button back" // Button to scroll left
                    onClick={() => scrollContainer(stayContainerRef, -1)} // Scroll left
                >
                    <ChevronLeft /> {/* Chevron icon for left scroll */}
                </div>
            )}

            {/* Images Container - Displays all favorite items */}
            <div 
                className="stay-inner-container" // Container holding all favorite items
                ref={stayContainerRef} // Attach the ref for scroll handling
                onScroll={() => handleScroll(stayContainerRef, setStayScroll)} // Call handleScroll on scroll
            >
                {favorites.map((favorite, i) => (
                    <div
                        key={i} // Unique key for each favorite item
                        className="stay-container" // Container for each favorite item
                        onClick={() => navigateToHotelSearch(favorite.location)} // Navigate to hotel search on click
                    >
                        {/* Blurhash Placeholder - Shows a blurred image before the actual image is loaded */}
                        {!favoritesLoadedImages[i] && (
                            <BlurhashCanvas
                                hash={favorite.blurhash} // The blurhash string for the placeholder
                                width={333} // Width of the placeholder
                                height={320} // Height of the placeholder
                                punch={1} // Intensity of the blur effect
                                className="absolute inset-0 w-full h-full blurhash-fade" // Styling for the blurhash canvas
                            />
                        )}

                        {/* Full Image - Lazy loaded image */}
                        <LazyLoadImage
                            src={favorite.img} // Image source
                            alt={favorite.name} // Alt text for the image
                            effect="blur" // Apply a blur effect while loading
                            className={`object-cover transition-all duration-500 ${
                                favoritesLoadedImages[i] ? 'opacity-100' : 'opacity-0'
                            }`} // Transition opacity to make image fade in
                            style={{ width: 333, height: 320 }} // Set dimensions for the image
                        />
                        <p className="absolute font-semibold bottom-5 left-4 text-white text-shadow-md">
                            {favorite.name} {/* Display the name of the favorite stay */}
                        </p>
                    </div>
                ))}
            </div>

            {/* Next Icon - Only visible if the scroll position allows scrolling right */}
            {stayScroll.next && (
                <div
                    className="slide_button next" // Button to scroll right
                    onClick={() => scrollContainer(stayContainerRef, 1)} // Scroll right
                >
                    <ChevronRight /> {/* Chevron icon for right scroll */}
                </div>
            )}
        </div>
    )
}

export default Favorites;