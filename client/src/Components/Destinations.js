import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useNavigate } from 'react-router-dom';
import { destinations } from '../Data/Locations';
import { BlurhashCanvas } from 'react-blurhash';
import dayjs from 'dayjs';

const Destinations = () => {
    const navigate = useNavigate()
    const [destinationsLoadedImages] = useState({});
    const destinationContainerRef = useRef(null);
    const [destinationScroll, setDestinationScroll] = useState({ prev: false, next: true });
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
          handleScroll(destinationContainerRef, setDestinationScroll);
        };
    
        window.addEventListener("resize", handleResizeAndScroll);
        handleResizeAndScroll();
    
        return () => {
          window.removeEventListener("resize", handleResizeAndScroll);
        };
    }, []);
    
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

    return (
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
    )
}

export default Destinations
