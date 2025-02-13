import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminInstance from "../../utils/apiClient";


const AdminLogin = () => {
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

    const navigate = useNavigate()

    function handleEmail(event){
      setEmail(event.target.value)
    }
    function handlePassword(event){
      setPassword(event.target.value)
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        const credentials = {email, password}
        try {
          console.log('sdffsd');
          
          const response = await adminInstance.post('/admin/adminlogin', credentials)
          console.log(response);
          
          if (response.status==200) {
            localStorage.getItem("token", response.data.token)
            navigate('/admin-pannel')
          }
        } catch (error) {
          
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmail}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePassword}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
           
          >
            Login
            
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default AdminLogin;
