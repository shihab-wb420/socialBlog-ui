import React, { useState } from 'react'; 
import toast from "react-hot-toast";
const url = "http://localhost:4040/api/v1" 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response = await fetch(`${url}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }); 
      response = await response.json(); 
      localStorage.setItem("userInfo",JSON.stringify(response?.data))
      console.log('Login successful!',response?.data); 
      
      toast("Login successful!")
    } catch (error) {
      console.log('Error during login:', error)
      toast('Error during login:')
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;