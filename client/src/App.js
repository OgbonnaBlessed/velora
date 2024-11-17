import React from 'react'
import { HashRouter as Router } from 'react-router-dom';
import Navbar from './Components/Navbar';
import AnimatedRoutes from './Components/AnimatedRoutes';
import Footer from './Components/Footer';

const App = () => {
  return (
    <Router>
      <Navbar/>
      <AnimatedRoutes/>
      <Footer/>
    </Router>
  )
}

export default App