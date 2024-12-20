import axios from 'axios';
import { getAmadeusToken } from '../helpers/tokenService.js'; // Token helper

// Helper to fetch IATA code for a city name
const fetchIATACode = async (query, token) => {
  try {
    const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        subType: 'CITY',
        keyword: query,
      },
    });

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

// Helper to fetch city name for IATA code
const fetchCityName = async (iataCode, token) => {
  try {
    const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        subType: 'AIRPORT',
        keyword: iataCode,
      },
    });

    if (response.data?.data?.length > 0) {
      return response.data.data[0].address.cityName; // Return city name
    } else {
      return iataCode; // Fallback to IATA code if city name is not found
    }
  } catch (error) {
    console.error(`Error fetching city name for ${iataCode}:`, error);
    return iataCode; // Fallback to IATA code
  }
};

export const searchFlights = async (req, res) => {
  const { origin, destination, departureDate, returnDate, adults } = req.body

  try {
    // Get a fresh access token
    const token = await getAmadeusToken();

    // Translate city names to IATA codes
    const originCode = await fetchIATACode(origin, token);
    const destinationCode = await fetchIATACode(destination, token);

    // Make the flight search request
    const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers?max=5', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate,
        returnDate,
        adults,
      },
    });

    // Map all IATA codes in the itineraries to readable city names
    const flightsWithCityNames = await Promise.all(
      response.data.data.map(async (flight) => {
        const updatedItineraries = await Promise.all(
          flight.itineraries.map(async (itinerary) => {
            const updatedSegments = await Promise.all(
              itinerary.segments.map(async (segment) => ({
                ...segment,
                departure: {
                  ...segment.departure,
                  cityName: await fetchCityName(segment.departure.iataCode, token),
                },
                arrival: {
                  ...segment.arrival,
                  cityName: await fetchCityName(segment.arrival.iataCode, token),
                },
              }))
            );
            return { ...itinerary, segments: updatedSegments };
          })
        );
        return { ...flight, itineraries: updatedItineraries };
      })
    );

    res.status(200).json({ data: flightsWithCityNames });
  } catch (error) {
    console.error('Error during flight search or database save:', error);
    res.status(500).json({ error: error.message });
  }
};