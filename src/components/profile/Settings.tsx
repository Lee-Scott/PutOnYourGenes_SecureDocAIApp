import React from 'react'
import { userAPI } from '../../service/UserService';
import { AccountSettings } from '../../enum/account.settings';
import { useOutletContext } from 'react-router-dom';
import { IUser } from '../../models/IUser';

const Settings = () => {
  type UserContext = { user: { data: { user: IUser } } };
  const { user } = useOutletContext<UserContext>();
  const [toggleAccountExpired] = userAPI.useToggleAccountExpiredMutation();
  const [toggleAccountLocked] = userAPI.useToggleAccountLockedMutation();
  const [toggleAccountEnabled] = userAPI.useToggleAccountEnabledMutation();
  const [toggleCredentialsExpired] = userAPI.useToggleCredentialsExpiredMutation();

  const toggleSettings = async (settings: AccountSettings) => {
    switch (settings) {
      case AccountSettings.EXPIRED:
        await toggleAccountExpired();
        break;
      case AccountSettings.LOCKED:
        await toggleAccountLocked();
        break;
      case AccountSettings.ENABLED:
        await toggleAccountEnabled();
        break;
      case AccountSettings.CREDENTIALS_EXPIRED:
        await toggleCredentialsExpired();
        break;
      default:
        break;
    }
  }
   return (
    <>
        <h4 className="mb-3">Settings</h4>
        <hr />
        <div className="form-group">
          <h6 className="d-block mb-0">Account Settings</h6>
          <div className="small text-muted mb-3">Settings regarding your account</div>
        </div>
        <div className="form-group mb-0">
          <ul className="list-group list-group-sm">
            <li className="list-group-item has-icon">
              Account Expired
              <div className="form-check form-switch ml-auto">
                <input type="checkbox" 
                onChange={(event) => toggleSettings(event.target.name as AccountSettings)} 
                checked={!user.data.user.accountNonExpired} 
                name={AccountSettings.EXPIRED} 
                disabled={user?.data.user.role === 'USER'}
                className="form-check-input" />
              </div>
            </li>
            <li className="list-group-item has-icon">
              Account Locked
              <div className="form-check form-switch ml-auto">
                <input type="checkbox" 
                onChange={(event) => toggleSettings(event.target.name as AccountSettings)} 
                checked={!user.data.user.accountNonLocked} 
                name={AccountSettings.LOCKED} 
                disabled={user?.data.user.role === 'USER'}
                className="form-check-input" />
              </div>
            </li>
            <li className="list-group-item has-icon">
              Account Enabled
              <div className="form-check form-switch ml-auto">
                <input type="checkbox" 
                onChange={(event) => toggleSettings(event.target.name as AccountSettings)} 
                checked={user.data.user.enabled} 
                name={AccountSettings.ENABLED} 
                disabled={user?.data.user.role === 'USER'}
                className="form-check-input" />
              </div>
            </li>
          </ul>
        </div>
        <div className="form-group mt-4">
          <h6 className="d-block mb-0">Credentials Settings</h6>
          <div className="small text-muted mb-3">Your credentials will expire after 90 days if not updated.</div>
        </div>
        <div className="form-group mb-0">
          <ul className="list-group list-group-sm">
            <li className="list-group-item has-icon">
              Credentials Expired
              <div className="form-check form-switch ml-auto">
                <input type="checkbox" 
                onChange={(event) => toggleSettings(event.target.name as AccountSettings)} 
                checked={!user.data.user.credentialsNonExpired} 
                // disabled={userData?.data.role === 'USER'}
                disabled={true}
                readOnly={true}
                name={AccountSettings.CREDENTIALS_EXPIRED} 
                className="form-check-input" />
              </div>
            </li>
          </ul>
        </div>
    </>
  )
}

export default Settings;
