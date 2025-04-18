import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { Toolbar } from 'primereact/toolbar'
import { Button } from 'primereact/button'
import { MultiSelect } from 'primereact/multiselect'
import { Sidebar } from 'primereact/sidebar'
import { Calendar } from 'primereact/calendar'
import { Toast } from 'primereact/toast'

import './Key.css'
import UploadExcelSidebar from '../../pages/UploadExcelSidebar/UploadExcelSidebar'
import axios from 'axios'
import decrypt from '../../helper'
import { Nullable } from 'primereact/ts-helpers'

interface Customer {
  id: number
  vendorLeaf: string
  vendor: string
  refStatus: string
  purchasedDate: string // or Date if you're using Date objects
  validity: string // or appropriate type
  validityDate: string // or appropriate type
}

interface UserDetails {
  refUserId: number
  refCustId: string
  refUserFName: string
  refUserLName: string
  refCustMobileNum: string
  refCustpassword: string
  refCusthashedpassword: string
  refUsername: string
  userTypeName: string
}

const Key: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [user, setUser] = useState<UserDetails>()
  useEffect(() => {
    const storedUser = localStorage.getItem('userDetails')
    console.log('storedUser', storedUser)

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const [globalFilter, setGlobalFilter] = useState<string | null>(null)
  const [customers, setCustomers] = useState([])
  const dt = useRef<DataTable<Customer[]> | null>(null)
  const [selectedVendors, setSelectedVendors] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [visibleRight, setVisibleRight] = useState(false)
  const [vendors, setVendors] = useState<any[]>([])

  const [multiDates, setMultiDates] = useState<Nullable<Date[]>>(null)
  const [rangeDates, setRangeDates] = useState<Nullable<(Date | null)[]>>(null)

  useEffect(() => {
    getPartners()
  }, [])

  const getPartners = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getPartner', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data', data)
        setVendors(data.partners)
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  const state = [
    { name: 'Not Assigned', code: 1 },
    { name: 'Assigned', code: 2 },
    { name: 'Dispatched', code: 3 },
    { name: 'Delivered', code: 4 },
    { name: 'Cancelled', code: 5 }
  ]

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + '/routes/mapping', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data line 63 --------- ', data)
        if (data.success) {
          console.log('data.success', data.success)
          setCustomers(data.data)
        }
      })
      .catch((error) => {
        setCustomers([])
        console.error('Error fetching vendor details:', error)
      })
  }, [])

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={() => setVisibleRight(true)}
        />
      </div>
    )
  }

  const exportCSV = () => {
    if (dt.current) {
      dt.current.exportCSV()
    }
  }

  const rightToolbarTemplate = () => {
    return (
      <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
    )
  }

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Transaction Details</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
          placeholder="Search..."
        />
      </IconField>
    </div>
  )

  return (
    <div>
      <>
        <Toast ref={toast} />

        <div className="primaryNav">
          <p>Transaction Mapping</p>
          <p className="">Logged in as: {user?.userTypeName}</p>
        </div>
        <div className="m-3">
          <div className="flex gap-2">
            <MultiSelect
              value={selectedVendors}
              onChange={(e) => setSelectedVendors(e.value)}
              options={vendors}
              optionLabel="partnersName"
              filter
              className="flex-1"
              placeholder="Partners"
              maxSelectedLabels={3}
            />
            <MultiSelect
              value={selectedState}
              onChange={(e) => setSelectedState(e.value)}
              options={state}
              optionLabel="name"
              filter
              className="flex-1"
              placeholder="Status"
              maxSelectedLabels={3}
            />
            <Calendar
              value={multiDates}
              onChange={(e) => setMultiDates(e.value)}
              selectionMode="multiple"
              readOnlyInput
              className="flex-1"
              placeholder="Pick Multiple Dates"
              showButtonBar
            />

            <Calendar
              value={rangeDates}
              onChange={(e) => setRangeDates(e.value)}
              selectionMode="range"
              readOnlyInput
              className="flex-1"
              placeholder="Pick Date Range"
              showButtonBar
              hideOnRangeSelection
            />
          </div>
          <Toolbar
            className="mb-2 mt-2"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            value={customers}
            ref={dt}
            scrollable
            showGridlines
            stripedRows
            className="transactionDetailsTable"
            header={header}
            globalFilter={globalFilter}
            scrollHeight="350px"
          >
            <Column
              field="id"
              header="S.No"
              style={{ minWidth: '3rem' }}
              body={(_rowData, { rowIndex }) => rowIndex + 1}
            ></Column>
            <Column
              field="vendorLeaf"
              header="Leaf"
              frozen
              style={{ minWidth: '10rem', textTransform: 'capitalize' }}
            ></Column>
            <Column
              field="vendor"
              header="Partners"
              style={{ minWidth: '9rem', textTransform: 'capitalize' }}
            ></Column>
            <Column
              field="refStatus"
              header="Status"
              style={{ minWidth: '12rem', textTransform: 'capitalize' }}
            ></Column>
            <Column
              field="purchasedDate"
              header="Purchased Date"
              style={{ minWidth: '10rem', textTransform: 'capitalize' }}
            ></Column>
            <Column
              field="validity"
              header="Validity"
              style={{ minWidth: '10rem', textTransform: 'capitalize' }}
            ></Column>
            <Column
              field="validityDate"
              header="Validity Date"
              style={{ minWidth: '10rem', textTransform: 'capitalize' }}
            ></Column>
          </DataTable>
        </div>

        <Sidebar
          visible={visibleRight}
          position="right"
          style={{ width: '70vw' }}
          onHide={() => setVisibleRight(false)}
        >
          <UploadExcelSidebar />
        </Sidebar>
      </>
    </div>
  )
}

export default Key
