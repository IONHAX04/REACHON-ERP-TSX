import { ReactNode, useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { NavLink, useNavigate } from 'react-router-dom'

import './Header.css'
import {
  Cog,
  FileCheck,
  FileText,
  LayoutGrid,
  LogOut,
  Menu,
  Package,
  ReceiptIndianRupee,
  RouteOff,
  Truck,
  UserRoundPlus
} from 'lucide-react'

interface HeaderProps {
  children: ReactNode
}

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    icon: <LayoutGrid />
  },
  {
    path: '/booking',
    name: 'Booking',
    icon: <Package />
  },
  {
    path: '/mapping',
    name: 'Mapping',
    icon: <FileText />
  },
  {
    path: '/employee',
    name: 'Employee',
    icon: <UserRoundPlus />
  },
  {
    path: '/tracking',
    name: 'Tracking',
    icon: <Truck />
  },
  {
    path: '/cancellation',
    name: 'Cancellation',
    icon: <RouteOff />
  },
  {
    path: '/finance',
    name: 'Finance',
    icon: <ReceiptIndianRupee />
  },
  {
    path: '/report',
    name: 'Report',
    icon: <FileCheck />
  },
  {
    path: '/settings',
    name: 'Settings',
    icon: <Cog />
  },
  {
    path: '/login',
    name: 'Logout',
    icon: <LogOut />,
    logout: true
  }
]

const adminRoutes = [
  {
    path: '/',
    name: 'Dashboard',
    icon: <LayoutGrid />
  },
  {
    path: '/booking',
    name: 'Booking',
    icon: <Package />
  },
  {
    path: '/mapping',
    name: 'Mapping',
    icon: <FileText />
  },
  {
    path: '/tracking',
    name: 'Tracking',
    icon: <Truck />
  },
  {
    path: '/cancellation',
    name: 'Cancellation',
    icon: <RouteOff />
  },
  {
    path: '/finance',
    name: 'Finance',
    icon: <ReceiptIndianRupee />
  },
  {
    path: '/report',
    name: 'Report',
    icon: <FileCheck />
  },
  {
    path: '/settings',
    name: 'Settings',
    icon: <Cog />
  },
  {
    path: '/login',
    name: 'Logout',
    icon: <LogOut />,
    logout: true
  }
]

const financeRoutes = [
  {
    path: '/',
    name: 'Dashboard',
    icon: <LayoutGrid />
  },
  {
    path: '/finance',
    name: 'Finance',
    icon: <ReceiptIndianRupee />
  },
  {
    path: '/report',
    name: 'Report',
    icon: <FileCheck />
  },
  {
    path: '/settings',
    name: 'Settings',
    icon: <Cog />
  },
  {
    path: '/login',
    name: 'Logout',
    icon: <LogOut />,
    logout: true
  }
]

const employeeRoutes = [
  {
    path: '/',
    name: 'Dashboard',
    icon: <LayoutGrid />
  },
  {
    path: '/booking',
    name: 'Booking',
    icon: <Package />
  },
  {
    path: '/mapping',
    name: 'Mapping',
    icon: <FileText />
  },
  {
    path: '/tracking',
    name: 'Tracking',
    icon: <Truck />
  },
  {
    path: '/cancellation',
    name: 'Cancellation',
    icon: <RouteOff />
  },
  {
    path: '/login',
    name: 'Logout',
    icon: <LogOut />,
    logout: true
  }
]

const defaultRoutes = [
  {
    path: '/login',
    name: 'Logout',
    icon: <LogOut />,
    logout: true
  }
]

const Header: React.FC<HeaderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  console.log('isOpen', isOpen)
  const [selectedRoutes, setSelectedRoutes] = useState(routes)

  useEffect(() => {
    const userDetailsString = localStorage.getItem('userDetails')
    if (userDetailsString) {
      try {
        const userDetails = JSON.parse(userDetailsString)
        const userType = userDetails.userTypeId
        console.log('userType', userDetails.userTypeId)

        switch (userType) {
          case 1:
            setSelectedRoutes(routes)
            break
          case 2:
            setSelectedRoutes(adminRoutes)
            break
          case 3:
            setSelectedRoutes(financeRoutes)
            break
          case 4:
            setSelectedRoutes(employeeRoutes)
            break
          default:
            setSelectedRoutes(defaultRoutes)
        }
      } catch (error) {
        console.error('Failed to parse userDetails:', error)
        setSelectedRoutes(routes)
      }
    }
  }, [])

  const navigate = useNavigate()

  const toggle = () => setIsOpen(!isOpen)

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    show: {
      width: 'auto',
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('JWTtoken')
    localStorage.removeItem('loginStatus')
    localStorage.removeItem('rememberMe')
    localStorage.removeItem('userDetails')

    navigate('/login')
  }

  return (
    <div>
      <div className="main_container">
        <motion.div
          animate={{
            minWidth: isOpen ? '250px' : '60px',
            transition: {
              duration: 0.2,
              type: 'spring',
              damping: 10
            }
          }}
          className="sidebar"
        >
          <div className="top_section">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  className="logo"
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                >
                  Admin Panel
                </motion.h1>
              )}
            </AnimatePresence>
            <div className="bars">
              <Menu onClick={toggle} />
            </div>
          </div>

          <section className="routes">
            {selectedRoutes.map((route) => (
              <NavLink
                to={route.path}
                key={route.name}
                className="link"
                onClick={route.logout ? handleLogout : undefined}
              >
                <div className="icon">{route.icon}</div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="link_text"
                      variants={showAnimation}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                    >
                      {route.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
          </section>
        </motion.div>
        <main style={{ minWidth: isOpen ? '82vw' : '95vw' }}>{children}</main>
      </div>
    </div>
  )
}

export default Header
