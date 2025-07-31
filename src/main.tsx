import { StrictMode } from 'react'
import './index.css'
import App from './App.tsx'
import { setupStore } from './store/Store.ts'
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import NavBar from './components/NavBar.tsx'
import Documents from './components/documents/Documents.tsx'
import Register from './components/Register.tsx'
import ResetPassword from './components/ResetPassword.tsx'
import VerifyAccount from './components/VerifyAccount.tsx'
import VerifyPassword from './components/VerifyPassword.tsx'


import ProtectedRoute from './components/ProtectedRoute.tsx'
import Login from './components/Login.tsx'
import Restricted from './components/Restricted.tsx'
import User from './components/profile/User.tsx'
import Profile from './components/profile/Profile.tsx'
import Password from './components/profile/Password.tsx'
import Settings from './components/profile/Settings.tsx'
import Authorization from './components/profile/Authorization.tsx'
import Authentication from './components/profile/Authentication.tsx'
import NotFound from './components/NotFound.tsx'
import DocumentDetails from './components/documents/DocumentDetails.tsx'
import Users from './components/users/Users.tsx'
import UserDetails from './components/users/UserDetails.tsx'

// TODO: do a second one with nextJS

const store = setupStore();
const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />}>
    <Route path='login' element={<Login />} />
    <Route path='register' element={<Register />} />
    <Route path='resetpassword' element={<ResetPassword />} />
    <Route path='user/verify' element={<VerifyAccount />} />  {/* Changed from 'verify/account' */}
    <Route path='verify/password' element={<VerifyPassword />} />

    <Route element={<ProtectedRoute />} >
      <Route element={<NavBar />}>
        <Route index path='/documents' element={<Documents />} />
        <Route path='/' element={<Navigate to={'/documents'} />} />
        <Route path='documents/:documentId' element={<DocumentDetails />} />
        
        <Route element={<Restricted />} >
          <Route path='users' element={<Users />} />
          <Route path='users/:userId' element={<UserDetails />} />
        </Route>

        <Route path='profile/:userId' element={<UserDetails />} />
        <Route path='/user' element={<User />} >
          <Route path='/user' element={<Navigate to='/user/profile' />} />
          <Route path='profile' element={<Profile />} />
          <Route path='password' element={<Password />} />
          <Route path='settings' element={<Settings />} />
          <Route path='authorization' element={<Authorization />} />
          <Route path='authentication' element={<Authentication />} />
        </Route>
      </Route>
    </Route>
    <Route path='*' element={<NotFound />} />
  </Route>
));

// Fix: Use createRoot instead of ReactDOM.createRoot
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)