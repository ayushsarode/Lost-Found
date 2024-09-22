import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token); // Store token in local storage
      navigate('/items'); // Redirect to Items page
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to login';
      alert(errorMessage);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-[5rem] bg-white p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-black mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-black mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-black rounded bg-white text-black placeholder-gray-500 focus:ring focus:ring-gray-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-black mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border border-black rounded bg-white text-black placeholder-gray-500 focus:ring focus:ring-gray-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <span className="text-black">Don't have an account? </span>
        <Link to="/register" className="text-indigo-500 hover:underline">Create Account</Link>
      </div>
    </div>
  );
}

export default Login;
