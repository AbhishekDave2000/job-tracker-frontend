import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import JobApplications from './pages/JobApplications'
import './App.css'

const queryClient = new QueryClient();

const ProtectedLayout = () => (
  <ProtectedRoute>
    <Outlet />
  </ProtectedRoute>
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>

          {/* Login and Register Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedLayout />}>
            <Route path="/applications" element={<JobApplications />}/>
            {/* <Route path="/applications/new" element={<JobApplicationForm />} />
            <Route path="/applications/:id" element={<JobApplication />} />
            <Route path="/applications/:id/edit" element={<JobApplicationForm />} /> */}
          </Route>

          {/* Default Router Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
