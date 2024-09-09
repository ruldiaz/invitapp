import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('isAuthenticated')) {
      alert('Access denied');
      navigate('/login'); // Redirect to the login page if not authenticated
      return;
    }

    const fetchUserData = async () => {
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
        navigate('/login'); // Redirect to login on failure
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        const { msg } = await response.json();
        throw new Error(msg);
      }
    } catch (error) {
      alert(`Profile update failed: ${error?.message || 'Unknown error'}`);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/user/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        alert('Password updated successfully');
        setPassword('');
      } else {
        const { msg } = await response.json(); // Ensure to await this
        throw new Error(msg);
      }
    } catch (error) {
      alert(`Password update failed: ${error?.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className='profile-component' id="user-info">
      <form onSubmit={handleProfileUpdate}>
        <p>
          First name:
          <input type="text" value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })} />
        </p>
        <p>
          Last name:
          <input type="text" value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })} />
        </p>
        <p>
          Email: {user.email}
        </p>
        <button type='submit'>Update Profile</button>
      </form>
      <form onSubmit={handlePasswordUpdate}>
        <p>
          New password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </p>
        <button type='submit'>Update Password</button>
      </form>
    </div>
  );
};

export default Profile;
