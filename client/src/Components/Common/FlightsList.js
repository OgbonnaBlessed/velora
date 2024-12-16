import React from 'react';
import Filters from './Filters';
import FlightCard from './Cards/FlightCard';

const FlightsList = ({ flights, formatTime, getFlightDuration, filters }) => {
  if (!flights || flights?.data?.length === 0) {
    return (
        <div className="flex flex-col gap-5 items-center font-Poppins font-semibold min-h-screen w-full justify-center">
            <div className="flex flex-col gap items-center">
                <p className="text-lg">Sorry, no flights found.</p>
                <p className="font-normal font-sans">
                    Kindly change your selected parameters to view available flights.
                </p>
            </div>
            <button className="px-8 py-3 bg-[#48aadf] font-semibold cursor-pointer rounded-full text-white">
                Edit search
            </button>
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