import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfileData(response.data);
      } catch (error) {
        setError('Error fetching profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profileData) {
    return <div>No profile data found</div>;
  }

  const { type, data } = profileData;

  return (
    <div className="profile-container">
    <div className="profile-header">
      <h1>Profile</h1>
    </div>
    {type === 'player' && (
      <div className="profile-data">
        <div className="profile-type">User Type: Player</div>
        <div className="profile-data-title">Data:</div>
        <pre className="profile-data-value">{JSON.stringify(data, null, 2)}</pre>
      </div>
    )}
    {type === 'coach' && (
      <div className="profile-data">
        <div className="profile-type">User Type: Coach</div>
        <div className="profile-data-title">Data:</div>
        <pre className="profile-data-value">{JSON.stringify(data, null, 2)}</pre>
        {/* Additional coach-specific UI elements can be added here */}
      </div>
    )}
  </div>
  
  );
}

export default Profile;
