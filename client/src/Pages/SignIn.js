import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import OAuth from '../Components/OAuth'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState();
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }

  const handleCheckboxChange = () => {
    setKeepMeSignedIn(!keepMeSignedIn); // Toggle checkbox state
  };

  return (
    <div className='w-full py-10 flex items-center justify-between relative'>
      <div className='absolute sm:left-5 sm:top-5 top-2 left-1 hover:bg-[#48aadf13] sm:p-3 p-2 rounded-full cursor-pointer text-[#48aadf] transition-colors duration-300 ease-in-out'>
        <ArrowLeft/>
      </div>
      <div className='flex flex-col items-center gap-5 w-full'>
        <h1 className='sm:text-3xl text-2xl font-medium'>Welcome Back</h1>
        <div className='flex flex-col items-center gap-5 w-96 max-w-[90%]'>
          <OAuth label={'Sign in with Google'} />
          <p>or</p>
          <form className='flex flex-col gap-3 w-full'>
            <input 
              type="email" 
              name="" 
              id="" 
              className='rounded-full px-8 py-4 bg-[#48aadf13] w-full'
              placeholder='Email'
              autoComplete='off'
            />
            <div className='rounded-full w-full relative'>
              <input 
                type={passwordVisible ? 'text' : 'password'}
                name="" 
                id="" 
                className='w-full h-full px-8 py-4 rounded-full bg-[#48aadf13]'
                placeholder='Password'
                autoComplete='off'
              />
              <span 
                className='absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl'
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash/> : <FaEye/>}
              </span>
            </div>

            <div className='flex items-center justify-between'>
              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  checked={keepMeSignedIn} 
                  onClick={handleCheckboxChange} 
                  onChange={handleChange}
                  className="hidden" // Hide the default checkbox
                />
                <label htmlFor="rememberMe" className="flex items-center cursor-pointer">
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

              <div>
                Forgot?
              </div>
            </div>
            <button 
              type="submit"
              className='w-full py-3 text-white rounded-full border-none outline-none cursor-pointer bg-[#48aadf] mt-5'
            >
              Continue
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
    </div>
  )
}

export default SignIn
