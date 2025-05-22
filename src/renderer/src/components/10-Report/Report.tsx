import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import axios from 'axios'
import decrypt from '../../helper'
import { useNavigate } from 'react-router-dom'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'

interface ReportResultProps {
  customer_reference_number: string
  message: string
  reason: string
  reference_number: string
  success: boolean
}

interface TypeProps {
  code: number
  name: string
}

interface LeafProps {
  purchasedDate: string
  refStatus: string
  validity: string
  validityDate: string
  vendor: string
  vendorLeaf: string
}

interface ReportDetailsProps {
  actualweight: string
  breadth: string
  chargedweight: string
  consigneeaddress: string
  consigneecity: string | null
  consigneeemail: string
  consigneegstnumber: string
  consigneename: string
  consigneephone: string
  consigneepincode: string
  consigneestate: string | null
  consignoraddress: string
  consignorcity: string | null
  consignoremail: string
  consignorgstnumber: string
  consignorname: string
  consignorphone: string
  consignorpincode: string
  consignorstate: string | null
  contentspecification: string
  count: number
  createdat: string // ISO timestamp string
  customerrefno: string
  customertype: boolean
  declaredvalue: string
  destination: string
  dimension: string
  formatteddate: string | null
  height: string
  id: number
  invoiceNum: string | null
  leaf: LeafProps
  netamount: string
  noofpieces: number
  origin: string
  paperenclosed: string
  parcelStatus: string | null
  parcel_status: string | null
  paymentid: number
  pickup: string
  refCode: string
  refCustomerId: string
  refCustomerName: string
  refcustomerid: string | null
  vendor: string
  weight: string
  type: TypeProps
  result: ReportResultProps
}

const Report = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<ReportDetailsProps[] | []>([])
  const [dateFrom, setDateFrom] = useState(null)
  const [dateTo, setDateTo] = useState(null)
  const [customerName, setCustomerName] = useState(null)
  const [bookingStatus, setBookingStatus] = useState(null)
  const [customersDetail, setCustomerDetails] = useState([])
  const toast = useRef(null)

  const getPartners = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getCustomers', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        if (data.token) {
          setCustomerDetails(data.Customer)
        } else {
          navigate('/login')
        }
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  const getReportData = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Finance/viewFullReport', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        if (data.token) {
          console.log('data', data)
          setProducts(data.data)
        } else {
          navigate('/login')
        }
      })
      .catch((error) => {
        console.error('Error fetching report data:', error)
      })
  }

  useEffect(() => {
    getPartners()
    getReportData()
  }, [])

  const dt = useRef(null)

  const customerNames = [...new Set(products.map((item) => item.refCustomerName))]
  const bookingStatuses = [
    { label: 'Success', value: 'Success' },
    { label: 'Failed', value: 'Failed' }
  ]

  const exportCustomCSV = () => {
    const headers = [
      'S.No',
      'Date',
      'Customer Ref No',
      'Customer Name',
      'Ref Code',
      'Consignor Name',
      'Destination',
      'Pieces',
      'Pick Up',
      'Weight',
      'Amount',
      'Status',
      'Message'
    ]

    const rows = filteredProducts.map((row, index) => [
      index + 1,
      new Date(row.createdat).toLocaleDateString('en-GB'),
      row.customerrefno || '',
      row.refCustomerName || '',
      row.refCode || '',
      row.consignorname || '',
      row.destination || '',
      row.leaf?.vendorLeaf || '-', // Leaf formatting
      row.noofpieces || '',
      row.pickup || '',
      row.actualweight || '',
      row.netamount || '',
      row.result?.success ? 'Success' : 'Failed',
      messageTemplate(row) // You must ensure messageTemplate returns a plain string
    ])

    const csvContent = [
      headers.join(','), // header row
      ...rows.map((row) => row.map((value) => `"${value}"`).join(',')) // data rows
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `Over All Report (${new Date()}).csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredProducts = products.filter((item) => {
    const itemDate = new Date(item.createdat)
    const validDate =
      (!dateFrom || itemDate >= new Date(dateFrom)) && (!dateTo || itemDate <= new Date(dateTo))
    const validCustomer = !customerName || item.refCustomerName === customerName
    const validBookingStatus =
      !bookingStatus || (item.result?.success ? 'Success' : 'Failed') === bookingStatus
    return validDate && validCustomer && validBookingStatus
  })

  const tableHeader = (
    <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
      <div className="flex flex-wrap gap-2">
        <Calendar
          value={dateFrom}
          onChange={(e) => setDateFrom(e.value)}
          placeholder="From Date"
          showIcon
        />
        <Calendar
          value={dateTo}
          onChange={(e) => setDateTo(e.value)}
          placeholder="To Date"
          showIcon
        />
        <Dropdown
          value={customerName}
          options={customerNames.map((name) => ({ label: name, value: name }))}
          onChange={(e) => setCustomerName(e.value)}
          placeholder="Select Customer"
        />
        <Dropdown
          value={bookingStatus}
          options={bookingStatuses}
          onChange={(e) => setBookingStatus(e.value)}
          placeholder="Booking Status"
        />
      </div>
      <Button label="Export" icon="pi pi-upload" onClick={exportCustomCSV} />
    </div>
  )

  const messageTemplate = (rowData) => {
    const message = rowData.result?.rmk?.trim() || rowData.result?.message?.trim() || 'N/A'
    return message
  }

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <DataTable
        ref={dt}
        value={filteredProducts}
        header={tableHeader}
        paginator
        scrollable
        showGridlines
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        responsiveLayout="scroll"
      >
        <Column
          header="S.No"
          style={{ minWidth: '4rem' }}
          body={(_, options) => options.rowIndex + 1}
        />
        <Column
          field="leaf"
          header="Leaf"
          body={(rowData) => rowData.leaf?.vendorLeaf || '-'}
          style={{ minWidth: '8rem' }}
        />
        <Column
          field="createdat"
          header="Date"
          style={{ minWidth: '8rem' }}
          body={(rowData) => new Date(rowData.createdat).toLocaleDateString('en-GB')}
        />
        <Column field="customerrefno" header="Customer Ref No" style={{ minWidth: '12rem' }} />
        <Column field="refCustomerName" header="Customer Name" style={{ minWidth: '13rem' }} />
        <Column field="refCode" header="Ref Code" style={{ minWidth: '8rem' }} />
        <Column field="consignorname" header="Consignor Name" style={{ minWidth: '12rem' }} />
        <Column field="destination" header="Destination" style={{ minWidth: '10rem' }} />
        <Column field="noofpieces" header="Pieces" style={{ minWidth: '8rem' }} />
        <Column field="pickup" header="Pickup" style={{ minWidth: '8rem' }} />
        <Column field="actualweight" header="Weight" style={{ minWidth: '8rem' }} />
        <Column field="netamount" header="Amount" style={{ minWidth: '8rem' }} />
        <Column
          field="result"
          header="Status"
          style={{ minWidth: '8rem' }}
          body={(rowData) => (rowData.result?.success ? 'Success' : 'Failed')}
        />
        <Column
          field="result"
          header="Message"
          body={(rowData) => messageTemplate(rowData)}
          style={{ minWidth: '20rem' }}
        />
      </DataTable>
    </div>
  )
}

export default Report
