import React from 'react';
import HotelCard from './Cards/HotelCard';

const HotelList = ({ hotels }) => {
    if (!hotels?.data?.length) {
        return (
            <div className="text-center">
                <p>No hotels found. Please adjust your search criteria.</p>
            </div>
        );
    }
  
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {hotels.data.map((hotel, index) => (
                <HotelCard key={index} hotel={hotel} />
            ))}
        </div>
    );
  };

export default HotelList;