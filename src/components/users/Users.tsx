import { userAPI } from "../../service/UserService";

// TODO: User

type User = {
  id: string;
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
  const { data, error, isLoading } = userAPI.useGetUsersQuery() as UsersApiResponse;

  console.log("Users API data:", data);

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
                    {((data as any)?.data?.users ?? []).map((user: User) => (
                      <tr key={user.id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.role}</td>
                        <td>
                          <span className={`badge ${user.enabled ? 'bg-success' : 'bg-danger'}`}>
                            {user.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;