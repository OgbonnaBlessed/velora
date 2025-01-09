// Import necessary hooks and components
import { useEffect } from 'react';  // Import the useEffect hook from React for side-effects
import { useLocation } from 'react-router-dom';  // Import useLocation hook from React Router to access the current URL

// ScrollToTop component definition
const ScrollToTop = () => {
    // Destructure pathname from the location object provided by useLocation hook
    const { pathname } = useLocation(); // pathname gives the current path (URL) of the page

    // useEffect hook to trigger a side-effect when the pathname changes
    useEffect(() => {
        // Scroll the window to the top (coordinates (0, 0)) whenever the pathname (URL) changes
        window.scrollTo(0, 0); // Scrolls the window to the top-left corner
    }, [pathname]); // Dependency array is [pathname], meaning this effect will run whenever the pathname changes

    // The component does not render anything visually, it just handles the scroll behavior
    return null; // Returning null because this component is for side-effects, not for rendering UI
};

// Export the ScrollToTop component to be used in other parts of the app
export default ScrollToTop;