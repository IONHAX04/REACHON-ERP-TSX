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

// Interfaces
interface Customer {
  refCustomerName: string
  refCustomerId: string
  [key: string]: any
}

interface ResultProps {
  cash_pickups: number
  cash_pickups_count: number
  cod_amount: number
  cod_count: number
  error: boolean
  package_count: number
  pickups_count: number
  prepaid_count: number
  replacement_count: number
  rmk: string
  message: string
  success: boolean
  upload_wbn: string | null
}

interface TypeProps {
  code: number
  name: string
}

interface Product {
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
  createdat: string
  customerrefno: string
  customertype: boolean
  declaredvalue: string
  destination: string
  dimension: string
  formatteddate: string | null
  height: string
  id: number
  invoiceNum: string | null
  leaf: string
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
  result: ResultProps
  type: TypeProps
}

const Report: React.FC = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [dateFrom, setDateFrom] = useState<any>(null)
  const [dateTo, setDateTo] = useState<any>(null)
  const [customerName, setCustomerName] = useState<any>(null)
  const [bookingStatus, setBookingStatus] = useState<any>(null)

  // Example of customer names and booking statuses - you can modify this logic based on your actual data
  const customerNames = [...new Set(products.map((item) => item.refCustomerName))]
  const bookingStatuses = [
    { label: 'Success', value: 'Success' },
    { label: 'Failed', value: 'Failed' }
  ]
  const [_customersdetail, setCustomerDetails] = useState<Customer[] | null>(null)

  const toast = useRef<Toast>(null)

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
          setProducts(data.data)
          console.log('data.data', data.data)
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

  const dt = useRef<DataTable<any[]>>(null)

  const exportCSV = () => {
    const exportableData = getExportData()
    dt.current?.exportCSV({ selectionOnly: false, data: exportableData })
  }

  const getExportData = () => {
    return products.map((item, index) => {
      const message =
        typeof item?.result?.message === 'string' && item.result.message.trim()
          ? item.result.message
          : typeof item?.result?.rmk === 'string' && item.result.rmk.trim()
            ? item.result.rmk
            : 'N/A'

      console.log('message', message)

      return {
        sno: index + 1,
        createdat: new Date(item.createdat).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        customerrefno: item.customerrefno || '',
        refCustomerName: item.refCustomerName || '',
        refCode: item.refCode || '',
        consignorname: item.consignorname || '',
        destination: item.destination || '',
        leaf: item.leaf || '',
        noofpieces: item.noofpieces || 0,
        pickup: item.pickup || '',
        actualweight: item.actualweight || '',
        netamount: item.netamount || '',
        bookingStatus: item.result.success ? 'Success' : 'Failed',
        message:
          typeof item?.result?.rmk === 'string' && item.result.rmk.trim()
            ? item.result.rmk
            : typeof item?.result?.message === 'string' && item.result.message.trim()
              ? item.result.message
              : 'N/A'
      }
    })
  }

  const filteredProducts = products.filter((item) => {
    // Filter by Date Range
    const itemDate = new Date(item.createdat)
    const validDate =
      (!dateFrom || itemDate >= new Date(dateFrom)) && (!dateTo || itemDate <= new Date(dateTo))

    // Filter by Customer Name
    const validCustomer = !customerName || item.refCustomerName === customerName

    // Filter by Booking Status
    const validBookingStatus =
      !bookingStatus || (item.result?.success ? 'Success' : 'Failed') === bookingStatus

    return validDate && validCustomer && validBookingStatus
  })

  const tableHeader = (
    <div className="flex justify-content-between align-items-center flex-wrap gap-2">
      <div className="flex gap-2">
        <div className="flex flex-column flex-1">
          <Calendar
            id="dateFrom"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.value)}
            dateFormat="dd/mm/yy"
            showIcon
          />
        </div>
        <div className="flex flex-column flex-1">
          <Calendar
            id="dateTo"
            value={dateTo}
            onChange={(e) => setDateTo(e.value)}
            dateFormat="dd/mm/yy"
            showIcon
          />
        </div>
        <div className="flex flex-column flex-1">
          <Dropdown
            id="customerName"
            value={customerName}
            options={customerNames}
            onChange={(e) => setCustomerName(e.value)}
            placeholder="Select Customer"
          />
        </div>
        <div className="flex flex-column flex-1">
          <Dropdown
            id="bookingStatus"
            value={bookingStatus}
            options={bookingStatuses}
            onChange={(e) => setBookingStatus(e.value)}
            placeholder="Select Status"
          />
        </div>
      </div>

      <Button label="Export" severity="success" onClick={() => exportCSV()}></Button>
    </div>
  )

  return (
    <div>
      <div className="primaryNav">
        <p>Report</p>
        <p>Logged in as: Admin</p>
      </div>

      <div className="m-3" style={{ scrollbarWidth: 'thin', overflow: 'hidden' }}>
        <Toast ref={toast} />

        <DataTable
          showGridlines
          ref={dt}
          value={filteredProducts}
          header={tableHeader}
          scrollable
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          stripedRows
          className="reportDatatable"
          dataKey="id"
        >
          <Column
            header="S.No"
            body={(_, { rowIndex }) => rowIndex + 1}
            style={{ minWidth: '1rem' }}
          />
          <Column
            field="createdat"
            header="Date"
            style={{ minWidth: '8rem' }}
            body={(rowData) => {
              const date = new Date(rowData.createdat)
              return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })
            }}
          />
          <Column field="customerrefno" header="Ref No" style={{ minWidth: '8rem' }} />
          <Column field="refCustomerName" header="Customer Name" style={{ minWidth: '12rem' }} />
          <Column field="refCode" header="Customer Code" style={{ minWidth: '12rem' }} />

          <Column field="consignorname" header="Consignor Name" style={{ minWidth: '12rem' }} />
          <Column field="destination" header="Destination" style={{ minWidth: '8rem' }} />
          <Column field="leaf" header="Leaf" style={{ minWidth: '12rem' }} />

          <Column field="noofpieces" header="No Of Pieces" style={{ minWidth: '12rem' }} />
          <Column field="pickup" header="Pick UP" style={{ minWidth: '8rem' }} />
          <Column field="actualweight" header="Weight" style={{ minWidth: '10rem' }} />
          <Column field="netamount" header="Amount" style={{ minWidth: '10rem' }} />
          <Column
            field="result.success"
            header="Booking Status"
            style={{ minWidth: '10rem' }}
            exportable={true}
            body={(rowData) => {
              const isSuccess = rowData.result?.success
              return (
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    color: 'white',
                    backgroundColor: isSuccess ? 'green' : 'red'
                  }}
                >
                  {isSuccess ? 'Success' : 'Failed'}
                </span>
              )
            }}
          />

          <Column
            header="Message"
            style={{ minWidth: '10rem' }}
            exportable={true}
            body={(rowData) => {
              const message = rowData.result?.message || rowData.result?.rmk || 'N/A'
              return <span>{message}</span>
            }}
          />
        </DataTable>
      </div>
    </div>
  )
}

export default Report
