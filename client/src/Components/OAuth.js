import React from 'react' // Importing React to use JSX and React features
import { FcGoogle } from 'react-icons/fc' // Importing the Google icon from react-icons for display in the button
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth' // Importing Firebase authentication methods for Google login
import { app } from '../firebase' // Importing the Firebase app configuration from a separate file
import { useDispatch } from 'react-redux' // Importing Redux hook to dispatch actions
import { signInSuccess } from '../redux/user/userSlice' // Importing Redux action to update user state on successful sign-in
import { useNavigate } from 'react-router-dom' // Importing hook for navigation after successful sign-in
import axios from 'axios' // Importing axios for making HTTP requests

// OAuth component for handling Google sign-in functionality
const OAuth = ({ label }) => {
  // Using the Redux dispatch hook to dispatch actions
  const dispatch = useDispatch();
  // Using the navigate hook to programmatically navigate to another route
  const navigate = useNavigate();
  // Get Firebase authentication instance
  const auth = getAuth(app);

  // Function that handles the Google sign-in process when the button is clicked
  const handleGoogleClick = async () => {
    // Create an instance of the GoogleAuthProvider for Google login
    const provider = new GoogleAuthProvider();
    // Set custom parameters for the login prompt
    provider.setCustomParameters({ prompt: 'select_account'});

    try {
      // Attempt to sign in with a popup window for Google authentication
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      // If sign-in is successful, make an Axios POST request to your backend
      const res = await axios.post('/api/auth/google', {
        name: resultsFromGoogle.user.displayName, // Send user display name to the backend
        email: resultsFromGoogle.user.email, // Send user email to the backend
        googlePhotoUrl: resultsFromGoogle.user.photoURL, // Send user's Google profile picture URL to the backend
      }, {
        headers: { 'Content-Type': 'application/json' } // Specify the content type of the request as JSON
      });

      // If the server responds with status 200 (successful request), update the Redux store and navigate
      if (res.status === 200) {
        dispatch(signInSuccess(res.data)); // Dispatch success action with user data
        navigate('/'); // Navigate to the homepage (or any other page you want after login)
      }

    } catch (error) {
      // Log any errors that occur during sign-in
      console.log(error);
    }
  };

  return (
    // The button used to trigger the Google OAuth sign-in
    <button 
      className='flex rounded-md bg-[#4078bc] p-2 items-center w-96 max-w-full cursor-pointer' // Button styling with flexbox and padding
      type="submit" // Specifies that this is a submit button (though it's not actually submitting a form)
      onClick={handleGoogleClick} // Attaches the click event handler to initiate Google sign-in
    >
      {/* Google icon displayed in the button */}
      <div className='bg-white p-2 rounded-md text-lg'>
        <FcGoogle /> {/* Google icon */}
      </div>
      {/* Label text inside the button, passed as a prop to the component */}
      <p className='text-center text-white w-full'>{label}</p>
    </button>
  )
}

export default OAuth; // Exporting the component for use in other parts of the application