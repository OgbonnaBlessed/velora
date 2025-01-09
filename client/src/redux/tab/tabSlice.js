import { createSlice } from "@reduxjs/toolkit";  // Importing createSlice from Redux Toolkit for state management

// Initial state of the slice, setting the default active tab to "stays"
const initialState = {
  activeTab: "stays", // Default tab is "stays"
};

// Create a slice of the Redux store named 'tab'
const tabSlice = createSlice({
    name: "tab",  // Name of the slice; helps to identify the slice in Redux DevTools
    initialState,  // Set the initial state for this slice
    reducers: {  // Define the actions (reducers) that modify the state
        // Action to set the active tab in the state
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;  // Update the activeTab with the payload from the action
        },
    },
});

// Export the action created by createSlice to be used in components
export const { setActiveTab } = tabSlice.actions;  // Destructure and export the 'setActiveTab' action

// Export the reducer to be used in the store configuration
export default tabSlice.reducer;  // The reducer function to be included in the store setup