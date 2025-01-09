import React, { useEffect, useRef, useState } from 'react'
import OAuth from '../Components/OAuth' // Importing OAuth component for social sign-in
import { signInSuccess, signInFailure, signInStart } from '../redux/user/userSlice'; // Redux actions
import { useDispatch, useSelector } from 'react-redux'; // Redux hooks
import { motion, AnimatePresence } from 'framer-motion'; // For animating components
import { Link, useNavigate } from 'react-router-dom'; // For navigation and routing
import { ArrowLeft, EyeClosedIcon, EyeIcon, X } from 'lucide-react'; // Icons for UI
import { SyncLoader } from 'react-spinners'; // Loader for async actions

const SignIn = ({ length = 4}) => {
  const [formData, setFormData] = useState({}); // State to hold form data
  const { error: errorMessage } = useSelector(state => state.user); // Fetch error from redux store
  const [loading, setLoading] = useState(false); // Loading state
  const [modalMessage, setModalMessage] = useState(null); // Modal message state
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle password visibility
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(false); // For 'Keep me signed in' checkbox
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false); // Forgot password modal state
  const [resetEmail, setResetEmail] = useState(""); // Email for password reset
  const [newPassword, setNewPassword] = useState(""); // New password state
  const [newPasswordVisible, setNewPasswordVisible] = useState(false); // Toggle visibility for new password
  const [step, setStep] = useState(1); // Step tracker for the reset password process
  const [otp, setOtp] = useState(new Array(length).fill("")); // OTP (One-time password) state
  const [password, setPassword] = useState(""); // Password state
  const [strength, setStrength] = useState("weak"); // Password strength
  const [strengthConditions, setStrengthConditions] = useState({ // Password strength criteria
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const inputRefs = useRef([]); // To store refs of OTP inputs for better management
  const passwordRef = useRef(null); // Ref for the password field to manage its focus/visibility
  const navigate = useNavigate(); // React router hook for navigation
  const dispatch = useDispatch(); // Redux dispatch function

  // Function to send password reset email
  const handleSendResetEmail = async () => {
    if (!resetEmail) {
      setModalMessage('Kindly enter your email address'); // Show message if email is not entered
      return;
    }
    
    try {
      const res = await fetch('/api/auth/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2);  // Proceed to the next step: input verification code
      } else {
        console.error(data.message);
        dispatch(signInFailure(data.message));
        setModalMessage(data.message); // Show error message in modal
      }

    } catch (error) {
      console.error('Error sending reset email:', error);
    }
  };

  // Function to verify OTP code
  const handleVerifyCode = async () => {
    if (otp.join('').length !== length) {
      setModalMessage(`Code must be ${length} digits`); // Check OTP length
      return;
    }

    const codeToSubmit = otp.join('');

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: codeToSubmit }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(3);  // Proceed to password reset step

      } else {
        console.error('Verification failed:', data.message);
        setModalMessage(data.message);
      }

    } catch (error) {
      console.error('Error verifying code:', error);
    }
  };

  // Function to handle resetting the password
  const handleResetPassword = async () => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(4)  // Inform the user that password reset was successful
      } else {
        console.error('Error resetting password:', data.message);
        setModalMessage(data.message); // Show error in modal
      }

    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  // Function to handle form data changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }

  // Function to handle form submission for sign-in
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      dispatch(signInFailure('Kindly fill out all fields.'));
      setShowModal(true);  // Show modal on error
      return;
    }

    try {
      dispatch(signInStart());
      setLoading(true);

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message)); // Handle failed sign-in
        setShowModal(true);  // Show modal on error
        setLoading(false);
        return;
      };

      if (res.ok) {
        dispatch(signInSuccess(data));

        setTimeout(() => {
          navigate('/'); // Redirect to homepage after successful sign-in
        }, 2000);
      }
      setLoading(false);

    } catch (error) {
      dispatch(signInFailure(error.message));
      setShowModal(true);  // Show modal on error
      console.log(error)
    }
  }

  // Function to handle OTP input changes
  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if(isNaN(value)) return; // Ensure input is a number

    const newOtp = [...otp];
    //Allow only one input
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to the next input if current field is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  }

  // Function to handle click on OTP input field
  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    // Optional: Automatically move to the next input if previous is empty
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")].focus();
    }
  }

  // Function to handle keydown event in OTP field (especially for backspace)
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
     // Move cursor to the previous input field if backspace is pressed
     inputRefs.current[index - 1].focus();
    }
  }

  // Function to handle password strength check
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    // Check conditions for password strength
    const conditions = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };

    setStrengthConditions(conditions);

    // Calculate password strength based on conditions met
    const satisfiedConditions = Object.values(conditions).filter(Boolean)
      .length;

    if (satisfiedConditions <= 2) setStrength("weak");
    else if (satisfiedConditions === 3 || satisfiedConditions === 4)
      setStrength("good");
    else if (satisfiedConditions === 5) setStrength("strong");
  };

  // Function to navigate back to the previous page
  const return_to_previous_page = () => {
    navigate(-1); // Navigate to the previous page
  }

  // UseEffect to handle closing the password strength checker modal
  useEffect(() => {
    const close_password_strength_checker = (event) => {
      if (passwordRef.current && !passwordRef.current.contains(event.target)) {
        setPassword(false);
      }
    };

    document.addEventListener("mousedown", close_password_strength_checker);

    return () => {
      document.removeEventListener("mousedown", close_password_strength_checker);
    };
  }, []);

  // Handle focusing OTP inputs on modal visibility changes
  useEffect(() => {
    if (forgotPasswordModal && step === 2 && inputRefs.current[0]) {
      const timer = setTimeout(() => {
        inputRefs.current[0].focus();
      }, 300); // Adjust the delay depending on your animation speed

      return () => {
        clearTimeout(timer);
      }
    }
  }, [forgotPasswordModal, step]);

  // Automatically hide modal after 3 seconds
  useEffect(() => {
    if (showModal || modalMessage || loading) {
      const timer = setTimeout(() => {
        setShowModal(false);
        setModalMessage(null);
        setLoading(false);
      }, 3000); // 3 seconds
  
      // Cleanup the timer if the component unmounts or the state changes before 3 seconds
      return () => clearTimeout(timer);
    }
  }, [loading, modalMessage, showModal]);

  // Handle the checkbox state change
  const handleCheckboxChange = () => {
    setKeepMeSignedIn(!keepMeSignedIn); // Toggle checkbox state
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: .5,
        ease: "easeInOut"
      }}
      className='w-full py-10 flex items-center justify-between relative bg-white'
    >
      
      {/* Wrapper div for the back button, positioned at the top left of the screen. */}
      <div 
        className='absolute sm:left-5 sm:top-5 top-2 left-1 hover:bg-[#48aadf13] sm:p-3 p-2 rounded-full cursor-pointer text-[#48aadf] transition-colors duration-300 ease-in-out'
        // On click, this triggers the return_to_previous_page function to navigate back.
        onClick={return_to_previous_page}
      >
        <ArrowLeft/> {/* Left arrow icon indicating the back button */}
      </div>

      {/* Main container for the content centered on the page, holding the form and other elements. */}
      <div className='flex flex-col items-center gap-5 w-full'>
        <h1 className='sm:text-3xl text-2xl font-medium'>Welcome Back</h1>

        {/* Nested container for the form and OAuth button */}
        <div className='flex flex-col items-center gap-5 w-96 max-w-[90%]'>
          {/* OAuth button to sign in with Google */}
          <OAuth label={'Sign in with Google'} />
          <p>or</p>

          {/* Form container */}
          <form 
            className='flex flex-col gap-3 w-full'
            // Handles form submission.
            onSubmit={handleSubmit}
          >
            {/* Input field for email */}
            <input 
              type="email" 
              id="email"
              onChange={handleChange} // Handles change in email input
              className='rounded-full px-8 py-4 bg-[#48aadf13] w-full'
              placeholder='Email'
              autoComplete='off' // Prevents browser autocomplete
            />

            {/* Password input container */}
            <div className='rounded-full w-full relative'>
              {/* Password input field with visibility toggle */}
              <input 
                type={passwordVisible ? 'text' : 'password'} // Conditionally render text or password input
                id="password"
                onChange={handleChange} // Handles change in password input
                className='w-full h-full px-8 py-4 rounded-full bg-[#48aadf13]'
                placeholder='Password'
                autoComplete='off' // Prevents browser autocomplete
              />
              {/* Toggle button for showing/hiding password */}
              <span 
                className='absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl'
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggles password visibility
              >
                {/* Display different icons based on visibility state */}
                {passwordVisible ? <EyeClosedIcon className='p-0.5'/> : <EyeIcon className='p-0.5'/>}
              </span>
            </div>

            {/* Keep Me Signed in checkbox and Forgot Password link */}
            <div className='flex items-center justify-between'>
              <div className="flex items-center">
                {/* Hidden checkbox for "Keep me signed in" */}
                <input 
                  type="checkbox" 
                  id="keepMeSignedIn" 
                  checked={keepMeSignedIn} // Reflects checkbox state
                  onClick={handleCheckboxChange} // Handles checkbox state change
                  onChange={handleChange}
                  className="hidden" // Hide the default checkbox
                />
                {/* Custom checkbox design using SVG */}
                <label htmlFor="keepMeSignedIn" className="flex items-center cursor-pointer">
                  <div className={`relative w-4 h-4 flex items-center justify-center rounded border-2 ${keepMeSignedIn ? 'border-[#4078bc] bg-[#4078bc]' : 'border-black'} transition-all duration-300`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`absolute w-3.5 h-3.5 text-white transition-opacity duration-300 
                        ${keepMeSignedIn ? 'opacity-100' : 'opacity-0'}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-2 text-black text-sm">Keep me signed in</span>
                </label>
              </div>

              {/* Forgot password link */}
              <div 
                className='cursor-pointer'
                onClick={() => setForgotPasswordModal(true)} // Triggers modal for forgotten password
              >
                Forgot?
              </div>
            </div>

            {/* Submit button for the form */}
            <button 
              type="submit"
              disabled={loading} // Disables the button when loading is true
              className={`w-full py-3 text-white rounded-full border-none outline-none mt-5 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out
                ${loading 
                  ? 'bg-[#48aadf96] cursor-not-allowed' // Button appears disabled when loading
                  : 'bg-[#48aadf] cursor-pointer' // Regular active state of the button
                }`
              }
            >
              <p>
                {/* Show a loading spinner or button text based on the loading state */}
                {loading 
                  ? <SyncLoader 
                      color="#fff" // Set color for the spinner
                      loading={loading} 
                      size={7} // Set spinner size
                      margin={2} // Set margin between spinner circles
                    />
                  : 'Continue' // Button text when not loading
                }
              </p>
            </button>
          </form>
        </div>

        {/* Footer text asking if the user has an account */}
        <div className='flex items-center gap-2 w-full justify-center'>
          <p>Don't have an account? </p>
          {/* Link to the signup page */}
          <Link 
            to='/signup'
            className='text-[#4078bc] hover:underline transition-all duration-300 ease-in-out'
          >
            sign up
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {/* Conditionally render modal based on showModal state */}
        {showModal && (
          <motion.div
            // Initial and final opacity for the fade-in/out effect
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5, // Duration of the fade effect
              ease: 'easeInOut' // Easing function for smooth animation
            }}
            exit={{ opacity: 0 }} // When exiting, fade out (opacity 0)
            // Modal backdrop covering the entire screen
            className="fixed left-0 right-0 top-0 bottom-0 z-[10001] bg-black/25 flex items-center justify-center"
          >
            <motion.div
              // Initial and final opacity for the modal content fade effect
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5, // Duration of the fade effect
                ease: 'easeInOut' // Easing function for smooth animation
              }}
              exit={{ opacity: 0 }} // Fade out when exiting
              // Styling for the modal container
              className="relative bg-[#ECECEC] p-5 pt-8 rounded-xl w-64 max-w-[90%] flex justify-center items-center flex-col gap-4"
            >
              {/* Close icon, clickable to close the modal */}
              <X
                className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8"
                onClick={() => setShowModal(false)} // Closes the modal on click
              />
              {/* Error message text */}
              <p className="font-serif pt-2 text-center">{errorMessage}</p>
              <div className="actions">
                {/* 'OK' button to close the modal */}
                <button 
                  type="button" 
                  className="bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full transition-all duration-300 ease-in-out shrink-button"
                  onClick={() => setShowModal(false)} // Closes the modal on click
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> 

      <AnimatePresence>
        {/* Check if the forgot password modal should be displayed */}
        {forgotPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }} // Initial state for the modal - transparent
            animate={{ opacity: 1 }} // Animated to fully opaque
            exit={{ opacity: 0 }} // Exit animation - fades out
            transition={{
              duration: .5, // Animation duration of 0.5 seconds
              ease: "easeInOut" // Smooth transition
            }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            {/* Inner modal content container */}
            <motion.div 
              key={step} // Key based on step to handle dynamic transitions
              initial={{ opacity: 0 }} // Initial state for the modal content - transparent
              animate={{ opacity: 1 }} // Fade in to opacity 1
              exit={{ opacity: 0 }} // Fade out when exiting
              transition={{
                duration: .5, // Transition duration
                ease: "easeInOut" // Ease transition effect
              }}
              className="bg-white pb-6 px-2 pt-8 rounded-lg relative flex flex-col justify-center items-center gap-1 w-64 max-w-[90%]"
            >
              {/* Close icon (X) */}
              <X
                className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8" 
                onClick={() => setForgotPasswordModal(false)} // Close the modal when clicked
              />

              {/* Step 1: Email input */}
              {step === 1 && (
                <>
                  <h2 className='text-black font-serif'>Enter your email</h2>
                  <input 
                    type="email"
                    id="resetEmail"
                    placeholder="Enter email" 
                    onChange={(e) => setResetEmail(e.target.value)} // Handle email input change
                    className='rounded-full px-5 py-3 bg-[#48aadf13] w-full'
                    autoComplete='off'
                  />
                  {/* Display error message */}
                  {modalMessage && 
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }} // Start with a small y-offset and invisible
                      animate={{ opacity: 1, y: 0 }} // Animate to full opacity and no y-offset
                      exit={{ opacity: 0, y: -10 }} // Fade out with the y-offset
                      transition={{
                        duration: .5, 
                        ease: "easeInOut"
                      }}
                      className='text-[0.7rem] text-red-500'
                    >
                      {modalMessage}
                    </motion.p>
                  }
                  {/* Send code button */}
                  <button 
                    onClick={handleSendResetEmail} // Trigger send code action
                    className="bg-[#48aadf] text-white py-2 px-5 rounded-full cursor-pointer outline-none mt-3 text-sm transition-all duration-300 ease-in-out shrink-button"
                  >
                    send code
                  </button>
                </>
              )}

              {/* Step 2: OTP input */}
              {step === 2 && (
                <>
                  <h2 className='text-black text-center font-serif'>
                    Enter code sent to {" "}
                    <span className='text-[#48aadf]'>
                      {resetEmail}
                    </span>
                  </h2>
                  {/* OTP inputs */}
                  <div className='flex gap-5 mt-1'>
                    {otp.map((value, index) => (
                      <input
                        key={index}
                        ref={(input) => inputRefs.current[index] = input} // Create ref for OTP inputs
                        type="text"
                        value={value}
                        onChange={(e) => handleOtpChange(index, e)} // Handle OTP input change
                        onClick={() => handleClick(index)} // Handle input click to focus
                        onKeyDown={(e) => handleKeyDown(index, e)} // Handle key down events for navigation
                        className='border border-gray-400 w-8 h-8 rounded-md bg-transparent outline-none text-center'
                      />
                    ))}
                  </div>
                  {/* Display error message for OTP */}
                  {modalMessage && 
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: .5,
                        ease: "easeInOut"
                      }}
                      className='text-[0.7rem] text-red-500'
                    >
                      {modalMessage}
                    </motion.p>
                  }
                  {/* Verify OTP button */}
                  <button 
                    onClick={handleVerifyCode} // Trigger verify code action
                    className="bg-[#48aadf] text-white py-2 px-5 rounded-full cursor-pointer outline-none mt-3 text-sm transition-all duration-300 ease-in-out shrink-button"
                  >
                    verify
                  </button>
                </>
              )}

              {/* Step 3: New password input */}
              {step === 3 && (
                <>
                  <h2 className='text-black text-center font-serif'>Enter your new password</h2>
                  <div ref={passwordRef} className='w-full'>
                    {/* New password input with visibility toggle */}
                    <div className='relative text-black'>
                      <input 
                        type={newPasswordVisible ? 'text' : 'password'} // Toggle between text and password type
                        placeholder='New password'
                        value={newPassword}
                        onFocus={() => setPassword(true)} // Set password field active on focus
                        onChange={handlePasswordChange} // Handle password input change
                        className='rounded-full px-5 py-3 bg-[#48aadf13] w-full'
                      />
                      {/* Toggle password visibility */}
                      <span 
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer' 
                        onClick={() => setNewPasswordVisible(!newPasswordVisible)} // Toggle visibility state
                      >
                        { newPasswordVisible ? <EyeClosedIcon className='p-0.5'/> : <EyeIcon className='p-0.5'/> }
                      </span>
                    </div>

                    {/* Password strength indicator */}
                    <div 
                      className={`mt-2 transition-all duration-700 ease-in-out overflow-hidden 
                        ${password ? 'h-36' : 'h-0'}`}
                    >
                      <p 
                        className={`text-sm 
                          ${strength === "weak" ? "text-red-500" 
                            : strength === "good" ? "text-[#f89a00]" 
                            : "text-green-500"}`
                        }
                      >
                        Password Strength: {strength.charAt(0).toUpperCase() + strength.slice(1)}
                      </p>
                      {/* Strength conditions - visual progress bars */}
                      <div className="flex gap-1 mt-2">
                        <div 
                          className={`h-1 w-14 rounded transition-colors duration-300 ease-in-out 
                          ${strengthConditions.length ? "bg-[#48aadf]" : "bg-gray-300"}`} 
                        />
                        <div 
                          className={`h-1 w-14 rounded transition-colors duration-300 ease-in-out 
                          ${strengthConditions.uppercase ? "bg-[#48aadf]" : "bg-gray-300"}`} 
                        />
                        <div 
                          className={`h-1 w-14 rounded transition-colors duration-300 ease-in-out 
                          ${strengthConditions.lowercase ? "bg-[#48aadf]" : "bg-gray-300"}`} 
                        />
                        <div 
                          className={`h-1 w-14 rounded transition-colors duration-300 ease-in-out 
                          ${strengthConditions.number ? "bg-[#48aadf]" : "bg-gray-300"}`} 
                        />
                        <div 
                          className={`h-1 w-14 rounded transition-colors duration-300 ease-in-out 
                          ${strengthConditions.specialChar ? "bg-[#48aadf]" : "bg-gray-300"}`} 
                        />
                      </div>
                      {/* Display password requirements */}
                      <ul className="mt-2 text-sm font-serif">
                        <li className={`transition-colors duration-300 ease-in-out 
                          ${strengthConditions.length ? "text-[#1158a6]" : "text-gray-500"}`}
                        >
                          At least 8 characters
                        </li>
                        <li className={`transition-colors duration-300 ease-in-out 
                          ${strengthConditions.uppercase ? "text-[#1158a6]" : "text-gray-500"}`}
                        >
                          At least one uppercase letter
                        </li>
                        <li className={`transition-colors duration-300 ease-in-out 
                          ${strengthConditions.lowercase ? "text-[#1158a6]" : "text-gray-500"}`}
                        >
                          At least one lowercase letter
                        </li>
                        <li className={`transition-colors duration-300 ease-in-out 
                          ${strengthConditions.number ? "text-[#1158a6]" : "text-gray-500"}`}
                        >
                          At least one number
                        </li>
                        <li className={`transition-colors duration-300 ease-in-out 
                          ${strengthConditions.specialChar ? "text-[#1158a6]" : "text-gray-500"}`}
                        >
                          At least one special character
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Display error message */}
                  {modalMessage && 
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: .5,
                        ease: "easeInOut"
                      }}
                      className='text-[0.7rem] text-red-500'
                    >
                      {modalMessage}
                    </motion.p>
                  }

                  {/* Reset password button, disabled until strong password */}
                  <button 
                    onClick={handleResetPassword} 
                    disabled={strength !== "strong"}
                    className={`text-white py-2 px-5 rounded-full outline-none mt-3 text-sm transition-all duration-300 ease-in-out 
                      ${strength !== 'strong' ? 'bg-[#48aadf96] cursor-not-allowed' : 'bg-[#48aadf] cursor-pointer'} 
                      shrink-button`
                    }
                  >
                    reset password
                  </button>
                </>
              )}

              {/* Step 4: Success message */}
              {step === 4 && (
                <>
                  <h2 className='text-black text-center font-serif'>Your password has been successfully changed</h2>
                  {/* OK button to close modal */}
                  <button 
                    onClick={() => setForgotPasswordModal(false)} 
                    className='bg-[#48aadf] text-white py-2 px-5 rounded-full cursor-pointer outline-none mt-3 text-sm transition-all duration-300 ease-in-out shrink-button'
                  >
                    OK
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SignIn