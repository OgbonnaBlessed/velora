import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileSidebar from "../Components/ProfileSidebar";
import ProfileDetails from "../Components/ProfileDetails";
import ProfileReviews from "../Components/ProfileReviews";
import ProfileSettings from "../Components/ProfileSettings";
import ProfilePayment from "../Components/ProfilePayment";
import BasicDetails from "../Components/BasicDetails";
import ContactDetails from "../Components/ContactDetails";
import ProfileBookings from "../Components/ProfileBookings";
import { motion } from "framer-motion";

// UserProfile component serves as the profile page for the user, handling different tabs such as details, settings, etc.
const UserProfile = () => {
  // useLocation is a hook from 'react-router-dom' to get the current location object, which includes the pathname and search params.
  const location = useLocation();
  // useNavigate is a hook from 'react-router-dom' to programmatically navigate the user to another page.
  const navigate = useNavigate();
  // useState is used to keep track of the currently selected tab in the profile.
  const [tab, setTab] = useState("collection");

  // useEffect is used to run some side-effects. This particular effect reads the URL parameters and sets the tab accordingly.
  useEffect(() => {
    // Creating a new URLSearchParams instance to parse query parameters from the current URL.
    const urlParams = new URLSearchParams(location.search); 
    // Extracting the value of the 'tab' query parameter.
    const tabFromUrl = urlParams.get("tab");

    // If there is no 'tab' query parameter and we're on the profile page ('/profile'), navigate to the details tab by default.
    if (!tabFromUrl && location.pathname === "/profile") {
      navigate("/profile?tab=details", { replace: true });
      setTab("details");
    } 
    // If 'tab' parameter exists, set the corresponding tab.
    else if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search, location.pathname, navigate]); // Dependency array: the effect depends on the URL search params, pathname, and navigate.

  return (
    // Motion.div is used here to animate the profile page's transitions.
    // It animates the opacity when the component is mounted and unmounted.
    <motion.div 
      initial={{ opacity: 0 }} // Initial state of opacity set to 0 when the component mounts.
      animate={{ opacity: 1 }} // The final opacity when the component is fully rendered.
      exit={{ opacity: 0 }} // When the component unmounts, it fades out to opacity 0.
      transition={{
        duration: .5, // Duration of the transition in seconds.
        ease: "easeInOut" // Easing function for a smooth transition.
      }}
      className="flex gap-5 px-4 sm:px-6 lg:px-20 pt-24 pb-10 bg-white"
    >
      {/* ProfileSidebar component is displayed on the left side of the screen, allowing navigation between profile sections. */}
      <ProfileSidebar/>

      {/* Conditional rendering based on the current tab */}
      {/* Each of the components below will only render if the current tab matches the tab state. */}
      {tab === 'details' && <ProfileDetails/>}  {/* ProfileDetails is shown if 'details' tab is selected */}
      {tab === 'payment' && <ProfilePayment/>}  {/* ProfilePayment is shown if 'payment' tab is selected */}
      {tab === 'reviews' && <ProfileReviews/>}  {/* ProfileReviews is shown if 'reviews' tab is selected */}
      {tab === 'settings' && <ProfileSettings/>}  {/* ProfileSettings is shown if 'settings' tab is selected */}
      {tab === 'edit_basic_details' && <BasicDetails/>}  {/* BasicDetails is shown if 'edit_basic_details' tab is selected */}
      {tab === 'edit_contact_details' && <ContactDetails/>}  {/* ContactDetails is shown if 'edit_contact_details' tab is selected */}
      {tab === 'bookings' && <ProfileBookings/>}  {/* ProfileBookings is shown if 'bookings' tab is selected */}
    </motion.div>
  );
};

// Exporting UserProfile component to make it available for use in other parts of the app.
export default UserProfile;