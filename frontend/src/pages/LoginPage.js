// frontend/src/pages/LoginPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className='auth-wrapper'>
      <div className='auth-card'>
        <h1>Login to TheFolio</h1>
        <p className="subtitle">Welcome back! Please enter your credentials.</p>

        {error && <div className='error-msg'>{error}</div>}

        <form className='auth-form' onSubmit={handleSubmit}>
          <input 
            type='email' 
            placeholder='Email address' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type='password' 
            placeholder='Password' 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type='submit' className="btn-primary">Login</button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to='/register'>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;