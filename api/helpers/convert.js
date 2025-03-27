import axios from 'axios';

export const fetchIATACode = async (query, token) => {
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
export const fetchCityName = async (iataCode, token) => {
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

// Helper function to fetch city info
export const fetchCityInfo = async (query, token) => {
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
        throw new Error(`Failed to fetch city info for "${query}", ${error}`);
    }
};