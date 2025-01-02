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

    const allImages = [
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798327/hotel35_xbfkio.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798327/hotel36_xsniiu.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798323/hotel29_pngxdp.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798322/hotel26_hznenv.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798320/hotel17_bbeywb.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798320/hotel28_td0uii.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798317/hotel27_j82g6d.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798313/hotel18_sjas2m.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798312/hotel23_ov26c7.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798312/hotel24_jr3vbf.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798311/hotel25_cj3jwv.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798311/hotel22_vme6rk.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798308/hotel21_n8uocf.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798307/hotel15_rb3scw.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798306/hotel19_jzvx7a.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798305/hotel20_tpsv95.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798301/hotel14_gtgvln.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798300/hotel16_o6h0jk.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798297/hotel13_bgs2qe.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798295/hotel12_ycsnim.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798294/hotel11_buw16n.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798293/hotel10_fl2iit.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798292/hotel9_nwyuq8.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798291/hotel8_ncaxhi.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798290/hotel7_gi1o3k.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798289/hotel6_cdtjoa.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798288/hotel5_dvqfnt.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798287/hotel4_z5un8c.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798286/hotel3_vr5mfg.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798285/hotel2_uf02tc.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798284/hotel1_qbugyy.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798235/hotel32_vn1ntl.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798211/hotel33_aqcyxt.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798191/hotel34_gkyoio.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798175/hotel35_fjaddo.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798158/hotel36_cp0tro.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798133/hotel1_nuyaft.jpg",
      "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798089/hotel2_pdbkzv.jpg",
    ];

    // Limit the number of results to 12
    const limitedHotels = response.data.data.slice(0, 12);
    
    const getUniqueImages = (count) => {
      if (allImages.length < count) {
        throw new Error("Not enough unique images available");
      }
      const selectedImages = [];
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * allImages.length);
        selectedImages.push(allImages[randomIndex]);
        allImages.splice(randomIndex, 1); // Remove the used image
      }
      return selectedImages;
    };
    
    // Add random images to the limited hotel results
    const hotelsWithImages = limitedHotels.map((hotel) => ({
      ...hotel,
      images: getUniqueImages(3), // Get 3 unique images for each hotel
    }));

    res.status(200).json({ data: hotelsWithImages, meta: response.data.meta });
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