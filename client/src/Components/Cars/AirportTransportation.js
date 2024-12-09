import React, { useState } from 'react'
import AirportToHotel from '../AirportTransport/AirportToHotel';
import HotelToAirport from '../AirportTransport/HotelToAirport';
import CarRoundTrip from '../AirportTransport/CarRoundTrip';

const AirportTransportation = () => {
    const [visible, setVisible] = useState('airport-to-hotel');

    const OpenTab = (tabname) => {
        setVisible(tabname);
    }

    return (
        <div className=''>
            <div className='flex flex-col gap-5'>
                <div className='flex sm:items-center gap-5 max-sm:flex-col'>
                    <div className='grid sm:grid-cols-3 grid-cols-2 items-center gap-3 text-[0.75rem] text-nowrap w-fit text-[#000000e3] relative font-Grotesk font-semibold'>
                        <p 
                            className={`py-2 px-4 w-fit border cursor-pointer rounded-full transition-all duration-500 ease-in-out 
                                ${visible === 'airport-to-hotel' && 'bg-blue-50'}`
                            }
                            onClick={() => OpenTab('airport-to-hotel')}
                        >
                            Aiport to hotel
                        </p>
                        <p
                            className={`py-2 px-4 w-fit border cursor-pointer rounded-full transition-all duration-500 ease-in-out 
                                ${visible === 'hotel-to-airport' && 'bg-blue-50'}`
                            }
                            onClick={() => OpenTab('hotel-to-airport')}
                        >
                            Hotel to airport
                        </p>
                        <p
                            className={`py-2 px-4 w-fit border cursor-pointer rounded-full transition-all duration-500 ease-in-out 
                                ${visible === 'round-trip' && 'bg-blue-50'}`
                            }
                            onClick={() => OpenTab('round-trip')}
                        >
                            Round trip
                        </p>
                    </div>
                </div>

                {/* Tab Contents */}
                {visible === 'airport-to-hotel' && <AirportToHotel />}
                {visible === 'hotel-to-airport' && <HotelToAirport />}
                {visible === 'round-trip' && <CarRoundTrip />}
            </div>
        </div>
    )
}

export default AirportTransportation