import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import axios from 'axios'
import decrypt from '../../helper'

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
  const [products, setProducts] = useState<Product[]>([])
  const [_customersdetail, setCustomerDetails] = useState<Customer[] | null>(null)

  const toast = useRef<Toast>(null)

  const getPartners = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getCustomers', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        setCustomerDetails(data.Customer)
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
        setProducts(data.data)
        console.log('data.data', data.data)
      })
      .catch((error) => {
        console.error('Error fetching report data:', error)
      })
  }

  useEffect(() => {
    getPartners()
    getReportData()
  }, [])

  const rowExpansionTemplate = (data: Product) => {
    return (
      <div className="p-3">
        <h5>{data.vendorLeaf}</h5>
        <DataTable value={data.refParcelBookings}>
          <Column
            field="id"
            header="S.No"
            body={(_, { rowIndex }) => rowIndex + 1}
            style={{ maxWidth: '1rem' }}
          />
          <Column
            field="bookedDate"
            header="Date"
            body={(row) => new Date(row.bookedDate).toLocaleDateString('en-GB')}
          />
          <Column field="vendorLeaf" header="POD Number" />
          <Column field="destination" header="Destination" />
          <Column field="weight" header="Weight" />
          <Column field="freight" header="Freight" />
          <Column field="pickup" header="Pick Up" />
          <Column field="amount" header="Amount" />
          <Column header="Action" body={payButtonTemplate} />
        </DataTable>
      </div>
    )
  }

  const payButtonTemplate = () => <Button label="Edit" className="p-button-success" />

  return (
    <div>
      <div className="primaryNav">
        <p>Report</p>
        <p>Logged in as: Admin</p>
      </div>

      <div className="m-3" style={{ scrollbarWidth: 'thin', overflow: 'hidden' }}>
        <Toast ref={toast} />

        <DataTable
          value={products}
          showGridlines
          scrollable
          stripedRows
          className="reportDatatable"
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="id"
        >
          <Column
            field="id"
            header="S.No"
            body={(_, { rowIndex }) => rowIndex + 1}
            style={{ width: '1rem' }}
          />
          <Column
            field="bookedDate"
            header="Date"
            body={(rowData) => new Date(rowData.bookedDate).toLocaleDateString('en-GB')}
          />
          <Column field="customerRefNo" header="Ref No" />
          <Column field="consignorName" header="Consignor Name" />
          <Column field="destination" header="Destination" />
          <Column field="refCustId" header="Leaf" />
          <Column field="destination" header="Destination" />
          <Column field="pickUP" header="Pick UP" />
          <Column field="weight" header="Weight" />
          <Column field="netAmount" header="Amount" />
          {/* <Column header="Action" body={payButtonTemplate} /> */}
        </DataTable>
      </div>
    </div>
  )
}

export default Report
