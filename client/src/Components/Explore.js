import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useNavigate } from 'react-router-dom';
import { explore } from '../Data/Locations';
import { BlurhashCanvas } from 'react-blurhash';
import dayjs from 'dayjs';

const Explore = () => {
    const navigate = useNavigate();
    const [exploreLoadedImages] = useState({});
    const exploreContainerRef = useRef(null);
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
            handleScroll(exploreContainerRef, setExploreScroll);
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
    )
}

export default Explore
