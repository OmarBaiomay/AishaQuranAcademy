import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";
import UserCard from "../../components/dashboard/UserCard.jsx";
import avatar from "/assets/user.svg";
import ConfirmDeleteModal from "../../components/dashboard/ConfirmDeleteModal.jsx";
import EditUserModal from "../../components/dashboard/EditUserModal.jsx";
import PageHeader from "../../components/dashboard/PageHeader.jsx"; 
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Filter, VirtualScroll, Sort, Resize, ContextMenu, ExcelExport, Edit, PdfExport } from '@syncfusion/ej2-react-grids';
import { Link } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Fetch Users from API
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

  // ✅ Filtering Users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // ✅ Open Delete Modal
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // ✅ Handle User Deletion
  const handleDelete = async () => {
    if (userToDelete) {
      try {
        await axiosInstance.delete(`/user/${userToDelete._id}`);
        toast.success(`${userToDelete.fullName} deleted successfully!`);
        setUsers(users.filter(user => user._id !== userToDelete._id));
      } catch (error) {
        toast.error("Error deleting user!");
      }
    }
    setShowDeleteModal(false);
  };

  // ✅ Open Add/Edit User Modal
  const openEditUserModal = (user = null) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // ✅ Handle User Save (After Edit)
  const handleSaveUser = (updatedUser) => {
    setUsers(users.map(user => (user._id === updatedUser._id ? updatedUser : user)));
    setShowEditModal(false);
  };

  // ✅ User List Columns for Syncfusion Grid
  const userListViewItems = [
    {
      headerText: 'User',
      template: (props) => (
        <Link to={`/dashboard/users/${props._id}`} className="flex gap-2 items-center">
          <img className="rounded-xl" height={25} width={25} src={props.profilePic || avatar} alt="user avatar" />
          <span>{props.fullName}</span>
        </Link>
      ),
      textAlign: 'Start',
      width: '150',
    },
    {
      field: 'email',
      headerText: 'Email',
      width: '200',
      textAlign: 'Center',
    },
    {
      field: 'role',
      headerText: 'Role',
      width: '150',
      textAlign: 'Center',
    },
  ];

  return (
    <div className="pt-20 px-10 w-full">
      
      {/* ✅ Using PageHeader Component */}
      <PageHeader
        title="Users"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterOptions={[
          { value: "all", label: "All" },
          { value: "Administrator", label: "Admins" },
          { value: "Supervisor", label: "Supervisors" },
          { value: "Teacher", label: "Teachers" },
          { value: "Student", label: "Students" },
        ]}
        selectedFilter={selectedRole}
        setSelectedFilter={setSelectedRole}
        onAddClick={() => openEditUserModal(null)} // Open Add User Modal
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* ✅ User List */}
      <div className="flex justify-start gap-5 items-center flex-wrap mt-10">
        {loading ? (
          <div>Loading...</div>
        ) : (
          viewMode === "grid"
            ? filteredUsers.map((user) => (
                <UserCard
                  key={user._id}
                  image={user.profilePic || avatar}
                  fullName={user.fullName}
                  role={user.role}
                  _id={user._id}
                  onEdit={() => openEditUserModal(user)} // ✅ Open Edit Modal
                  onDelete={() => openDeleteModal(user)}
                />
              ))
            : (
                <GridComponent 
                  id="userList" 
                  dataSource={filteredUsers}
                  allowPaging
                  allowSorting
                  allowExcelExport
                >
                  <ColumnsDirective>
                    {userListViewItems.map((item, index) => (
                      <ColumnDirective key={index} {...item} />
                    ))}
                  </ColumnsDirective>
                  <Inject services={[Resize, Sort, ContextMenu, Filter, ExcelExport, Edit, PdfExport]} />
                </GridComponent>
              )
        )}
      </div>

      {/* ✅ Confirmation Delete Modal */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        userName={userToDelete ? `${userToDelete.fullName}` : ""}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* ✅ Edit/Add User Modal */}
      <EditUserModal
        show={showEditModal}
        user={selectedUser}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveUser} // ✅ Updates the user list after edit
      />
    </div>
  );
}

export default Users;
