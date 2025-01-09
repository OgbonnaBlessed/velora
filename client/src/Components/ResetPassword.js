import React, { useEffect, useRef, useState } from 'react';
// Import React and necessary hooks: useEffect, useRef, and useState for state and lifecycle management.

import { ArrowLeft, EyeClosedIcon, EyeIcon } from 'lucide-react';
// Import icons from the lucide-react library for UI elements (e.g., back arrow and password visibility toggle).

import { useSelector } from 'react-redux';
// Import useSelector from react-redux to access the current user from the Redux state.

import { useNavigate } from 'react-router-dom';
// Import useNavigate from react-router-dom for navigation between routes.

import { motion } from 'framer-motion';
// Import motion from framer-motion for animations.

const ResetPassword = () => {
    // Define the ResetPassword functional component.

    const { currentUser } = useSelector((state) => state.user);
    // Use useSelector to access the current user's details from the Redux store.

    const [password, setPassword] = useState("");
    // State for the user's current password (optional use case).

    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    // State to toggle visibility of the new password field.

    const [strength, setStrength] = useState("weak");
    // State to track the strength of the new password (e.g., weak, good, strong).

    const [isFocused3, setIsFocused3] = useState(false);
    // State to track if the password input field is focused (used for UI effects).

    const [newPassword, setNewPassword] = useState("");
    // State to hold the value of the new password entered by the user.

    const [modalMessage, setModalMessage] = useState(null);
    // State to display error or success messages in a modal.

    const [strengthConditions, setStrengthConditions] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });
    // State to track whether specific password strength conditions are met.

    const passwordRef = useRef(null);
    // Reference to the password input field for detecting clicks outside it.

    const navigate = useNavigate();
    // Initialize useNavigate for programmatic navigation.

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        // Update the new password state as the user types.

        // Check password strength conditions.
        const conditions = {
            length: value.length >= 8,
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            number: /[0-9]/.test(value),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        };

        setStrengthConditions(conditions);
        // Update the state for password strength conditions.

        // Determine password strength based on satisfied conditions.
        const satisfiedConditions = Object.values(conditions).filter(Boolean).length;

        if (satisfiedConditions <= 2) setStrength("weak");
        else if (satisfiedConditions === 3 || satisfiedConditions === 4)
        setStrength("good");
        else if (satisfiedConditions === 5) setStrength("strong");
    };

    const handleResetPassword = async () => {
        // Function to handle password reset.

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: currentUser.email, newPassword }),
            });
            // Make a POST request to reset the password with the user's email and new password.

            const data = await res.json();
            // Parse the response as JSON.

            if (res.ok) {
                navigate('/password-reset-success');
                // If the response is successful, navigate to the success page.
            } else {
                console.error('Error resetting password:', data.message);
                setModalMessage(data.message);
                // If there's an error, log it and display the error message in a modal.
            }
        } catch (error) {
        console.error('Error resetting password:', error);
        // Log any network or unexpected errors.
        }
    };

    useEffect(() => {
        // Effect to close the password strength checker when clicking outside the input.

        const close_password_strength_checker = (event) => {
        if (passwordRef.current && !passwordRef.current.contains(event.target)) {
            setPassword(false);
            // Close the password strength checker if the click is outside the input field.
        }
        };

        document.addEventListener("mousedown", close_password_strength_checker);
        // Add event listener for mouse clicks.

        return () => {
        document.removeEventListener("mousedown", close_password_strength_checker);
        // Clean up the event listener when the component is unmounted.
        };
    }, []);
    // Dependency array is empty to ensure the effect runs once when the component mounts.

    return (
        <motion.div 
            initial={{ opacity: 0 }} // Initial opacity is 0 (hidden)
            animate={{ opacity: 1 }} // Animate to full opacity (visible)
            exit={{ opacity: 0 }} // When exiting, fade out (opacity 0)
            transition={{
                duration: .5, // Transition duration set to 0.5s
                ease: "easeInOut" // Apply an ease-in-out timing function
            }}
            className='bg-white fixed w-full h-full inset-0 z-[10000] flex justify-center'
        >
            {/* Main container of the password reset modal */}
            <div className='pt-16 w-[30rem] max-w-[90%] flex flex-col gap-5'>
            
                {/* Back button, navigating to previous page */}
                <div 
                    className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
                    onClick={() => {
                        navigate(-1); // Navigate to previous page
                    }}
                >
                    <ArrowLeft /> {/* Display left arrow icon */}
                </div>

                {/* Logo display */}
                <div className='flex items-center justify-center gap-1 w-full mb-5'>
                    <img 
                        src={`${process.env.PUBLIC_URL}/images/logo.png`} 
                        alt="Velora logo" 
                        className='w-14 bg-black p-1 rounded-br-xl'
                    />
                </div>
                
                {/* Title: Change Password */}
                <h1 className='text-3xl font-semibold'>Change Password</h1>
                
                {/* New Password Input Section */}
                <div ref={passwordRef} className='w-full'>
                    <div className='relative text-black'>
                    
                        {/* Label for password input */}
                        <label
                            htmlFor="new-password"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text 
                                ${isFocused3
                                    ? 'top-[0.01rem] scale-75 text-[#48aadf] transform -translate-x-3' // When focused, label moves and shrinks
                                    : 'top-1/2 transform -translate-y-1/2 text-black' // Default label position
                                }`
                            }
                        >
                            New password
                        </label>

                        {/* New password input */}
                        <input 
                            id='new-password'
                            type={newPasswordVisible ? 'text' : 'password'} // Toggle visibility based on state
                            value={newPassword} // Bind to state
                            onFocus={() => {
                                setPassword(true); // Enable password visibility on focus
                                setIsFocused3(true); // Trigger label animation on focus
                            }}
                            onBlur={(e) => !e.target.value && setIsFocused3(false)} // Reset label when input is blurred
                            onChange={handlePasswordChange} // Handle input changes for password validation
                            className="w-full shadow shadow-gray-400 rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                        />

                        {/* Toggle visibility icon */}
                        <span 
                            className='absolute right-4 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer' 
                            onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                        >
                            { newPasswordVisible 
                                ? <EyeClosedIcon className='p-0.5'/> // Eye closed icon when password is visible
                                : <EyeIcon className='p-0.5'/> // Eye icon when password is hidden
                            }
                        </span>
                    </div>

                    {/* Password Strength Indicator */}
                    <div 
                        className={`mt-2 transition-all duration-700 ease-in-out overflow-hidden 
                            ${password ? 'h-36' : 'h-0'}`
                        }
                    >
                        {/* Display password strength text */}
                        <p 
                            className={`text-sm 
                                ${strength === "weak" ? "text-red-500" // Weak strength - red text
                                : strength === "good" ? "text-[#f89a00]" // Good strength - orange text
                                : "text-green-500" // Strong strength - green text
                            }`}
                        >
                            Password Strength: {strength.charAt(0).toUpperCase() + strength.slice(1)}
                        </p>
                        
                        {/* Strength criteria (length, uppercase, etc.) */}
                        <div className="flex gap-1 mt-2">
                            {/* Condition indicators */}
                            <div 
                                className={`h-1 w-14 rounded transition-colors duration-300 ease-in-out 
                                    ${strengthConditions.length ? "bg-[#48aadf]" : "bg-gray-300"}`
                                } 
                            />
                            <div 
                                className={`h-1 w-14 rounded transition-colors duration-300 ease-in-out 
                                    ${strengthConditions.uppercase ? "bg-[#48aadf]" : "bg-gray-300"}`
                                } 
                            />
                            <div 
                                className={`h-1 w-14 rounded transition-colors duration-300 ease-in-out 
                                    ${strengthConditions.lowercase ? "bg-[#48aadf]" : "bg-gray-300"}`
                                } 
                            />
                            <div 
                                className={`h-1 w-14 rounded transition-colors duration-300 ease-in-out 
                                    ${strengthConditions.number ? "bg-[#48aadf]" : "bg-gray-300"}`
                                } 
                            />
                            <div 
                                className={`h-1 w-14 rounded transition-colors duration-300 ease-in-out 
                                    ${strengthConditions.specialChar ? "bg-[#48aadf]" : "bg-gray-300"}`
                                } 
                            />
                        </div>

                        {/* List of password strength criteria */}
                        <ul className="mt-2 text-sm font-serif">
                            {/* Each item checks if the condition is satisfied (highlighted in blue if true) */}
                            <li
                                className={`transition-colors duration-300 ease-in-out 
                                    ${strengthConditions.length ? "text-[#1158a6]" : "text-gray-500"}`
                            }>
                                At least 8 characters
                            </li>
                            <li
                                className={`transition-colors duration-300 ease-in-out 
                                    ${strengthConditions.uppercase ? "text-[#1158a6]" : "text-gray-500"}`
                            }>
                                At least one uppercase letter
                            </li>
                            <li
                                className={`transition-colors duration-300 ease-in-out 
                                    ${strengthConditions.lowercase ? "text-[#1158a6]" : "text-gray-500"}`
                            }>
                                At least one lowercase letter
                            </li>
                            <li
                                className={`transition-colors duration-300 ease-in-out 
                                    ${strengthConditions.number ? "text-[#1158a6]" : "text-gray-500"}`
                            }>
                                At least one number
                            </li>
                            <li
                                className={`transition-colors duration-300 ease-in-out 
                                    ${strengthConditions.specialChar ? "text-[#1158a6]" : "text-gray-500"}`
                            }>
                                At least one special character
                            </li>
                        </ul>
                    </div>

                    {/* Modal error message (shown if there is any) */}
                    <p 
                        className={`text-[0.7rem] text-red-500 transform transition-all duration-700 ease-in-out 
                            ${modalMessage 
                                ? 'opacity-1 translate-y-0 pointer-events-auto' // Show message when it's not null
                                : 'opacity-0 -translate-y-5 pointer-events-none' // Hide message when null
                            }`
                        }
                    >
                        {modalMessage}
                    </p>

                    {/* Reset Password Button */}
                    <button 
                        onClick={handleResetPassword} // Call handleResetPassword when clicked
                        disabled={strength !== "strong"} // Disable button if strength is not strong
                        className={`text-white w-full h-12 rounded-full outline-none mt-3 font-semibold transition-all duration-300 ease-in-out shrink-button
                            ${strength !== 'strong' 
                                ? 'bg-[#48aadf96] cursor-not-allowed' // If password is not strong, disable button and change color
                                : 'bg-[#48aadf] cursor-pointer' // Enable button if password is strong
                            }`
                        }
                    >
                        Reset password
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default ResetPassword