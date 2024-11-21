import React, { useEffect, useState } from 'react';
import "./App.css"
import Layout from './Components/Layout.jsx';
// import Todo from "./Components/Redux todo/Todo";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './Components/PrivateRoute.jsx';
import Home from './Pages/Home.jsx';
import Signup from './Pages/Signup.jsx';
import Login from './Pages/Login.jsx';
import UserData from './Pages/UserData.jsx';
import ContactList from './Components/Contact List/ContactList.jsx';
import { useDispatch, useSelector } from 'react-redux';
import Title from './Components/Title.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LogoutButton from './Components/ConfirmLogout.jsx';
import { addToken } from './Auth/authSlice.js';

const App = () => {
const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(addToken(localStorage.getItem('token')));
  },[dispatch])
  return (
    <>
      <Router>
        <div className='bodyDiv'>
         <Layout>
                    <Title/>
                    <ToastContainer />
                    {/* <LogoutButton /> */}
          <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Login />} />
              
              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                  <Route path="/UserData" element={<UserData />} />
                  <Route path="/contacts" element={<ContactList />} />
              </Route>
          </Routes>
          </Layout>
          </div>
      </Router>

      </>
  );
};

export default App;