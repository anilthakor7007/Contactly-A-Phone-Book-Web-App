import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLogin, err }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Validate form inputs
    const validateForm = () => {
        const newErrors = {};
        if (!email.trim()) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        return newErrors;
    };

    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            onLogin({ email, password });
        } else {
            setErrors(newErrors);
        }
    };

    // Remove error when input is corrected
    const handleInputChange = (e, field) => {
        const { value } = e.target;
        if (field === 'email') setEmail(value);
        if (field === 'password') setPassword(value);

        // Clear error for the field
        setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    };

    const handleSignupRedirect = (e) => {
        e.preventDefault();
        // Navigate to signup page
        navigate('/signup');
    };

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <form onSubmit={handleSubmit} className="max-w-md w-full p-6 bg-white bg-opacity-50 shadow-md rounded-lg">
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
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password:</label>
                    <input
                        autoComplete="current-password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => handleInputChange(e, 'password')}
                        // required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                    Login
                </button>
                {err && (
                    <div className="mt-4 text-red-500">
                        <p>{err}</p>
                    </div>
                )}
                <p className="mt-4 text-gray-600 text-sm text-center">
                    Don't have an account?{' '}
                    <span
                        onClick={handleSignupRedirect}
                        className="text-blue-500 cursor-pointer hover:underline"
                    >
                        Sign up here
                    </span>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;
