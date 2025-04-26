import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Nullable } from 'primereact/ts-helpers'
import React, { useState } from 'react'

interface EmployeePayroll {
  sno: number
  employeeId: string
  employeeName: string
  basicPay: number
  pf: number
  salary: number
}

const PayrollStatus: React.FC = () => {
  const [date, setDate] = useState<Nullable<Date>>(null)
  const [payrollData, setPayrollData] = useState<EmployeePayroll[]>([])
  const [showTable, setShowTable] = useState<boolean>(false)
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeePayroll[]>([])

  const handleGetEmployees = () => {
    const sampleData: EmployeePayroll[] = [
      {
        sno: 1,
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        basicPay: 50000,
        pf: 2000,
        salary: 48000
      },
      {
        sno: 2,
        employeeId: 'EMP002',
        employeeName: 'Jane Smith',
        basicPay: 55000,
        pf: 2500,
        salary: 52500
      }
    ]
    setPayrollData(sampleData)
    setShowTable(true)
  }

  return (
    <div>
      <div className="flex justify-content-between">
        <div>
          <Calendar
            value={date}
            onChange={(e) => setDate(e.value as Date)}
            readOnlyInput
            className="flex-1"
            placeholder="Pick a Date"
            showButtonBar
            showIcon
            dateFormat="yy-mm-dd"
          />
          <Button
            label="Get Employees"
            className="mx-3"
            severity="success"
            onClick={handleGetEmployees}
          />
        </div>{' '}
        {showTable && (
          <div>
            <Button label="Pay Salary" severity="success" />
            <Button label="Export" className="mx-3" severity="danger" />
          </div>
        )}
      </div>

      {showTable && (
        <DataTable
          value={payrollData}
          showGridlines
          stripedRows
          scrollable
          className="mt-3"
          selectionMode="multiple"
          selection={selectedEmployees}
          onSelectionChange={(e: any) => {
            setSelectedEmployees(e.value as EmployeePayroll[])
          }}
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
          <Column field="sno" header="S.No" />
          <Column field="employeeId" header="Employee ID" />
          <Column field="employeeName" header="Name" />
          <Column field="basicPay" header="Basic Pay" />
          <Column field="pf" header="PF" />
          <Column field="salary" header="Net Salary" />
        </DataTable>
      )}
    </div>
  )
}

export default PayrollStatus
