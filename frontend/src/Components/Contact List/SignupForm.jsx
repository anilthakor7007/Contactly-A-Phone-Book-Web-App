import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signupUser } from '../../Auth/authAPI';

const SignupForm = ({ onSignup, err }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Validate form inputs
    const validateForm = () => {
        const newErrors = {};
        if (!username.trim()) newErrors.username = 'Username is required';
        if (!email.trim()) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        return newErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            try {
                await onSignup({ username, email, password });
            } catch (error) {
                console.error('Error during signup:', error);
            }
        } else {
            setErrors(newErrors);
        }
    };

    // Remove error when input is corrected
    const handleInputChange = (e, field) => {
        const { value } = e.target;
        if (field === 'username') setUsername(value);
        if (field === 'email') setEmail(value);
        if (field === 'password') setPassword(value);
        if (field === 'confirmPassword') setConfirmPassword(value);

        // Clear error for the field
        setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <form onSubmit={handleSubmit} className="max-w-md w-full p-6 bg-white bg-opacity-50 shadow-md rounded-lg">
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => handleInputChange(e, 'username')}
                        // required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => handleInputChange(e, 'email')}
                        // required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => handleInputChange(e, 'password')}
                        // required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => handleInputChange(e, 'confirmPassword')}
                        // required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                    Sign Up
                </button>
                {err && <p className="mt-4 text-red-500">{err}</p>}
                <p className="mt-4 text-gray-600 text-sm text-center">
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('/')}
                        className="text-blue-500 cursor-pointer hover:underline"
                    >
                        Log in
                    </span>
                </p>
            </form>
        </div>
    );
};

export default SignupForm;
