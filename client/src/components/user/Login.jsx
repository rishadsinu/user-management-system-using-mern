
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthenticationStatus, setUser } from '../../redux/slices/authSlice';
import axiosInstances from '../../utils/apiClient';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axiosInstances.post("/user/login", formData)
      if(response.status==200){
        dispatch(setUser(response.data.user))
        dispatch(setAuthenticationStatus(true))
        localStorage.getItem("token", response.data.token)
        navigate('/profile')
      }
    } catch (error) {
      setLoginError("Invalid credentials. Please check your email and password.");
      console.log(error,"login failed");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white shadow-lg rounded-1 p-8 w-full max-w-[415px]">
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Login</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
          />
          
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
          />{loginError && <p className="mt-2 text-sm text-red-600 text-center">{loginError}</p>}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-sm hover:bg-blue-500 transition duration-300"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600 text-center">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Register here
        </a>
      </p>
      

    </div>
  </div>
  );
};

export default Login;
