import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
import ProtectedRoute from './ProtectedRoute';
import ConnectedDevices from './ConnectedDevices';
import AirportSecurity from './AirportSecurity';
import TravelDocument from './TravelDocument';
import Preferences from './Preferences';
import SearchPage from '../Pages/SearchPage';
import FlightDetails from '../Pages/FlightDetails';
import CheckOut from '../Pages/CheckOut';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/policy" element={<Policy />} />
        <Route path='/user-data-deletion-policy' element={<UserData/>} />
        <Route path='/flight-search' element={<SearchPage/>} />
        <Route path='/flight-details' element={<FlightDetails/>} />
        <Route path='/check-out' element={<CheckOut/>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path='/verify-email' element={<VerifyEmail/>} />
          <Route path='/password-reset' element={<ResetPassword/>} />
          <Route path='/password-reset-success' element={<PasswordResetSuccessful/>} />
          <Route path='/verify-user-email' element={<VerifyUserEmail/>} />
          <Route path='/update-email' element={<UpdateEmail/>} />
          <Route path='/email-update-success' element={<UpdateEmailSuccess/>} />
          <Route path='/connected-devices' element={<ConnectedDevices/>} />
          <Route path='/airport_security' element={<AirportSecurity/>} />
          <Route path='/travel_document' element={<TravelDocument/>} />
          <Route path='/preference' element={<Preferences/>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;