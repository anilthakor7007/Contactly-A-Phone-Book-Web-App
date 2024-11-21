import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../Components/Contact List/SignupForm'; // Adjust the path as needed
import { signupUser } from '../Auth/authAPI'; // Adjust the path as needed
import { toast } from 'react-toastify';

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [signupError, setSignupError] = useState(null);

    const handleSignup = async (formData) => {
        try {
            // Dispatch signupUser action with formData
            const result = await dispatch(signupUser(formData)).unwrap();
            console.log(result);
            console.log(result.token);
            if (result.token) {
                toast.success('SignUp successful!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                navigate('/');
                // Save the token to localStorage
                localStorage.setItem('token', result.token);
                // Navigate to the login page upon successful signup
                console.log("token after navigation" + result.token);
            }
        } catch (err) {
            // Handle signup errors here
            toast.error('SignUp failed. Please try again.', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            console.error('Signup failed:', err);
            setSignupError(err.message || 'Signup failed. Please try again.'); // Set the error to display in the form
        }
    };

    return (
        <div>
            {/* <h1>Signup Page</h1> */}
            <SignupForm onSignup={handleSignup} err={signupError} />
        </div>
    );
};

export default Signup;
