import React from 'react';
import { HashRouter as Router, useLocation } from 'react-router-dom';
import AnimatedRoutes from './Components/AnimatedRoutes';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Help from './Components/Help';
import ScrollToTop from './Components/ScrollToTop';

const App = () => {
  const location = useLocation();

  // Define paths where you want to hide the Navbar and Footer
  const noHeaderFooterPaths = ['/signin', '/signup'];

  // Check if the current path is in the list of paths to hide Navbar and Footer
  const isNavbarVisible = !noHeaderFooterPaths.includes(location.pathname);

  return (
    <>
      {/* Render Navbar only on specified routes */}
      {isNavbarVisible && <Navbar />}

      <ScrollToTop/>

      <AnimatedRoutes />

      {/* Render Footer only when it's visible */}
      {isNavbarVisible && <Footer />}
    </>
  );
};

// Wrap App in Router to allow useLocation to work
const AppWithRouter = () => (
  <Router>
    <Help/>
    <App />
  </Router>
);

export default AppWithRouter;