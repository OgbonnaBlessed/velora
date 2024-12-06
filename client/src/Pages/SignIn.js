import React, { useEffect, useRef, useState } from 'react'
import OAuth from '../Components/OAuth'
import { signInSuccess, signInFailure, signInStart } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, EyeClosedIcon, EyeIcon, X } from 'lucide-react'
import { SyncLoader } from 'react-spinners';

const SignIn = ({ length = 4}) => {
  const [formData, setFormData] = useState({});
  const { error: errorMessage } = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);  // Modal visibility state
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [step, setStep] = useState(1); // Step tracker
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("weak");
  const [strengthConditions, setStrengthConditions] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const inputRefs = useRef([]);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSendResetEmail = async () => {
    if (!resetEmail) {
      setModalMessage('Kindly enter your email address');
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
        setModalMessage(data.message);
        // setShowModal(true);
      }

    } catch (error) {
      console.error('Error sending reset email:', error);
    }

  };

  const handleVerifyCode = async () => {
    if (otp.join('').length !== length) {
      setModalMessage(`Code must be ${length} digits`);
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
        setStep(3);  // Proceed to step 3: reset password

      } else {
        console.error('Verification failed:', data.message);
        setModalMessage(data.message);
      }

    } catch (error) {
      console.error('Error verifying code:', error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(4)  // Inform the user the password reset was successful

      } else {
        console.error('Error resetting password:', data.message);
        setModalMessage(data.message);
      }

    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      dispatch(signInFailure('Kindly fill out all fields.'));
      setShowModal(true);  // Show the modal when there's an error
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
        dispatch(signInFailure(data.message));
        setShowModal(true);  // Show the modal when there's an error
        setLoading(false);
        return;
      };

      if (res.ok) {
        dispatch(signInSuccess(data));

        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
      setLoading(false);

    } catch (error) {
      dispatch(signInFailure(error.message));
      setShowModal(true);  // Show the modal when there's an error
      console.log(error)
    }
  }

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

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

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

  
  const return_to_previous_page = () => {
    navigate(-1); // Navigate to the previous page
  }

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

  useEffect(() => {
    if (forgotPasswordModal && step === 2 && inputRefs.current[0]) {

      // Ensure the modal is fully open before trying to focus
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
  
      // Cleanup the timer if the component unmounts or the state changes before 5 seconds
      return () => clearTimeout(timer);
    }

  }, [loading, modalMessage, showModal]);

  const handleCheckboxChange = () => {
    setKeepMeSignedIn(!keepMeSignedIn); // Toggle checkbox state
  };

  return (
    <div className='w-full py-10 flex items-center justify-between relative'>
      <div 
        className='absolute sm:left-5 sm:top-5 top-2 left-1 hover:bg-[#48aadf13] sm:p-3 p-2 rounded-full cursor-pointer text-[#48aadf] transition-colors duration-300 ease-in-out'
        onClick={return_to_previous_page}
      >
        <ArrowLeft/>
      </div>
      <div className='flex flex-col items-center gap-5 w-full'>
        <h1 className='sm:text-3xl text-2xl font-medium'>Welcome Back</h1>
        <div className='flex flex-col items-center gap-5 w-96 max-w-[90%]'>
          <OAuth label={'Sign in with Google'} />
          <p>or</p>
          <form 
            className='flex flex-col gap-3 w-full'
            onSubmit={handleSubmit}
          >
            <input 
              type="email" 
              id="email"
              onChange={handleChange} 
              className='rounded-full px-8 py-4 bg-[#48aadf13] w-full'
              placeholder='Email'
              autoComplete='off'
            />
            <div className='rounded-full w-full relative'>
              <input 
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                onChange={handleChange} 
                className='w-full h-full px-8 py-4 rounded-full bg-[#48aadf13]'
                placeholder='Password'
                autoComplete='off'
              />
              <span 
                className='absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl'
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <EyeClosedIcon className='p-0.5'/> : <EyeIcon className='p-0.5'/>}
              </span>
            </div>

            <div className='flex items-center justify-between'>

              {/* Keep Me Signed in Checkbox */}
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="keepMeSignedIn" 
                  checked={keepMeSignedIn} 
                  onClick={handleCheckboxChange} 
                  onChange={handleChange}
                  className="hidden" // Hide the default checkbox
                />
                <label htmlFor="keepMeSignedIn" className="flex items-center cursor-pointer">
                  <div className={`relative w-4 h-4 flex items-center justify-center rounded border-2 ${keepMeSignedIn ? 'border-[#4078bc] bg-[#4078bc]' : 'border-black'} transition-all duration-300`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`absolute w-3.5 h-3.5 text-white transition-opacity duration-300 
                        ${keepMeSignedIn ? 'opacity-100' : 'opacity-0'}`
                      }
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

              <div 
                className='cursor-pointer'
                onClick={() => setForgotPasswordModal(true)}
              >
                Forgot?
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white rounded-full border-none outline-none mt-5 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out
                ${loading ? 'bg-[#48aadf96] cursor-not-allowed' : 'bg-[#48aadf] cursor-pointer'}`
              }
            >
              <p>
                {
                  loading 
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
          <p>Don't have an account? </p>
          <Link 
            to='/signup'
            className='text-[#4078bc] hover:underline transition-all duration-300 ease-in-out'
          >
            sign up
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
          duration: .5,
            ease: 'easeInOut'
          }}
          exit={{ opacity: 0 }}
          className="fixed left-0 right-0 top-0 bottom-0 z-50 bg-black/25 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: .5,
              ease: 'easeInOut'
            }}
            exit={{ opacity: 0 }}
            className="relative bg-[#ECECEC] p-5 pt-8 rounded-xl .transition-all { transition: all 0.3s ease-in-out; } w-64 max-w-[90%] flex justify-center items-center flex-col gap-4"
          >
            <X
              className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8"
              onClick={() => setShowModal(false)}
            />
            <p className="font-serif pt-2 text-center">{errorMessage}</p>
            <div className="actions">
              <button 
                type="button" 
                className={`bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full transition-all duration-300 ease-in-out 
                  shrink-button`
                }
                onClick={() => setShowModal(false)}
              >
                OK
              </button>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence> 

      <AnimatePresence>
        {forgotPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: .5,
              ease: "easeInOut"
            }}
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
              className="bg-white pb-6 px-2 pt-8 rounded-lg relative flex flex-col justify-center items-center gap-1 w-64 max-w-[90%]"
            >
              <X
                className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8" 
                onClick={() => setForgotPasswordModal(false)} 
              />

              {step === 1 && (
                <>
                  <h2 className='text-black font-serif'>Enter your email</h2>
                  <input 
                    type="email"
                    id="resetEmail"
                    placeholder="Enter email" 
                    onChange={(e) => setResetEmail(e.target.value)}
                    className='rounded-full px-5 py-3 bg-[#48aadf13] w-full'
                    autoComplete='off'
                  />
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
                  <button 
                    onClick={handleSendResetEmail} 
                    className={`bg-[#48aadf] text-white py-2 px-5 rounded-full cursor-pointer outline-none mt-3 text-sm transition-all duration-300 ease-in-out shrink-button`}
                  >
                    send code
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className='text-black text-center font-serif'>
                    Enter code sent to {" "}
                    <span className='text-[#48aadf]'>
                      {resetEmail}
                    </span>
                  </h2>
                  <div className='flex gap-5 mt-1'>
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
                  <button 
                    onClick={handleVerifyCode} 
                    className={`bg-[#48aadf] text-white py-2 px-5 rounded-full cursor-pointer outline-none mt-3 text-sm transition-all duration-300 ease-in-out shrink-button`
                    }
                  >
                    verify
                  </button>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className='text-black text-center font-serif'>Enter your new password</h2>

                  <div ref={passwordRef} className='w-full'>
                    <div className='relative text-black'>
                      <input 
                        type={newPasswordVisible ? 'text' : 'password'} 
                        placeholder='New password'
                        value={newPassword}
                        onFocus={() => setPassword(true)}
                        onChange={handlePasswordChange} 
                        className='rounded-full px-5 py-3 bg-[#48aadf13] w-full'
                      />
                      <span 
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer' 
                        onClick={() => setNewPasswordVisible(!newPasswordVisible)}>
                          { newPasswordVisible ? <EyeClosedIcon className='p-0.5'/> : <EyeIcon className='p-0.5'/> }
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
                  <button 
                    onClick={handleResetPassword} 
                    disabled={ strength !== "strong" }
                    className={`text-white py-2 px-5 rounded-full outline-none mt-3 text-sm transition-all duration-300 ease-in-out 
                      ${strength !== 'strong' ? 'bg-[#48aadf96] cursor-not-allowed' : 'bg-[#48aadf] cursor-pointer'} 
                      shrink-button`
                    }
                  >
                    reset password
                  </button>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className='text-black text-center font-serif'>Your password has been successfully changed</h2>
                  
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
    </div>
  )
}

export default SignIn