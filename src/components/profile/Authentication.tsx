import { userAPI } from '../../service/UserService';
import { useOutletContext } from 'react-router-dom';
import { IUser } from '../../models/IUser';

function formatLastLogin(dateString?: string | number | Date) {
  if (!dateString) return 'Never';
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(dateString));
}

const Authentication = () => {
  type UserContext = { user: { data: { user: IUser } } };
  const { user } = useOutletContext<UserContext>();
  const [enableMfa, { isLoading: enableLoading, isSuccess: qrCodeSuccess }] = userAPI.useEnableMfaMutation();
  const [disableMfa, { isLoading: disableLoading }] = userAPI.useDisableMfaMutation();

  const toggleMfa = async () => {
    if (user && user.data && user.data.user && typeof user.data.user.mfa !== 'undefined') {
      if (user.data.user.mfa) { await disableMfa(); } else { await enableMfa(); }
    }
  }
  return (
    <>
        <h4 className="mb-3">Authentication(MFA) <span className={`badge pill text-light text-bg-${user?.data.user.mfa ? 'success' : 'warning'} fs-6`}>{user?.data.user.mfa ? 'Enabled' : 'Disabled'}</span></h4>
        <hr />
        <div className="row g-3">
          <div className="col-12 mb-2">
            <h6 className="form-label d-block mb-1">Multi Factor Authentication</h6>
            <p className="small text-muted">Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to log in.</p>
            <button onClick={toggleMfa} disabled={disableLoading || enableLoading} className={`btn border btn-${user?.data.user.mfa ? 'light' : 'primary'} mt-2`} type="button">{user?.data.user.mfa ? 'Disable' : 'Enable'} Two-Factor Authentication
              {(disableLoading || enableLoading) && <div className={`spinner-border text-${user?.data.user.mfa ? 'primary' : 'light'}`} role="status" style={{ height: '20px', width: '20px', marginLeft: '10px' }}></div>}
            </button>
            {(user?.data.user.mfa) && <div className="accordion mt-3 mb-3" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    QR Code to scan
                  </button>
                </h2>
                <div id="collapseOne" className={`accordion-collapse collapse ${qrCodeSuccess ? 'show': undefined}`} data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <p className="small text-muted fw-semibold fs-6 text">Use an authenticator application on your phone to scan this QR Code to set up MFA Authentication.</p>
                    <hr className="my-4" />
                    <img src={user?.data.user.qrCodeImageUri} className="rounded mx-auto d-block" alt="QR Code" />
                  </div>
                </div>
              </div>
            </div>}
          </div>
          <hr className="my-2" />
          <div className="col-12">
            <h6 className="form-label">Last Login Session:</h6>
            <ul className="list-group list-group-sm">
              <li className="list-group-item">
                <div>
                  <small className="text-muted">Your last session is when you last logged in</small>
                  <h6 className="mb-0 mt-2">{formatLastLogin(user?.data.user.lastLogin)}</h6>
                </div>
              </li>
            </ul>
          </div>
        </div>
    </>
  )
}

export default Authentication;
