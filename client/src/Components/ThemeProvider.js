import React from 'react'
import { useSelector } from 'react-redux'

/**
 * ThemeProvider is a component that wraps its children components
 * and applies a theme class based on the current theme from the Redux store.
 * The theme value is dynamically retrieved from the Redux store and applied to
 * the outer div to customize the look and feel of the entire application based on the theme.
 */
const ThemeProvider = ({ children }) => {
  // Get the current theme from the Redux store's state
  const { theme } = useSelector(state => state.theme)

  return (
    // Apply the theme class to the outer div using template literals.
    // The theme class dynamically changes based on the current theme state.
    <div className={`theme-container ${theme}`}>
      { children }  {/* Render the child components inside the theme container */}
    </div>
  )
}

export default ThemeProvider