import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'
import axios from 'axios'
import decrypt from '../../helper'
import { Nullable } from 'primereact/ts-helpers'

interface CustomerDetailsProps {
  createdAt: string
  createdBy: string
  deletedAt: string
  deletedBy: string
  refAddress: string
  refCode: string
  refCustId: string
  refCustomerId: number
  refCustomerName: string
  refCustomerType: boolean
  refDummy4: string
  refDummy5: string
  refNotes: string
  refPhone: string
  updatedAt: string
  updatedBy: string
}

const Report: React.FC = () => {
  const [products, setProducts] = useState([])
  const [expandedRows, setExpandedRows] = useState(null)
  const [selectedVendors, setSelectedVendors] = useState(null)
  const [startDate, setStartDate] = useState<Nullable<Date>>(null)
  const [endDate, setEndDate] = useState<Nullable<Date>>(null)

  const [customersdetail, setCustoemrDetails] = useState<CustomerDetailsProps[] | []>([])

  const toast = useRef(null)

  const getPartners = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getCustomers', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data LINE 30', data)
        setCustoemrDetails(data.Customer)
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  const getReportData = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/route/addReport', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data', data)
        setProducts(data.data)
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  useEffect(() => {
    getPartners()
    getReportData()
  }, [])

  const allowExpansion = (rowData) => {
    console.log('rowData line 66', rowData.refParcelBookings)
    return rowData.refParcelBookings.length > 0
  }

  const rowExpansionTemplate = (data) => {
    console.log('data ----------- 71', data)
    return (
      <div className="p-3">
        <h5>{data.vendorLeaf}</h5>
        <DataTable value={data.refParcelBookings}>
          <Column
            field="id"
            header="S.No"
            style={{ maxWidth: '1rem' }}
            body={(_rowData, { rowIndex }) => rowIndex + 1}
          ></Column>
          <Column
            field="bookedDate"
            header="Date"
            style={{ minWidth: '3rem' }}
            body={(rowData) => new Date(rowData.bookedDate).toLocaleDateString('en-GB')}
          />
          <Column field="vendorLeaf" header="POD Number" style={{ minWidth: '8rem' }} />
          <Column field="destination" header="Destination" style={{ minWidth: '3rem' }} />
          {/* <Column field="" header="Weight" style={{ minWidth: '3rem' }} />
          <Column field="freight" header="Freight" style={{ minWidth: '3rem' }} />
          <Column field="pickup" header="Pick Up" style={{ minWidth: '3rem' }} />
          <Column field="amount" header="Amount" style={{ minWidth: '3rem' }} /> */}
          <Column header="Action" body={payButtonTemplate} style={{ minWidth: '8rem' }} />
        </DataTable>
      </div>
    )
  }

  const handlePdfDownload = () => {
    window.open('/reportPDF')
  }

  const payButtonTemplate = (_rowData) => <Button label="Edit" className="p-button-success" />

  return (
    <div>
      <div>
        <div className="primaryNav">
          <p>Report</p>
          <p className="">Logged in as: Admin</p>
        </div>
        <div className="m-3" style={{ scrollbarWidth: 'thin', overflow: 'hidden' }}>
          <div className="flex mt-3 mb-3 gap-3">
            <Dropdown
              value={selectedVendors}
              onChange={(e) => setSelectedVendors(e.value)}
              options={customersdetail}
              optionLabel="refCustomerName"
              style={{ maxWidth: '14rem' }}
              filter
              className="flex-1"
              placeholder="Customers"
            />
            <Calendar
              value={startDate}
              onChange={(e) => setStartDate(e.value)}
              placeholder="Pick Start Month"
            />
            <Calendar
              value={endDate}
              onChange={(e) => setEndDate(e.value)}
              placeholder="Pick End Date"
            />
            <Button
              label="Generate Report"
              severity="info"
              onClick={() => handlePdfDownload()}
            ></Button>
          </div>
          <Toast ref={toast} />
          <DataTable
            value={products}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            showGridlines
            scrollable
            scrollHeight="450px"
            stripedRows
            className="reportDatatable"
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey="id"
          >
            <Column
              field="id"
              header="S.No"
              style={{ width: '1rem' }}
              body={(_rowData, { rowIndex }) => rowIndex + 1}
            ></Column>
            <Column header="" expander={allowExpansion} style={{ width: '2rem' }} />
            <Column
              field="bookedDate"
              header="Date"
              style={{ width: '5rem' }}
              body={(rowData) => new Date(rowData.bookedDate).toLocaleDateString('en-GB')}
            />
            <Column field="vendorLeaf" header="POD Number" style={{ minWidth: '9rem' }} />
            <Column field="refCustId" header="Leaf" style={{ minWidth: '12rem' }} />
            <Column field="destination" header="Destination" style={{ width: '5rem' }} />
            <Column field="weight" header="Weight" style={{ width: '6rem' }} />
            {/* <Column field="freight" header="Freight" style={{ width: "7rem" }} />
          <Column field="pickUP" header="Pick Up" style={{ width: "7rem" }} /> */}
            <Column field="netAmount" header="Amount" style={{ width: '6rem' }} />
            <Column header="Action" body={payButtonTemplate} style={{ minWidth: '8rem' }} />
          </DataTable>
        </div>
      </div>
    </div>
  )
}

export default Report
