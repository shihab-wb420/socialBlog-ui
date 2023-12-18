import React, { useState } from 'react';
const url = "http://localhost:4040/api/v1"


const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    avatar: null  // Add an avatar field for the file
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // If the input is a file input, set the value to the file itself
    const inputValue = type === 'file' ? e.target.files[0] : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: inputValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('avatar', formData.avatar);

    try {
      const response = await fetch(`${url}/users/register`, {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        console.log('Signup successful!');
        // Handle successful signup, e.g., redirect user to login page
      } else {
        console.error('Signup failed');
        // Handle signup failure, e.g., show error message to the user
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name:
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Last Name:
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </label>
      <br />
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
      <label>
        Avatar:
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;