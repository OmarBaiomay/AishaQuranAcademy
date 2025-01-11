import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";
import UserCard from "../../components/dashboard/UserCard.jsx";
import avatar from "/assets/user.svg";
import ConfirmDeleteModal from "../../components/dashboard/ConfirmDeleteModal.jsx";
import EditUserModal from "../../components/dashboard/EditUserModal.jsx"; // Import the EditUserModal

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); // Track edit modal visibility
  const [userToEdit, setUserToEdit] = useState(null); // Store the user to edit
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user); // Set the selected user data
    setShowEditModal(true); // Open the modal
  };
  
  const handleSaveUser = (updatedUser) => {
    setUsers(users.map(user => user._id === updatedUser._id ? updatedUser : user)); // Update the user list with the updated user
    setShowEditModal(false); // Close the modal
  };

  const handleExport = () => {
    toast.success("Export Data clicked!");
  };

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        await axiosInstance.delete(`/user/${userToDelete._id}`);
        toast.success(`${userToDelete.firstName} ${userToDelete.lastName} deleted successfully!`);
        setUsers(users.filter(user => user._id !== userToDelete._id));
      } catch (error) {
        toast.error("Error deleting user!");
      }
    }
    setShowDeleteModal(false);
  };

  const handleMessage = () => {
    toast.success("Message clicked!");
  };

  const GetUsers = async () => {
    try {
      const res = await axiosInstance.get("/user");
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error In Fetching Users");
      setLoading(false);
    }
  };

  useEffect(() => {
    GetUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Add new user modal handling
  const openAddUserModal = () => {
    setShowEditModal(true); // Same modal for adding a new user, just with empty fields
    setUserToEdit(null); // Empty user object to add a new one
  };

  return (
    <div className="pt-20 pl-7 w-[-webkit-fill-available]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-600">Users</h1>
        <div className="controlles flex gap-5 px-5">
          <button
            className="bg-purple-500 text-white rounded-lg px-3 py-1 text-sm"
            onClick={openAddUserModal} // Open add user modal
          >
            Add User
          </button>
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-200 text-zinc-600 rounded-lg px-3 py-1 text-sm"
          />
          <select
            className="bg-zinc-200 text-zinc-600 rounded-lg px-3 py-1 text-sm"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Administrator">Admins</option>
            <option value="Supervisor">Supervisors</option>
            <option value="Teacher">Teachers</option>
            <option value="Student">Students</option>
          </select>
        </div>
      </div>
      <div className="flex justify-start items-center gap-7 flex-wrap mt-10">
        {loading ? (
          <div>Loading....</div>
        ) : (
          filteredUsers.map((user) => (
            <UserCard
              key={user._id}
              image={user.profilePic ? user.profilePic : avatar}
              firstName={user.firstName}
              lastName={user.lastName}
              role={user.role}
              onEdit={() => handleEdit(user)}
              onDelete={() => openDeleteModal(user)}
              onMessage={handleMessage}
            />
          ))
        )}
      </div>

      {/* Confirmation Delete Modal */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        userName={userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : ""}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Edit/Add User Modal */}
      <EditUserModal
        show={showEditModal}
        user={selectedUser}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveUser}
      />

    </div>
  );
}

export default Users;
