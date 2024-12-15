import axios from 'axios';

export const getAmadeusToken = async () => {
    try {
        const response = await axios.post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: "DBa230NPP3MvchoN3lAo6Ul7ecVOqeeM",
            client_secret: "Ad81wQHw6u4xfWCD",
        }),
        {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
    );
    
    return response.data.access_token;
} catch (error) {
        console.error('Failed to fetch Amadeus token:', error);
        throw new Error('Could not authenticate with Amadeus API.');
    }
};