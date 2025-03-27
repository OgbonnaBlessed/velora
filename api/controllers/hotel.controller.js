import axios from 'axios';
import { getAmadeusToken } from '../helpers/tokenService.js'; // Token helper for retrieving access tokens
import SearchData from '../models/search.model.js'; // Model to store search data in the database
import { fetchIATACode } from '../helpers/convert.js';

// Store images temporarily during the searchHotels call
let hotelsImageMap = {};

// Controller for searching hotels
export const searchHotels = async (req, res) => {
    const { userId, destination, checkInDate, checkOutDate, adults, rooms } = req.body;

    // Validate that all necessary fields are present
    if (!destination || !checkInDate || !checkOutDate || !adults || !rooms) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const token = await getAmadeusToken();

        // Translate the destination city name into an IATA code
        const destinationCode = await fetchIATACode(destination, token);

        // Save the search data to the database
        await SearchData.create({
            userId,
            searchType: 'stays',
            destination,
            departureDate: checkInDate,
            returnDate: checkOutDate,
            numberOfTravelers: adults,
        });

        // Request hotel offers from Amadeus API
        const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            cityCode: destinationCode,  // City code for the destination
        },
        });

        // Predefined list of images for hotels
        const allImages = [
            "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798327/hotel36_xsniiu.jpg",
            "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798327/hotel35_xbfkio.jpg",
            "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798326/hotel30_td5q5t.jpg",
            "https://res.cloudinary.com/dddvbg9tm/image/upload/v1735798324/hotel31_pgwpqg.jpg",
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

        // Function to get a unique set of images for hotels
        const getUniqueImages = (count) => {
            if (allImages.length < count) throw new Error('Not enough unique images available');
            const selectedImages = [];
            for (let i = 0; i < count; i++) {
                const randomIndex = Math.floor(Math.random() * allImages.length);
                selectedImages.push(allImages[randomIndex]);
                allImages.splice(randomIndex, 1); // Remove selected image from the pool
            }
            return selectedImages;
        };

        // Limit the number of hotels to show
        const limitedHotels = response.data.data.slice(0, 12);

        // Add images to each hotel object and store them in a map for later reference
        const hotelsWithImages = limitedHotels.map((hotel) => {
            const images = getUniqueImages(3); // Assign 3 images to each hotel
            hotelsImageMap[hotel.hotelId] = images; // Store images by hotel ID
            return { ...hotel, images };
        });

        // Send back the hotel data with images
        res.status(200).json({ data: hotelsWithImages, meta: response.data.meta });
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({ error: 'Failed to fetch hotels. Please try again.' });
    }
};

// Function to retrieve and send detailed hotel information based on hotelId
export const hotelDetails = async (req, res) => {
    // Extract hotelId from the request parameters
    const { hotelId } = req.params;

    try {
        // Get an authentication token from the Amadeus API (for access to hotel data)
        const token = await getAmadeusToken();

        // Make an API call to fetch hotel details using the hotelId
        const response = await axios.get(
            'https://test.api.amadeus.com/v3/shopping/hotel-offers', // API endpoint for hotel offers
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Use the token for authentication
                },
                params: {
                    hotelIds: hotelId, // Pass the hotelId to fetch specific hotel details
                },
            }
        );

        // Retrieve images mapped to the hotelId from a predefined mapping (hotelsImageMap)
        // Default to an empty array if no images are found for this hotelId
        const images = hotelsImageMap[hotelId] || [];

        // Enrich the response data by adding the images information
        const enrichedHotelDetails = {
            ...response.data, // Spread the original response data from the API
            images, // Attach the images to the enriched response
        };

        // Send the enriched hotel details in the response with a 200 OK status
        res.status(200).json(enrichedHotelDetails);
    } catch (error) {
        // Log any error that occurs during the API call or data processing
        console.error('Error fetching hotel details:', error.response?.data || error.message);

        // Send a 500 Internal Server Error status with a descriptive error message
        res.status(500).json({ error: error.response?.data || 'Failed to fetch hotel details. Please try again.' });
    }
};