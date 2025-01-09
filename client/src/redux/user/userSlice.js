import { createSlice } from "@reduxjs/toolkit";  // Importing createSlice from Redux Toolkit

// Initial state of the user slice, representing the user's authentication state, loading status, and error state
const initialState = {
    currentUser: null,  // Initially, no user is signed in, so it's set to null
    error: null,        // Error is initially null
    loading: false,     // Loading is initially false, indicating no ongoing operation
};

// Creating a slice to manage the user-related actions and state
const userSlice = createSlice({
    name: 'user',         // Name of the slice, used to identify this part of the state
    initialState,         // The initial state defined above
    reducers: {           // Reducers to handle various user-related actions
        // Action to start the sign-in process, sets loading to true and clears any existing errors
        signInStart: (state) => {
            state.loading = true;  // Indicates the sign-in process is ongoing
            state.error = null;    // Clear any previous errors
        },
        // Action for successful sign-in, sets the currentUser and resets loading and error states
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;  // Sets the user from the action payload
            state.loading = false;                // Sign-in process is completed
            state.error = null;                   // Clears any error messages
        },
        // Action for failed sign-in, updates loading state and sets the error message
        signInFailure: (state, action) => {
            state.loading = false;  // Sign-in process has ended
            state.error = action.payload;  // Sets the error from the action payload
        },
        // Action to start the update process (e.g., updating user info), sets loading to true
        updateStart: (state) => {
            state.loading = true;  // Sets loading to true while updating
            state.error = null;    // Clears any previous errors
        },
        // Action for successful update of user info, updates the currentUser and resets loading/error states
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;  // Updates the user information with the payload
            state.loading = false;                // Resets loading to false
            state.error = null;                   // Clears any error messages
        },
        // Action for failed update, updates loading state and sets the error message
        updateFailure: (state, action) => {
            state.loading = false;  // Update process has ended
            state.error = action.payload;  // Sets the error from the action payload
        },
        // Action to start the delete user process, sets loading to true
        deleteUserStart: (state) => {
            state.loading = true;  // Indicates that the user deletion process is ongoing
            state.error = null;    // Clears any previous errors
        },
        // Action for successful user deletion, resets currentUser and loading states
        deleteUserSuccess: (state) => {
            state.currentUser = null;  // Clears the current user as they are deleted
            state.loading = false;     // Resets loading to false
            state.error = null;        // Clears any errors
        },
        // Action for failed user deletion, updates loading state and sets the error message
        deleteUserFailure: (state, action) => {
            state.loading = false;  // User deletion process has ended
            state.error = action.payload;  // Sets the error from the action payload
        },
        // Action for successful sign-out, clears the currentUser and error states
        signOutSuccess: (state) => {
            state.currentUser = null;  // Clears the current user when signed out
            state.error = null;        // Clears any error messages
            state.loading = false;     // Resets loading state
        },
        // Action to update the user's bookings (e.g., when a booking is added/removed/updated)
        updateUserBookings: (state, action) => {
            if (state.currentUser) {  // Check if a user is signed in
                state.currentUser.bookings = action.payload;  // Updates the bookings array in the current user's profile
            }
        },
    },
});

// Exporting the actions that can be dispatched to update the user state
export const { 
    signInStart, 
    signInSuccess, 
    signInFailure, 
    updateStart, 
    updateFailure, 
    updateSuccess,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signOutSuccess,
    updateUserBookings
} = userSlice.actions;  // Destructuring all the actions from the slice

// Exporting the reducer to be used in the Redux store
export default userSlice.reducer;