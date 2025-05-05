import { useState, useRef } from 'react'
import { classNames } from 'primereact/utils'
import { Button } from 'primereact/button'
import { Password } from 'primereact/password'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import logoImg from '../../assets/imageLogo.png'
// import logoImg from '../../assets/Logo/LOGO.png'

import decrypt from '@renderer/helper'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const toast = useRef<Toast>(null)
  const navigate = useNavigate()

  const containerClassName = classNames(
    'surface-ground flex align-items-center justify-content-center overflow-hidden'
  )

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.current?.show({
        severity: 'error',
        summary: 'Missing Fields',
        detail: 'Please enter mobile or password.',
        life: 3000
      })
      return
    }

    if (!navigator.onLine) {
      toast.current?.show({
        severity: 'warn',
        summary: 'No Internet Connection',
        detail: 'Please check your network and try again.',
        life: 3000
      })
      return
    }

    try {
      const credentials = {
        login: email,
        password: password
      }

      const response = await axios.post(import.meta.env.VITE_API_URL + '/Routes/login', credentials)
      console.log('response', response)

      const data = decrypt(response.data[1], response.data[0], import.meta.env.VITE_ENCRYPTION_KEY)

      console.log('data', data)
      if (data.success) {
        const userDetails = data.userDetails[0]
        console.log('userDetails', userDetails)

        localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
        localStorage.setItem('loginStatus', 'true')
        localStorage.setItem('userDetails', JSON.stringify(userDetails))

        confirmDialog({
          group: 'headless',
          message: 'Login successful!',
          header: 'Success',
          icon: 'pi pi-check',
          accept: () => {
            navigate('/')
          }
        })
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Invalid credentials',
          life: 3000
        })
      }
    } catch (error) {
      console.error('Login failed:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Login Failed',
        detail: 'Please check your credentials.',
        life: 3000
      })
    }
  }

  return (
    <div className="h-screen loginScreenBg">
      <Toast ref={toast} />
      <ConfirmDialog
        group="headless"
        content={({ headerRef, contentRef, footerRef, hide, message }) => (
          <div
            className="flex flex-column align-items-center p-5 surface-overlay border-round"
            style={{ width: '400px', maxWidth: '100%' }}
            ref={(el) => {
              if (el) el.style.setProperty('background-color', 'white', 'important')
            }}
          >
            <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
              <i className="pi pi-check text-5xl"></i>
            </div>
            <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
              {message.header}
            </span>
            <p className="mb-0" ref={contentRef as React.RefObject<HTMLParagraphElement>}>
              {message.message}
            </p>

            <div
              className="flex align-items-center gap-2 mt-4"
              ref={footerRef as React.RefObject<HTMLDivElement>}
            >
              <Button
                label="OK"
                onClick={(event) => {
                  hide(event)
                  navigate('/')
                }}
                className="w-8rem"
              ></Button>
            </div>
          </div>
        )}
      />

      <div className={containerClassName}>
        <div className="flex flex-column h-screen align-items-center justify-content-center">
          <div
            style={{
              borderRadius: '56px',
              padding: '0.3rem'
            }}
          >
            <div
              className="w-full surface-card py-8 px-5 sm:px-8"
              style={{ borderRadius: '53px' }}
              ref={(el) => {
                if (el) {
                  el.style.setProperty('background-color', 'rgba(255, 255, 255, 0.90)', 'important') // translucent
                  el.style.setProperty('backdrop-filter', 'blur(3px)', 'important') // blur effect
                  el.style.setProperty('-webkit-backdrop-filter', 'blur(10px)', 'important') // Safari support
                  el.style.setProperty('border-radius', '12px', 'important') // rounded corners
                  el.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.3)', 'important') // subtle border
                  el.style.setProperty('box-shadow', '0 4px 30px rgba(0, 0, 0, 0.1)', 'important') // soft shadow
                }
              }}
            >
              <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3 loginFonts">Welcome, Admin!</div>
                <img src={logoImg} alt="" style={{ width: '150px' }} />
              </div>
              <div>
                <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                  {/* Username */}
                </label>
                <InputText
                  id="email1"
                  type="text"
                  placeholder="Enter Mobile Number"
                  className="w-full md:w-30rem mb-5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ padding: '1rem' }}
                />

                <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                  {/* Password */}
                </label>
                <Password
                  inputId="password1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  toggleMask
                  className="w-full mb-5"
                  inputClassName="w-full p-3 md:w-30rem"
                ></Password>

                <div className="flex align-items-center justify-content-between mb-5 gap-5"></div>
                <Button
                  label="Sign In"
                  className="w-full p-3 text-xl"
                  style={{ background: '#0478df' }}
                  onClick={handleSignIn}
                ></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
