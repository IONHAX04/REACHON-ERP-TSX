import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Tag } from 'primereact/tag'
import { Nullable } from 'primereact/ts-helpers'
import React, { useState } from 'react'

interface EmployeePayroll {
  sno: number
  employeeId: string
  employeeName: string
  basicPay: number
  pf: number
  salary: number
  status: string
}

const PayrollAudit: React.FC = () => {
  const [date, setDate] = useState<Nullable<Date>>(null)
  const [showTable, setShowTable] = useState<boolean>(false)
  const [payrollData, setPayrollData] = useState<EmployeePayroll[]>([])

  const handleGetEmployees = () => {
    const sampleData: EmployeePayroll[] = [
      {
        sno: 1,
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        basicPay: 50000,
        pf: 2000,
        salary: 48000,
        status: 'Paid'
      },
      {
        sno: 2,
        employeeId: 'EMP002',
        employeeName: 'Jane Smith',
        basicPay: 55000,
        pf: 2500,
        salary: 52500,
        status: 'Not Paid'
      }
    ]
    setPayrollData(sampleData)
    setShowTable(true)
  }

  const statusBodyTemplate = (rowData: EmployeePayroll) => {
    return (
      <Tag
        value={rowData.status}
        severity={rowData.status === 'Paid' ? 'success' : 'danger'} // Set color based on status
      />
    )
  }

  return (
    <div>
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
            dateFormat="mm/yy"
          />
          <Button
            label="Get Employees"
            className="mx-3"
            severity="success"
            onClick={handleGetEmployees}
          />
        </div>
      </div>
      {showTable && (
        <DataTable value={payrollData} showGridlines stripedRows scrollable className="mt-3">
          <Column field="sno" header="S.No" />
          <Column field="employeeId" header="Employee ID" />
          <Column field="employeeName" header="Name" />
          <Column field="basicPay" header="Basic Pay" />
          <Column field="pf" header="PF" />
          <Column field="salary" header="Net Salary" />
          <Column field="status" header="Payment Status" body={statusBodyTemplate} />{' '}
        </DataTable>
      )}
    </div>
  )
}

export default PayrollAudit
