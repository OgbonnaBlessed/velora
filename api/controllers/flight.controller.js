import axios from 'axios';
import { getAmadeusToken } from '../helpers/tokenService.js'; // Token helper for retrieving access tokens
import SearchData from '../models/search.model.js'; // Model to store search data in the database
import { fetchCityName, fetchIATACode } from '../helpers/convert.js';

// Controller for searching flights
export const searchFlights = async (req, res) => {
  const { userId, origin, destination, departureDate, returnDate, adults } = req.body;

  try {
    // Retrieve fresh Amadeus access token
    const token = await getAmadeusToken();

    // Translate city names (origin and destination) into IATA codes
    const originCode = await fetchIATACode(origin, token);
    const destinationCode = await fetchIATACode(destination, token);

    // Save the search data to the database
    await SearchData.create({
      userId,
      searchType: 'flights',
      origin,
      destination,
      departureDate,
      returnDate,
      numberOfTravelers: adults,
    });

    // Make a request to search for flight offers
    const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers?max=12', {
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

    // Map the IATA codes in the flight itineraries to human-readable city names
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

    // Send the flight data back as the response
    res.status(200).json({ data: flightsWithCityNames });
  } catch (error) {
    console.error('Error during flight search or database save:', error);
    res.status(500).json({ error: error.message });
  }
};

export const searchMultiCityFlights = async (req, res) => {
  const { userId, flights: flightSegments, adults } = req.body;
  console.log(flightSegments)

  if (!Array.isArray(flightSegments) || flightSegments.length === 0) {
    return res.status(400).json({ error: 'Flight segments must be a non-empty array.' });
  }

  try {
    const token = await getAmadeusToken();

    // Convert each origin and destination to IATA codes
    const updatedSegments = await Promise.all(
      flightSegments.map(async (segment, index) => {
        const { origin, destination, departureDate } = segment;
        if (!origin || !destination || !departureDate) {
          throw new Error('Origin, destination, and departure date are required for each segment.');
        }

        const [originCode, destinationCode] = await Promise.all([
          fetchIATACode(origin, token),
          fetchIATACode(destination, token),
        ]);

        return {
          id: (index + 1).toString(), // Unique ID for each segment
          originLocationCode: originCode,
          destinationLocationCode: destinationCode,
          departureDateTimeRange: { date: departureDate },
        };
      })
    );

    console.log('Multi-city Flight Segments:', updatedSegments);

    // Save search data for each flight segment
    await Promise.all(
      flightSegments.map((segment) =>
      SearchData.create({
        userId,
        searchType: 'flights',
        origin: segment.origin,
        destination: segment.destination,
        departureDate: segment.departureDate,
        returnDate: segment.returnDate,
        numberOfTravelers: segment.travelers
      }))
    )

    // Define originDestinationIds for cabinRestrictions
    const originDestinationIds = updatedSegments.map((segment) => segment.id);

    // Final request body
    const requestBody = {
      originDestinations: updatedSegments,
      travelers: Array.from({ length: adults }, (_, i) => ({
        id: (i + 1).toString(),
        travelerType: "ADULT",
      })),
      sources: ["GDS"], // Fixed: Only use "GDS"
      searchCriteria: {
        maxFlightOffers: 20,
        flightFilters: {
          cabinRestrictions: [
            {
              cabin: "ECONOMY", // Can be ECONOMY, BUSINESS, FIRST, PREMIUM_ECONOMY
              coverage: "MOST_SEGMENTS",
              originDestinationIds, // Specify segment IDs
            },
          ],
          connectionRestrictions: {
            maxNumberOfConnections: 2,
            nonStop: false,
          },
        },
      },
    };

    // Make the flight search request to Amadeus API
    const response = await axios.post(
      'https://test.api.amadeus.com/v2/shopping/flight-offers',
      requestBody,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Map IATA codes to city names for human-readable output
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

    if (response.data?.meta?.count === 0) {
      console.warn('No flight offers found.');
    }

    // Send the flight data back as the response
    res.status(200).json({ data: flightsWithCityNames });
  } catch (error) {
    console.error('Error during multi-city flight search:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};