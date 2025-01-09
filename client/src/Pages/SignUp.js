import React, { useEffect, useRef, useState } from 'react' // Importing React hooks for state management and effects
import { ArrowLeft, EyeClosedIcon, EyeIcon, X } from 'lucide-react' // Importing icons for UI components
import OAuth from '../Components/OAuth' // Importing OAuth component
import { Link, useNavigate } from 'react-router-dom'; // Importing navigation hooks from react-router-dom
import { motion, AnimatePresence } from 'framer-motion' // Importing animation libraries for motion effects
import { SyncLoader } from 'react-spinners'; // Importing a spinner loader component for async operations

const SignUp = ({ length = 4}) => { // SignUp component, length is the number of OTP digits
  // State hooks for various form and modal states
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);  // Controls modal visibility
  const [loading, setLoading] = useState(false);  // Loading state for async operations
  const [verificationModal, setVerificationModal] = useState(false); // Controls OTP modal visibility
  const [step, setStep] = useState(1); // Current step in the sign-up process
  const [otp, setOtp] = useState(new Array(length).fill("")); // OTP array initialized to the required length
  const inputRefs = useRef([]); // Ref to manage OTP input fields
  const navigate = useNavigate(); // Navigation hook for routing
  const [agree, setAgree] = useState(false); // State for agreement to terms
  const [formData, setFormData] = useState({}); // Stores form data for submission
  const [password, setPassword] = useState(""); // User password input
  const [strength, setStrength] = useState("weak"); // Password strength state
  const [strengthConditions, setStrengthConditions] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  }); // Conditions for password strength

  const passwordRef = useRef(null); // Ref for password field

  // Function to handle password input change and validate its strength
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value); // Update password state
    setFormData({ ...formData, password: value }); // Update form data

    // Password strength conditions
    const conditions = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };

    setStrengthConditions(conditions); // Update conditions

    // Calculate strength based on conditions
    const satisfiedConditions = Object.values(conditions).filter(Boolean).length;
    if (satisfiedConditions <= 2) setStrength("weak");
    else if (satisfiedConditions === 3 || satisfiedConditions === 4) setStrength("good");
    else if (satisfiedConditions === 5) setStrength("strong");
  };

  // Function to handle form data changes (name, email, etc.)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() }); // Update form data with trimmed values
  };

  // Function to toggle agreement to terms and conditions
  const agreeToTerms = () => {
    setAgree(!agree); // Toggle agreement state
  };

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate that all fields are filled
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirm) {
      setErrorMessage('Kindly fill out all fields.');
      setShowModal(true);  // Show error modal
      return;
    }

    // Ensure passwords match
    if (formData.password !== formData.confirm) {
      setErrorMessage('Kindly confirm your password');
      setShowModal(true); // Show error modal
      return;
    }

    // Ensure the user agrees to terms
    if (agree === false) {
      setErrorMessage('Kindly agree to our privacy policy');
      setShowModal(true); // Show error modal
      return;
    }

    // Perform signup API request
    try {
      setLoading(true);
      setErrorMessage(null); // Reset error message

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      // If signup fails, show the error message
      if (data.success === false) {
        setErrorMessage(data.message);
        setShowModal(true);  // Show error modal
        setLoading(false);
        return;
      }

      setLoading(false);
      setVerificationModal(true); // Show OTP verification modal after successful signup

    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
      console.log(error);
      setShowModal(true);  // Show error modal
    }
  };

  // Function to verify OTP entered by the user
  const handleVerifyOTP = async () => {
    const otpString = otp.join(''); // Join OTP digits to form a string

    // Validate OTP length
    if (otpString.length !== length) {
      setModalMessage(`Code must be ${length} digits`);
      return;
    }
    
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: otpString }),
      });

      const data = await res.json();

      // If OTP verification succeeds, move to the next step
      if (data.success) {
        setStep(2); // Move to step 2 (successful verification)
      } else {
        setModalMessage(data.message); // Show error message if OTP verification fails
        console.log(data);
      }

    } catch (error) {
      setErrorMessage('Error verifying OTP. Please try again.');
      setShowModal(true); // Show error modal
    }
  };

  // Function to resend OTP if the user requests it
  const handleResendOTP = async () => {
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, firstName: formData.firstName }),
      });

      const data = await res.json();

      // If resending OTP fails, show an error
      if (!data.success) {
        setErrorMessage('Error resending OTP. Please try again.');
        setShowModal(true);
      }
    } catch (error) {
      setErrorMessage('Error resending OTP. Please try again.');
      setShowModal(true);
    }
  };

  // Function to handle changes in OTP input fields
  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if(isNaN(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Ensure only the last digit is used
    setOtp(newOtp);

    // Move focus to the next input if the current one is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Function to handle focus on an OTP input field when clicked
  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1); // Set cursor position

    // Move focus if the previous OTP input is empty
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")].focus();
    }
  };

  // Function to handle backspace behavior for OTP input
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus(); // Move focus to the previous input
    }
  };

  // Function to navigate to the previous page
  const return_to_previous_page = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // Focus on the first OTP input field when the modal is shown
  useEffect(() => {
    if (verificationModal && inputRefs.current[0]) {
      const timer = setTimeout(() => {
        inputRefs.current[0].focus(); // Focus on the first OTP input field
      }, 300); // Delay to allow modal animation

      return () => {
        clearTimeout(timer); // Cleanup the timer on unmount
      };
    }
  }, [verificationModal]);

  // Auto-close the modal after 3 seconds if it's showing
  useEffect(() => {
    if (showModal || loading || modalMessage) {
      const timer = setTimeout(() => {
        setShowModal(false); // Hide modal
        setLoading(false); // Reset loading state
        setModalMessage(null); // Clear modal message
      }, 3000);  // Auto-close after 3 seconds

      return () => clearTimeout(timer);  // Cleanup the timer if modal is manually closed
    }
  }, [showModal, loading, modalMessage]);

  // Close password strength checker if clicked outside the password field
  useEffect(() => {
    const close_password_strength_checker = (event) => {
      if (passwordRef.current && !passwordRef.current.contains(event.target)) {
        setPassword(false); // Close password strength checker
      }
    };

    document.addEventListener("mousedown", close_password_strength_checker); // Listen for click events

    return () => {
      document.removeEventListener("mousedown", close_password_strength_checker); // Cleanup listener
    };
  }, []);

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
      <div 
        className='absolute sm:left-5 sm:top-5 top-2 left-1 hover:bg-[#48aadf13] sm:p-3 p-2 rounded-full cursor-pointer text-[#48aadf] transition-colors duration-300 ease-in-out'
        onClick={return_to_previous_page}
      >
        {/* Back button that navigates to the previous page */}
        <ArrowLeft />
      </div>

      <div className='flex flex-col items-center gap-5 w-full'>
        {/* Header Section */}
        <h1 className='sm:text-3xl text-2xl font-medium'>Create an account</h1>

        <div className='flex flex-col items-center gap-5 w-96 max-w-[90%]'>
          {/* OAuth Sign Up */}
          <OAuth label={'Sign up with Google'} />
          <p>or</p>

          {/* Form for account creation */}
          <form 
            className='flex flex-col gap-3 w-full'
            onSubmit={handleSubmit}
          >
            {/* Name Fields (First and Last Name) */}
            <div className='flex items-center gap-4'>
              <input 
                type="text" 
                id="firstName" 
                onChange={handleChange}
                className='rounded-full px-8 py-4 bg-[#48aadf13] w-full'
                placeholder='First name'
                autoComplete='off'
              />
              <input 
                type="text" 
                id="lastName" 
                onChange={handleChange}
                className='rounded-full px-8 py-4 bg-[#48aadf13] w-full'
                placeholder='Last name'
                autoComplete='off'
              />
            </div>

            {/* Email input */}
            <input 
              type="email" 
              name="email" 
              id="email" 
              onChange={handleChange}
              className='rounded-full px-8 py-4 bg-[#48aadf13] w-full'
              placeholder='Email'
              autoComplete='off'
            />

            {/* Password Input with visibility toggle */}
            <div className='' ref={passwordRef}>
              <div className='rounded-full w-full relative'>
                <input 
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  onChange={handlePasswordChange}
                  onFocus={() => setPassword(true)}
                  className='w-full h-full px-8 py-4 rounded-full bg-[#48aadf13]'
                  placeholder='Password'
                  autoComplete='off'
                />
                {/* Eye icon for password visibility toggle */}
                <span 
                  className='absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer'
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <EyeClosedIcon className='p-0.5'/> : <EyeIcon className='p-0.5'/>}
                </span>
              </div>

              {/* Password Strength Indicator */}
              <div 
                className={`mt-2 transition-all duration-700 ease-in-out overflow-hidden 
                  ${password ? 'h-36' : 'h-0'}`}
              >
                <p 
                  className={`text-sm 
                    ${strength === "weak" ? "text-red-500" 
                    : strength === "good" ? "text-[#f89a00]" 
                    : "text-green-500"}`}
                >
                  Password Strength: {strength.charAt(0).toUpperCase() + strength.slice(1)}
                </p>

                {/* Strength bar for password */}
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

                {/* Password criteria list */}
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

            {/* Confirm Password Input with visibility toggle */}
            <div className='rounded-full w-full relative'>
              <input 
                type={confirmPassword ? 'text' : 'password'}
                id="confirm" 
                onChange={handleChange}
                className='w-full h-full px-8 py-4 rounded-full bg-[#48aadf13]'
                placeholder='Confirm password'
                autoComplete='off'
              />
              {/* Eye icon for confirm password visibility toggle */}
              <span 
                className='absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl'
                onClick={() => setConfirmPassword(!confirmPassword)}
              >
                { confirmPassword ? <EyeClosedIcon className='p-0.5'/> : <EyeIcon className='p-0.5'/> }
              </span>
            </div>

            {/* Terms of Service Agreement */}
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="rememberMe" 
                checked={agree} 
                onClick={agreeToTerms} 
                onChange={handleChange}
                className="hidden" // Hide the default checkbox
              />
              <label 
                htmlFor="rememberMe" 
                className="flex items-center cursor-pointer"
              >
                {/* Custom checkbox design */}
                <div 
                  className={`relative w-4 h-4 flex items-center justify-center rounded border-2 transition-all duration-300
                    ${agree 
                      ? 'border-[#4078bc] bg-[#4078bc]' 
                      : 'border-black'
                    }`
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`absolute w-3.5 h-3.5 text-white transition-opacity duration-300 
                      ${agree ? 'opacity-100' : 'opacity-0'}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <span className="ml-2 text-black text-sm flex items-center gap-1">
                  <p>Agree to our</p>
                  <Link 
                    to='/policy'
                    className='text-[#4078bc] hover:underline transition-all duration-300 ease-in-out'
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={strength !== "strong" }
              className={`w-full py-3 text-white rounded-full border-none outline-none mt-5 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out 
                ${strength !== 'strong' || loading ? 'bg-[#48aadf96] cursor-not-allowed' : 'bg-[#48aadf] cursor-pointer'}`}
            >
              <p>{ loading 
                ? <SyncLoader 
                    color="#fff" // Customize the color
                    loading={loading} 
                    size={7} // Customize the size
                    margin={2} // Customize the margin between circles
                  />
                : 'Continue'
              }
              </p>
            </button>
          </form>
        </div>

        {/* Link to sign in page if the user already has an account */}
        <div className='flex items-center gap-2 w-full justify-center'>
          <p>Already have an account? </p>
          <Link 
            to='/signin'
            className='text-[#4078bc] hover:underline transition-all duration-300 ease-in-out'
          >
            sign in
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            // Motion animation for fade in and fade out effect when modal appears/disappears
            initial={{ opacity: 0 }}  // Modal starts with opacity 0 (invisible)
            animate={{ opacity: 1 }}  // Modal animates to full opacity (visible)
            exit={{ opacity: 0 }}     // Modal fades out when exiting
            transition={{
              duration: .5,           // The duration of the fade effect
              ease: 'easeInOut'       // The easing function to smoothen the transition
            }}
            className="fixed left-0 right-0 top-0 bottom-0 z-[10001] bg-black/25 flex items-center justify-center"
            // Fixed position to cover the entire screen with a transparent black overlay
          >
            <motion.div
              initial={{ opacity: 0 }}  // Modal content starts with opacity 0
              animate={{ opacity: 1 }}  // Modal content fades in to full opacity
              exit={{ opacity: 0 }}     // Modal content fades out when exiting
              transition={{
                duration: .5,
                ease: 'easeInOut'
              }}
              className="relative bg-white p-5 pt-8 rounded-xl .transition-all { transition: all 0.3s ease-in-out; } w-64 max-w-[90%] flex justify-center items-center flex-col gap-4"
              // Styles for the modal content: white background, padding, rounded corners, and flexible layout
            >
              <X
                className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8"
                onClick={() => setShowModal(false)} // Closes the modal when clicked
              />
              <p className="font-serif pt-2 text-center">{errorMessage}</p>
              <motion.div className="actions">
                <button 
                  type="button" 
                  className='bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full transition-all duration-300 ease-in-out shrink-button'
                  onClick={() => setShowModal(false)} // Closes the modal when clicked
                >
                  OK
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>  

      {/* Modal for verifying email address */}
      <AnimatePresence>
        {verificationModal && (
          <motion.div
            initial={{ opacity: 0 }}  // Starts with opacity 0
            animate={{ opacity: 1 }}  // Fades in to full opacity
            exit={{ opacity: 0 }}     // Fades out when exiting
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            // Fixed position with black transparent background covering the entire screen
          >
            <motion.div 
              key={step}  // Animates based on the current step (helps with rerendering the modal on step change)
              initial={{ opacity: 0 }}  // Modal starts with opacity 0
              animate={{ opacity: 1 }}  // Fades in to full opacity
              exit={{ opacity: 0 }}     // Fades out when exiting
              transition={{
                duration: .5,
                ease: "easeInOut"
              }}
              className="bg-[#ECECEC] px-6 pt-8 pb-6 rounded-lg relative flex flex-col justify-center items-center gap-1 w-64 max-w-[90%]"
              // Styles for modal content: light gray background, padding, rounded corners, and flex layout
            >
              <X
                className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8" 
                onClick={() => setVerificationModal(false)} // Closes the verification modal
              />
              {/* Conditional rendering based on step */}
              {step === 1 && (
                <>
                  <div className='font-serif text-xl mb-2'>Enter OTP</div>
                  <div className='flex gap-5'>
                    {/* OTP input fields */}
                    {otp.map((value, index) => (
                      <input
                        key={index}
                        ref={(input) => inputRefs.current[index] = input} // Sets refs for each input
                        type="text"
                        value={value}
                        onChange={(e) => handleOtpChange(index, e)} // Handles OTP input change
                        onClick={() => handleClick(index)} // Handles click on OTP input
                        onKeyDown={(e) => handleKeyDown(index, e)} // Handles keydown for navigating inputs
                        className='border border-gray-400 w-8 h-8 rounded-md bg-transparent outline-none text-center'
                        // Styles for OTP inputs
                      />
                    ))}
                  </div>
                  {/* Display error message if any */}
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
                      {modalMessage}  {/* Display error message */}
                    </motion.p>
                  }
                  {/* Resend OTP option */}
                  <div 
                    className='cursor-pointer text-[#4078bc] text-sm' 
                    onClick={handleResendOTP}
                  >
                    Resend OTP
                  </div>
                  {/* Verify OTP button */}
                  <button 
                    type="button" 
                    className='bg-[#48aadf] text-white py-2 px-5 rounded-full cursor-pointer outline-none mt-3 text-sm 
                      transition-all duration-300 ease-in-out shrink-button'
                    onClick={handleVerifyOTP} // Verifies OTP
                  >
                    verify 
                  </button>
                </>
              )}

              {/* Step 2: Account creation success */}
              {step === 2 && (
                <>
                  <p className='text-center font-serif'>Your account has been successfully created</p>
                  <div>
                    {/* Sign in button after successful account creation */}
                    <button 
                      type="button"
                      onClick={() => {
                        setVerificationModal(false); // Closes the modal
                        setTimeout(() => {
                          navigate('/signin') // Redirects to the sign-in page after 1 second
                        }, 1000);
                      }}
                      className='bg-[#48aadf] text-white py-2 px-5 rounded-full cursor-pointer outline-none mt-3 text-sm transition-all duration-300 ease-in-out shrink-button'
                    >
                      sign in
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SignUp