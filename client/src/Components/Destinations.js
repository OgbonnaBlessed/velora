import { ChevronLeft, ChevronRight } from 'lucide-react' // Import icons for scrolling navigation.
import React, { useEffect, useRef, useState } from 'react' // Import React and necessary hooks.
import { LazyLoadImage } from 'react-lazy-load-image-component'; // Import LazyLoadImage for lazy loading images.
import 'react-lazy-load-image-component/src/effects/blur.css'; // Import blur effect for lazy loading.
import { useNavigate } from 'react-router-dom'; // Import navigation hook for routing.
import { destinations } from '../Data/Locations'; // Import destination data.
import { BlurhashCanvas } from 'react-blurhash'; // Import BlurhashCanvas for displaying placeholders for images.
import dayjs from 'dayjs'; // Import Day.js for date manipulation.

const Destinations = () => {
    const navigate = useNavigate(); // React Router hook for programmatic navigation.
    const [destinationsLoadedImages] = useState({}); // State to track which images have fully loaded.
    const destinationContainerRef = useRef(null); // Reference to the container for scrolling operations.
    const [destinationScroll, setDestinationScroll] = useState({ prev: false, next: true }); // State to manage the visibility of the scroll buttons.

    // Function to handle scroll events and update the scroll button state.
    const handleScroll = (containerRef, setScrollState) => {
        const container = containerRef.current; // Get the current DOM element.
        const maxScrollLeft = container.scrollWidth - container.clientWidth; // Calculate the maximum scroll position.

        // Update the state to show/hide scroll buttons based on the current scroll position.
        setScrollState({
            prev: container.scrollLeft > 0, // Show "previous" button if not at the start.
            next: container.scrollLeft < maxScrollLeft, // Show "next" button if not at the end.
        });
    };

    // Function to scroll the container left or right.
    const scrollContainer = (containerRef, direction) => {
        const container = containerRef.current; // Get the current DOM element.
        const scrollAmount = container.clientWidth * direction; // Determine scroll amount based on the container width and direction.
        container.scrollBy({ left: scrollAmount, behavior: "smooth" }); // Scroll smoothly by the calculated amount.
    };

    // Effect to handle window resizing and initial scroll state setup.
    useEffect(() => {
        const handleResizeAndScroll = () => {
            handleScroll(destinationContainerRef, setDestinationScroll); // Update scroll button state on resize.
        };

        window.addEventListener("resize", handleResizeAndScroll); // Add event listener for window resize.
        handleResizeAndScroll(); // Initial call to set the scroll state.

        return () => {
            window.removeEventListener("resize", handleResizeAndScroll); // Cleanup the event listener on component unmount.
        };
    }, []);

    // Function to navigate to the hotel search page with pre-filled query parameters.
    const navigateToHotelSearch = (location) => {
        navigate('/hotel-search', {
            state: {
                destination: location, // Pass the selected location.
                departureDate: dayjs().format('YYYY-MM-DD'), // Set today's date as the departure date.
                returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'), // Set the return date to 2 days from now.
                adults: 1, // Default number of adults.
                rooms: 1, // Default number of rooms.
            },
        });
    };

    return (
        <div className='destination-outer-container'>
            {/* Header */}
            <h1 className='md:text-3xl text-xl font-bold'>Explore stays in trending destinations</h1>

            {/* "Previous" Scroll Button */}
            {destinationScroll.prev && (
                <div
                    className="change_button before"
                    onClick={() => scrollContainer(destinationContainerRef, -1)} // Scroll left when clicked.
                >
                    <ChevronLeft /> {/* Left arrow icon */}
                </div>
            )}

            {/* Destination Images Container */}
            <div
                className="destination-inner-container"
                ref={destinationContainerRef} // Attach the reference for scroll tracking.
                onScroll={() => handleScroll(destinationContainerRef, setDestinationScroll)} // Update scroll state on scroll.
            >
                {/* Map through the destination data */}
                {destinations.map((destination, i) => (
                    <div
                        key={i}
                        className="destination-container"
                        onClick={() => navigateToHotelSearch(destination.state)} // Navigate to hotel search on click.
                    >
                        <div className='relative w-full h-[60%] bg-[#dbeafe]'>
                            {/* Blurhash Placeholder */}
                            {!destinationsLoadedImages[i] && (
                                <BlurhashCanvas
                                    hash={destination.blurhash} // Placeholder hash.
                                    width={333} // Placeholder width.
                                    height={320} // Placeholder height.
                                    punch={1} // Adjust brightness.
                                    className="absolute inset-0 w-full h-[60%] blurhash-fade"
                                />
                            )}

                            {/* Lazy-loaded Full Image */}
                            <LazyLoadImage
                                src={destination.img} // Image source.
                                alt={destination.name} // Alt text for accessibility.
                                effect="blur" // Blur effect during loading.
                                className={`object-cover transition-all duration-500 ${
                                    destinationsLoadedImages[i] ? 'opacity-100' : 'opacity-0' // Show image once loaded.
                                }`}
                                style={{ width: 333, height: 145 }} // Set image dimensions.
                            />
                        </div>

                        {/* Destination Details */}
                        <div className='flex flex-col gap-1 px-2 font-Grotesk mt-5'>
                            <p>{destination.state}</p> {/* Destination name */}
                            <p>{destination.location}</p> {/* Destination location */}
                        </div>
                    </div>
                ))}
            </div>

            {/* "Next" Scroll Button */}
            {destinationScroll.next && (
                <div
                    className="change_button after"
                    onClick={() => scrollContainer(destinationContainerRef, 1)} // Scroll right when clicked.
                >
                    <ChevronRight /> {/* Right arrow icon */}
                </div>
            )}
        </div>
    );
};

export default Destinations; // Export the component.