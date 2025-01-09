// Import necessary modules and components
import { ChevronDown } from "lucide-react"; // Importing a ChevronDown icon from the lucide-react library
import React, { useState, useEffect } from "react"; // React hooks for state management and lifecycle methods
import axios from "axios"; // Axios for making HTTP requests
import ScrollToTop from "./ScrollToTop"; // Custom component to handle scrolling to the top of the page
import { motion } from "framer-motion"; // Motion library for adding animations

// ProfilePayment component definition
const ProfilePayment = () => {
    // State to manage which accordion is open; default is "paymentMethods"
    const [openAccordion, setOpenAccordion] = useState("paymentMethods");
    // State to store the list of connected accounts fetched from the server
    const [connectedAccounts, setConnectedAccounts] = useState([]);

    // Function to toggle accordion sections
    const handleAccordionClick = (accordion) => {
        // If the clicked accordion is already open, close it; otherwise, open it
        setOpenAccordion(openAccordion === accordion ? null : accordion);
    };

    // useEffect hook to fetch connected accounts when the component mounts
    useEffect(() => {
        const fetchConnectedAccounts = async () => {
            try {
                // Making an API call to get connected accounts
                const response = await axios.get('/api/auth/connected-accounts', {
                    withCredentials: true, // Include credentials for authentication
                });
                console.log("Connected Accounts Response:", response.data); // Log API response
                // Update state with the fetched accounts or an empty array
                setConnectedAccounts(response.data.connectedAccounts || []);
            } catch (error) {
                // Log any error that occurs during the API call
                console.error("Error fetching connected accounts:", error.response?.data || error.message);
            }
        };

        fetchConnectedAccounts(); // Call the function
    }, []); // Empty dependency array ensures this runs only once on component mount

    return (
        // Motion div for fade-in/out animation when the component mounts/unmounts
        <motion.div 
            initial={{ opacity: 0 }} // Initial opacity is 0 (invisible)
            animate={{ opacity: 1 }} // Final opacity is 1 (fully visible)
            exit={{ opacity: 0 }} // Exit animation opacity back to 0
            transition={{
                duration: 0.5, // Animation duration in seconds
                ease: "easeInOut" // Easing function for smooth animation
            }}
            className="bg-blue-100 rounded-3xl sm:p-14 p-5 flex-1 flex flex-col gap-10" // Tailwind CSS classes
        >
            {/* Ensure page scrolls to the top when this component loads */}
            <ScrollToTop />
            
            {/* Main container for account information */}
            <div className="bg-white flex flex-col">
                <h1 className="font-bold text-xl py-2 px-5">My Account Info</h1>
                <hr /> {/* Divider */}

                {/* Payment Methods Accordion */}
                <div>
                    <h1
                        className="font-semibold cursor-pointer py-2 px-5 flex justify-between items-center"
                        onClick={() => handleAccordionClick("paymentMethods")}
                    >
                        Payment Methods
                        <ChevronDown
                            className={`transition-transform duration-700 ease-in-out ${
                                openAccordion === "paymentMethods" ? "rotate-180" : ""
                            }`}
                        />
                    </h1>
                    <hr />
                    <div
                        className={`overflow-hidden transition-all duration-700 ease-in-out ${
                            openAccordion === "paymentMethods" ? "max-h-screen" : "max-h-0"
                        }`}
                    >
                        <div className="px-5 py-2">
                            <h3>You have no saved cards.</h3>
                            <p>You can save a new card when you check out.</p>
                        </div>
                    </div>
                </div>

                {/* Connected Accounts Accordion */}
                <div>
                    <h1
                        className="font-semibold cursor-pointer py-2 px-5 flex justify-between items-center"
                        onClick={() => handleAccordionClick("connectedAccounts")}
                    >
                        Connected Accounts
                        <ChevronDown
                            className={`transition-transform duration-700 ease-in-out ${
                                openAccordion === "connectedAccounts" ? "rotate-180" : ""
                            }`}
                        />
                    </h1>
                    <hr />
                    <div
                        className={`overflow-hidden transition-all duration-700 ease-in-out ${
                            openAccordion === "connectedAccounts" ? "max-h-screen" : "max-h-0"
                        }`}
                    >
                        <div className="px-5 py-2">
                            {connectedAccounts.length > 0 ? ( // Render accounts if they exist
                                <ul>
                                    {connectedAccounts.map((account, index) => (
                                        <li key={index} className="flex justify-between items-center py-2">
                                            <span>
                                                {account.provider} ({account.email})
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Connected on {new Date(account.connectedAt).toLocaleDateString()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No connected accounts yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Travel Arranger Accordion */}
                <div>
                    <h1
                        className="font-semibold cursor-pointer py-2 px-5 flex justify-between items-center"
                        onClick={() => handleAccordionClick("travelArranger")}
                    >
                        Travel Arranger
                        <ChevronDown
                            className={`transition-transform duration-700 ease-in-out ${
                                openAccordion === "travelArranger" ? "rotate-180" : ""
                            }`}
                        />
                    </h1>
                    <hr />
                    <div
                        className={`overflow-hidden transition-all duration-700 ease-in-out ${
                            openAccordion === "travelArranger" ? "max-h-screen" : "max-h-0"
                        }`}
                    >
                        <div className="px-5 py-2">
                            <p>
                                Velora's Travel Arranger lets you book travel for your friends
                                or co-workers. With permission, you can arrange trips directly
                                from their account, making it simple to coordinate and manage
                                trips for any Velora traveler.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Export the component to be used in other parts of the application
export default ProfilePayment;