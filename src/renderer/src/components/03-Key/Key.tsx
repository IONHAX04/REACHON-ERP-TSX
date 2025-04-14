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

interface PartnersProps {
  createdAt: string
  createdBy: string
  deletedAt: string
  deletedBy: string
  partnersId: number
  partnersName: string
  phoneNumber: string
  refDummy1: string
  refDummy2: string
  refDummy3: string
  refDummy4: string
  refDummy5: string
  refUserId: number
  updatedAt: string
  updatedBy: string
  validity: string
}

const Key: React.FC = () => {
  const toast = useRef<Toast>(null)

  const [globalFilter, setGlobalFilter] = useState(null)
  const [customers, setCustomers] = useState([])
  const dt = useRef<DataTable<any>>(null)
  const [selectedVendors, setSelectedVendors] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [visibleRight, setVisibleRight] = useState(false)
  const [dates, setDates] = useState<Nullable<Date[]>>(null)
  const [dateRange, setDateRange] = useState<Nullable<(Date | null)[]>>(null)

  const [vendors, setVendors] = useState<PartnersProps[] | []>([])

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
        console.log('data.partners ---- line 45', data.partners)
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

  const handleEdit = (rowData) => {
    toast.current?.show({
      severity: 'info',
      summary: 'Edit Action',
      detail: `Tracking ID: ${rowData.trackingId}`
    })
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text p-button-info"
          onClick={() => handleEdit(rowData)}
          tooltipOptions={{ position: 'bottom' }}
          tooltip="Edit"
        />
      </div>
    )
  }

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
    dt.current?.exportCSV()
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
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </IconField>
    </div>
  )

  return (
    <>
      <Toast ref={toast} />

      <div className="primaryNav">
        <p>Transaction Mapping</p>
        <p className="">Logged in as: Admin</p>
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
            value={dates}
            onChange={(e) => setDates(e.value)}
            selectionMode="multiple"
            readOnlyInput
            className="flex-1"
            placeholder="Pick Multiple Dates"
            showButtonBar
          />
          <Calendar
            value={dateRange}
            onChange={(e) => setDateRange(e.value)}
            selectionMode="range"
            readOnlyInput
            className="flex-1"
            showButtonBar
            placeholder="Pick Date Range"
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
            body={(rowData, { rowIndex }) => rowIndex + 1}
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
          {/* <Column
            header="Action"
            body={actionBodyTemplate}
            style={{
              textAlign: 'center',
              minWidth: '10rem',
              textTransform: 'capitalize'
            }}
          ></Column> */}
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
  )
}

export default Key
