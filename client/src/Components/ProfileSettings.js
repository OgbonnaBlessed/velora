import { AnimatePresence, motion } from 'framer-motion'; // Import animation components for UI transitions
import { ChevronRight, X } from 'lucide-react'; // Import icons for navigation and modal close actions
import React, { useState } from 'react'; // Import React and state management hooks
import { useDispatch, useSelector } from 'react-redux'; // Redux hooks for accessing and dispatching state
import { useNavigate } from 'react-router-dom'; // Hook for programmatic navigation between routes
import ConnectedDevices from './ConnectedDevices'; // Component to manage connected devices
import {
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
} from '../redux/user/userSlice'; // Redux actions for user deletion
import ScrollToTop from './ScrollToTop'; // Utility component to ensure the page scrolls to the top

/**
 * ProfileSettings Component
 * Handles user profile settings, including email confirmation and account deletion.
 */
const ProfileSettings = () => {
    // Access the current user from the Redux store
    const { currentUser } = useSelector((state) => state.user);

    // State variables for managing modals and UI visibility
    const [showModal, setShowModal] = useState(false); // Controls general modal visibility
    const [deleteAccountModal, setDeleteAccountModal] = useState(false); // Controls delete account modal visibility
    const [displayConnectedDevices, setDisplayConnectedDevices] = useState(false); // Toggles the display of connected devices
    const [modalMessage, setModalMessage] = useState(null); // Stores messages to display in the modal

    // Hooks for navigation and Redux state management
    const navigate = useNavigate(); // Navigate to different routes
    const dispatch = useDispatch(); // Dispatch actions to the Redux store

    /**
     * Handle email confirmation request.
     * Sends a POST request to the backend API to confirm the user's email.
     */
    const handleConfirmEmail = async () => {
        try {
            // Send email confirmation request to the API
            const res = await fetch('/api/auth/confirm-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Set headers for JSON payload
                body: JSON.stringify({ email: currentUser.email }), // Pass the current user's email
            });

            const data = await res.json(); // Parse the response data

            // Handle errors and display a message in the modal if the request fails
            if (!res.ok) {
                console.error(data.message);
                setModalMessage(data.message); // Set the error message
                setShowModal(true); // Show the modal with the message
            }
        } catch (error) {
            console.error('Error sending reset email:', error); // Log errors to the console
        }
    };

    /**
     * Handle sending the confirmation email and navigate to the verification page.
     */
    const handleSendConfirmEmail = async () => {
        try {
            // Send the email confirmation request
            const res = await fetch('/api/auth/confirm-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Set headers for JSON payload
                body: JSON.stringify({ email: currentUser.email }), // Pass the current user's email
            });

            const data = await res.json(); // Parse the response data

            // Handle errors and display a message in the modal if the request fails
            if (!res.ok) {
                console.error(data.message);
                setModalMessage(data.message); // Set the error message
                setShowModal(true); // Show the modal with the message
            }

            // Navigate to the email verification page
            navigate('/verify-email');
        } catch (error) {
            console.error('Error sending reset email:', error); // Log errors to the console
        }
    };

    /**
     * Handle user account deletion.
     * Dispatches Redux actions and sends a DELETE request to the backend API.
     */
    const handleDeleteUser = async () => {
        setShowModal(false); // Close the modal

        try {
            dispatch(deleteUserStart()); // Dispatch the start of the deletion process
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE', // Use the DELETE HTTP method
            });

            const data = await res.json(); // Parse the response data

            // Handle success or failure of the deletion request
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message)); // Dispatch failure action with the error message
            } else {
                dispatch(deleteUserSuccess(data)); // Dispatch success action with the response data
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message)); // Dispatch failure action with the error message
        }
    };
    
  return (
    // A motion.div component with animation properties for smooth entrance, exit, and transitions.
    <motion.div 
        initial={{ opacity: 0 }} // Initial opacity set to 0 for a fade-in effect.
        animate={{ opacity: 1 }} // Opacity transitions to 1 when the component is rendered.
        exit={{ opacity: 0 }} // Fades out when the component is removed.
        transition={{
            duration: 0.5, // Animation duration set to 0.5 seconds.
            ease: "easeInOut" // Easing function for smooth animation.
        }}
        className='bg-blue-100 rounded-3xl sm:p-14 p-5 sm:flex-1 flex flex-col gap-10 max-w-full' // Styling the div.
    >
        {/* Component to ensure the user is scrolled to the top when navigating to this page */}
        <ScrollToTop/>

        {/* Section for "Sign-in and security" settings */}
        <div className='flex flex-col gap-5'>
            {/* Header for the section */}
            <div className='flex flex-col gap-1'>
                <h1 className='font-semibold sm:text-3xl text-2xl'>Sign-in and security</h1>
                <p className='text-sm'>
                    Keep your account safe with a secure password and by signing out of devices you're not actively using.
                </p>
            </div>

            {/* Content section containing various security options */}
            <div className='flex flex-col gap-5'>
                {/* Email confirmation option */}
                <div 
                    className='bg-white py-3 px-4 flex items-center justify-between cursor-pointer rounded-lg w-72 max-w-full relative shadow shadow-gray-300'
                    onClick={() => {
                        handleConfirmEmail(); // Function to handle email confirmation.
                        navigate('/verify-user-email'); // Navigates to the email verification page.
                    }}
                >
                    <div className='bg-[#48aadf] h-[70%] w-1.5 rounded-r-xl absolute left-0'></div>
                    <div>
                        <h2 className='font-semibold'>Email</h2>
                        <p className='text-sm'>{currentUser.email}</p> {/* Displays the user's email */}
                    </div>
                    <ChevronRight/> {/* Icon indicating the option is clickable */}
                </div>

                {/* Password change option */}
                <div 
                    className='bg-white py-3 px-4 flex items-center justify-between cursor-pointer rounded-lg h-16 w-72 max-w-full relative shadow shadow-gray-300'
                    onClick={() => {
                        handleSendConfirmEmail(); // Sends confirmation email.
                        navigate('/verify-email'); // Redirects to verify email page.
                    }}
                >
                    <div className='bg-[#48aadf] h-[70%] w-1.5 rounded-r-xl absolute left-0'></div>
                    <div>
                        <h2 className='font-semibold'>Change password</h2> {/* Option label */}
                    </div>
                    <ChevronRight/>
                </div>

                {/* Connected devices toggle */}
                <div className='flex flex-col gap-5'>
                    <div 
                        className='bg-white py-3 px-4 flex items-center justify-between cursor-pointer rounded-lg h-16 w-72 max-w-full relative shadow shadow-gray-300'
                        onClick={() => setDisplayConnectedDevices(!displayConnectedDevices)} // Toggles connected devices display.
                    >
                        <div className='bg-[#48aadf] h-[70%] w-1.5 rounded-r-xl absolute left-0'></div>
                        <div>
                            <h2 className='font-semibold'>Connected devices</h2> {/* Option label */}
                        </div>
                        <ChevronRight 
                            className={`transition-all duration-300 ease-in-out 
                                ${displayConnectedDevices ? 'rotate-90' : ''}`} // Rotates the arrow icon when toggled.
                        />
                    </div>

                    {/* Displays connected devices list if toggle is active */}
                    <div className={`overflow-hidden ml-5 transition duration-300 ease-in-out 
                            ${displayConnectedDevices ? 'max-h-screen' : 'h-0'}`}
                    >
                        <ConnectedDevices/> {/* Connected devices component */}
                    </div>
                </div>
            </div>
        </div>

        {/* Section for "Account management" */}
        <div className='flex flex-col gap-5'>
            <div>
                <h1 className='font-semibold sm:text-3xl text-2xl'>Account management</h1>
                <p className='text-sm'>Control other options to manage your data, like deleting your account.</p>
            </div>

            <div className='flex flex-col gap-5'>
                {/* Placeholder option */}
                <div className='bg-white py-3 px-4 flex items-center justify-between cursor-pointer rounded-lg h-16 w-72 max-w-full relative shadow shadow-gray-300'>
                    <div className='bg-[#48aadf] h-[70%] w-1.5 rounded-r-xl absolute left-0'></div>
                    <div>
                        <h2 className='font-semibold'>Traveler arranger</h2>
                    </div>
                    <ChevronRight/>
                </div>

                {/* Account deletion option */}
                <p 
                    className='hover:underline text-[#1158a6] text-sm cursor-pointer w-fit'
                    onClick={() => {
                        setDeleteAccountModal(!deleteAccountModal); // Toggles account deletion modal.
                        setModalMessage('Your data will be permanently deleted from Velora'); // Sets a warning message.
                    }}
                >
                    Delete account
                </p>
                <p className='text-sm'>Permanently delete your Velora account and data.</p>
            </div>
        </div>

        {/* Modal for general messages */}
        <AnimatePresence>
            {showModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.5,
                        ease: 'easeInOut'
                    }}
                    exit={{ opacity: 0 }}
                    className="fixed left-0 right-0 top-0 bottom-0 z-[10001] bg-black/25 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeInOut'
                        }}
                        exit={{ opacity: 0 }}
                        className="relative bg-[#ECECEC] p-5 pt-8 rounded-xl w-64 max-w-[90%] flex justify-center items-center flex-col gap-4"
                    >
                        <X
                            className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8"
                            onClick={() => setShowModal(false)} // Closes the modal.
                        />
                        <p className="font-serif pt-2 text-center">{modalMessage}</p> {/* Displays the modal message */}
                        <div className="actions">
                            <button 
                                type="button" 
                                className="bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full"
                                onClick={() => setShowModal(false)} // Closes the modal on OK click.
                            >
                                OK
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Modal for account deletion confirmation */}
        <AnimatePresence>
            {deleteAccountModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.5,
                        ease: 'easeInOut'
                    }}
                    exit={{ opacity: 0 }}
                    className="fixed left-0 right-0 top-0 bottom-0 z-[10001] bg-black/25 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeInOut'
                        }}
                        exit={{ opacity: 0 }}
                        className="relative bg-[#ECECEC] p-5 pt-8 rounded-xl w-64 max-w-[90%] flex justify-center items-center flex-col gap-4"
                    >
                        <X
                            className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8"
                            onClick={() => setDeleteAccountModal(false)} // Closes the modal.
                        />
                        <p className="font-serif pt-2 text-center">{modalMessage}</p> {/* Warning message */}
                        <div className="flex items-center gap-4">
                            <button 
                                type="button" 
                                className="bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full"
                                onClick={() => {
                                    setShowModal(false);
                                    handleDeleteUser(); // Triggers account deletion.
                                }}
                            >
                                Delete
                            </button>
                            <button 
                                type="button" 
                                className="bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full"
                                onClick={() => setDeleteAccountModal(false)} // Cancels account deletion.
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
  )
}

export default ProfileSettings