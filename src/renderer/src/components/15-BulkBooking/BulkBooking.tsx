import React, { useEffect, useRef, useState } from 'react'

import { Toast } from 'primereact/toast'
import { MultiSelect } from 'primereact/multiselect'
import axios from 'axios'
import decrypt from '@renderer/helper'
import { useNavigate } from 'react-router-dom'
import { Calendar } from 'primereact/calendar'
import { Nullable } from 'primereact/ts-helpers'
import { Toolbar } from 'primereact/toolbar'
import { Button } from 'primereact/button'
import { Sidebar } from 'primereact/sidebar'
import BulkParcelBooking from '@renderer/pages/BulkParcelBooking/BulkParcelBooking'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { Tag } from 'primereact/tag'

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

interface Vendor {
  partnersName: string
  // Add other fields if needed
}

export interface Customer {
  dsr_act_cust_code: string
  dsr_amt: string
  dsr_booked_by: string
  dsr_booking_date: string
  dsr_booking_time: string
  dsr_branch_code: string
  dsr_captured_weight: string
  dsr_cn_type: string
  dsr_cn_weight: string
  dsr_cnno: string
  dsr_contents: string
  dsr_cust_code: string
  dsr_dest: string
  dsr_dest_pin: string
  dsr_dox: string
  dsr_email: string
  dsr_id_num: string
  dsr_invdate: string
  dsr_invno: string
  dsr_mobile: string
  dsr_mode: string
  dsr_ndx_paper: string
  dsr_no_of_pieces: string
  dsr_pickup_time: string
  dsr_pod_recd: string
  dsr_refno: string
  dsr_remarks: string
  dsr_service_tax: string
  dsr_spl_disc: string
  dsr_status: string
  dsr_transmf_no: any
  dsr_value: string
  dsr_vol_weight: string
  fr_dp_code: string
  id: number
  mod_date: string
  mod_time: string
  nodeid: string
  office_code: string
  office_type: string
  trans_status: string
  userid: string
}

const BulkBooking: React.FC = () => {
  const toast = useRef<Toast>(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(true)

  const [customers, setCustomers] = useState<Customer[]>([])
  const dt = useRef<DataTable<Customer[]> | null>(null)

  const [globalFilter, setGlobalFilter] = useState<string | null>(null)

  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])

  const [user, setUser] = useState<UserDetails>()
  const [vendors, setVendors] = useState<any[]>([])
  const [selectedVendors, setSelectedVendors] = useState<Vendor[] | null>(null)
  const [visibleRight, setVisibleRight] = useState(false)

  const [multiDates, setMultiDates] = useState<Nullable<Date[]>>(null)
  const [rangeDates, setRangeDates] = useState<Nullable<(Date | null)[]>>(null)

  const getPartners = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getPartner', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        if (data.token) {
          console.log('data', data)
          localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
          setVendors(data.partners)
        } else {
          navigate('/login')
        }
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  const fetchKeydata = () => {
    setLoading(true)

    axios
      .get(import.meta.env.VITE_API_URL + '/route/fetchAllMappingData', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        if (data.token) {
          console.log('data line 63 --------- ', data)
          if (data.success) {
            localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
            setCustomers(data.result)
            setFilteredCustomers(data.result)
          }
        } else {
          navigate('/login')
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

  const footer = `In total there are ${filteredCustomers ? filteredCustomers.length : 0} Leafs.`

  const exportCSV = () => {}

  useEffect(() => {
    const storedUser = localStorage.getItem('userDetails')
    console.log('storedUser', storedUser)

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    console.log('customers', customers)
    let filtered = [...customers]

    // if (selectedVendors && selectedVendors.length > 0) {
    //   const vendorNames = selectedVendors.map((v: any) => v.partnersName)
    //   filtered = filtered.filter((c) => vendorNames.includes(c.vendor))
    // }

    // if (multiDates && multiDates.length > 0) {
    //   const dateStrings = multiDates.map((d) => d.toDateString())
    //   filtered = filtered.filter((c) =>
    //     dateStrings.includes(new Date(c.purchasedDate).toDateString())
    //   )
    // }

    // if (rangeDates && rangeDates[0] && rangeDates[1]) {
    //   const start = rangeDates[0]
    //   const end = rangeDates[1]
    //   filtered = filtered.filter((c) => {
    //     const date = new Date(c.purchasedDate)
    //     return date >= start! && date <= end!
    //   })
    // }

    setFilteredCustomers(filtered)
  }, [selectedVendors, multiDates, rangeDates, customers])

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
  }, [visibleRight])

  return (
    <div>
      <Toast ref={toast} />

      <div className="primaryNav">
        <p>Bulk Booking</p>
        <p className="">Logged in as: {user?.userTypeName}</p>
      </div>

      <div className="m-3">
        <div className="flex gap-3">
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
            value={selectedVendors}
            onChange={(e) => setSelectedVendors(e.value)}
            options={vendors}
            optionLabel="partnersName"
            filter
            className="flex-1"
            placeholder="EO Code"
            maxSelectedLabels={3}
          />

          <MultiSelect
            value={selectedVendors}
            onChange={(e) => setSelectedVendors(e.value)}
            options={vendors}
            optionLabel="partnersName"
            filter
            className="flex-1"
            placeholder="Customer Code"
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
            dateFormat="yy-mm-dd"
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
            dateFormat="yy-mm-dd"
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
          footer={footer}
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
        style={{ width: '90vw' }}
        onHide={() => setVisibleRight(false)}
      >
        <BulkParcelBooking setVisibleRight={setVisibleRight} />
      </Sidebar>
    </div>
  )
}

export default BulkBooking
