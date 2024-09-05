import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!sessionStorage.getItem('isAuthenticated')) {
        alert('Access denied');
        navigate('/login'); // Redirect to the homepage if not authenticated
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const { user } = await response.json();
          setUser(user); // Update the user state with fetched data
        } else {
          const { msg } = await response.json();
          throw new Error(msg);
        }
      } catch (error) {
        setErrorMessage(error?.message || 'Unknown error');
        alert(`Failed to load profile: ${error?.message || 'Unknown error'}`);
        navigate('/login'); // Redirect to homepage on failure
      }
    };

    fetchUserData();
  }, [navigate]);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }
console.log(user);

  return (
    <div id="user-info">
      <p>First name: {user.firstName}</p>
      <p>Last name: {user.lastName}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Profile;
