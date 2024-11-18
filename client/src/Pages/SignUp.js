import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import OAuth from '../Components/OAuth'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [formData, setFormData] = useState();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }

  const agreeToTerms = () => {
    setAgree(!agree);
  }

  return (
    <div className='w-full py-10 flex items-center justify-between relative'>
      <div className='absolute sm:left-5 sm:top-5 top-2 left-1 hover:bg-[#48aadf13] sm:p-3 p-2 rounded-full cursor-pointer text-[#48aadf] transition-colors duration-300 ease-in-out'>
        <ArrowLeft/>
      </div>
      <div className='flex flex-col items-center gap-5 w-full'>
        <h1 className='sm:text-3xl text-2xl font-medium'>Create an account</h1>
        <div className='flex flex-col items-center gap-5 w-96 max-w-[90%]'>
          <OAuth label={'Sign up with Google'} />
          <p>or</p>
          <form className='flex flex-col gap-3 w-full'>
            <input 
              type="text" 
              name="username" 
              id="username" 
              className='rounded-full px-8 py-4 bg-[#48aadf13] w-full'
              placeholder='Full name'
              autoComplete='off'
            />
            <input 
              type="email" 
              name="email" 
              id="email" 
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
            <div className='rounded-full w-full relative'>
              <input 
                type={confirmPassword ? 'text' : 'password'}
                name="confirm" 
                id="confirm" 
                className='w-full h-full px-8 py-4 rounded-full bg-[#48aadf13]'
                placeholder='Confirm password'
                autoComplete='off'
              />
              <span 
                className='absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl'
                onClick={() => setConfirmPassword(!confirmPassword)}
              >
                {confirmPassword ? <FaEyeSlash/> : <FaEye/>}
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-2 text-black text-sm flex items-center gap-1">
                  <p>Agree to our</p>
                  <Link className='text-[#4078bc] hover:underline transition-all duration-300 ease-in-out'>
                    Terms of service
                  </Link>
                </span>
              </label>
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
          <p>Already have an account? </p>
          <Link 
            to='/signin'
            className='text-[#4078bc] hover:underline transition-all duration-300 ease-in-out'
          >
            sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp