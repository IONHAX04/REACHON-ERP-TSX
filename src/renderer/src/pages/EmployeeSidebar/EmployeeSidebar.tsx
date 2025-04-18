import React from 'react'
import { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'
import axios from 'axios'
import decrypt from '../../helper'
import { Nullable } from 'primereact/ts-helpers'

interface EmployeeSidebarProps {
  onEmployeeAdded: () => void
}

interface EmployeeOptionsProps {
  userTypeId: number
  userTypeName: string
}

const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({ onEmployeeAdded }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [qualification, setQualification] = useState('')
  const [selectedDesignation, setSelectedDesignation] = useState<EmployeeOptionsProps | null>(null)
  const [dateOfBirth, setDateOfBirth] = useState<Nullable<Date>>(null)

  const [designations, setDesignations] = useState<EmployeeOptionsProps[]>([])

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getUsertype', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data line 6dsfa2', data)
        setDesignations(data.Usertype)
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }, [])

  const handleAddEmployee = () => {
    if (!selectedDesignation) {
      console.error('No designation selected.')
      return
    }

    axios
      .post(
        import.meta.env.VITE_API_URL + '/Routes/addEmployee',
        {
          temp_fname: firstName,
          temp_lname: lastName,
          designation: selectedDesignation.userTypeName,
          userType: selectedDesignation.userTypeId,
          temp_phone: mobile,
          temp_email: email,
          dateOfBirth: dateOfBirth,
          qualification: qualification
        },
        {
          headers: { Authorization: localStorage.getItem('JWTtoken') }
        }
      )
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data - line 60', data)

        if (data.success) {
          // Clear the form
          setFirstName('')
          setLastName('')
          setEmail('')
          setMobile('')
          setQualification('')
          setSelectedDesignation(null)
          setDateOfBirth(null)

          if (onEmployeeAdded) {
            onEmployeeAdded()
          }
        }
      })
      .catch((error) => {
        console.error('Error adding employee:', error)
      })
  }

  return (
    <div>
      <h3>Add Employee</h3>
      <div className="flex gap-3">
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <InputText
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </div>
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <InputText
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </div>
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <Dropdown
            value={selectedDesignation}
            onChange={(e) => setSelectedDesignation(e.value)}
            options={designations}
            optionLabel="userTypeName"
            style={{ textTransform: 'capitalize' }}
            placeholder="Select Designation"
            className="w-full md:w-14rem"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-3">
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-envelope"></i>
          </span>
          <InputText value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </div>
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-phone"></i>
          </span>
          <InputText
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-3">
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-calendar"></i>
          </span>
          <Calendar
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.value)}
            placeholder="Date of Birth"
            className="w-full md:w-14rem"
          />
        </div>
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-book"></i>
          </span>
          <InputText
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            placeholder="Qualification"
          />
        </div>
      </div>
      <div className="flex mt-3 justify-content-end">
        <Button label="Add" severity="success" onClick={handleAddEmployee} />
      </div>
    </div>
  )
}

export default EmployeeSidebar
