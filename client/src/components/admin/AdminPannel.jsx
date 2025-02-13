import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import adminInstance from '../../utils/apiClient'

const AdminPannel = () => {

  const navigate = useNavigate()
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminInstance.get('/admin/users')
        if (response.status == 200) {
          setUsers(response.data.users)
        }
      } catch (error) {
        console.log('dond get users details', error);

      }
    }
    fetchUsers()
  }, [])

  const handleDelete = async(id) => {
    try {
      const response = await adminInstance.delete(`/admin/users/${id}`);
      if (response.data.success) {
        setUsers((prevUsers) => prevUsers.filter(user => user._id !== id))
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleEdit = async () => {
    try {
      
    } catch (error) {
      
    }
  }

  
  return (

    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        User Management
      </h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="p-4 border">Image</th>
              <th className="p-4 border">Name</th>
              <th className="p-4 border">Email</th>
              <th className="p-4 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>

            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-100">
                  <td className="p-4 border">
                    <img
                      src={user.profileImage || "https://via.placeholder.com/50"}
                      alt="User"
                      className="w-12 h-12 rounded-full"
                    />
                  </td>
                  <td className="p-4 border">{user.name}</td>
                  <td className="p-4 border">{user.email}</td>
                  <td className="p-4 border text-center space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>


  )
}

export default AdminPannel
