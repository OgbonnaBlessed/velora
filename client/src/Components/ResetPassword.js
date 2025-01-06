import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, EyeClosedIcon, EyeIcon } from 'lucide-react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [password, setPassword] = useState("");
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [strength, setStrength] = useState("weak");
    const [isFocused3, setIsFocused3] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [modalMessage, setModalMessage] = useState(null);
    const [strengthConditions, setStrengthConditions] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });
    const passwordRef = useRef(null);
    const navigate = useNavigate();

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

    const handleResetPassword = async () => {
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: currentUser.email, newPassword }),
            });
        
            const data = await res.json();
        
            if (res.ok) {
                navigate('/password-reset-success')
        
            } else {
                console.error('Error resetting password:', data.message);
                setModalMessage(data.message);
            }
    
        } catch (error) {
          console.error('Error resetting password:', error);
        }
    };

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
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
            duration: .5,
            ease: "easeInOut"
        }}
        className='bg-white fixed w-full h-full inset-0 z-[10000] flex justify-center'
    >
        <div className='pt-16 w-[30rem] max-w-[90%] flex flex-col gap-5'>
            <div 
                className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
                onClick={() => {
                    navigate(-1);
                }}
            >
                <ArrowLeft />
            </div>

            <div className='flex items-center justify-center gap-1 w-full mb-5'>
                <img 
                    src={`${process.env.PUBLIC_URL}/images/logo.png`} 
                    alt="Velora logo" 
                    className='w-14 bg-black p-1 rounded-br-xl'
                />
            </div>
            <h1 className='text-3xl font-semibold'>Change Password</h1>
            <div ref={passwordRef} className='w-full'>
                <div className='relative text-black'>
                <label
                    htmlFor="new-password"
                    className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text 
                        ${isFocused3
                            ? 'top-[0.01rem] scale-75 text-[#48aadf] transform -translate-x-3' // Label moves up and scales down when focused
                            : 'top-1/2 transform -translate-y-1/2 text-black'
                        }`
                    }
                >
                    New password
                </label>
                <input 
                    id='new-password'
                    type={newPasswordVisible ? 'text' : 'password'} 
                    value={newPassword}
                    onFocus={() => {
                        setPassword(true);
                        setIsFocused3(true);
                    }}
                    onBlur={(e) => !e.target.value && setIsFocused3(false)} // Reset if input is empty
                    onChange={handlePasswordChange} 
                    className="w-full shadow shadow-gray-400 rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                />
                <span 
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer' 
                    onClick={() => setNewPasswordVisible(!newPasswordVisible)}>
                    { newPasswordVisible 
                        ? <EyeClosedIcon className='p-0.5'/> 
                        : <EyeIcon className='p-0.5'/> 
                    }
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
                    <ul className="mt-2 text-sm font-serif">
                        <li
                            className={`transition-colors duration-300 ease-in-out 
                                ${strengthConditions.length ? "text-[#1158a6]" : "text-gray-500"}`
                            }
                        >
                            At least 8 characters
                        </li>
                        <li
                            className={`transition-colors duration-300 ease-in-out 
                                ${strengthConditions.uppercase ? "text-[#1158a6]" : "text-gray-500"}`
                            }
                        >
                            At least one uppercase letter
                        </li>
                        <li
                            className={`transition-colors duration-300 ease-in-out 
                                ${strengthConditions.lowercase ? "text-[#1158a6]" : "text-gray-500"}`
                            }
                        >
                            At least one lowercase letter
                        </li>
                        <li
                            className={`transition-colors duration-300 ease-in-out 
                                ${strengthConditions.number ? "text-[#1158a6]" : "text-gray-500"}`
                            }
                        >
                            At least one number
                        </li>
                        <li
                            className={`transition-colors duration-300 ease-in-out 
                                ${strengthConditions.specialChar ? "text-[#1158a6]" : "text-gray-500"}`
                            }
                        >
                            At least one special character
                        </li>
                    </ul>
                </div>

                <p 
                    className={`text-[0.7rem] text-red-500 transform transition-all duration-700 ease-in-out 
                        ${modalMessage 
                            ? 'opacity-1 translate-y-0 pointer-events-auto' 
                            : 'opacity-0 -translate-y-5 pointer-events-none'
                        }`
                    }
                >
                    {modalMessage}
                </p>

                <button 
                    onClick={handleResetPassword} 
                    disabled={ strength !== "strong" }
                    className={`text-white w-full h-12 rounded-full outline-none mt-3 font-semibold transition-all duration-300 ease-in-out shrink-button
                        ${strength !== 'strong' 
                            ? 'bg-[#48aadf96] cursor-not-allowed' 
                            : 'bg-[#48aadf] cursor-pointer'
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