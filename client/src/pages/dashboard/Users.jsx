import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";
import UserCard from "../../components/dashboard/UserCard.jsx";
import avatar from "/assets/user.svg";
import ConfirmDeleteModal from "../../components/dashboard/ConfirmDeleteModal.jsx";
import EditUserModal from "../../components/dashboard/EditUserModal.jsx"; // Import the EditUserModal
import { FaList, FaTh } from "react-icons/fa"; // Icons for buttons
import { Link } from "react-router-dom";
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Filter, VirtualScroll, Sort, Resize, ContextMenu, ExcelExport, Edit, PdfExport } from '@syncfusion/ej2-react-grids';


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

  const userListImageName = (props) => (
    <Link to={`/dashboard/users/${props._id}`} className="flex gap-2 items-center justify-start">
      <img className="rounded-xl" height={25} width={25} src={props.profilePic ? props.profilePic : avatar}alt="user avatar"/>
      <span>{props.fullName}</span>
    </Link>
  );

  const userListPhone = (props) => (
    <div className="w-full flex items-center justify-center">
      <p>{props.phone.countryCode} {props.phone.number} </p>
    </div>
  );

  const userListViewItems = [
    {
      headerText: 'User',
      template: userListImageName,
      textAlign: 'Start',
      width: '120',
    },
    {
      field: 'email',
      headerText: 'Email',
      width: '150',
      editType: 'dropdownedit',
      textAlign: 'Center',
    },
    {
      headerText: 'Phone',
      template: userListPhone,
      width: '150',
      textAlign: 'Center',
    },
    {
      field: 'role',
      headerText: 'Role',
      width: '150',
      editType: 'dropdownedit',
      textAlign: 'Center',
    },
  ];


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
      const res = await axiosInstance.get("/users");
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
      (user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
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
            <GridComponent 
              id="userList" 
              dataSource={filteredUsers}
              allowPaging
              allowSorting
              allowExcelExport

            >
              <ColumnsDirective>
                {
                  userListViewItems.map((item, index) =>(
                    <ColumnDirective key={index} {...item} />
                  ))
                }
              </ColumnsDirective>
              <Inject services={[Resize, Sort, ContextMenu, Filter, ExcelExport, Edit, PdfExport]} />
            </GridComponent>
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
