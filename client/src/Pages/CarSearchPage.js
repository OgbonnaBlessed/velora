/* eslint-disable jsx-a11y/img-redundant-alt */
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BounceLoader } from 'react-spinners';
import { locations } from '../Data/Locations';
import { LucideMessageSquareWarning } from 'lucide-react';
import DateRangePicker from '../Components/Common/Inputs/DateRangePicker';
import OriginInput from '../Components/Common/Inputs/OriginInput';
import DestinationInput from '../Components/Common/Inputs/DestinationInput';
import PassengerInput from '../Components/Common/Inputs/PassengerInput';

const CarSearchPage = () => {
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();

    const [cars, setCars] = useState([]); // State to store car data
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({ origin: '', destination: '' }); // To handle field-specific errors
    const [loading, setLoading] = useState(false);
    const [triggerSearch, setTriggerSearch] = useState(false); // To trigger search based on props or initial state
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        departureDate: dayjs().format('YYYY-MM-DD'),  // default departure date (today)
        returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),  // default return date (2 days later)
        pickupTime: dayjs().format('h:mm a'),
        dropoffTime: dayjs().add(2, 'hour').format('h:mm a'),
        passengers: 1,
        seats: 1,
    });

    // useEffect hook to update formData based on location state (if provided)
    useEffect(() => {
        if (location.state) {
            setFormData({
                origin: location.state.origin,
                destination: location.state.destination,
                departureDate: location.state.departureDate,
                returnDate: location.state.returnDate,
                pickupTime: location.state.pickupTime,
                dropoffTime: location.state.dropoffTime,
                passengers: location.state.passengers,
                seats: location.state.seats,
            });
            setTriggerSearch(true); // Trigger the search if location state exists
        }
    }, [location.state]);

    // useEffect hook to trigger search when required
    // useEffect(() => {
    //     if (triggerSearch && formData.origin && formData.destination) {
    //         handleSubmit(); // Call submit when required fields are set
    //         setTriggerSearch(false); // Reset the trigger after search
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [triggerSearch]);

    // Handle changes in date range picker (departure and return dates)
    const handleDateChange = ([startDate, endDate]) => {
        setFormData((prev) => ({
            ...prev,
            departureDate: startDate.format('YYYY-MM-DD'),
            returnDate: endDate.format('YYYY-MM-DD'),
        }));
    };

    // Function to handle date and time formatting
    const formatDateTime = (date, time) => {
        return `${dayjs(date).format('YYYY-MM-DD')}T${dayjs(time, 'h:mm a').format('HH:mm:ss')}`;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);

        let hasError = false;
        const newErrors = { origin: '', destination: '' };

        if (!formData.origin) {
            newErrors.origin = 'Please select an origin.';
            hasError = true;
        }
        if (!formData.destination) {
            newErrors.destination = 'Please select a destination.';
            hasError = true;
        }
        if (formData.origin === formData.destination) {
            newErrors.destination = 'Origin and destination cannot be the same.';
            hasError = true;
        }
        if (hasError) {
            setErrors(newErrors);
            setTimeout(() => setErrors({ origin: '', destination: '' }), 3000);
            return;
        }

        const payload = {
            startLocationCode: "CDG",
            endAddressLine: "Avenue Anatole France, 5",
            endCityName: "Paris",
            endZipCode: "75007",
            endCountryCode: "FR",
            endName: "Souvenirs De La Tour",
            endGeoCode: "48.859466,2.2976965",
            transferType: "PRIVATE",
            startDateTime: "2025-04-10T10:30:00",
            passengers: 2,
            stopOvers: [
                {
                    duration: "PT2H30M",
                    sequenceNumber: 1,
                    addressLine: "Avenue de la Bourdonnais, 19",
                    countryCode: "FR",
                    cityName: "Paris",
                    zipCode: "75007",
                    name: "De La Tours",
                    geoCode: "48.859477,2.2976985",
                    stateCode: "FR"
                }
            ],
            startConnectedSegment: {
                transportationType: "CAR",
                transportationNumber: "AF380",
                departure: {
                    localDateTime: "2025-07-10T09:00:00",
                    iataCode: "NCE"
                },
                arrival: {
                    localDateTime: "2025-07-10T10:00:00",
                    iataCode: "CDG"
                }
            },
            passengerCharacteristics: [
                { passengerTypeCode: "ADT", age: 20 },
                { passengerTypeCode: "CHD", age: 10 }
            ]
        };

        try {
            const response = await fetch('/api/car/car-offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            if (Array.isArray(data)) {
                setCars(data);
                console.log(data);
            } else if (Array.isArray(data.data)){
                setCars(data.data);
                console.log(data.data);
            } else {
                console.log("unexpected response:", data);
            }
            
            setLoading(false);
        } catch (error) {
            console.error("Fetch error:", error);
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: .5,
                ease: "easeInOut"
            }}
            className='flex flex-col gap-5 px-4 sm:px-6 lg:px-20 pt-28 md:pt-36 pb-10 bg-white'
        >
            {/* Search form for cars */}
            <form 
                onSubmit={(e) => handleSubmit(e)}
                className="xl:flex xl:gap-3 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center"
            >
                {/* Origin Input */}
                <div className="relative flex-1">
                    <OriginInput
                        formData={formData}
                        setFormData={setFormData}
                        locations={locations} // Pass available locations to the OriginInput component
                        label='From where?' // Custom label for the input
                    />
                    {errors.origin && (
                        <p className="text-red-500 text-[0.7rem] absolute mt-1">
                            {errors.origin} {/* Display validation error if any */}
                        </p>
                    )}
                </div>
        
                {/* Destination Input */}
                <div className="relative flex-1">
                    <DestinationInput
                        formData={formData}
                        setFormData={setFormData}
                        locations={locations} // Pass available locations to the DestinationInput component
                        label='Where to?' // Custom label for the input
                    />
                    {errors.destination && (
                        <p className="text-red-500 text-[0.7rem] absolute mt-1">
                            {errors.destination} {/* Display validation error if any */}
                        </p>
                    )}
                </div>
        
                {/* Date Range Picker */}
                <DateRangePicker
                    onDateChange={handleDateChange} // Handle date changes in the picker
                    defaultDates={[
                        dayjs(formData.departureDate),
                        dayjs(formData.returnDate),
                    ]}
                />
        
                {/* Passengers Input */}
                <PassengerInput
                    formData={formData} 
                    setFormData={setFormData} 
                />
        
                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="bg-[#48aadf] rounded-full font-semibold text-white cursor-pointer px-8 py-3 h-fit w-fit self-center"
                >
                    Search
                </button>
            </form>
    
            {/* Loading, Error, or Flight Results Display */}
            <div>
                {loading ? (
                    <div className='min-h-64 w-full flex items-center justify-center'>
                        <BounceLoader
                            color="#48aadf" // Customize the color of the loader
                            loading={loading} 
                        />
                    </div>
                ) : error ? (
                    <motion.div 
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{
                            duration: .5,
                            ease: "easeInOut"
                        }}
                        className='flex flex-col gap-5 items-center font-Poppins font-semibold min-h-64 w-full justify-center'
                    >
                        <div className='flex flex-col gap items-center'>
                            <LucideMessageSquareWarning />
                            <p className='text-lg'>
                                We are currently having issues at our end
                            </p>
                            <p className='font-normal font-sans'>Please try again later</p>
                        </div>
                    </motion.div>
                ) : (
                    (Array.isArray(cars) && cars.length > 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {cars.map((car, index) => (
                                <div key={index} className='flex flex-col gap-4 bg-[#dbeafe] p-4 rounded-md'>
                                    <img src={car?.vehicle?.imageURL ? car?.vehicle?.imageURL : `${process.env.PUBLIC_URL}/images/placeholder-car.png`} alt={`Car ${index + 1} image`} className='object-cover' />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-col gap-5 items-center font-Poppins font-semibold min-h-64 w-full justify-center'>
                            <div className='flex flex-col gap items-center'>
                                <LucideMessageSquareWarning />
                                <p className='text-lg'>No car offers found</p>
                                <p className='font-normal font-sans'>Please try a different search</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
      );
}

export default CarSearchPage