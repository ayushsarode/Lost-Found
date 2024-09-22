import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', { name, email, password });
            
            // Assuming the backend sends a token after successful registration
            const token = res.data.token; // Get token from response
            if (token) {
                localStorage.setItem('token', token); // Store token
                navigate('/items'); // Redirect to items page
            } else {
                alert('Registration successful, but no token received.');
                navigate('/login'); // If no token, redirect to login page
            }
        } catch (error) {
            alert('Registration failed!');
        }
    };

    return (
        <div className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-xl mt-[5rem]">
            <h2 className="text-2xl font-bold text-black mb-4 text-center">Register</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-4">
                    <label className="block text-black mb-2" htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        className="w-full p-2 border border-black rounded bg-white text-black placeholder-gray-500 focus:ring focus:ring-gray-200"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="w-full p-2 border border-black rounded bg-white text-black placeholder-gray-500 focus:ring focus:ring-gray-200"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="w-full p-2 border border-black rounded bg-white text-black placeholder-gray-500 focus:ring focus:ring-gray-200"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;
