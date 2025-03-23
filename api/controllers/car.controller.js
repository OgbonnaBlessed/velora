import axios from "axios";
import { getAmadeusToken } from "../helpers/tokenService.js";

// Helper function to fetch IATA code for a city name
const fetchCityInfo = async (query, token) => {
    try {
        // Send request to Amadeus API to fetch city location details
        const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                subType: 'CITY', // We are looking for cities
                keyword: query,   // The city name to search for
            },
        });

        // If results are found, return the city info of the first city match
        return response.data;

    } catch (error) {
        console.error(`Error fetching city info for ${query}:`, error);
        throw new Error(`Failed to fetch city info for "${query}"`);
    }
};

// Helper function to fetch IATA code for a city name
const fetchIATACode = async (query, token) => {
    try {
        // Send request to Amadeus API to fetch city location details
        const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                subType: 'CITY', // We are looking for cities
                keyword: query,   // The city name to search for
            },
        });

        // If results are found, return the IATA code of the first city match
        if (response.data?.data?.length > 0) {
            return response.data.data[0].iataCode; // Return the first matching IATA code
        } else {
            throw new Error(`No IATA code found for "${query}"`);
        }
    } catch (error) {
        console.error(`Error fetching IATA code for ${query}:`, error);
        throw new Error(`Failed to fetch IATA code for "${query}"`);
    }
};

// Main function to fetch car offers
export const carOffers = async (req, res) => {
    try {
        const token = await getAmadeusToken();

        const {
            origin,
            endCityName,
            destination,
            transferType,
            startDateTime,
            endDateTime,
            passengers,
            passengerCharacteristics
        } = req.body
        
        const originLocationCode = await fetchIATACode(origin, token);
        const destinationLocationCode = await fetchIATACode(destination, token);

        const city = await fetchCityInfo(endCityName, token);
        const latitude = city?.data[0]?.geoCode?.latitude;
        const longitude = city?.data[0]?.geoCode?.longitude;
        const endCountryCode = city?.data[0]?.address?.countryCode;
        const endAddressLine = city?.data[0]?.address?.cityName;

        console.log(latitude, longitude, endCountryCode, endAddressLine);

        const response = await axios.post('https://test.api.amadeus.com/v1/shopping/transfer-offers', {
            startLocationCode: originLocationCode,
            endAddressLine,
            endCityName,
            endCountryCode,
            endGeoCode: {
                latitude,
                longitude
            },
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
    } catch (error) {
        console.error('Error fetching car offers:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to fetch car offers', error: error.response?.data });
    }
};