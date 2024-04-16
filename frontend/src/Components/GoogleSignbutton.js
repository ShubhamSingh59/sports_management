import React, { useEffect } from 'react';
import axios from 'axios'; // You'll need to install axios

function GoogleSignIn() {
  // Function to handle Google sign-in button click
  const handleGoogleSignIn = async () => {
    try {
      await axios.get('http://localhost:5000/google/');
      // After successful redirect, the Flask backend will handle the Google OAuth process
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  // Function to handle Google authentication callback
  useEffect(() => {
    const handleGoogleAuthCallback = async () => {
      try {
        const response = await axios.get('http://localhost:5000/google/auth/');
        console.log('Google Auth Response:', response.data);
        // Handle further actions after successful authentication
      } catch (error) {
        console.error('Error handling Google authentication:', error);
      }
    };

    handleGoogleAuthCallback();
  }, []);

  return (
    <div>
      <h1>Welcome to My App</h1>
      <p>Please sign in with Google to continue:</p>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      <p>Processing Google authentication...</p>
    </div>
  );
}

export default GoogleSignIn;
