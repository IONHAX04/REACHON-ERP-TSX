import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

// import Header from '../01-Header/Header'
// import Dashboard from '../02-Dashboard/Dashboard'
// import Key from '../03-Key/Key'
// import Employees from '../04-Employees/Employees'
// import Tracking from '../05-Tracking/Tracking'
// import Settings from '../06-Settings/Settings'
// import Profile from '../07-Profile/Profile'
import Login from '../08-Login/Login'
// import Booking from '../09-Booking/Booking'
// import Report from '../10-Report/Report'
// import TestingPDF from '../11-TestingPDF/TestingPDF'
// import ReportPDF from '../12-ReportPDF/ReportPDF'
// import Finance from '../13-Finance/Finance'

function PrivateRoute({ children }) {
  const userDetails = localStorage.getItem('userDetails')
  return userDetails ? children : <Navigate to="/login" replace />
}

const MainRoutes: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false)
  console.log('isMobile', isMobile)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileView = window.innerWidth <= 768
      setIsMobile(isMobileView)
      setShowModal(isMobileView)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  return (
    <div>
      <ConditionalHeader>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/testingPDF" element={<TestingPDF />} /> */}
          {/* <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/booking"
            element={
              <PrivateRoute>
                <Booking />
              </PrivateRoute>
            }
          />
          <Route
            path="/mapping"
            element={
              <PrivateRoute>
                <Key />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <PrivateRoute>
                <Employees />
              </PrivateRoute>
            }
          />
          <Route
            path="/tracking"
            element={
              <PrivateRoute>
                <Tracking />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/finance"
            element={
              <PrivateRoute>
                <Finance />
              </PrivateRoute>
            }
          />
          <Route
            path="/report"
            element={
              <PrivateRoute>
                <Report />
              </PrivateRoute>
            }
          />
          <Route
            path="/reportPDF"
            element={
              <PrivateRoute>
                <ReportPDF />
              </PrivateRoute>
            }
          /> */}
        </Routes>{' '}
      </ConditionalHeader>

      <Dialog
        visible={showModal}
        onHide={() => setShowModal(false)}
        header="Mobile View Warning"
        modal
        closable={false}
        footer={<Button label="OK" onClick={() => setShowModal(false)} />}
      >
        <p>For a better experience, please use a laptop or desktop.</p>
      </Dialog>
    </div>
  )
}

function ConditionalHeader({ children }) {
  const location = useLocation()
  const excludedRoutes = ['/login', '/testingPDF']
  const isExcluded = excludedRoutes.includes(location.pathname)
  console.log('isExcluded', isExcluded)

  return (
    <>
      {/* {!isExcluded && <Header />} */}
      {children}
    </>
  )
}

ConditionalHeader.propTypes = {
  children: PropTypes.node
}

PrivateRoute.propTypes = {
  children: PropTypes.node
}

export default MainRoutes
