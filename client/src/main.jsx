import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
// 👇 Import Google Provider
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👇 Wrap everything with your Client ID */}
    {/* ⚠️ PASTE YOUR ACTUAL GOOGLE CLIENT ID BELOW */}
    <GoogleOAuthProvider clientId="321612544837-pq9g77ngg86g2burmcnceqg6ato3uogo.apps.googleusercontent.com">
      <BrowserRouter>
        <App />
        <Toaster position="top-center" reverseOrder={false} />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)