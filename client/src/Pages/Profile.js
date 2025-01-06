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

const UserProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState("collection");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); 
    const tabFromUrl = urlParams.get("tab");

    if (!tabFromUrl && location.pathname === "/profile") {
      navigate("/profile?tab=details", { replace: true });
      setTab("details");
    } else if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search, location.pathname, navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: .5,
        ease: "easeInOut"
      }}
      className="flex gap-5 px-4 sm:px-6 lg:px-20 pt-24 pb-10"
    >
      <ProfileSidebar/>

      {tab === 'details' && <ProfileDetails/>}
      {tab === 'payment' && <ProfilePayment/>}
      {tab === 'reviews' && <ProfileReviews/>}
      {tab === 'settings' && <ProfileSettings/>}
      {tab === 'edit_basic_details' && <BasicDetails/>}
      {tab === 'edit_contact_details' && <ContactDetails/>}
      {tab === 'bookings' && <ProfileBookings/>}
    </motion.div>
  );
};

export default UserProfile;