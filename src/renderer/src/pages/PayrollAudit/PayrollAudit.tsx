import decrypt from '@renderer/helper'
import axios from 'axios'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Tag } from 'primereact/tag'
import { Toast } from 'primereact/toast'
import { Nullable } from 'primereact/ts-helpers'
import React, { useRef, useState } from 'react'

interface EmployeePayroll {
  sno: number
  employeeId: string
  employeeName: string
  basicPay: number
  pf: number
  finalSalary: string
  salary: number
  status: string
}

const PayrollAudit: React.FC = () => {
  const [date, setDate] = useState<Nullable<Date>>(null)
  const [showTable, setShowTable] = useState<boolean>(false)
  const [payrollData, setPayrollData] = useState<EmployeePayroll[]>([])
  const toast = useRef<Toast>(null)

  const handleGetEmployees = () => {
    if (!date) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Choose month and year',
        life: 3000
      })
      return
    }

    const currentDate = new Date()
    if (
      date.getFullYear() > currentDate.getFullYear() ||
      (date.getFullYear() === currentDate.getFullYear() && date.getMonth() > currentDate.getMonth())
    ) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Cannot select future months',
        life: 3000
      })
      return
    }

    console.log('date', date)
    axios
      .post(
        import.meta.env.VITE_API_URL + '/Employee/payedList',
        {
          month: date
        },
        {
          headers: { Authorization: localStorage.getItem('JWTtoken') }
        }
      )
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('list of unpaid employees', data)
        setPayrollData(data.data)
        setShowTable(true)
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  const statusBodyTemplate = (_rowData: EmployeePayroll) => {
    return <Tag value="Paid" severity="success" />
  }

  const calculateNetSalaryTotal = () => {
    return payrollData.reduce((total, employee) => {
      const salary = parseFloat(employee.finalSalary as unknown as string) || 0
      return total + salary
    }, 0)
  }

  const getMonthYearString = (date: Nullable<Date>) => {
    if (!date) return ''
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
    return date.toLocaleDateString('en-US', options)
  }

  const footer = `Net Salary Paid - for Month - ${getMonthYearString(date)} - Total: ₹ ${calculateNetSalaryTotal().toFixed(2)}`

  return (
    <div>
      <Toast ref={toast} />

      <div className="flex justify-content-between align-items-center">
        <div className="flex align-items-center">
          <Calendar
            value={date}
            onChange={(e) => setDate(e.value as Date)}
            readOnlyInput
            className="flex-1"
            placeholder="Pick a Date"
            showButtonBar
            showIcon
            view="month"
            maxDate={new Date()}
            dateFormat="mm/yy"
          />
          <Button
            label="Get Employees List"
            className="mx-3"
            severity="success"
            onClick={handleGetEmployees}
          />
        </div>
      </div>
      {showTable && (
        <DataTable
          value={payrollData}
          showGridlines
          stripedRows
          scrollable
          className="mt-3"
          header={footer}
        >
          <Column header="S.No" body={(_rowData, options) => options.rowIndex + 1} />
          <Column field="refCustId" header="Employee ID" />
          <Column field="refUserLName" header="Name" />
          <Column field="salary" header="Basic Pay" />
          <Column field="pfDeduction" header="PF" />
          <Column field="finalSalary" header="Net Salary" />
          <Column field="status" header="Payment Status" body={statusBodyTemplate} />
        </DataTable>
      )}
    </div>
  )
}

export default PayrollAudit
