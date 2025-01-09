// Import React library to use JSX and React-specific functionality
import React from 'react';

// Import ReactDOM to render the React app to the DOM
import ReactDOM from 'react-dom/client';

// Import global CSS file for styling the app
import './index.css';

// Import the root component of your application
import App from './App';

// Import the store and persistor objects from the redux store setup
import { store, persistor } from './redux/store';

// Import the Provider component from react-redux to connect Redux to the app
import { Provider } from 'react-redux';

// Import PersistGate to delay rendering until the persisted state has been retrieved
import { PersistGate } from 'redux-persist/integration/react';

// Import ThemeProvider component to manage and provide theme styling
import ThemeProvider from './Components/ThemeProvider';

// Create the root element of the React application by targeting the 'root' DOM element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application to the DOM, wrapped with various providers
root.render(
  // PersistGate component ensures that the app waits until the Redux store is fully hydrated
  <PersistGate persistor={persistor}>
    {/* Provider component makes the Redux store available to all components */}
    <Provider store={store}>
      {/* ThemeProvider is used to provide global theme settings to the app */}
      <ThemeProvider>
        {/* App is the root component of the application */}
        <App />
      </ThemeProvider>
    </Provider>
  </PersistGate>
);