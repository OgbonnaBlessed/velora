import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const OAuth = ({ label }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account'})

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      // Axios POST request instead of fetch
      const res = await axios.post('/api/auth/google', {
        name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        googlePhotoUrl: resultsFromGoogle.user.photoURL,
      }, {
        headers: { 'Content-Type': 'application/json' }
      })

      if (res.status === 200) {
        dispatch(signInSuccess(res.data))
        navigate('/')
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <button 
      className='flex rounded-md bg-[#4078bc] p-2 items-center w-96 max-w-full cursor-pointer'
      type="submit"
      onClick={handleGoogleClick}
    >
      <div className='bg-white p-2 rounded-md text-lg'>
        <FcGoogle />
      </div>
      <p className='text-center text-white w-full'>{label}</p>
    </button>
  )
}

export default OAuth