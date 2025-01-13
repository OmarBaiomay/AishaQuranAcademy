import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";
import UserCard from "../../components/dashboard/UserCard.jsx";
import avatar from "/assets/user.svg";
import ConfirmDeleteModal from "../../components/dashboard/ConfirmDeleteModal.jsx";
import EditUserModal from "../../components/dashboard/EditUserModal.jsx"; // Import the EditUserModal
import { FaList, FaTh } from "react-icons/fa"; // Icons for buttons
import { Link } from "react-router-dom";




function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // Track the current view mode
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
    <div className="pt-20 px-10 w-[-webkit-fill-available]">
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

           {/* Buttons for List/Grid View */}
           <div className="flex justify-center items-center rounded-lg overflow-hidden">

           <button
            onClick={() => setViewMode("grid")}
            className={`${
              viewMode === "grid" ? "bg-purple-500 text-white" : "bg-zinc-200 text-zinc-600"
            } px-3 py-1 flex items-center gap-1 w-full h-full`}
          >
            <FaTh />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`${
              viewMode === "list" ? "bg-purple-500 text-white" : "bg-zinc-200 text-zinc-600"
            } px-3 py-1 flex items-center gap-1 w-full h-full`}
          >
            <FaList />
          </button>

           </div>
        </div>
      </div>
      <div className="flex justify-start items-center gap-7 flex-wrap mt-10">
        {loading ? (
            <div>Loading....</div>
          ) : (
            viewMode === "grid" ? 
            filteredUsers.map((user) =>(
              <UserCard
                key={user._id}
                image={user.profilePic ? user.profilePic : avatar}
                fullName={user.fullName}
                role={user.role}
                _id={user._id}
                onEdit={() => handleEdit(user)}
                onDelete={() => openDeleteModal(user)}
              />
            )
          ) : (
            <table className="table-auto w-full text-left text-zinc-600 border-collapse">
              <thead>
                <tr className="bg-zinc-200 text-sm">
                  <th className="px-4 py-2">Profile</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-zinc-100 transition duration-200"
                  >
                    <td className="px-4 py-2">
                      <img
                        src={user.profilePic ? user.profilePic : avatar}
                        alt={`${user.fullName} profile`}
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="px-4 py-2">{user.fullName}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 text-white rounded-lg px-3 py-1 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="bg-red-500 text-white rounded-lg px-3 py-1 text-sm"
                      >
                        Delete
                      </button>
                      <Link
                        to={`/dashboard/users/${user._id}`}
                        className="bg-purple-500 text-white rounded-lg px-3 py-1 text-sm"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          )
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
