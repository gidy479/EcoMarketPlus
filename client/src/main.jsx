import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.jsx'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

if (!clientId) {
  console.error("CRITICAL: Google Client ID is missing. Please check VITE_GOOGLE_CLIENT_ID in Vercel settings.");
} else {
  console.log("Google Client ID loaded successfully ending in: ..." + clientId.slice(-10));
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
