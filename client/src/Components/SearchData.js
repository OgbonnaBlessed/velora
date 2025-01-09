// Import necessary hooks and libraries
import React, { useEffect, useState } from 'react'; // useEffect and useState from React for handling side effects and state management
import axios from 'axios'; // Axios for making HTTP requests
import { useSelector } from 'react-redux'; // useSelector to access Redux state (currentUser)
import { useNavigate } from 'react-router-dom'; // useNavigate for navigation between pages in React Router
import { FaHotel, FaTelegramPlane, FaTrash } from 'react-icons/fa'; // Import icons for hotel, flight, and trash
import dayjs from 'dayjs'; // Import dayjs for working with dates

const SearchData = () => {
  // Access the current user from Redux state
  const { currentUser } = useSelector((state) => state.user);

  // State variables to store search data, loading state, and error messages
  const [searchData, setSearchData] = useState([]); // Array to store search data
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [error, setError] = useState(null); // Error state to display error messages

  // Navigate hook to programmatically navigate to different routes
  const navigate = useNavigate();

  // useEffect hook to fetch search data from the server when the component mounts or when currentUser changes
  useEffect(() => {
    // Fetch search data from the API
    const fetchSearchData = async () => {
      try {
        // Making GET request to fetch search data for the current user
        const response = await axios.get(`/api/flight/search-data/${currentUser._id}`);
        setSearchData(response.data); // Set the fetched data to state
      } catch (err) {
        // Handle errors and set the error state
        setError('Failed to fetch search data. Please try again.');
        console.error(err); // Log the error to the console
      } finally {
        // Set loading to false once the request is complete (successful or failed)
        setLoading(false);
      }
    };

    // Fetch search data only if the user is logged in
    if (currentUser) {
      fetchSearchData(); // Trigger the fetch function if currentUser exists
    } else {
      setError('You are not signed in'); // Display error if user is not signed in
    }
  }, [currentUser]); // Dependency array ensures the effect runs when currentUser changes

  // Date formatter function to format date into 'weekday, month day' format
  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date)); // Format date using Intl API
  };

  // Handle delete action for a specific search item
  const handleDelete = async (id) => {
    try {
      // Sending DELETE request to remove the search data from the server
      await axios.delete(`/api/flight/search-data/${id}`);
      // Remove the deleted item from the state
      setSearchData((prevData) => prevData.filter((item) => item._id !== id));
    } catch (error) {
      // Log and display error if the deletion fails
      console.error('Error deleting search data:', error);
      setError('Failed to delete search data. Please try again.');
    }
  };

  // Handle the item click event to navigate to either hotel or flight search page
  const handleItemClick = (item) => {
    // If the search type is "stays" (hotel), navigate to hotel search page
    if (item.searchType === 'stays') {
      navigate('/hotel-search', {
        state: { 
          destination: item.destination,
          departureDate: dayjs().format('YYYY-MM-DD'), // Set current date for departure
          returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'), // Set return date as 2 days after
          adults: item.numberOfTravelers,
          rooms: 1, // Set number of rooms
        }
      });
    } else {
      // If the search type is "flights", navigate to flight search page
      navigate('/flight-search', {
        state: { 
          origin: item.origin,
          destination: item.destination,
          departureDate: dayjs().format('YYYY-MM-DD'),
          returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
          adults: item.numberOfTravelers,
          rooms: 1,
        }
      });
    }
  };

  // Conditional rendering based on user sign-in, loading state, and error state
  if (!currentUser) {
    return <div>You are not signed in</div>; // Return message if user is not signed in
  }

  if (loading) {
    return <div>Loading...</div>; // Return loading message while data is being fetched
  }

  if (error) {
    return <div>{error}</div>; // Return error message if there's an error
  }

  return (
    <div>
      {/* Display recent searches if there is any data */}
      {searchData.length > 0 ? (
        <div className='flex flex-col gap-5'>
          <h1 className='font-bold md:text-2xl text-xl'>Your Recent Searches</h1>
          <ul className='flex gap-4 overflow-auto remove-scroll-bar'>
            {/* Iterate over the search data and display each item */}
            {searchData.map((item) => (
              <li
                className='rounded-2xl bg-blue-100 p-4 flex items-center gap-5 min-w-72 min-h-32 cursor-pointer relative'
                key={item._id} // Unique key for each item
                onClick={() => handleItemClick(item)} // Navigate to the corresponding search page on click
              >
                <div className='text-2xl'>
                  {/* Display different icons based on search type */}
                  {item.searchType === 'stays' ? <FaHotel /> : <FaTelegramPlane />}
                </div>
                {/* Display details based on search type */}
                {item.searchType === 'stays' ? (
                  <div className='flex flex-col'>
                    <p className='font-bold'>{`Stays in ${item.destination || 'Unknown'}`}</p>
                    <div>{`${formatDate(item.departureDate)} - ${formatDate(item.returnDate)}`}</div>
                    <div>
                      {item.numberOfTravelers} {item.numberOfTravelers > 1 ? 'travelers' : 'traveler'}
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col'>
                    <p className='font-bold'>{`Flights from ${item.origin || 'Unknown'} to ${item.destination || 'Unknown'}`}</p>
                    <div>{`${formatDate(item.departureDate)} - ${formatDate(item.returnDate)}`}</div>
                    <div>
                      {item.numberOfTravelers} {item.numberOfTravelers > 1 ? 'travelers' : 'traveler'}
                    </div>
                  </div>
                )}

                {/* Delete button */}
                <div 
                  className='absolute top-2 right-2 text-[#48aadf] bg-white rounded-full p-2 cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click from bubbling up to the list item
                    handleDelete(item._id); // Delete the item when clicked
                  }}
                >
                  <FaTrash/> {/* Trash icon */}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>You don't have any search yet.</p> // Display this message if no search data exists
      )}
    </div>
  );
};

export default SearchData; // Export the component for use in other parts of the application