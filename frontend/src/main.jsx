import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';  // Import Provider
import App from './App.jsx';
import './index.css';
import { store } from './redux/store.js';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>  {/* Wrap App with Redux Provider */}
      <App />
    </Provider>
  </StrictMode>,
);
