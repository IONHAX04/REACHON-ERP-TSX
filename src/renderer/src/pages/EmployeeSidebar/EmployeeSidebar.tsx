import React, { useEffect, useState } from 'react'
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
  // Payroll Fields
  const [salary, setSalary] = useState('')
  const [payFrequency, setPayFrequency] = useState<string>('Monthly') // Default to Monthly
  const [pfDeduction, setPfDeduction] = useState('')
  const [taxId, setTaxId] = useState('')
  const [bankAccountNumber, setBankAccountNumber] = useState('')
  const [bankBranch, setBankBranch] = useState('')

  const [designations, setDesignations] = useState<EmployeeOptionsProps[]>([])
  const [calculatedSalary, setCalculatedSalary] = useState<number>(0) // For displaying calculated salary

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

  // Function to calculate the salary based on the selected pay frequency and PF deduction
  const calculateSalary = () => {
    if (!salary || !pfDeduction) return

    let baseSalary = parseFloat(salary)
    let deduction = parseFloat(pfDeduction)

    // Calculate deduction amount
    const deductionAmount = (baseSalary * deduction) / 100
    const finalSalary = baseSalary - deductionAmount

    // Adjust salary for different pay frequencies
    if (payFrequency === 'Bi-monthly') {
      setCalculatedSalary(finalSalary / 2) // Split salary for two months
    } else {
      setCalculatedSalary(finalSalary) // Monthly salary
    }
  }

  useEffect(() => {
    calculateSalary()
  }, [salary, pfDeduction, payFrequency]) // Recalculate whenever salary, PF deduction, or pay frequency changes

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
          qualification: qualification,
          salary: calculatedSalary // Send the calculated salary
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
          setSalary('')
          setPayFrequency('Monthly') // Reset to default
          setPfDeduction('')
          setTaxId('')
          setBankAccountNumber('')
          setBankBranch('')

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
        {/* First Name and Last Name */}
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

      {/* Email and Mobile */}
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

      {/* Date of Birth and Qualification */}
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

      {/* Payroll Details */}
      <h3>Payroll Details</h3>

      <div className="flex gap-3 mt-3">
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-indian-rupee"></i>
          </span>
          <InputText
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="Base Salary"
          />
        </div>
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-calendar"></i>
          </span>
          <Dropdown
            value={payFrequency}
            onChange={(e) => setPayFrequency(e.value)}
            options={['Monthly', 'Bi-monthly']}
            placeholder="Pay Frequency"
          />
        </div>
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-credit-card"></i>
          </span>
          <InputText
            value={pfDeduction}
            onChange={(e) => setPfDeduction(e.target.value)}
            placeholder="Provident Fund Deduction (%)"
          />
        </div>
      </div>

      {/* Calculated Salary Display */}
      <div className="mt-3">
        <h4>Calculated Salary: ₹{calculatedSalary}</h4>
      </div>

      {/* Bank Details */}
      <h3>Bank Details</h3>
      <div className="flex gap-3 mt-3">
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-credit-card"></i>
          </span>
          <InputText
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            placeholder="Bank Account Number"
          />
        </div>
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-home"></i>
          </span>
          <InputText
            value={bankBranch}
            onChange={(e) => setBankBranch(e.target.value)}
            placeholder="Bank Branch"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex mt-3 justify-content-end">
        <Button label="Add" severity="success" onClick={handleAddEmployee} />
      </div>
    </div>
  )
}

export default EmployeeSidebar
