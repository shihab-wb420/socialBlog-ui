import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import toast from "react-hot-toast";

const url = "http://localhost:4040/api/v1" 

const Navbar = () => {
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px',
    background: '#333',
    color: '#fff',
    width:'100%',
    position:"fixed",
    top:"0",
    left:'0px'
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
  };
  

// Your logout function
const logout = async () => { 
  let local_userInfo = localStorage.getItem('userInfo');

// Parse the stored data (assuming it's stored as a JSON string)
  let parsedLocal_userInfo = local_userInfo ? JSON.parse(local_userInfo) : null; 
  let accessToken = parsedLocal_userInfo?.accessToken;
 console.log(accessToken)

  try {
    // Make a request to the logout endpoint
    const response = await fetch(`${url}/users/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${accessToken}`
      },
      credentials: 'include'
    });
console.log("resp",response)
    // Check if the request was successful
    if (response.ok) {
      toast("logout success ")
    } else {
      // Handle errors or log them
      toast("error logout ")
      console.error('Logout failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
};


  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>
        Feed
      </Link>
      <Link to="/signup" style={linkStyle}>
        Signup
      </Link>
      <Link to="/login" style={linkStyle}>
        Login
      </Link> 
      <button onClick={logout}>Logout</button>
    </nav>
  );
};

export default Navbar;