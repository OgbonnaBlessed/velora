// Importing axios to make HTTP requests
import axios from 'axios';

// Function to get the Amadeus API authentication token using OAuth2
export const getAmadeusToken = async () => {
    try {
        // Sending a POST request to the Amadeus OAuth2 token endpoint
        const response = await axios.post(
            'https://test.api.amadeus.com/v1/security/oauth2/token', // API URL for token generation
            new URLSearchParams({
                grant_type: 'client_credentials', // OAuth2 grant type
                client_id: "xiUzNhf6PgCeinmHgGndkHQlFZbHEbL9", // Client ID provided by Amadeus
                client_secret: "HIaYrhN4RehAEX6Y", // Client secret provided by Amadeus
            }),
            {
                // Setting headers for the request
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // Indicates that the request body is form data
            }
        );
        
        // Returning the access token from the response to use in subsequent API calls
        return response.data.access_token;

    } catch (error) {
        // Handling any errors that may occur during the API request
        console.error('Failed to fetch Amadeus token:', error); // Logging the error to the console
        throw new Error('Could not authenticate with Amadeus API.'); // Throwing a custom erro
    }
};