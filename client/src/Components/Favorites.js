import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useNavigate } from 'react-router-dom';
import { favorites } from '../Data/Locations';
import { BlurhashCanvas } from 'react-blurhash';
import dayjs from 'dayjs';

const Favorites = () => {
    const navigate = useNavigate()
    const [favoritesLoadedImages] = useState({});
    const favoriteRef = useRef(null);
    const stayContainerRef = useRef(null);
    const [stayScroll, setStayScroll] = useState({ prev: false, next: true });

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
    )
}

export default Favorites
