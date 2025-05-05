import React, { useRef } from 'react'
import { IndianRupee, ShoppingCart, TriangleAlert, Undo2 } from 'lucide-react'
import { Divider } from 'primereact/divider'

import profile from '../../assets/dashboard/profile.svg'
// import coverImg from '../../assets/dashboard/banner.png'
import coverImg from '../../assets/zadpro.jpg'

import './Dashboard.css'
import { useEffect, useState } from 'react'
import { Toast } from 'primereact/toast'

interface UserDetails {
  refUserId: number
  refCustId: string
  refUserFName: string
  refUserLName: string
  refCustMobileNum: string
  refCustpassword: string
  refCusthashedpassword: string
  refUsername: string
  userTypeName: string
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserDetails>()
  const toast = useRef<Toast>(null)

  const checkNetwork = () => {
    if (!navigator.onLine) {
      toast.current?.show({
        severity: 'warn',
        summary: 'No Internet Connection',
        detail: 'Please check your network and try again.',
        life: 3000
      })
      return
    }
  }
  useEffect(() => {
    const storedUser = localStorage.getItem('userDetails')
    console.log('storedUser', storedUser)

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    checkNetwork()
  }, [])

  const cardData = [
    {
      id: 1,
      title: 'Orders',
      count: '4 ',
      description: 'Orders count',
      icon: <ShoppingCart size={40} />
    },
    {
      id: 2,
      title: 'Revenue',
      count: '280',
      description: 'Sales count',
      icon: <IndianRupee size={40} />
    },
    {
      id: 3,
      title: 'Return Orders',
      count: '0',
      description: 'Returns count',
      icon: <Undo2 size={40} />
    },
    {
      id: 4,
      title: 'Pending Orders',
      count: '0',
      description: 'Pending count',
      icon: <TriangleAlert size={40} />
    }
  ]
  return (
    <div>
      <Toast ref={toast} />

      <div>
        <div className="primaryNav">
          <p>Dashboard</p>
          <p className="">Logged in as: {user?.userTypeName}</p>
        </div>
        <div className="dashboardContxt">
          <div className="contents m-3">
            <div className="userProfile">
              <div className="coverImage">
                <img src={coverImg} alt="coverImage" />
              </div>
              <div className="coverContents">
                <img src={profile} alt="userProfile" />
                <div className="userDetails">
                  <div className="userDetOne">
                    <div className="userDetPrimary">
                      <p className="username">
                        {user && (
                          <>
                            {user.refUserFName} {user.refUserLName}
                          </>
                        )}
                      </p>
                      <p className="useremail">{user?.refCustId}</p>
                    </div>
                    {/* <p className="empPosition">{user?.userTypeName}</p> */}
                  </div>
                  <div className="userDetTwo">
                    <p>
                      {' '}
                      {user && (
                        <>
                          <span>Employee ID </span>: {user.refCustId}
                        </>
                      )}
                    </p>
                    <Divider layout="vertical" />
                    <p>
                      <span>Department </span>: {user?.userTypeName}
                    </p>
                    <Divider layout="vertical" />
                    <p>
                      <span>Mobile </span>: +91 9360257667
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboardContents">
            {cardData.map((card) => (
              <div className="card" key={card.id}>
                <div className="cardTextContents">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <p>
                    <span className="text-2xl font-bold">{card.count}</span> since last week
                  </p>
                </div>
                <div className="cardIcon">{card.icon}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
