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
import { Tag } from 'primereact/tag'
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

interface StateOption {
  name: string
  code: number
}

interface Vendor {
  partnersName: string
  // Add other fields if needed
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
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('userDetails')
    console.log('storedUser', storedUser)

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const [globalFilter, setGlobalFilter] = useState<string | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const dt = useRef<DataTable<Customer[]> | null>(null)
  const [selectedVendors, setSelectedVendors] = useState<Vendor[] | null>(null)
  const [selectedState, setSelectedState] = useState<StateOption[] | null>(null)

  const [visibleRight, setVisibleRight] = useState(false)
  const [vendors, setVendors] = useState<any[]>([])

  const [multiDates, setMultiDates] = useState<Nullable<Date[]>>(null)
  const [rangeDates, setRangeDates] = useState<Nullable<(Date | null)[]>>(null)

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

  const fetchKeydata = () => {
    setLoading(true)

    axios
      .get(import.meta.env.VITE_API_URL + '/routes/mapping', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data line 63 --------- ', data)
        if (data.success) {
          setCustomers(data.data)
          setFilteredCustomers(data.data)
        }
      })
      .catch((error) => {
        setCustomers([])
        console.error('Error fetching vendor details:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const refreshButton = () => {
    getPartners()
    fetchKeydata()
  }

  const showNetworkStatus = (isOnline: boolean) => {
    if (isOnline) {
      getPartners()
      fetchKeydata()
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Network Error',
        detail: 'No network found. Please check your internet connection!',
        life: 4000
      })
    }
  }

  useEffect(() => {
    if (!navigator.onLine) {
      showNetworkStatus(false)
    } else {
      showNetworkStatus(true)
    }

    const handleOnline = () => {
      showNetworkStatus(true)
    }

    const handleOffline = () => {
      showNetworkStatus(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    let filtered = [...customers]

    if (selectedVendors && selectedVendors.length > 0) {
      const vendorNames = selectedVendors.map((v: any) => v.partnersName)
      filtered = filtered.filter((c) => vendorNames.includes(c.vendor))
    }

    if (selectedState && selectedState.length > 0) {
      const stateNames = selectedState.map((s: any) => s.name)
      filtered = filtered.filter((c) => stateNames.includes(c.refStatus))
    }

    if (multiDates && multiDates.length > 0) {
      const dateStrings = multiDates.map((d) => d.toDateString())
      filtered = filtered.filter((c) =>
        dateStrings.includes(new Date(c.purchasedDate).toDateString())
      )
    }

    if (rangeDates && rangeDates[0] && rangeDates[1]) {
      const start = rangeDates[0]
      const end = rangeDates[1]
      filtered = filtered.filter((c) => {
        const date = new Date(c.purchasedDate)
        return date >= start! && date <= end!
      })
    }

    setFilteredCustomers(filtered)
  }, [selectedVendors, selectedState, multiDates, rangeDates, customers])

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
    if (!filteredCustomers || filteredCustomers.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'No Data',
        detail: 'There is no data to export.',
        life: 3000
      })
      return
    }

    const exportData = filteredCustomers.map((item, index) => ({
      'S.No': index + 1,
      Leaf: item.vendorLeaf,
      Partners: item.vendor,
      Status: item.refStatus,
      'Purchased Date': item.purchasedDate,
      Validity: item.validity,
      'Validity Date': item.validityDate
    }))

    const csvHeader = Object.keys(exportData[0]).join(',') + '\n'
    const csvRows = exportData
      .map((row) =>
        Object.values(row)
          .map((value) => `"${value}"`)
          .join(',')
      )
      .join('\n')

    const csvContent = csvHeader + csvRows

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'transaction_mapping.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const rightToolbarTemplate = () => {
    return (
      <div className="gap-3">
        <Button
          className="mx-3"
          icon="pi pi-refresh"
          rounded
          raised
          onClick={refreshButton}
          style={{ background: '#202d71' }}
        />
        <Button label="Export" icon="pi pi-upload" severity="danger" onClick={exportCSV} />
      </div>
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
              onChange={(e) => {
                setMultiDates(e.value)
                setRangeDates(null) // clear range calendar
              }}
              selectionMode="multiple"
              readOnlyInput
              className="flex-1"
              placeholder="Pick Multiple Dates"
              showButtonBar
              disabled={Array.isArray(rangeDates) && rangeDates.length > 0}
              panelClassName="multi-calendar"
              showIcon
            />

            <Calendar
              value={rangeDates}
              onChange={(e) => {
                setRangeDates(e.value)
                setMultiDates(null) // clear multiple calendar
              }}
              selectionMode="range"
              readOnlyInput
              className="flex-1"
              placeholder="Pick Date Range"
              showButtonBar
              hideOnRangeSelection
              disabled={Array.isArray(multiDates) && multiDates.length > 0}
              panelClassName="range-calendar"
              showIcon
            />
          </div>
          <Toolbar
            className="mb-2 mt-2"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            value={filteredCustomers}
            ref={dt}
            scrollable
            showGridlines
            paginator
            loading={loading}
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            stripedRows
            className="transactionDetailsTable"
            header={header}
            globalFilter={globalFilter}
          >
            <Column
              field="serialNo"
              header="S.No"
              body={(_rowData, { rowIndex }) => rowIndex + 1}
              exportField="S.No"
              style={{ minWidth: '3rem' }}
            />

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
              field="assignedTo"
              header="Assigned To"
              body={(_rowData) => (_rowData.assignedTo ? _rowData.assignedTo : '-')}
              style={{ minWidth: '10rem', textTransform: 'capitalize' }}
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
            <Column
              header="Validity Status"
              body={(_rowData) => {
                const validityDate = new Date(_rowData.validityDate)
                const currentDate = new Date()

                const isExpired = validityDate < currentDate
                return (
                  <div>
                    {isExpired ? (
                      <Tag severity="danger" value="Expired" />
                    ) : (
                      <Tag severity="success" value="Live" />
                    )}
                  </div>
                )
              }}
              style={{ minWidth: '12rem' }}
            />
          </DataTable>
        </div>

        <Sidebar
          visible={visibleRight}
          position="right"
          style={{ width: '70vw' }}
          onHide={() => setVisibleRight(false)}
        >
          <UploadExcelSidebar setVisibleRight={setVisibleRight} />
        </Sidebar>
      </>
    </div>
  )
}

export default Key
