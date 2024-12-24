import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import themeReducer from './theme/themeSlice'
import bookmarkReducer from './bookmark/bookmarkSlice'
import tabReducer from "./tab/tabSlice";

const rootReducer = combineReducers({
    user: userReducer,
    theme: themeReducer,
    bookmarks: bookmarkReducer,
    tab: tabReducer, // Add tab reducer
});

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);