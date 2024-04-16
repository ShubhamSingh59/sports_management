import React from 'react';
import { GoogleLogin } from 'react-google-login';

const clientId = '137749633841-51ec8ds9mmvlilvmdtbktaqgtihjb87g.apps.googleusercontent.com'; 

const GoogleSignIn = () => {
    const onSuccess = (googleUser) => {
        console.log('Login Success:', googleUser);
        // Extract user information from googleUser object
        const profile = googleUser.getBasicProfile();
        const email = profile.getEmail();
        const name = profile.getName();
        // Perform further actions, such as setting authentication tokens or redirecting
      
    // Handle successful login
  };

  const onFailure = (error) => {
    console.error('Login Failed:', error);
    // Display an error message to the user
    alert('Login failed. Please try again.');
  };
  

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Sign in with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default GoogleSignIn;
