// frontend/src/pages/RegisterPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password.trim(),
    };

    try {
      const { data } = await API.post('/auth/register', payload);
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ECONNABORTED'
          ? 'Registration timed out. The server took too long to respond.'
          : err.message === 'Network Error'
            ? `Cannot reach the server at ${API.defaults.baseURL}.`
            : 'Registration failed. Check that the backend server is running and try again.');

      setError(message);
    }
  };

  return (
    <div className='auth-wrapper'>
      <div className='auth-card'>
        <h1>Create an Account</h1>
        <p className="subtitle">Join TheFolio and start sharing your work.</p>
        
        {error && <div className='error-msg'>{error}</div>}
        
        <form className='auth-form' onSubmit={handleSubmit}>
          <input 
            name='name' 
            placeholder='Full name' 
            value={form.name} 
            onChange={handleChange} 
            required 
          />
          <input 
            name='email' 
            type='email' 
            placeholder='Email address' 
            value={form.email} 
            onChange={handleChange} 
            required 
          />
          <input 
            name='password' 
            type='password' 
            placeholder='Password (min 6 chars)' 
            value={form.password} 
            onChange={handleChange} 
            required 
            minLength={6} 
          />
          <button type='submit' className="btn-primary">Register</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to='/login'>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
