import React, { useEffect, useState } from 'react';

function NotificationHandler() {
  const [showNotification, setShowNotification] = useState(false);
  const [playerData, setPlayerData] = useState([]);
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const token = localStorage.getItem('token');
       
        const response = await fetch('http://localhost:5000/send-reminder', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setShowNotification(data.show_notification);
        setPlayerData(data.player_data)  ; 
      } catch (error) {
        console.error('Error fetching notification:', error);
      }
    };
    fetchNotification();
  }, []);

  useEffect(() => {
    if (showNotification) {
      alert(`You have not returned your issued ${playerData[9]} item yet.`);
    }
  }, [showNotification]);

  return null;
}

export default NotificationHandler;
