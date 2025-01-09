import { configureStore, combineReducers } from '@reduxjs/toolkit'; // Importing necessary functions from Redux Toolkit
import userReducer from './user/userSlice'; // Importing the user slice reducer
import { persistReducer, persistStore } from 'redux-persist'; // Importing persist functions for state persistence
import storage from 'redux-persist/lib/storage'; // Importing default storage engine (localStorage) for persistence
import themeReducer from './theme/themeSlice'; // Importing the theme slice reducer
import bookmarkReducer from './bookmark/bookmarkSlice'; // Importing the bookmark slice reducer
import tabReducer from "./tab/tabSlice"; // Importing the tab slice reducer

// Combining all reducers into one rootReducer
const rootReducer = combineReducers({
    user: userReducer, // Combines the user reducer for handling user authentication
    theme: themeReducer, // Combines the theme reducer for handling the theme (light/dark mode)
    bookmarks: bookmarkReducer, // Combines the bookmark reducer to manage user's bookmarked items
    tab: tabReducer, // Combines the tab reducer for managing tabs state (e.g., which tab is active)
});

// Configuration for redux-persist, specifying how the state should be persisted
const persistConfig = {
    key: 'root', // The key used to store the persisted state in storage (localStorage by default)
    storage, // The storage engine to use (here, localStorage)
    version: 1, // Versioning helps in case the persisted state structure needs to change in future versions
};

// Wrapping the rootReducer with persistReducer to make it persistent
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Creating the Redux store and configuring it
export const store = configureStore({
    reducer: persistedReducer, // Setting the persisted reducer to manage state
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }), // Disabling serializable check to allow non-serializable values (e.g., functions) in the store
});

// Creating a persistor object which will be used to persist the store data
export const persistor = persistStore(store);