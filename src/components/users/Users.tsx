import React from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from "../../service/UserService";

// TODO: User

type User = {
  id: string;
  userId: string; // Make sure this matches your backend response
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  enabled: boolean;
};

type UsersApiResponse = {
  data?: {
    users?: User[];
  };
  error?: any;
  isLoading: boolean;
};

const Users = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = userAPI.useGetUsersQuery() as UsersApiResponse;

  console.log("Users API data:", data);

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="container mtb">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body">
                <h5 className="header-title pb-3 mt-0">Users</h5>
                <p className="card-text placeholder-glow">
                  <span className="placeholder col-12"></span>
                  <span className="placeholder col-12"></span>
                  <span className="placeholder col-12"></span>
                  <span className="placeholder col-12"></span>
                  <span className="placeholder col-12"></span>
                  <span className="placeholder col-12"></span>
                  <span className="placeholder col-12"></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mtb">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body">
                <h5 className="header-title pb-3 mt-0">Users</h5>
                <p className="text-danger">Error loading users.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mtb">
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              <h5 className="header-title pb-3 mt-0">Users</h5>
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.users?.map((user: User) => (
                      <tr
                        key={user.id}
                        onClick={() => handleUserClick(user.userId)}
                        style={{ cursor: 'pointer' }}
                        className="user-row"
                      >
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || 'N/A'}</td>
                        <td>
                          <span className="badge bg-secondary">{user.role}</span>
                        </td>
                        <td>
                          <span className={`badge ${user.enabled ? 'bg-success' : 'bg-danger'}`}>
                            {user.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>
                      </tr>
                    )) || []}
                  </tbody>
                </table>
              </div>
              {(!data?.users || data.users.length === 0) && (
                <div className="text-center mt-3">
                  <p className="text-muted">No users found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;