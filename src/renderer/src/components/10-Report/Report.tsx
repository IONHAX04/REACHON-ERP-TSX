import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import axios from 'axios'
import decrypt from '../../helper'
import { Calendar } from 'primereact/calendar'
import { useNavigate } from 'react-router-dom'

// Interfaces
interface Customer {
  refCustomerName: string
  refCustomerId: string
  [key: string]: any
}

interface ParcelBooking {
  id: number
  bookedDate: string
  vendorLeaf: string
  destination: string
  weight: number
  freight: number
  pickup: number
  amount: number
}

interface Product {
  id: number
  bookedDate: string
  vendorLeaf: string
  refCustId: string
  destination: string
  weight: number
  netAmount: number
  refParcelBookings: ParcelBooking[]
}

const Report: React.FC = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [_customersdetail, setCustomerDetails] = useState<Customer[] | null>(null)
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])

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
      .get(import.meta.env.VITE_API_URL + '/route/addReport', {
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
    dt.current?.exportCSV()
  }

  const tableHeader = (
    <div className="flex justify-content-between align-items-center flex-wrap gap-2">
      <div className="flex align-items-center gap-2">
        <label className="font-medium">Booking Date:</label>
        <Calendar
          value={dateRange}
          onChange={(e) => setDateRange(e.value as [Date | null, Date | null])}
          selectionMode="range"
          placeholder="Select date range"
          readOnlyInput
          showIcon
        />
      </div>

      <div>
        <button className="p-button p-button-sm p-button-success" onClick={() => exportCSV()}>
          Export as CSV
        </button>
      </div>
    </div>
  )

  const filteredProducts = products.filter((product) => {
    const [start, end] = dateRange

    if (!(start instanceof Date) || !(end instanceof Date)) {
      return true // Do not filter if the range is not fully selected
    }

    const bookedDate = new Date(product.bookedDate)
    const bookedDateOnly = new Date(
      bookedDate.getFullYear(),
      bookedDate.getMonth(),
      bookedDate.getDate()
    )

    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate())

    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate())
    endDate.setHours(23, 59, 59, 999)

    return bookedDateOnly >= startDate && bookedDateOnly <= endDate
  })

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
          stripedRows
          className="reportDatatable"
          dataKey="id"
        >
          <Column
            field="id"
            header="S.No"
            body={(_, { rowIndex }) => rowIndex + 1}
            style={{ minWidth: '1rem' }}
          />
          <Column
            field="bookedDate"
            header="Date"
            style={{ minWidth: '8rem' }}
            body={(rowData) => new Date(rowData.bookedDate).toLocaleDateString('en-GB')}
          />
          <Column field="customerRefNo" header="Ref No" style={{ minWidth: '8rem' }} />
          <Column field="consignorName" header="Consignor Name" style={{ minWidth: '12rem' }} />
          <Column field="destination" header="Destination" style={{ minWidth: '8rem' }} />
          <Column
            field="vendorLeaf"
            header="Leaf"
            style={{ minWidth: '15rem' }}
            body={(rowData) => {
              try {
                const parsedLeaf = JSON.parse(rowData.vendorLeaf)
                return parsedLeaf.vendorLeaf
              } catch (error) {
                console.error('Error parsing vendorLeaf:', error)
                return ''
              }
            }}
          />

          <Column field="pickUP" header="Pick UP" style={{ minWidth: '8rem' }} />
          <Column field="weight" header="Weight" style={{ minWidth: '10rem' }} />
          <Column field="netAmount" header="Amount" style={{ minWidth: '10rem' }} />
        </DataTable>
      </div>
    </div>
  )
}

export default Report
