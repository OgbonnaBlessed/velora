import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from '../Pages/Home';
import SignUp from '../Pages/SignUp';
import SignIn from '../Pages/SignIn';
import Navbar from './Navbar';
import Footer from './Footer';

const AnimatedRoutes = () => {
  const location = useLocation();

  // Define paths where you want to hide the Navbar and Footer
  const noHeaderFooterPaths = [
    "/signin",
    "/signup"
  ];

  // Define paths where you want to hide the Help component
  // const noHelpPaths = ["/Dashboard"];

  // Conditionally apply padding only if Navbar is present
  const isNavbarVisible = !noHeaderFooterPaths.includes(location.pathname);

  // Conditionally apply padding only if Navbar is present
  // const isHelpVisible = !noHelpPaths.includes(location.pathname);

  return (
    <AnimatePresence>
      {isNavbarVisible && <Navbar/>}
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<Home/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/signin' element={<SignIn/>} />
      </Routes>
      {isNavbarVisible && <Footer/>}
    </AnimatePresence>
  )
}

export default AnimatedRoutes