import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaHotel, FaTelegramPlane, FaTrash } from 'react-icons/fa';
import dayjs from 'dayjs';

const SearchData = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchData, setSearchData] = useState([]);
  console.log(searchData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const response = await axios.get(`/api/flight/search-data/${currentUser._id}`);
        setSearchData(response.data);
      } catch (err) {
        setError('Failed to fetch search data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchSearchData();
    } else {
      setError('You are not signed in');
    }
  }, [currentUser]);

  // Formatter for dates
  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/flight/search-data/${id}`);
      setSearchData((prevData) => prevData.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting search data:', error);
      setError('Failed to delete search data. Please try again.');
    }
  };

  // Handle item click
  const handleItemClick = (item) => {
    if (item.searchType === 'stays') {
      navigate('/hotel-search', { state: { 
        destination: item.destination,
        departureDate: dayjs().format('YYYY-MM-DD'),
        returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
        adults: item.numberOfTravelers,
        rooms: 1,
      }});
    } else {
      navigate('/flight-search', { state: { 
        origin: item.origin,
        destination: item.destination,
        departureDate: dayjs().format('YYYY-MM-DD'),
        returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
        adults: item.numberOfTravelers,
        rooms: 1,
      }});
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {searchData.length > 0 ? (
        <div className='flex flex-col gap-5'>
          <h1 className='font-bold md:text-2xl text-xl'>Your Recent Searches</h1>
          <ul className='flex gap-4 overflow-auto remove-scroll-bar'>
            {searchData.map((item) => (
              <li
                className='rounded-2xl bg-blue-100 p-4 flex items-center gap-5 min-w-80 min-h-32 cursor-pointer relative'
                key={item._id}
                onClick={() => handleItemClick(item)}
              >
                <div className='text-2xl'>
                  {item.searchType === 'stays' ? <FaHotel /> : <FaTelegramPlane />}
                </div>
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

                <div 
                  className='absolute top-2 right-2 text-red-500 bg-white rounded-full p-2 cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item._id);
                  }}
                >
                  <FaTrash/>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>You don't have any search yet.</p>
      )}
    </div>
  );
};

export default SearchData;