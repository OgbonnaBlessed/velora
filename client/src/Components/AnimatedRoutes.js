import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // Importing required modules from React Router
import { AnimatePresence } from 'framer-motion'; // Importing AnimatePresence from framer-motion for animation transitions

// Importing all the page components that will be used in the routes
import Home from '../Pages/Home';
import SignUp from '../Pages/SignUp';
import SignIn from '../Pages/SignIn';
import Policy from '../Pages/Policy';
import UserData from '../Pages/UserData';
import Profile from '../Pages/Profile';
import VerifyEmail from './VerifyEmail';
import ResetPassword from './ResetPassword';
import PasswordResetSuccessful from './PasswordResetSuccessful';
import VerifyUserEmail from './VerifyUserEmail';
import UpdateEmail from './UpdateEmail';
import UpdateEmailSuccess from './UpdateEmailSuccess';
import ProtectedRoute from './ProtectedRoute'; // Importing ProtectedRoute for routes that require user authentication
import ConnectedDevices from './ConnectedDevices';
import AirportSecurity from './AirportSecurity';
import TravelDocument from './TravelDocument';
import Preferences from './Preferences';
import FlightDetails from '../Pages/details-page/FlightDetails';
import BookingCompleted from '../Pages/BookingCompleted';
import HotelDetails from '../Pages/details-page/HotelDetails';
import FlightCheckOutPage from '../Pages/checkout-pages/FlightCheckOutPage';
import HotelCheckOutPage from '../Pages/checkout-pages/HotelCheckOutPage';
import MultiCitySearch from '../Pages/search-pages/MultiCitySearch';
import RoundTripCarSearch from '../Pages/search-pages/RoundTripCarSearch';
import HotelToAirportCarSearch from '../Pages/search-pages/HotelToAirportCarSearch';
import AirportToHotelCarSearch from '../Pages/search-pages/AirportToHotelCarSearch';
import CarSearchPage from '../Pages/search-pages/CarSearchPage';
import SearchPage from '../Pages/search-pages/SearchPage';
import HotelSearch from '../Pages/search-pages/HotelSearch';
import CarDetails from '../Pages/details-page/CarDetails';
import CarCheckOutPage from '../Pages/checkout-pages/CarCheckOutPage';
import StateRequiredRoutes from './StateRequiredRoutes';

const AnimatedRoutes = () => {
  // useLocation hook from React Router to get the current location (path)
  const location = useLocation();

  return (
    // AnimatePresence allows us to animate routes when they are entering or exiting the page
    <AnimatePresence>
      {/* Routes is a container that handles the routing logic, including the dynamic key prop to trigger animations */}
      <Routes location={location} key={location.pathname}>
        
        {/* Public routes that can be accessed by any user */}
        <Route path="/" element={<Home />} /> {/* Home Page Route */}
        <Route path="/signup" element={<SignUp />} /> {/* SignUp Page Route */}
        <Route path="/signin" element={<SignIn />} /> {/* SignIn Page Route */}
        <Route path="/policy" element={<Policy />} /> {/* Privacy Policy Page Route */}
        <Route path='/user-data-deletion-policy' element={<UserData/>} /> {/* User Data Deletion Policy Route */}

        {/* Protected routes are wrapped in the ProtectedRoute component to ensure they can only be accessed by authenticated users */}
        <Route element={<ProtectedRoute />}>
          {/* Routes for authenticated users */}
          <Route path="/profile" element={<Profile />} /> {/* User Profile Page */}
          <Route path='/verify-email' element={<VerifyEmail/>} /> {/* Verify User Email Route */}
          <Route path='/password-reset' element={<ResetPassword/>} /> {/* Password Reset Route */}
          <Route path='/password-reset-success' element={<PasswordResetSuccessful/>} /> {/* Password Reset Success Page */}
          <Route path='/verify-user-email' element={<VerifyUserEmail/>} /> {/* Verify User Email Page */}
          <Route path='/update-email' element={<UpdateEmail/>} /> {/* Update Email Route */}
          <Route path='/email-update-success' element={<UpdateEmailSuccess/>} /> {/* Email Update Success Page */}
          <Route path='/connected-devices' element={<ConnectedDevices/>} /> {/* Connected Devices Page */}
          <Route path='/airport_security' element={<AirportSecurity/>} /> {/* Airport Security Page */}
          <Route path='/travel_document' element={<TravelDocument/>} /> {/* Travel Document Page */}
          <Route path='/preference' element={<Preferences/>} /> {/* Preferences Page */}
          <Route element={<StateRequiredRoutes />}>
            <Route path='/flight-search' element={<SearchPage/>} /> {/* Flight Search Page */}
            <Route path='/hotel-search' element={<HotelSearch />} /> {/* Hotel Search Page */}
            <Route path='/car-search' element={<CarSearchPage />} />
            <Route path='/airport-to-hotel-car-search' element={<AirportToHotelCarSearch />} /> {/* Airport to Hotel Page */}
            <Route path='/hotel-to-airport-car-search' element={<HotelToAirportCarSearch />} /> {/* Hotel to Airport Page */}
            <Route path='/round-trip-car-search' element={<RoundTripCarSearch />} /> {/* Round Trip Car Search Page */}
            <Route path='/multi-city-search' element={<MultiCitySearch />} /> {/* Multi City Flight Search */}
            <Route path='/flight-check-out' element={<FlightCheckOutPage/>} /> {/* Flight Checkout Page */}
            <Route path='/flight-details/:flightId' element={<FlightDetails/>} /> {/* Flight Details Page with dynamic flightId */}
            <Route path='/hotel-details/:hotelId' element={<HotelDetails/>} /> {/* Hotel Details Page with dynamic hotelId */}
            <Route path='/car-details/:carId' element={<CarDetails />} />
            <Route path='/hotel-check-out' element={<HotelCheckOutPage />} /> {/* Hotel Checkout Page */}
            <Route path='/car-check-out' element={<CarCheckOutPage />} />
          </Route>
          <Route path='/booking-completed' element={<BookingCompleted/>} /> {/* Booking Completed Page */}
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes; // Export the AnimatedRoutes component for use in the main app