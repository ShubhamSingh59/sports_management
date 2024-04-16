import { GoogleLogin } from 'react-google-login';

function MyComponent() {
  const responseGoogle = (response) => {
    console.log(response);
    // Send the response to your backend for verification and authentication
  };

  return (
    <GoogleLogin
      clientId="137749633841-51ec8ds9mmvlilvmdtbktaqgtihjb87g.apps.googleusercontent.com"
      buttonText="Login with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
    />
  );
}

export default MyComponent;


