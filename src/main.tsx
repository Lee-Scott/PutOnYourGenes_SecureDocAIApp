import { StrictMode } from 'react'
import './index.css'
import App from './App.tsx'
import { setupStore } from './store/store.ts'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Login from './components/login.tsx'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'

const store = setupStore();
const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />}>
    <Route path='/login' element={<Login />} />
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