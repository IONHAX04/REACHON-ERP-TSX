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
  tempStatus: string
  overallStatus: string
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
  const [vendors, setVendors] = useState<any | null>()
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
          localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
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
          if (data.success) {
            localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
            setCustomers(data.result)
            const vendors = Array.from(
              new Map(
                data.result.map((item) => [
                  item.dsr_act_cust_code,
                  { partnersName: item.dsr_act_cust_code }
                ])
              ).values()
            )
            setVendors(vendors)
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

    const exportData = filteredCustomers.map((item, index) => {
      let lastStatusCode = '-'
      console.log('lastStatusCode', lastStatusCode)
      try {
        const parsedStatus = JSON.parse(item.overallStatus)
        lastStatusCode = parsedStatus?.[parsedStatus.length - 1]?.strCode || '-'
      } catch (e) {
        console.warn('Failed to parse overallStatus', e)
      }

      return {
        'S.No': index + 1,
        dsr_branch_code: item.dsr_branch_code,
        dsr_cnno: item.dsr_cnno,
        dsr_booked_by: item.dsr_booked_by,
        dsr_cust_code: item.dsr_cust_code,
        dsr_cn_weight: item.dsr_cn_weight,
        dsr_cn_type: item.dsr_cn_type,
        dsr_dest: item.dsr_dest,
        dsr_mode: item.dsr_mode,
        dsr_no_of_pieces: item.dsr_no_of_pieces,
        dsr_dest_pin: item.dsr_dest_pin,
        dsr_booking_date: item.dsr_booking_date,
        dsr_amt: item.dsr_amt,
        dsr_status: item.dsr_status,
        dsr_pod_recd: item.dsr_pod_recd,
        dsr_transmf_no: item.dsr_transmf_no,
        dsr_booking_time: item.dsr_booking_time,
        dsr_dox: item.dsr_dox,
        dsr_service_tax: item.dsr_service_tax,
        dsr_spl_disc: item.dsr_spl_disc,
        dsr_contents: item.dsr_contents,
        dsr_remarks: item.dsr_remarks,
        dsr_value: item.dsr_value,
        dsr_invno: item.dsr_invno,
        dsr_invdate: item.dsr_invdate,
        mod_date: item.mod_date,
        office_type: item.office_type,
        office_code: item.office_code,
        dsr_refno: item.dsr_refno,
        mod_time: item.mod_time,
        nodeid: item.nodeid,
        userid: item.userid,
        trans_status: item.trans_status,
        dsr_act_cust_code: item.dsr_act_cust_code,
        dsr_mobile: item.dsr_mobile,
        dsr_email: item.dsr_email,
        dsr_ndx_paper: item.dsr_ndx_paper,
        dsr_pickup_time: item.dsr_pickup_time,
        dsr_vol_weight: item.dsr_vol_weight,
        dsr_captured_weight: item.dsr_captured_weight,
        dsr_id_num: item.dsr_id_num,
        fr_dp_code: item.fr_dp_code,
        tempStatus: item.tempStatus,
        lastStatusCode: item.overallStatus
      }
    })

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

  useEffect(() => {
    const storedUser = localStorage.getItem('userDetails')
    console.log('storedUser', storedUser)

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0') // months are 0-based
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
  }

  useEffect(() => {
    let filtered = [...customers]

    if (selectedVendors && selectedVendors.length > 0) {
      const vendorNames = selectedVendors.map((v: any) => v.partnersName)
      filtered = filtered.filter((c) => vendorNames.includes(c.dsr_act_cust_code))
    }

    // Format helper: convert Date to "dd-mm-yyyy"
    const formatDate = (date: Date) => {
      const d = new Date(date)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      return `${day}-${month}-${year}`
    }

    if (multiDates && multiDates.length > 0) {
      const dateStrings = multiDates.map((d) => formatDate(new Date(d)))
      filtered = filtered.filter((c) => dateStrings.includes(c.dsr_booking_date))
    }

    if (rangeDates && rangeDates[0] && rangeDates[1]) {
      const start = new Date(rangeDates[0])
      const end = new Date(rangeDates[1])

      filtered = filtered.filter((c) => {
        const [day, month, year] = c.dsr_booking_date.split('-').map(Number)
        const bookingDate = new Date(year, month - 1, day) // Create Date from dd-mm-yyyy
        return bookingDate >= start && bookingDate <= end
      })
    }

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
          rows={10}
          rowsPerPageOptions={[10, 50, 150, 300]}
          stripedRows
          className="transactionDetailsTable"
          header={header}
          footer={footer}
          globalFilter={globalFilter}
        >
          <Column
            field="serialNo"
            frozen
            header="S.No"
            body={(_rowData, { rowIndex }) => rowIndex + 1}
            exportField="S.No"
            style={{ minWidth: '3rem' }}
          />
          <Column field="dsr_value" header="DSR Value" style={{ minWidth: '13rem' }} frozen />
          <Column field="dsr_branch_code" header="Branch Code" style={{ minWidth: '8rem' }} />
          <Column field="dsr_cnno" header="CN No" style={{ minWidth: '13rem' }} />

          <Column field="dsr_cust_code" header="Customer Code" style={{ minWidth: '13rem' }} />
          <Column field="dsr_booking_date" header="Booking Date" style={{ minWidth: '13rem' }} />
          <Column field="dsr_amt" header="Amount" style={{ minWidth: '13rem' }} />
          <Column field="dsr_act_cust_code" header="Cust Number" style={{ minWidth: '13rem' }} />
          <Column field="dsr_status" header="Status" style={{ minWidth: '13rem' }} />
          <Column field="userid" header="Booked By" style={{ minWidth: '13rem' }} />
          <Column field="mod_date" header="Modified Date" style={{ minWidth: '13rem' }} />

          <Column
            header="Last Status Code"
            body={(rowData) => {
              try {
                const statusArray = JSON.parse(rowData.overallStatus)
                const last = statusArray[statusArray.length - 1]
                return last?.strCode || '-'
              } catch {
                return '-'
              }
            }}
            style={{ minWidth: '13rem' }}
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
