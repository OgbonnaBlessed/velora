import React from 'react';
import Filters from './Filters';
import FlightCard from './Cards/FlightCard';
import { Search } from 'lucide-react';

const FlightsList = ({ flights, formatTime, getFlightDuration }) => {
  if (!flights || flights?.data?.length === 0) {
    return (
        <div className="flex flex-col gap-5 items-center font-Poppins font-semibold min-h-64 w-full justify-center">
            <div className="flex flex-col gap items-center">
                <Search className='mb-2'/>
                <p className="text-lg">Sorry, no flights found.</p>
                <p className="font-normal font-sans">
                    Kindly change your selected parameters to view available flights.
                </p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 w-full md:mt-8 mt-5">
        <Filters
            handleSubmit={(filters) => {
                console.log(filters);
            }}
        />
        <div className="flex flex-col gap-5 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between gap-10">
                {flights?.data?.map((flight, index) => (
                    <FlightCard
                        key={index}
                        flight={flight}
                        formatTime={formatTime}
                        getFlightDuration={getFlightDuration}
                    />
                ))}
            </div>
        </div>
    </div>
  );
};

export default FlightsList;