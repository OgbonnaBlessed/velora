import axios from 'axios';
import { getAmadeusToken } from '../helpers/tokenService.js'; // Token helper
import SearchData from '../models/search.model.js';

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
  const { userId, origin, destination, departureDate, returnDate, adults } = req.body

  try {
    // Get a fresh access token
    const token = await getAmadeusToken();

    // Translate city names to IATA codes
    const originCode = await fetchIATACode(origin, token);
    const destinationCode = await fetchIATACode(destination, token);

    // Save search data to the database
    await SearchData.create({
      userId,
      searchType: 'flights',
      origin,
      destination,
      departureDate,
      returnDate,
      numberOfTravelers: adults,
    });

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

export const searchHotels = async (req, res) => {
  const { userId, destination, checkInDate, checkOutDate, adults, rooms } = req.body;

  if (!destination || !checkInDate || !checkOutDate || !adults || !rooms) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  
  try {
    const token = await getAmadeusToken();
    
    // Translate city names to IATA codes
    const destinationCode = await fetchIATACode(destination, token);
    
    // Save search data to the database
    await SearchData.create({
      userId,
      searchType: 'stays',
      destination,
      departureDate: checkInDate,
      returnDate: checkOutDate,
      numberOfTravelers: adults,
    });

    const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        cityCode: destinationCode
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotels. Please try again.' });
  }
};

export const getSearchData = async (req, res) => {
  const { userId } = req.params;  // Ensure this comes from the authenticated user

  try {
    const searchData = await SearchData.find({ userId }).sort({ createdAt: -1 });

    if (!searchData) {
      return res.status(404).json({ error: 'No search data found for this user' });
    }

    res.status(200).json(searchData);
  } catch (error) {
    console.error('Error fetching search data:', error);
    res.status(500).json({ error: 'Failed to fetch search data' });
  }
};

export const deleteSearchData = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await SearchData.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Search data not found' });
    }

    res.status(200).json({ message: 'Search data deleted successfully' });
  } catch (error) {
    console.error('Error deleting search data:', error);
    res.status(500).json({ error: 'Failed to delete search data' });
  }
};