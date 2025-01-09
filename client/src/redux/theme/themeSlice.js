import { createSlice } from "@reduxjs/toolkit";  // Importing createSlice from Redux Toolkit

// Initial state for the theme slice, which holds the current theme of the application
const initialState = {
    theme: 'light',  // Default theme is 'light'
};

// Creating a slice for managing the theme state using Redux Toolkit's createSlice
const themeSlice = createSlice({
    name: 'theme',  // Name of the slice, which helps identify this part of the state
    initialState,    // The initial state for the slice
    reducers: {      // Reducers are functions that modify the state
        toggleTheme: (state) => {  // Reducer to toggle between light and dark themes
            // Toggle the theme between 'light' and 'dark' when this action is dispatched
            state.theme = state.theme === 'light' ? 'dark' : 'light'; 
        },
    },
});

// Exporting the action created by the slice so it can be dispatched elsewhere
export const { toggleTheme } = themeSlice.actions;

// Exporting the reducer function to be used in the store setup
export default themeSlice.reducer;