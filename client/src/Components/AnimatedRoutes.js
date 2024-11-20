import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from '../Pages/Home';
import SignUp from '../Pages/SignUp';
import SignIn from '../Pages/SignIn';
import Policy from '../Pages/Policy';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/policy" element={<Policy />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;