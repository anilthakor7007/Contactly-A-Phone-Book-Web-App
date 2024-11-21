import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'https://contactly-backend-one.vercel.app/api/auth';

// Setup Axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Function to get the auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Set the token header if it exists in localStorage on initialization
const token = getAuthToken();
if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Async thunk for signup
export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/signup', userData);
            console.log('Signup Response:', response.data);

            const { token } = response.data; 
            
            if (token) {
                localStorage.setItem('token', token);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }

            return response.data; // Returning the full response data which may include user details
        } catch (error) {
            console.error('Signup Error:', error.response?.data);
            return rejectWithValue(error.response?.data || 'Signup failed');
        }
    }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/login', userData);
            console.log('Login Response:', response.data);
       

            const { token, user } = response.data; 
            
            if (token) {
                localStorage.setItem('token', token);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            
            // alert(token);
            // alert(user.username);
            return { token, user }; // Returning both token and user
        } catch (error) {
            console.error('Login Error:', error.response?.data);
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

// Fetch contacts
export const fetchContacts = createAsyncThunk(
    'contacts/fetchContacts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/contacts', {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Fetch Contacts Error:', error.response?.data);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contacts');
        }
    }
);
