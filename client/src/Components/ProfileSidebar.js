/* eslint-disable jsx-a11y/img-redundant-alt */
import axios from "axios"; // Library for making HTTP requests
import { CalendarCog, Camera, ChevronRight, CreditCardIcon, SettingsIcon, StarIcon } from "lucide-react"; // Icons for UI elements
import React, { useRef } from "react"; // React hooks for state and refs
import { FaUser } from "react-icons/fa"; // User icon from React Icons library
import { useDispatch, useSelector } from "react-redux"; // Redux hooks for dispatching actions and accessing state
import { useState, useEffect } from "react"; // React hooks for managing state and lifecycle
import { Link, useLocation } from "react-router-dom"; // For routing and navigation
import { signOutSuccess, updateFailure, updateStart, updateSuccess } from "../redux/user/userSlice"; // Redux actions for user management
import { CircularProgressbar } from "react-circular-progressbar"; // Progress bar component
import { AnimatePresence, motion } from "framer-motion"; // Animation library
import { FiMoreHorizontal } from 'react-icons/fi'; // Icon for more options

// Cloudinary configuration constants
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dddvbg9tm/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "velora";

const ProfileSidebar = () => {
    // Redux state for the current user and errors
    const { currentUser, error } = useSelector((state) => state.user);
    
    // State variables for managing component state
    const [tab, setTab] = useState("details"); // Current active tab
    const [imageFile, setImageFile] = useState(null); // Selected image file
    const [imageFileUrl, setImageFileUrl] = useState(currentUser.profilePicture); // Image URL
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); // Upload progress
    const [imageFileUploadError, setImageFileUploadError] = useState(null); // Upload error
    const [imageFileUploading, setImageFileUploading] = useState(false); // Upload status
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null); // Success message for user update
    const [updateUserError, setUpdateUserError] = useState(null); // Error message for user update
    const [sidebar, setSidebar] = useState(false); // Sidebar toggle state
    
    // References for DOM elements and routing location
    const location = useLocation();
    const dispatch = useDispatch();
    const filePickerRef = useRef();
    const sidebarRef = useRef();

    // Handle file selection for profile picture
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if the file is an image
            if (file.type.startsWith("image/")) {
                setImageFile(file); // Set the selected image file
                setImageFileUrl(URL.createObjectURL(file)); // Generate a preview URL
            } else {
                setUpdateUserError("Only image files are allowed");
                setImageFile(null);
            }
        }
    };

    // Upload the image whenever imageFile is updated
    useEffect(() => {
        if (imageFile) {
            uploadImageToCloudinary();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageFile]);

    // Handle user profile update with the new image URL
    const handleSubmit = async (imageUrl) => {
        try {
            dispatch(updateStart()); // Indicate the start of an update
            const res = await axios.put(
                `/api/user/update/${currentUser._id}`, 
                { profilePicture: imageUrl }, 
                { headers: { "Content-Type": "application/json" } }
            );
    
            if (res.status === 200) {
                dispatch(updateSuccess(res.data)); // Update successful
                setUpdateUserSuccess("Image uploaded successfully");
            } else {
                dispatch(updateFailure(res.data.message)); // Update failed
                setUpdateUserError(res.data.message);
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    // Upload the image file to Cloudinary
    const uploadImageToCloudinary = async () => {
        setImageFileUploading(true); // Indicate that the upload has started
        setImageFileUploadProgress(0); // Reset the progress
    
        const formData = new FormData();
        formData.append("file", imageFile); // Add the file to the form data
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); // Add the upload preset
    
        try {
            const res = await axios.post(CLOUDINARY_URL, formData, {
                onUploadProgress: (progressEvent) => {
                    // Update progress state during upload
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    setImageFileUploadProgress(progress);
                },
            });
    
            const imageUrl = res.data.secure_url; // Get the uploaded image URL
            setImageFileUrl(imageUrl); // Update the state with the new URL
    
            setImageFileUploading(false); // Reset upload state
            setImageFileUploadProgress(0);
            handleSubmit(imageUrl); // Trigger profile update with the new image
        } catch (error) {
            setUpdateUserError("Image upload failed. Please try again.");
            setImageFileUploading(false);
        }
    };

    // Handle user sign-out
    const handleSignOut = async () => {
        try {
            const res = await axios.post("/api/user/signout");
            if (res.status === 200) {
                dispatch(signOutSuccess()); // Dispatch sign-out action
            } else {
                console.log(res.data.message); // Log any errors
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    // Automatically clear success and error messages after 2 seconds
    useEffect(() => {
        if (updateUserSuccess || updateUserError || error || imageFileUploadError) {
            const timer = setTimeout(() => {
                setUpdateUserSuccess(null);
                setUpdateUserError(null);
                setImageFileUploadError(null);
            }, 2000);

            return () => clearTimeout(timer); // Clear timer on unmount
        }
    }, [updateUserSuccess, updateUserError, error, imageFileUploadError]);

    // Update the active tab based on URL query parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
    
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    // Close the sidebar when clicking outside of it
    useEffect(() => {
        const closeSidebar = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebar(false);
            }
        };

        document.addEventListener('mousedown', closeSidebar); // Add event listener

        return () => {
            document.removeEventListener('mousedown', closeSidebar); // Clean up listener
        };
    }, []);

    // Toggle the sidebar visibility
    const toggleSidebar = () => {
        setSidebar(!sidebar);
    };

  return (
    <>
        {/* Hamburger menu icon (only visible on smaller screens) to toggle the sidebar */}
        <FiMoreHorizontal 
            className="xl:hidden block fixed left-5 top-36 bg-white shadow shadow-gray-300 rounded-md p-2 text-3xl cursor-pointer z-10"
            onClick={() => setSidebar(!sidebar)} // Toggles the sidebar's visibility
        />

        {/* Sidebar container (hidden on smaller screens, visible on larger screens) */}
        <div className='max-xl:hidden xl:w-72 xl:flex flex-col gap-10'>

            {/* User profile section */}
            <div className='flex items-start gap-3'>

                {/* Profile picture container */}
                <div className='relative'>
                    {/* Hidden file input for selecting profile picture */}
                    <input 
                        type="file" 
                        accept='image/*' 
                        onChange={handleImageChange} // Handles the image selection logic
                        ref={filePickerRef} // Reference for programmatically opening the file picker
                        className='hidden' // Hides the file input from the UI
                    />
                    
                    {/* Profile picture display */}
                    <img 
                        src={imageFileUrl || currentUser.profilePicture} // Displays the selected or existing profile picture
                        alt="profile picture" 
                        className={`w-14 h-14 rounded-full transition-all duration-300 ease-in-out
                            ${imageFileUploading ? 'opacity-[0.4]' : 'opacity-100'}`}
                        style={{
                            opacity: imageFileUploading 
                                ? (0.4 + (imageFileUploadProgress / 250)) // Dynamically adjusts opacity during upload
                                : 1
                        }}
                    />

                    {/* Upload progress indicator */}
                    {imageFileUploading && (
                        <div className="absolute top-0 left-0 w-14 h-14 flex items-center justify-center">
                            <CircularProgressbar
                                value={imageFileUploadProgress || 0} // Current upload progress percentage
                                text={`${imageFileUploadProgress}%`} // Displays progress text
                                strokeWidth={5} // Thickness of the progress bar
                                styles={{
                                    path: {
                                        stroke: `rgba(64, 120, 188, ${imageFileUploadProgress / 100})`, // Progress bar color
                                    },
                                    text: {
                                        fill: "white", // Text color
                                        fontSize: "0.8rem",
                                        fontWeight: "bold",
                                        dominantBaseline: "central", // Align text vertically
                                        textAnchor: "middle", // Align text horizontally
                                    },
                                }}
                            />
                        </div>
                    )}

                    {/* Camera icon to trigger file picker */}
                    <Camera 
                        className='absolute bg-gray-300 rounded-full p-1 text-[#48aadf] bottom-0 right-0 cursor-pointer'
                        onClick={() => filePickerRef.current.click()} // Opens file picker when clicked
                    />
                </div>

                {/* User information */}
                <div>
                    <h2 className='font-medium'>Welcome, {currentUser.firstName}</h2> {/* Displays user's first name */}
                    <p className='text-sm'>{currentUser.email}</p> {/* Displays user's email */}
                </div>
            </div>

            {/* Success message for image upload */}
            <p 
                className={`text-[0.7rem] -mt-8 text-green-500 transform transition-all duration-700 ease-in-out 
                    ${
                        updateUserSuccess 
                        ? 'opacity-1 translate-y-0 pointer-events-auto' // Shows message when upload is successful
                        : 'opacity-0 -translate-y-5 pointer-events-none' // Hides message otherwise
                    }`}
            >
                {updateUserSuccess}
            </p>

            {/* Error message for image upload */}
            <p 
                className={`text-[0.7rem] -mt-8 text-red-500 self-start transform transition-all duration-700 ease-in-out 
                    ${
                        updateUserError 
                        ? 'opacity-1 translate-y-0 pointer-events-auto' // Shows error message if upload fails
                        : 'opacity-0 -translate-y-5 pointer-events-none' // Hides message otherwise
                    }`}
            >
                {updateUserError}
            </p>

            {/* Sidebar links */}
            <div className='flex flex-col gap-5'>

                {/* Profile tab link */}
                <Link 
                    to='/profile?tab=details'
                    className={`relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20 
                        ${tab === 'details' ? 'border-0' : ''}` // Highlights the active tab
                    }
                >
                    <FaUser className='text-xl'/> {/* Icon for the Profile tab */}
                    <div className='w-[70%]'>
                        <h2 className='font-medium'>Profile</h2>
                        <p className='text-[0.7rem]'>Provide your personal details and travel documents</p>
                    </div>
                    <ChevronRight className='text-3xl absolute right-2'/> {/* Right arrow icon */}
                </Link>

                {/* Payment methods tab link */}
                <Link 
                    to='/profile?tab=payment'
                    className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                >
                    <CreditCardIcon className='text-xl'/> {/* Icon for Payment methods */}
                    <div className='w-[70%]'>
                        <h2 className='font-medium'>Payment methods</h2>
                        <p className='text-[0.7rem]'>View saved payment methods</p>
                    </div>
                    <ChevronRight className='text-3xl absolute right-2'/>
                </Link>

                {/* Reviews tab link */}
                <Link 
                    to='/profile?tab=reviews'
                    className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                >
                    <StarIcon className='text-xl'/> {/* Icon for Reviews */}
                    <div className='w-[70%]'>
                        <h2 className='font-medium'>Reviews</h2>
                        <p className='text-[0.7rem]'>Read reviews you've shared</p>
                    </div>
                    <ChevronRight className='text-3xl absolute right-2'/>
                </Link>

                {/* Bookings tab link */}
                <Link
                    to='/profile?tab=bookings'
                    className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                >
                    <CalendarCog className='text-xl'/> {/* Icon for Manage Bookings */}
                    <div className="w-[70%]">
                        <h2 className="font-medium">Manage Bookings</h2>
                        <p className="text-[0.7rem]">Manage your bookings</p>
                    </div>
                    <ChevronRight className="text-3xl absolute right-2" />
                </Link>

                {/* Settings tab link */}
                <Link 
                    to='/profile?tab=settings'
                    className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                >
                    <SettingsIcon className='text-xl'/> {/* Icon for Settings */}
                    <div className='w-[70%]'>
                        <h2 className='font-medium'>Security and settings</h2>
                        <p className='text-[0.7rem]'>Update your email or password</p>
                    </div>
                    <ChevronRight className='text-3xl absolute right-2'/>
                </Link>

                {/* Sign-out option */}
                <div className='text-lg font-medium h-20 w-full flex items-center justify-center'>
                    <p 
                        className='cursor-pointer text-[#4078bc] text-lg font-medium'
                        onClick={handleSignOut} // Handles user sign-out
                    >
                        Sign out
                    </p> 
                </div>
            </div>
        </div>

        <AnimatePresence>
            {/* Conditionally render the sidebar when sidebar state is true */}
            {sidebar && 
                <motion.div
                    // Initial animation state: sidebar is invisible
                    initial={{ opacity: 0 }}
                    // Animate to full opacity when the sidebar appears
                    animate={{ opacity: 1 }}
                    // Exit animation: fade out when the sidebar disappears
                    exit={{ opacity: 0 }}
                    // Transition settings for smooth animation
                    transition={{
                        duration: 0.5, // Animation duration in seconds
                        ease: "easeInOut" // Easing function for smooth transition
                    }}
                    // Styling for the backdrop overlay
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10001]"
                >
                    {/* Inner motion div for the actual sidebar content */}
                    <motion.div 
                        // Animation states and transitions
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.5,
                            ease: "easeInOut"
                        }}
                        // Reference for detecting outside clicks
                        ref={sidebarRef}
                        // Styling for the sidebar container
                        className='flex flex-col gap-7 w-[20rem] pointer-events-auto max-w-[90%] bg-white rounded-2xl z-[10002] px-6 py-4'
                    >
                        {/* User profile section */}
                        <div className='flex items-start gap-3'>
                            <div className='relative'>
                                {/* Hidden file input for profile picture upload */}
                                <input 
                                    type="file" 
                                    accept='image/*' 
                                    onChange={handleImageChange} 
                                    ref={filePickerRef}
                                    className='hidden'
                                />
                                {/* Display the user's profile picture */}
                                <img 
                                    src={imageFileUrl || currentUser.profilePicture} 
                                    alt="profile picture" 
                                    className={`w-14 h-14 rounded-full transition-all duration-300 ease-in-out
                                        ${imageFileUploading ? 'opacity-[0.4]' : 'opacity-100'}`
                                    }
                                    // Adjust opacity dynamically based on upload progress
                                    style={{
                                        opacity: imageFileUploading ? (0.4 + (imageFileUploadProgress / 250)) : 1
                                    }}
                                />
                                {/* Show upload progress indicator while uploading */}
                                {imageFileUploading && (
                                    <div className="absolute top-0 left-0 w-14 h-14 flex items-center justify-center">
                                        <CircularProgressbar
                                            value={imageFileUploadProgress || 0} // Upload progress value
                                            text={`${imageFileUploadProgress}%`} // Display progress percentage
                                            strokeWidth={5} // Thickness of the progress bar
                                            styles={{
                                                path: {
                                                    stroke: `rgba(64, 120, 188, ${imageFileUploadProgress / 100})`, // Dynamic stroke color
                                                },
                                                text: {
                                                    fill: "white",
                                                    fontSize: "0.8rem",
                                                    fontWeight: "bold",
                                                    dominantBaseline: "central", // Vertically align text
                                                    textAnchor: "middle", // Horizontally align text
                                                },
                                            }}
                                        />
                                    </div>
                                )}
                                {/* Camera icon for uploading a new picture */}
                                <Camera 
                                    className='absolute bg-gray-300 rounded-full p-1 text-[#48aadf] bottom-0 right-0 cursor-pointer'
                                    onClick={() => filePickerRef.current.click()} // Trigger file input on click
                                />
                            </div>
                            <div>
                                {/* Display user's name and email */}
                                <h2 className='font-medium'>Welcome, {currentUser.firstName}</h2>
                                <p className='text-sm'>{currentUser.email}</p>
                            </div>
                        </div>

                        {/* Success message for user updates */}
                        <p 
                            className={`text-[0.7rem] -mt-8 text-green-500 transform transition-all duration-700 ease-in-out
                                ${
                                    updateUserSuccess 
                                    ? 'opacity-1 translate-y-0 pointer-events-auto' 
                                    : 'opacity-0 -translate-y-5 pointer-events-none'
                                }`
                            }
                        >
                            {updateUserSuccess}
                        </p>

                        {/* Error message for user updates */}
                        <p 
                            className={`text-[0.7rem] -mt-8 text-red-500 self-start transform transition-all duration-700 ease-in-out 
                                ${
                                    updateUserError 
                                    ? 'opacity-1 translate-y-0 pointer-events-auto' 
                                    : 'opacity-0 -translate-y-5 pointer-events-none'
                                }`
                            }
                        >
                            {updateUserError}
                        </p>

                        {/* Sidebar links for navigation */}
                        <div className='flex flex-col gap-4'>
                            {/* Profile link */}
                            <Link 
                                to='/profile?tab=details'
                                className={`relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20 
                                    ${tab === 'details' ? 'border-0' : ''}`
                                }
                                onClick={toggleSidebar} // Close sidebar on click
                            >
                                <FaUser className='text-xl'/>
                                <div className='w-[70%]'>
                                    <h2 className='font-medium'>Profile</h2>
                                    <p className='text-[0.7rem]'>Provide your personal details and travel documents</p>
                                </div>
                                <ChevronRight className='text-3xl absolute right-2'/>
                            </Link>
                            
                            {/* Payment methods link */}
                            <Link 
                                to='/profile?tab=payment'
                                className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                                onClick={toggleSidebar}
                            >
                                <CreditCardIcon className='text-xl'/>
                                <div className='w-[70%]'>
                                    <h2 className='font-medium'>Payment methods</h2>
                                    <p className='text-[0.7rem]'>View saved payment methods</p>
                                </div>
                                <ChevronRight className='text-3xl absolute right-2'/>
                            </Link>
                            
                            {/* Reviews link */}
                            <Link 
                                to='/profile?tab=reviews'
                                className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                                onClick={toggleSidebar}
                            >
                                <StarIcon className='text-xl'/>
                                <div className='w-[70%]'>
                                    <h2 className='font-medium'>Reviews</h2>
                                    <p className='text-[0.7rem]'>Read reviews you've shared</p>
                                </div>
                                <ChevronRight className='text-3xl absolute right-2'/>
                            </Link>

                            {/* Manage bookings link */}
                            <Link
                                to='/profile?tab=bookings'
                                className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                                onClick={toggleSidebar}
                            >
                                <CalendarCog className='text-xl'/>
                                <div className="w-[70%]">
                                    <h2 className="font-medium">Manage Bookings</h2>
                                    <p className="text-[0.7rem]">Manage your bookings</p>
                                </div>
                                <ChevronRight className="text-3xl absolute right-2" />
                            </Link>

                            {/* Security and settings link */}
                            <Link 
                                to='/profile?tab=settings'
                                className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                                onClick={toggleSidebar}
                            >
                                <SettingsIcon className='text-xl'/>
                                <div className='w-[70%]'>
                                    <h2 className='font-medium'>Security and settings</h2>
                                    <p className='text-[0.7rem]'>Update your email or password</p>
                                </div>
                                <ChevronRight className='text-3xl absolute right-2'/>
                            </Link>

                            {/* Sign-out link */}
                            <div className='text-lg font-medium w-full flex items-center justify-center'>
                                <p 
                                    className='cursor-pointer text-[#4078bc] text-lg font-medium'
                                    onClick={() => {
                                        handleSignOut(); // Handle user sign-out
                                        toggleSidebar(); // Close sidebar
                                    }}
                                >
                                    Sign out
                                </p> 
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    </>
  );
};

export default ProfileSidebar;