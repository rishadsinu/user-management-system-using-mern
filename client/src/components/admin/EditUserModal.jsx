import React, { useState } from "react";
import adminInstance from "../../utils/apiClient";

const EditUserModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [name, setName] = useState(user?.name || "");

  if (!isOpen) return null; 

  const handleUpdate = async () => {
    try {
      const response = await adminInstance.put(`/admin/users/${user._id}`, { name });
      if (response.data.success) {
        onUpdate(user._id, name); 
        onClose();
      }
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>

        <label className="block text-gray-600">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-md mt-1"
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
          <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
