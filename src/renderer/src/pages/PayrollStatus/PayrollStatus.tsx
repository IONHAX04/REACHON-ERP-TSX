import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
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
  const [showDialog, setShowDialog] = useState<boolean>(false)

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

  const calculateTotalSalary = () => {
    return selectedEmployees.reduce((total, emp) => total + emp.salary, 0)
  }

  const handlePaySalary = () => {
    const totalSalary = calculateTotalSalary()
    console.log('Total Salary to be paid:', totalSalary)
    console.log('Individual Split Up:', selectedEmployees)
    setShowDialog(false)
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

        {showTable && (
          <Button
            label="Pay Salary"
            severity="success"
            disabled={selectedEmployees.length === 0}
            onClick={() => setShowDialog(true)}
          />
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
          onSelectionChange={(e) => setSelectedEmployees(e.value as EmployeePayroll[])}
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

      <Dialog
        header="Salary Payment"
        visible={showDialog}
        style={{ width: '50vw' }}
        onHide={() => setShowDialog(false)}
        footer={
          <div>
            <Button
              label="Cancel"
              severity="secondary"
              onClick={() => setShowDialog(false)}
              className="mr-2"
            />
            <Button label="Pay" severity="success" onClick={handlePaySalary} />
          </div>
        }
      >
        <div className="mb-3">
          <h4>Total Salary: ₹{calculateTotalSalary()}</h4>
        </div>

        <DataTable value={selectedEmployees} showGridlines stripedRows scrollable>
          <Column field="employeeId" header="Employee ID" />
          <Column field="employeeName" header="Employee Name" />
          <Column field="salary" header="Net Salary" />
        </DataTable>
      </Dialog>
    </div>
  )
}

export default PayrollStatus
