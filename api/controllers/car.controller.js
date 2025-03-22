import axios from "axios";
import { getAmadeusToken } from "../helpers/tokenService.js";

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

// Helper function to fetch city name for a given IATA code
const fetchCityName = async (iataCode, token) => {
    try {
        // Send request to Amadeus API to fetch city details using the IATA code
        const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                subType: 'AIRPORT', // Looking for airports by IATA code
                keyword: iataCode,  // IATA code to search for
            },
        });

        // If city is found, return the city name, else fallback to IATA code
        if (response.data?.data?.length > 0) {
            return response.data.data[0].address.cityName; // Return the city name from the response
        } else {
            return iataCode; // Fallback to IATA code if city name not found
        }
    } catch (error) {
        console.error(`Error fetching city name for ${iataCode}:`, error);
        return iataCode; // Fallback to IATA code
    }
};

// Main function to fetch car offers
export const carOffers = async (req, res) => {
    try {
        const token = await getAmadeusToken();
        const {
            startLocationCode,
            endAddressLine,
            endCityName,
            endZipCode,
            endCountryCode,
            endName,
            endGeoCode,
            transferType,
            startDateTime,
            passengers,
            stopOvers,
            startConnectedSegment,
            passengerCharacteristics
        } = req.body;

        const response = await axios.post('https://test.api.amadeus.com/v1/shopping/transfer-offers', {
            startLocationCode,
            endAddressLine,
            endCityName,
            endZipCode,
            endCountryCode,
            endName,
            endGeoCode,
            transferType,
            startDateTime,
            passengers,
            stopOvers,
            startConnectedSegment,
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