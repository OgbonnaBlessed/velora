import axios from "axios";
import { getAmadeusToken } from "../helpers/tokenService.js";
import SearchData from "../models/search.model.js";
import { fetchCityInfo } from "../helpers/convert.js";

// Main function to fetch car offers
export const carOffers = async (req, res) => {
    try {
        const token = await getAmadeusToken();

        const {
            userId,
            origin,
            endCityName,
            destination,
            transferType,
            startDateTime,
            endDateTime,
            departureDate,
            returnDate,
            passengers,
            passengerCharacteristics
        } = req.body;

        // Fetching origin and destination IATA codes
        const originLocationCode = await fetchIATACode(origin, token);
        const destinationLocationCode = await fetchIATACode(destination, token);

        // Fetching city geoCode and address details
        const city = await fetchCityInfo(endCityName, token);
        const latitude = city?.data[0]?.geoCode?.latitude;
        const longitude = city?.data[0]?.geoCode?.longitude;
        const endCountryCode = city?.data[0]?.address?.countryCode;
        const endAddressLine = city?.data[0]?.address?.cityName;

        console.log('City info:', city);

        // Validate latitude and longitude
        if (!latitude || !longitude) {
            throw new Error('Latitude or longitude not found for the specified city.');
        }

        // Proper format for endGeoCode
        const endGeoCode = `${latitude},${longitude}`;

        // Save the search data to the database
        await SearchData.create({
            userId,
            searchType: 'cars',
            origin,
            destination,
            departureDate,
            returnDate,
            numberOfTravelers: passengers,
        });

        const response = await axios.post('https://test.api.amadeus.com/v1/shopping/transfer-offers', {
            startLocationCode: originLocationCode,
            endAddressLine,
            endCityName,
            endCountryCode,
            endGeoCode, // String format required by Amadeus
            transferType,
            startDateTime,
            passengers,
            startConnectedSegment: {
                transportationType: "CAR",
                departure: {
                    localDateTime: startDateTime,
                    iataCode: originLocationCode
                },
                arrival: {
                    localDateTime: endDateTime,
                    iataCode: destinationLocationCode
                }
            },
            passengerCharacteristics
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        res.status(200).json(response.data);
        // console.log('Car offers fetched successfully:', response.data);
    } catch (error) {
        console.error('Error fetching car offers:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to fetch car offers', error: error.response?.data });
    }
};

// Function to fetch airport to hotel car offers
export const airportToHotelCarOffers = async (req, res) => {
    try {
        const token = await getAmadeusToken();

        const {
            userId,
            origin,
            endCityName,
            destination,
            transferType,
            startDateTime,
            endDateTime,
            departureDate,
            returnDate,
            passengers,
            passengerCharacteristics
        } = req.body;

        // Fetching origin and destination IATA codes
        const originLocationCode = await fetchIATACode(origin, token);
        const destinationLocationCode = await fetchIATACode(destination, token);

        // Fetching city geoCode and address details
        const city = await fetchCityInfo(endCityName, token);
        const latitude = city?.data[0]?.geoCode?.latitude;
        const longitude = city?.data[0]?.geoCode?.longitude;
        const endCountryCode = city?.data[0]?.address?.countryCode;
        const endAddressLine = city?.data[0]?.address?.cityName;

        // Validate latitude and longitude
        if (!latitude || !longitude) {
            throw new Error('Latitude or longitude not found for the specified city.');
        }

        // Proper format for endGeoCode
        const endGeoCode = `${latitude},${longitude}`;

        // Save the search data to the database
        await SearchData.create({
            userId,
            searchType: 'cars',
            origin,
            destination,
            departureDate,
            returnDate,
            numberOfTravelers: passengers,
        });

        const response = await axios.post('https://test.api.amadeus.com/v1/shopping/transfer-offers', {
            startLocationCode: originLocationCode,
            endAddressLine,
            endCityName,
            endCountryCode,
            endGeoCode, // String format required by Amadeus
            transferType,
            startDateTime,
            passengers,
            startConnectedSegment: {
                transportationType: "CAR",
                departure: {
                    localDateTime: startDateTime,
                    iataCode: originLocationCode
                },
                arrival: {
                    localDateTime: endDateTime,
                    iataCode: destinationLocationCode
                }
            },
            passengerCharacteristics
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        res.status(200).json(response.data);
        // console.log('Car offers fetched successfully:', response.data);
    } catch (error) {
        console.error('Error fetching car offers:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to fetch car offers', error: error.response?.data });
    }
};