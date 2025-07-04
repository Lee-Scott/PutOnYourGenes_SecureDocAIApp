import { StrictMode } from 'react'
import './index.css'
import App from './App.tsx'
import { setupStore } from './store/store.ts'
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import NavBar from './components/NavBar.tsx'
import Documents from './components/documents/Documents.tsx'
import Login from './components/login.tsx'
import Register from './components/Register.tsx'
import Verify from './components/VerifyAccount.tsx'
import ResetPassword from './components/ResetPassword.tsx'
import VerifyAccount from './components/VerifyAccount.tsx'
import VerifyPassword from './components/VerifyPassword.tsx'

const store = setupStore();
const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />}>
    <Route path='login' element={<Login />} />
    <Route path='register' element={<Register />} />
    <Route path='resetpassword' element={<ResetPassword />} />
    <Route path='user/verify' element={<VerifyAccount />} /> // Todo change to user/verify/password
    <Route path='user/verify/password' element={<VerifyPassword />} />
    <Route element={<NavBar />}>
      <Route index path='/documents' element={<Documents />} />
      <Route path='/' element={<Navigate to={'/documents'} />} />
    </Route>
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