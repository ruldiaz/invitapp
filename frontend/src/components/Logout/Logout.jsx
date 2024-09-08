import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutSuccess } from '../../redux/authSlice';

export const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await fetch('http://localhost:3000/api/logout', { method: 'POST', credentials: 'include' });
      dispatch(logoutSuccess());
      navigate('/');
    };

    logout();
  }, [dispatch, navigate]);

  return <div>Logging out...</div>;
};
