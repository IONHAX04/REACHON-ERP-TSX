import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import axios from 'axios'
import decrypt from '../../helper'
import { Nullable } from 'primereact/ts-helpers'
import { useNavigate } from 'react-router-dom'

interface EmployeeSidebarProps {
  onEmployeeAdded: () => void
}

interface EmployeeOptionsProps {
  userTypeId: number
  userTypeName: string
}

const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({ onEmployeeAdded }) => {
  const navigate = useNavigate()
  const toast = React.useRef<Toast>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [qualification, setQualification] = useState('')
  const [selectedDesignation, setSelectedDesignation] = useState<EmployeeOptionsProps | null>(null)
  const [dateOfBirth, setDateOfBirth] = useState<Nullable<Date>>(null)
  // Payroll Fields
  const [salary, setSalary] = useState('')
  const [pfDeduction, setPfDeduction] = useState('')
  const [bankAccountNumber, setBankAccountNumber] = useState('')
  const [bankBranch, setBankBranch] = useState('')
  const [bankIFSC, setBankIFSC] = useState('')

  const [designations, setDesignations] = useState<EmployeeOptionsProps[]>([])
  const [calculatedSalary, setCalculatedSalary] = useState<number>(0) // For displaying calculated salary

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getUsertype', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        if (data.token) {
          console.log('data line 6dsfa2', data)
          localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
          setDesignations(data.Usertype)
        } else {
          navigate('/login')
        }
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

    setCalculatedSalary(finalSalary)
  }

  useEffect(() => {
    calculateSalary()
  }, [salary, pfDeduction])

  const validateFields = () => {
    const missingFields: string[] = []

    if (!firstName) missingFields.push('First Name')
    if (!lastName) missingFields.push('Last Name')
    if (!email) missingFields.push('Email')
    if (!mobile) missingFields.push('Mobile')
    if (!qualification) missingFields.push('Qualification')
    if (!selectedDesignation) missingFields.push('Designation')
    if (!dateOfBirth) missingFields.push('Date of Birth')
    if (!salary) missingFields.push('Base Salary')
    if (!pfDeduction) missingFields.push('Provident Fund Deduction')
    if (!bankAccountNumber) missingFields.push('Bank Account Number')
    if (!bankBranch) missingFields.push('Bank Branch')
    if (!bankIFSC) missingFields.push('Bank IFSC')

    if (missingFields.length > 0) {
      toast.current?.show({
        severity: 'error',
        summary: 'Missing Fields',
        detail: `Please fill in the following fields: ${missingFields.join(', ')}`,
        life: 3000
      })
      return false
    }
    return true
  }

  const handleAddEmployee = () => {
    if (!validateFields()) {
      return
    }

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
          salary: salary,
          finalSalary: calculatedSalary,
          pfDeduction: pfDeduction,
          bankAccountNumber: bankAccountNumber,
          bankBranch: bankBranch,
          bankIFSC: bankIFSC
        },
        {
          headers: { Authorization: localStorage.getItem('JWTtoken') }
        }
      )
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data - line 60', data)
        localStorage.setItem('JWTtoken', 'Bearer ' + data.token)

        if (data.success && data.token) {
          // Clear the form
          setFirstName('')
          setLastName('')
          setEmail('')
          setMobile('')
          setQualification('')
          setSelectedDesignation(null)
          setDateOfBirth(null)
          setSalary('')
          setPfDeduction('')
          setBankAccountNumber('')
          setBankBranch('')

          if (onEmployeeAdded) {
            onEmployeeAdded()
          }
        } else {
          toast.current?.show({
            severity: 'error',
            summary: 'Error Occures',
            detail: `User Mobile / Email ${data.message}`,
            life: 3000
          })
        }
      })
      .catch((error) => {
        console.error('Error adding employee:', error)
      })
  }

  return (
    <div>
      <Toast ref={toast} />
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
        <h4>Calculated Salary: ₹{calculatedSalary} Per Month</h4>
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
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-home"></i>
          </span>
          <InputText
            value={bankIFSC}
            onChange={(e) => setBankIFSC(e.target.value)}
            placeholder="IFSC"
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
