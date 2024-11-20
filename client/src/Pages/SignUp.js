import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, EyeClosedIcon, EyeIcon, X } from 'lucide-react'
import OAuth from '../Components/OAuth'
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'
import { SyncLoader } from 'react-spinners';

const SignUp = ({ length = 4}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);  // Modal visibility state
  const [loading, setLoading] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [formData, setFormData] = useState({});
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("weak");
  const [strengthConditions, setStrengthConditions] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const passwordRef = useRef(null);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    setFormData({ ...formData, password: value });

    // Check conditions
    const conditions = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };

    setStrengthConditions(conditions);

    // Determine strength
    const satisfiedConditions = Object.values(conditions).filter(Boolean)
      .length;

    if (satisfiedConditions <= 2) setStrength("weak");
    else if (satisfiedConditions === 3 || satisfiedConditions === 4)
      setStrength("good");
    else if (satisfiedConditions === 5) setStrength("strong");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }

  const agreeToTerms = () => {
    setAgree(!agree);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirm) {
      setErrorMessage('Kindly fill out all fields.');
      setShowModal(true);  // Show the modal when there's an error
      return;
    }

    if (formData.password !== formData.confirm) {
      setErrorMessage('Kindly confirm your password');
      setShowModal(true);
      return;
    }

    if (agree === false) {
      setErrorMessage('Kindly agree to our privacy policy');
      setShowModal(true);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        setErrorMessage(data.message);
        setShowModal(true);  // Show the modal when there's an error
        setLoading(false);
        return;
      }

      setLoading(false);
      setVerificationModal(true); // Open OTP modal after successful signup

    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
      console.log(error)
      setShowModal(true);  // Show the modal when there's an error
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');

    if (otp.join('').length !== length) {
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

      if (data.success) {
        setStep(2); // Move to the second step

      } else {
        setModalMessage(data.message);
        console.log(data)
      }

    } catch (error) {
      setErrorMessage('Error verifying OTP. Please try again.');
      setShowModal(true);
    }
  };

  // Function to resend OTP
  const handleResendOTP = async () => {
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      
      const data = await res.json();
      
      if (!data.success) {
        setErrorMessage('Error resending OTP. Please try again.');
        setShowModal(true);
      }
    } catch (error) {
      setErrorMessage('Error resending OTP. Please try again.');
      setShowModal(true);
    }
  };

  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if(isNaN(value)) return;

    const newOtp = [...otp];
    //Allow only one input
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // move to the next input if current field is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    //optional
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")].focus();
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
 
     //Move cursor to the previous input field
     inputRefs.current[index - 1].focus();
    }
  }

  const return_to_previous_page = () => {
    navigate(-1); // Navigate to the previous page
  }

  const handleButtonClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300); // Reset after 150ms
  };

  useEffect(() => {
    if (verificationModal && inputRefs.current[0]) {

      // Ensure the modal is fully open before trying to focus
      const timer = setTimeout(() => {
        inputRefs.current[0].focus();
      }, 300); // Adjust the delay depending on your animation speed

      return () => {
        clearTimeout(timer);
      }
    }
  }, [verificationModal]);

  // Automatically hide modal after 3 seconds
  useEffect(() => {
    if (showModal || loading || modalMessage) {
      const timer = setTimeout(() => {
        setShowModal(false);
        setLoading(false);
        setModalMessage(null);
      }, 3000);  // Auto-close modal after 3 seconds

      return () => clearTimeout(timer);  // Cleanup the timer if the modal is manually closed
    }
  }, [showModal, loading, modalMessage]);

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

  return (
    <div className='w-full py-10 flex items-center justify-between relative'>
      <div 
        className='absolute sm:left-5 sm:top-5 top-2 left-1 hover:bg-[#48aadf13] sm:p-3 p-2 rounded-full cursor-pointer text-[#48aadf] transition-colors duration-300 ease-in-out'
        onClick={return_to_previous_page}
      >
        <ArrowLeft/>
      </div>
      <div className='flex flex-col items-center gap-5 w-full'>
        <h1 className='sm:text-3xl text-2xl font-medium'>Create an account</h1>
        <div className='flex flex-col items-center gap-5 w-96 max-w-[90%]'>
          <OAuth label={'Sign up with Google'} />
          <p>or</p>
          <form 
            className='flex flex-col gap-3 w-full'
            onSubmit={handleSubmit}
          >
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
            <input 
              type="email" 
              name="email" 
              id="email" 
              onChange={handleChange}
              className='rounded-full px-8 py-4 bg-[#48aadf13] w-full'
              placeholder='Email'
              autoComplete='off'
            />
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
                  ${password ? 'h-36' : 'h-0'}`
                }
              >
                <p 
                  className={`text-sm 
                    ${
                      strength === "weak" ? "text-red-500" 
                      : strength === "good" ? "text-[#f89a00]" 
                      : "text-green-500"
                      }`
                    }
                >
                  Password Strength: {strength.charAt(0).toUpperCase() + strength.slice(1)}
                </p>
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
                <ul className="mt-2 text-sm font-serif">
                  <li
                    className={`transition-colors duration-300 ease-in-out ${
                      strengthConditions.length ? "text-[#1158a6]" : "text-gray-500"
                    }`}
                  >
                    At least 8 characters
                  </li>
                  <li
                    className={`transition-colors duration-300 ease-in-out ${
                      strengthConditions.uppercase ? "text-[#1158a6]" : "text-gray-500"
                    }`}
                  >
                    At least one uppercase letter
                  </li>
                  <li
                    className={`transition-colors duration-300 ease-in-out ${
                      strengthConditions.lowercase ? "text-[#1158a6]" : "text-gray-500"
                    }`}
                  >
                    At least one lowercase letter
                  </li>
                  <li
                    className={`transition-colors duration-300 ease-in-out ${
                      strengthConditions.number ? "text-[#1158a6]" : "text-gray-500"
                    }`}
                  >
                    At least one number
                  </li>
                  <li
                    className={`transition-colors duration-300 ease-in-out ${
                      strengthConditions.specialChar ? "text-[#1158a6]" : "text-gray-500"
                    }`}
                  >
                    At least one special character
                  </li>
                </ul>
              </div>
            </div>

            <div className='rounded-full w-full relative'>
              <input 
                type={confirmPassword ? 'text' : 'password'}
                id="confirm" 
                onChange={handleChange}
                className='w-full h-full px-8 py-4 rounded-full bg-[#48aadf13]'
                placeholder='Confirm password'
                autoComplete='off'
              />
              <span 
                className='absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl'
                onClick={() => setConfirmPassword(!confirmPassword)}
              >
                { confirmPassword ? <EyeClosedIcon className='p-0.5'/> : <EyeIcon className='p-0.5'/> }
              </span>
            </div>

            {/* Terms of Service */}
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="rememberMe" 
                checked={agree} 
                onClick={agreeToTerms} 
                onChange={handleChange}
                className="hidden" // Hide the default checkbox
              />
              <label htmlFor="rememberMe" className="flex items-center cursor-pointer">
                <div className={`relative w-4 h-4 flex items-center justify-center rounded border-2 ${agree ? 'border-[#4078bc] bg-[#4078bc]' : 'border-black'} transition-all duration-300`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`absolute w-3.5 h-3.5 text-white transition-opacity duration-300 
                      ${agree ? 'opacity-100' : 'opacity-0'}`
                    }
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

            <button 
              type="submit"
              disabled={strength !== "strong" }
              className={`w-full py-3 text-white rounded-full border-none outline-none mt-5 flex items-center justify-center gap-2 
                ${strength !== 'strong' || loading ? 'bg-[#48aadf96] cursor-not-allowed' : 'bg-[#48aadf] cursor-pointer'}`
              }
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: .5,
            ease: 'easeInOut'
          }}
          className="fixed left-0 right-0 top-0 bottom-0 z-50 bg-black/25 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: .5,
              ease: 'easeInOut'
            }}
            className="relative bg-white p-5 pt-8 rounded-xl .transition-all { transition: all 0.3s ease-in-out; } w-64 max-w-[90%] flex justify-center items-center flex-col gap-4"
          >
            <X
              className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8"
              onClick={() => setShowModal(false)}
            />
            <p className="font-serif pt-2 text-center">{errorMessage}</p>
            <motion.div className="actions">
              <button 
                type="button" 
                className={`bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full transition-all duration-300 ease-in-out 
                  ${isClicked ? 'scale-90' : 'scale-100'}`
                }
                onClick={() => {
                  setShowModal(false)
                  handleButtonClick();
                }}
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>  
      
      <AnimatePresence>
        {/* Verify Email Address */}
        {verificationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <motion.div 
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: .5,
                ease: "easeInOut"
              }}
              className="bg-[#ECECEC] px-6 pt-8 pb-6 rounded-lg relative flex flex-col justify-center items-center gap-1 w-64 max-w-[90%]">
              <X
                className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8" 
                onClick={() => setVerificationModal(false)} 
              />
              {step === 1 && (
              <>
                <div className='font-serif text-xl mb-2'>Enter OTP</div>
                <div className='flex gap-5'>
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      ref={(input) => inputRefs.current[index] = input}
                      type="text"
                      value={value}
                      onChange={(e) => handleOtpChange(index, e)}
                      onClick={() => handleClick(index)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className='border border-gray-400 w-8 h-8 rounded-md bg-transparent outline-none text-center'
                    />
                  ))}
                </div>
                {modalMessage && 
                  <motion.p 
                    initial={{
                      opacity: 0,
                      y: -10
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    exit={{
                      opacity: 0,
                      y: -10
                    }}
                    transition={{
                      duration: .5,
                      ease: "easeInOut"
                    }}
                    className='text-[0.7rem] text-red-500'
                  >
                    {modalMessage}
                  </motion.p>
                }
                <div 
                  className='cursor-pointer text-[#4078bc] text-sm' 
                  onClick={handleResendOTP}
                >
                  Resend OTP
                </div>
                <button 
                  type="button" 
                  className={`bg-[#48aadf] text-white py-2 px-5 rounded-full cursor-pointer outline-none mt-3 text-sm 
                    transition-all duration-300 ease-in-out 
                    ${isClicked ? 'scale-90' : 'scale-100'}`
                  }
                  onClick={() => {
                    handleVerifyOTP();
                    handleButtonClick();
                  }}
                >
                  verify 
                </button>
              </>
              )}

              {step === 2 && (
                <>
                  <p className='text-center font-serif'>Your account has been successfully created</p>
                  <div>
                    <button 
                      type="button"
                      onClick={() => {
                        setVerificationModal(false);
                        handleButtonClick();

                        setTimeout(() => {
                          navigate('/signin')
                        }, 1000);
                      }}

                      className={`bg-[#48aadf] text-white py-2 px-5 rounded-full cursor-pointer outline-none mt-3 text-sm transition-all duration-300 ease-in-out 
                        ${isClicked ? 'scale-90' : 'scale-100'}`
                      }
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
    </div>
  )
}

export default SignUp