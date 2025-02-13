
import React, { useEffect, useState, useRef } from 'react';
import adminInstance from '../../utils/apiClient';
import EditUserModal from './EditUserModal';
import AddUserModal from './AddUserModal';


const AdminPannel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchUser, setSearchUser] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const debounceTimeout = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminInstance.get(`/admin/search-users?search=${debouncedSearchTerm}`)
        if (response.data.success) {
          setUsers(response.data.users)
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUsers();
  }, [debouncedSearchTerm])

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchUser(value)
    if(debounceTimeout.current){
      clearTimeout(debounceTimeout.current)
    }
    debounceTimeout.current = setTimeout(()=> {
      setDebouncedSearchTerm(value)
    },300)
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminInstance.get('/admin/users');
        if (response.status === 200) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await adminInstance.delete(`/admin/users/${id}`);
      if (response.data.success) {
        setUsers((prevUsers) => prevUsers.filter(user => user._id !== id));
      }
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleUpdateUser = (id, newName) => {
    setUsers((prevUsers) =>
      prevUsers.map(user => user._id === id ? { ...user, name: newName } : user)
    );
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  const handleUserAdded = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser])
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        User Management
      </h1>

      {/* <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        onClick={handleAddClick}
      >
        Add User
      </button> */}

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="px-4 py-2 border rounded-md w-1/3 focus:ring-2 focus:ring-blue-400 outline-none"
          value={searchUser}
          onChange={handleSearchChange}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={handleAddClick}
        >
          Add User
        </button>
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
                <tr key={user._id} className="border-b hover:bg-gray-100">

                  <td className="p-4 border">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-2 border-gray-300 overflow-hidden">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={`${user.name}'s profile`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-100">
                              <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 border">{user.name}</td>
                  <td className="p-4 border">{user.email}</td>
                  <td className="p-4 border text-center space-x-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
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

      {isEditModalOpen && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditUserModalOpen(false)}
          user={selectedUser}
          onUpdate={handleUpdateUser}
          title="Edit Name"
        />
      )}

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={handleUserAdded}
      />

    </div>
  );
};

export default AdminPannel;
