import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom' // Link for routing to different pages
import { FaBars, FaBell, FaBriefcase, FaCar, FaClone, FaHotel, FaTelegramPlane } from 'react-icons/fa' // Icons for navigation
import { ChevronDown, Globe, Search, X } from 'lucide-react' // Additional icons for the UI
import { motion, AnimatePresence } from 'framer-motion' // For animations and transitions
import { useSelector, useDispatch } from "react-redux"; // Redux hooks for state management
import { signOutSuccess } from "../redux/user/userSlice"; // Redux action for user signout
import axios from 'axios' // To make HTTP requests to the backend
import { countries } from '../Data/Locations' // Importing countries data for the app
import { setActiveTab } from '../redux/tab/tabSlice' // Redux action for setting the active tab

const Navbar = () => {
    // Accessing current user data from Redux store
    const { currentUser } = useSelector((state) => state.user);

    // State variables to manage various UI states like modal visibility
    const [isOpen, setIsOpen] = useState(false); // For controlling sidebar visibility
    const [services, setServices] = useState(false); // For controlling services dropdown visibility
    const [sidebarServices, setSidebarServices] = useState(false); // For controlling sidebar services dropdown visibility
    const [languageModal, setLanguageModal] = useState(false); // For controlling language modal visibility
    const [profile, setProfile] = useState(false); // For controlling profile menu visibility

    // Dispatch hook to send actions to the Redux store
    const dispatch = useDispatch();

    // Refs to handle clicking outside of certain elements (for closing modals and dropdowns)
    const sidebarRef = useRef(null);
    const servicesRef = useRef(null);
    const sidebarServicesRef = useRef(null);
    const languageRef = useRef(null);
    const profileRef = useRef();

    // Toggles the profile menu visibility
    const toggleProfile = () => {
        setProfile(!profile);
    };

    // Function to toggle the services dropdown visibility
    const toggleServices = () => {
        setServices(!services);
    };

    // Function to toggle the sidebar services dropdown visibility
    const toggleSidebarServices = () => {
        setSidebarServices(!sidebarServices);
    };

    // Function to toggle the sidebar open/close with additional checks
    const toggleSidebar = () => {
        // Check if the sidebar is open and if the services dropdown is visible
        if (sidebarServices === true) {
            // Close the services dropdown first
            setSidebarServices(false);
            
            // Delay closing the sidebar to allow the dropdown to close smoothly
            setTimeout(() => {
                setIsOpen(false); // Close the sidebar after delay
            }, 800); // 800ms delay for the transition
        } else {
            // Toggle the sidebar visibility
            setIsOpen((prev) => !prev);
        }
    };

    // Handles user sign-out, sends a POST request to the backend
    const handleSignOut = async () => {
        try {
            const res = await axios.post(
                "/api/user/signout", 
                {}, // Pass an empty body as no data is needed for signout
                {
                    headers: { 'Content-Type': 'application/json' }, // Set request headers
                }
            );
    
            // Check the response status and handle accordingly
            if (res.status === 200) {
                console.log(res.data.message); // Log success message from server response
                dispatch(signOutSuccess()); // Dispatch Redux action to sign out the user
                window.scrollTo(0, 0); // Scroll to top when sign-out is successful
            } else {
                console.error("Unexpected response:", res.data.message); // Log any unexpected response
            }
        } catch (error) {
            console.error("Error during sign out:", error.message); // Log any errors during sign-out process
        }
    };

    // Effect hook to close modals or dropdowns when clicked outside of them
    useEffect(() => {
        const closeSidebar = (event) => {
            // Close sidebar if clicked outside of the sidebar
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpen(false);
            }

            // Close services dropdown if clicked outside of the services section
            if (servicesRef.current && !servicesRef.current.contains(event.target)) {
                setServices(false);
            }

            // Close sidebar services dropdown if clicked outside
            if (sidebarServicesRef.current && !sidebarServicesRef.current.contains(event.target)) {
                setSidebarServices(false);
            }

            // Close language modal if clicked outside
            if (languageRef.current && !languageRef.current.contains(event.target)) {
                setLanguageModal(false);
            }

            // Close profile menu if clicked outside
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfile(false);
            }
        };
  
        // Add event listener for mouse clicks to detect clicks outside
        document.addEventListener('mousedown', closeSidebar);
  
        // Cleanup the event listener on component unmount
        return () => {
          document.removeEventListener('mousedown', closeSidebar);
        };
    }, []); // Empty dependency array to run only once on component mount

    // Handles the click of a service and sets the active tab
    const handleServiceClick = (service) => {
        dispatch(setActiveTab(service)); // Dispatch action to update the active tab
    };

  return (
    <nav ref={sidebarRef}>
        <div className='lg:px-20 px-6 py-6 bg-[#fff] shadow shadow-gray-300 text-black flex justify-between items-center font-medium fixed top-0 w-full z-[10000] font-Roboto'>
            <div className='flex items-center gap-14'>

                {/* Logo Section */}
                <Link 
                    to='/'
                    className='flex items-center gap-1'
                    onClick={() => {
                        // Close the sidebar and services dropdown when the logo is clicked
                        setIsOpen(false); 
                        setServices(false);
                    }}
                >
                    {/* Logo Image */}
                    <img 
                        src={`${process.env.PUBLIC_URL}/images/logo.png`} 
                        alt="Velora logo" 
                        className='w-8 p-1 rounded-br-lg bg-black'
                    />
                    {/* Logo Text */}
                    <h1 className='text-xl font-sans text-black'>velora</h1>
                </Link>

                {/* Services Dropdown Section */}
                <div className='relative' ref={servicesRef}>
                    {/* Button to toggle services dropdown */}
                    <div 
                        className='hidden lg:flex items-center cursor-pointer text-[.9rem]'
                        onClick={() => setServices(!services)}
                    >
                        <p>view services</p>
                        <ChevronDown className='p-1' />
                    </div>
                    
                    {/* Services Dropdown Menu */}
                    <div className={`hidden absolute top-8 bg-white rounded-xl lg:flex flex-col transition-all duration-500 ease-in-out transform overflow-hidden shadow shadow-gray-300 font-normal text-sm
                        ${services ? 'w-64 h-96 translate-y-0 opacity-100' : 'w-0 h-0 -translate-y-3 opacity-0'}`}
                    >
                        {/* Service Options */}
                        <div className='flex flex-col py-3 w-full border-b-2 border-gray-400'>
                            {/* Stays Service */}
                            <Link 
                                to='/'
                                className='pl-5 py-3 w-full hover:bg-gray-200 transition-colors duration-300 ease-in-out'
                                onClick={() => {
                                    toggleServices();
                                    handleServiceClick('stays');
                                }}
                            >
                                <div className='flex items-center gap-2'>
                                    <FaHotel className='text-2xl'/>
                                    <p>Stays</p>
                                </div>
                            </Link>
                            {/* Flights Service */}
                            <Link 
                                to='/'
                                className='pl-5 py-3 w-full hover:bg-gray-200 transition-colors duration-300 ease-in-out'
                                onClick={() => {
                                    toggleServices();
                                    handleServiceClick('flights');
                                }}
                            >
                                <div className='flex items-center gap-2'>
                                    <FaTelegramPlane className='text-2xl'/>
                                    <p>Flights</p>
                                </div>
                            </Link>
                            {/* Cars Service */}
                            <Link 
                                to='/'
                                className='pl-5 py-3 w-full hover:bg-gray-200 transition-colors duration-300 ease-in-out'
                                onClick={() => {
                                    toggleServices();
                                    handleServiceClick('cars');
                                }}
                            >
                                <div className='flex items-center gap-2'>
                                    <FaCar className='text-2xl'/>
                                    <p>Cars</p>
                                </div>
                            </Link>
                            {/* Packages Service */}
                            <Link 
                                to='/'
                                className='pl-5 py-3 w-full hover:bg-gray-200 transition-colors duration-300 ease-in-out'
                                onClick={() => {
                                    toggleServices();
                                    handleServiceClick('packages');
                                }}
                            >
                                <div className='flex items-center gap-2'>
                                    <FaBriefcase className='text-2xl'/>
                                    <p>Packages</p>
                                </div>
                            </Link>
                            {/* Things to do Service */}
                            <Link 
                                to='/'
                                className='pl-5 py-3 w-full hover:bg-gray-200 transition-colors duration-300 ease-in-out'
                                onClick={() => {
                                    toggleServices();
                                    handleServiceClick('things-to-do');
                                }}
                            >
                                <div className='flex items-center gap-2'>
                                    <FaClone className='text-2xl'/>
                                    <p>Things to do</p>
                                </div>
                            </Link>
                        </div>

                        {/* Additional Links */}
                        <div className='flex flex-col py-3 w-full'>
                            <Link 
                                to='/deals'
                                className='pl-5 py-3 w-full hover:bg-gray-200 transition-colors duration-300 ease-in-out'
                                onClick={toggleServices}
                            >
                                Deals
                            </Link>
                            <Link 
                                to='/meeting'
                                className='pl-5 py-3 w-full hover:bg-gray-200 transition-colors duration-300 ease-in-out'
                                onClick={toggleServices}
                            >
                                Groups & meeting
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Language Selector, Links, Notifications, and Profile */}
            <div className='hidden lg:flex items-center gap-14 text-[.9rem] font-Grotesk'>
                {/* Language Selector */}
                <div>
                    <div 
                        className='flex gap-1 items-center cursor-pointer'
                        onClick={() => setLanguageModal(!languageModal)}
                    >
                        <Globe className='p-0.5'/>
                        <p>English</p>
                    </div>
                </div>

                {/* Links */}
                <Link to='/'>List your property</Link>
                <Link>Trips</Link>
                <Link to='/notifications' className='text-xl'>
                    <FaBell/>
                </Link>

                {/* Profile Section: Display user info if logged in */}
                {currentUser ? (
                    <div className="relative" ref={profileRef}>
                        <div className="w-10 h-10 rounded-full cursor-pointer">
                            {/* User Profile Image */}
                            <img
                                src={currentUser.profilePicture}
                                alt="profile icon"
                                className="w-10 h-10 cursor-pointer rounded-full"
                                onClick={toggleProfile} // Toggle profile dropdown on click
                            />
                        </div>

                        {/* Profile Dropdown Menu */}
                        <div
                            className={`absolute bg-white text-black rounded p-3 shadow shadow-gray-300 transform right-0 top-12 flex 
                                flex-col gap-2 transition-all duration-700 ease-in-out ${
                                    profile
                                    ? "opacity-1 translate-x-0 pointer-events-auto"
                                    : "opacity-0 translate-x-5 pointer-events-none"
                                }`}
                        >
                            {/* User's Name */}
                            <div className="flex items-center gap-1">
                                <p>{currentUser.firstName}</p>
                                <p>{currentUser.lastName}</p>
                            </div>
                            {/* User's Email */}
                            <p className="">{currentUser.email}</p>

                            {/* Account Link */}
                            <Link 
                                to="/profile"
                                onClick={() => setProfile(false)}
                            >
                                Account
                            </Link>

                            {/* Admin Dashboard Link (Visible only to admins) */}
                            {currentUser.isAdmin && (
                                <Link
                                    onClick={() => setProfile(false)}
                                    to="/Dashboard?tab=collection"
                                >
                                    Dashboard
                                </Link>
                            )}

                            {/* Sign Out Button */}
                            <button
                                className="border-t border-[#48aadf] py-2 w-full text-start mt-3 cursor-pointer"
                                onClick={() => handleSignOut()}
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link to="/signin">
                        sign in
                    </Link>
                )}
            </div>

            {/* Mobile Sidebar Toggle Button */}
            <div 
                className='lg:hidden'
                onClick={toggleSidebar}
            >
                <FaBars/>
            </div>
        </div>

        {/* Sidebar */}
        <aside 
            ref={sidebarServicesRef} 
            className={`z-20 fixed overflow-auto top-[4.8rem] font-Grotesk left-0 w-96 max-w-full h-[100vh] bg-gradient-to-b bg-[#ffffff] text-black lg:hidden transition-all duration-700 ease-in-out transform 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} // Sidebar positioning, visibility transition, and styling
        >
            {/* Navigation menu */}
            <nav className='flex flex-col space-y-8 mt-4 justify-center items-center overflow-auto'>
                
                {/* Conditional rendering based on user login status */}
                {currentUser
                    ?   <div className='flex flex-col gap-3 text-gray-600 items-center font-semibold'>
                            {/* Display user's name and email */}
                            <div className='flex items-center gap-1'>
                                <p>{currentUser.firstName}</p>
                                <p>{currentUser.lastName}</p>
                            </div>
                            <p>{currentUser.email}</p>
                            {/* Link to user profile */}
                            <Link 
                                to='/profile'
                                onClick={toggleSidebar} // Close sidebar on link click
                            >
                                Account
                            </Link>
                            {/* Sign out button */}
                            <p 
                                className='border border-[#48aadf] px-10 py-2 cursor-pointer rounded-full'
                                onClick={() => {
                                    handleSignOut(); // Sign out logic
                                    toggleSidebar(); // Close sidebar on sign out
                                }}
                            >
                                Sign out
                            </p>
                        </div>
                    :   <Link 
                            to="/signin" 
                            className="relative text-black"
                            onClick={toggleSidebar} // Close sidebar on click
                        >
                            {/* Sign-in button */}
                            <button
                                className='rounded-full border border-[#48aadf] text-gray-500 font-semibold px-10 py-2 cursor-pointer'
                            >
                                Sign in
                            </button> 
                        </Link>
                }
                
                {/* Notifications link */}
                <Link 
                    to="/notifications" 
                    className="relative self-start px-6"
                    onClick={toggleSidebar} // Close sidebar on link click
                >
                    Notifications 
                </Link>

                {/* Services section with toggling functionality */}
                <div className='flex flex-col space-y-4 mt-4 p-4 border border-x-0 border-y-gray-400 w-[100%]'>
                    <div className='relative flex flex-col gap-4'>
                        {/* Toggle button for services dropdown */}
                        <div
                            className='flex items-center gap-2'
                            onClick={toggleSidebarServices} // Toggle the visibility of services
                        >
                            <Search /> View services
                        </div>
                        {/* Dropdown menu for services */}
                        <div 
                            className={`lg:hidden bg-blue-100 text-black rounded-xl flex flex-col transition-all duration-700 ease-in-out transform overflow-hidden font-normal text-sm
                                ${sidebarServices ? 'h-96' : 'h-0'}`} // Conditionally show/hide services based on sidebarServices state
                        >
                            {/* Services links */}
                            <div className='flex flex-col py-3 w-full border-b-2 border-gray-400'>
                                {/* Link for Stays */}
                                <Link 
                                    to='/'
                                    className='pl-5 py-3 w-full hover:bg-[gray-200] hover:text-black transition-colors duration-300 ease-in-out'
                                    onClick={() => {
                                        toggleSidebar();
                                        handleServiceClick('stays'); // Handle stay service click
                                    }}
                                >
                                    <div className='flex items-center gap-2'>
                                        <FaHotel className='text-2xl'/>
                                        <p>Stays</p>
                                    </div>
                                </Link>
                                {/* Link for Flights */}
                                <Link 
                                    to='/'
                                    className='pl-5 py-3 w-full hover:bg-gray-200 hover:text-black transition-colors duration-300 ease-in-out'
                                    onClick={() => {
                                        toggleSidebar();
                                        handleServiceClick('flights'); // Handle flight service click
                                    }}
                                >
                                    <div className='flex items-center gap-2'>
                                        <FaTelegramPlane className='text-2xl'/>
                                        <p>Flights</p>
                                    </div>
                                </Link>
                                {/* Link for Cars */}
                                <Link 
                                    to='/'
                                    className='pl-5 py-3 w-full hover:bg-gray-200 hover:text-black transition-colors duration-300 ease-in-out'
                                    onClick={() => {
                                        toggleSidebar();
                                        handleServiceClick('cars'); // Handle car service click
                                    }}
                                >
                                    <div className='flex items-center gap-2'>
                                        <FaCar className='text-2xl'/>
                                        <p>Cars</p>
                                    </div>
                                </Link>
                                {/* Link for Packages */}
                                <Link 
                                    to='/'
                                    className='pl-5 py-3 w-full hover:bg-gray-200 hover:text-black transition-colors duration-300 ease-in-out'
                                    onClick={() => {
                                        toggleSidebar();
                                        handleServiceClick('packages'); // Handle package service click
                                    }}
                                >
                                    <div className='flex items-center gap-2'>
                                        <FaBriefcase className='text-2xl'/>
                                        <p>Packages</p>
                                    </div>
                                </Link>
                                {/* Link for Things to do */}
                                <Link 
                                    to='/'
                                    className='pl-5 py-3 w-full hover:bg-gray-200 hover:text-black transition-colors duration-300 ease-in-out'
                                    onClick={() => {
                                        toggleSidebar();
                                        handleServiceClick('things-to-do'); // Handle things to do service click
                                    }}
                                >
                                    <div className='flex items-center gap-2'>
                                        <FaClone className='text-2xl'/>
                                        <p>Things to do</p>
                                    </div>
                                </Link>
                            </div>
                            {/* Additional services links */}
                            <div className='flex flex-col py-3 w-full'>
                                <Link 
                                    to='/'
                                    className='pl-5 py-3 w-full hover:bg-gray-200 hover:text-black transition-colors duration-300 ease-in-out'
                                    onClick={toggleSidebar} // Close sidebar on click
                                >
                                    Deals
                                </Link>
                                <Link 
                                    to='/'
                                    className='pl-5 py-3 w-full hover:bg-gray-200 hover:text-black transition-colors duration-300 ease-in-out'
                                    onClick={toggleSidebar} // Close sidebar on click
                                >
                                    Groups & meeting
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Language selection */}
                    <Link 
                        className='flex items-center gap-2'
                        onClick={() => {
                            toggleSidebar();
                            setLanguageModal(!languageModal); // Toggle language modal
                        }}
                    >
                        <Globe /> English
                    </Link>
                </div>

                {/* Footer links */}
                <div className='flex flex-col space-y-8 px-6 pb-4 border-0 w-full'>
                    <Link 
                        to="/property" 
                        className=''
                        onClick={toggleSidebar} // Close sidebar on click
                    >
                        List your property
                    </Link>
                    <Link 
                        to="/trips" 
                        className=''
                        onClick={toggleSidebar} // Close sidebar on click
                    >
                        Trips
                    </Link>
                    <Link 
                        to="/feedback" 
                        className=''
                        onClick={toggleSidebar} // Close sidebar on click
                    >
                        Feedback
                    </Link>
                </div>
            </nav>
        </aside>

        {/* AnimatePresence ensures smooth exit animations for the modal */}
        <AnimatePresence>
            {/* Conditionally render the language modal based on the 'languageModal' state */}
            {languageModal && 
                <motion.div
                    // Initial opacity is 0 for fade-in effect, final opacity is 1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        // Set the duration of the transition to 0.5 seconds and apply easeInOut easing function
                        duration: .5,
                        ease: "easeInOut"
                    }}
                    className='fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center'
                >
                    {/* Modal content with motion for vertical sliding and opacity */}
                    <motion.div
                        initial={{
                            opacity: 0, // Modal starts with no opacity
                            y: -50      // Modal starts above the view (50px above)
                        }}
                        animate={{
                            opacity: 1,  // Modal fades in with full opacity
                            y: 0         // Modal slides into place
                        }}
                        exit={{
                            opacity: 0,  // Modal fades out
                            y: -50       // Modal slides up (above the view)
                        }}
                        transition={{
                            duration: .5,  // Duration for the transition effect
                            ease: "easeInOut" // Easing function to smooth the animation
                        }}
                        className='rounded-2xl p-4 flex flex-col gap-3 bg-white w-96 max-w-[90%]' // Styling for the modal content
                        ref={languageRef}
                    >
                        {/* Close button and title */}
                        <div className='flex items-center gap-3'>
                            {/* Close button */}
                            <div 
                                className='bg-[#48aadf13] p-1.5 rounded-full cursor-pointer text-[#48aadf]'
                                onClick={() => {
                                    // Close the modal when clicked
                                    setLanguageModal(false)
                                }}
                            >
                                {/* X icon for closing */}
                                <X className='p-0.5' />
                            </div>
                            <p>Language settings</p>
                        </div>

                        {/* Region dropdown */}
                        <div className='relative w-full'>
                            {/* Chevron icon indicating dropdown */}
                            <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                            <label 
                                htmlFor="region"
                                className='text-[0.7rem] absolute top-1.5 left-3'
                            >
                                Region
                            </label>
                            <select 
                                id="travelDocument.country" // ID for the dropdown
                                className='w-full shadow shadow-gray-400 pt-6 pb-3 px-3 pr-5 bg-transparent rounded-md text-black appearance-none text-base cursor-pointer'
                            >
                                {/* Render list of countries dynamically */}
                                {countries.map((country, i) => (
                                    <option 
                                        key={i} 
                                        value={country.name} // Set value to country name
                                    >
                                        {country.name} {/* Display country name in dropdown */}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Language dropdown */}
                        <div className='relative w-full'>
                            {/* Chevron icon indicating dropdown */}
                            <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                            <label 
                                htmlFor="language"
                                className='text-[0.7rem] absolute top-1.5 left-3'
                            >
                                Language
                            </label>
                            <select 
                                id="travelDocument.language" // ID for the language dropdown
                                className='w-full shadow shadow-gray-400 pt-6 pb-3 px-3 pr-5 bg-transparent rounded-md text-black appearance-none text-base cursor-pointer'
                            >
                                {/* Render languages dynamically based on selected country */}
                                {countries.map((country, i) => (
                                    <option 
                                        key={i} 
                                        value={country.language} // Set value to country language
                                    >
                                        {country.language} {/* Display language in dropdown */}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Currency dropdown (disabled) */}
                        <div className='relative w-full'>
                            {/* Chevron icon indicating dropdown */}
                            <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                            <label 
                                htmlFor="currency"
                                className='text-[0.7rem] absolute top-1.5 left-3'
                            >
                                Currency
                            </label>
                            <select 
                                id="currency"
                                disabled // Disable this dropdown as currency is fixed
                                className='w-full shadow shadow-gray-400 pt-6 pb-3 px-3 pr-5 bg-transparent rounded-md text-black appearance-none text-base cursor-pointer'
                            >
                                {/* Pre-set options for currency */}
                                <option value="$ USD">$ USD</option>
                                <option value="€ EURO">€ EURO</option>
                            </select>
                        </div>

                        {/* Save button */}
                        <button 
                            type="submit"
                            className='bg-[#48aadf] text-white rounded-full py-3 font-semibold cursor-pointer mt-3'
                        >
                            Save {/* Button to save changes */}
                        </button>
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    </nav>
  )
}

export default Navbar