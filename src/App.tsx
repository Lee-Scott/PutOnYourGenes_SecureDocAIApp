import { Slide, ToastContainer } from 'react-toastify'
import './App.css'
import { Outlet, Route, Routes } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import PdfLibViewer from './components/documents/PdfLibViewer'

const App = () => {
  return (
    <>
      <Outlet />
      <ToastContainer transition={Slide} />
    </>
  )
}

export default App
