import './index.css'
import { StrictMode } from 'react'
import App from './App.tsx';
import { setupStore } from './store/store.ts';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import Documents from './components/documents/Documents.tsx';
import Register from './components/Register.tsx';
import ResetPassword from './components/ResetPassword.tsx'
import VerifyAccount from './components/VerifyAccount.tsx'
import VerifyPassword from './components/VerifyPassword.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import Login from './components/login/login.tsx'
import Restricted from './components/Restricted.tsx'
import User from './components/profile/User.tsx'
import Profile from './components/profile/Profile.tsx'
import Password from './components/profile/Password.tsx'
import Settings from './components/profile/Settings.tsx'
import Authorization from './components/profile/Authorization.tsx'
import Authentication from './components/profile/Authentication.tsx'
import NotFound from './components/NotFound.tsx'
import DocumentDetails from './components/documents/DocumentDetails.tsx'
import PaperlessDocumentDetails from './components/documents/PaperlessDocumentDetails.tsx';
import Users from './components/users/Users.tsx';
import UserDetails from './components/users/UserDetails.tsx';
import { ChatRooms } from './components/chat/index.ts';
import {
  Questionnaires,
  QuestionnaireDetails,
  QuestionnaireForm,
  QuestionnaireResults,
  QuestionnaireBuilder,
} from './components/questionnaire/index.ts';
import Homepage from './components/Homepage/Homepage.tsx';
import IntegrationHub from './components/IntegrationHub/IntegrationHub.tsx';
import ReportViewer from './components/ReportViewer/ReportViewer.tsx';
import UserDashboard from './components/UserDashboard/UserDashboard.tsx';
import PublicLayout from './components/PublicLayout.tsx';
import DocumentViewerPage from './components/documents/DocumentViewerPage.tsx';
import NutrientTestViewer from './components/documents/NutrientTestViewer';
import PdfLibViewer from './components/documents/PdfLibViewer';
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { documentAPI } from './service/DocumentService.ts';

const store = setupStore();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Routes for unauthenticated users only */}
      <Route element={<ProtectedRoute unauthenticatedOnly={true} />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="resetpassword" element={<ResetPassword />} />
        <Route path="user/verify" element={<VerifyAccount />} />
        <Route path="verify/password" element={<VerifyPassword />} />
      </Route>

      {/* Publicly accessible routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<Homepage />} />
        <Route path="integrations" element={<IntegrationHub />} />
        <Route path="PersonalHealth&ServiceInterest" element={<QuestionnaireForm />} />
      </Route>

      {/* Protected routes for authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route path="report-viewer" element={<ReportViewer />} />
        <Route path="questionnaires" element={<Questionnaires />} />
        <Route path="questionnaires/builder" element={<QuestionnaireBuilder />} />
        <Route path="questionnaires/:id" element={<QuestionnaireDetails />} />
        <Route path="questionnaires/:id/form" element={<QuestionnaireForm />} />
        <Route path="questionnaires/results/:responseId" element={<QuestionnaireResults />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="documents" element={<Documents />} />
        <Route path="documents/:documentId" element={<DocumentDetails />} />
        <Route path="editdoc/:id" element={<PaperlessDocumentDetails />} />
        <Route path="viewdoc/:id" element={<DocumentViewerPage />} />
        <Route path="chat" element={<ChatRooms />} />
        <Route path="chat/:chatRoomId" element={<ChatRooms />} />
        <Route element={<Restricted />}>
          <Route path="users" element={<Users />} />
          <Route path="users/:userId" element={<UserDetails />} />
        </Route>
        <Route path="profile/:userId" element={<UserDetails />} />
        <Route path="user" element={<User />}>
          <Route path="" element={<Navigate to="profile" />} />
          <Route path="profile" element={<Profile />} />
          <Route path="password" element={<Password />} />
          <Route path="settings" element={<Settings />} />
          <Route path="authorization" element={<Authorization />} />
          <Route path="authentication" element={<Authentication />} />
        </Route>
      </Route>

      <Route path="nutrient-test" element={<NutrientTestViewer />} />
      <Route path="pdf-lib" element={<PdfLibViewer />} />
      {/* Catch-all for not found pages */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
