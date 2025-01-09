import React from 'react' 
// Import React to create and use React components.

import { useSelector } from 'react-redux' 
// Import the useSelector hook from react-redux to access the state stored in the Redux store.

import { Outlet, Navigate } from 'react-router-dom' 
// Import Outlet and Navigate from react-router-dom for handling nested routes and redirection.

const ProtectedRoute = () => {
  // Define a functional component named ProtectedRoute.

  const { currentUser } = useSelector((state) => state.user)
  // Use the useSelector hook to extract the currentUser property from the user slice of the Redux store's state.
  // state is the entire Redux store state, and state.user refers to the user-related part of the state.
  // currentUser is expected to hold information about the logged-in user, or it will be null/undefined if no user is logged in.

  return currentUser ? <Outlet /> : <Navigate to='/signin'/>
  // Check if currentUser exists:
  // - If currentUser is truthy (i.e., a user is logged in), render the Outlet component, which allows access to nested routes defined within this ProtectedRoute.
  // - If currentUser is falsy (i.e., no user is logged in), redirect the user to the /signin route using the Navigate component.
  // This ensures that only authenticated users can access the protected routes.
}

export default ProtectedRoute
// Export the ProtectedRoute component as the default export of this module.