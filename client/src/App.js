import React from 'react'
import { HashRouter as Router } from 'react-router-dom';
import Navbar from './Components/Navbar';
import AnimatedRoutes from './Components/AnimatedRoutes';

const App = () => {
  return (
    <Router>
      <Navbar/>
      <AnimatedRoutes/>
    </Router>
  )
}

export default App