import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Set global axios base URL — fixes all API calls across the entire app
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
