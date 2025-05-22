import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Truck } from 'lucide-react'
import axios from 'axios'
import decrypt from '@renderer/helper'

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

const Tracking: React.FC = () => {
  const [selectedVendor, setSelectedVendor] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [user, setUser] = useState<UserDetails>()
  const [trackingData, setTrackingData] = useState<any>(null)

  const vendorOptions = [
    { label: 'DTDC', value: 'DTDC' },
    { label: 'Delhivery', value: 'Delhivery' }
  ]

  const typeOptions = [
    { label: 'Consignment Number', value: 'Consignment Number' },
    { label: 'Reference Number', value: 'Reference Number' }
  ]

  useEffect(() => {
    const storedUser = localStorage.getItem('userDetails')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const fetchTrackingStatus = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + '/tracking/ViewTracking',
        {
          trkType: selectedType === 'Consignment Number' ? 'cnno' : 'ref',
          strcnno: trackingNumber,
          addtnlDtl: 'Y',
          vendorType: selectedVendor
        },
        {
          headers: { Authorization: localStorage.getItem('JWTtoken') }
        }
      )

      const data = decrypt(response.data[1], response.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
      console.log('Decrypted Tracking Data:', data)

      if (data.success) {
        localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
        if (selectedVendor === 'DTDC') {
          setTrackingData(data.data)
        } else if (selectedVendor === 'Delhivery') {
          setTrackingData(data.data.ShipmentData)
        }
      }
    } catch (error) {
      console.error('Tracking Error:', error)
      alert('Error while tracking. Please try again.')
    }
  }

  const renderTrackingDetails = () => {
    if (!trackingData) return null

    if (selectedVendor === 'DTDC') {
      const header = trackingData.trackHeader
      const details = trackingData.trackDetails || []

      return (
        <div className="mt-4">
          <h4>Status: {header?.strStatus}</h4>
          <p>Shipment No: {header?.strShipmentNo}</p>
          <p>Booked Date: {header?.strBookedDate}</p>
          <p>Origin: {header?.strOrigin}</p>
          <p>Destination: {header?.strDestination}</p>
          <h5>History:</h5>
          <ul>
            {details.map((event: any, index: number) => (
              <li key={index}>
                [{event.strActionDate} {event.strActionTime}] - <strong>{event.strAction}</strong> -{' '}
                {event.strOrigin} → {event.strDestination}
              </li>
            ))}
          </ul>
        </div>
      )
    }

    if (selectedVendor === 'Delhivery') {
      const shipment = trackingData[0]?.Shipment
      const scans = shipment?.Scans || []

      return (
        <div className="mt-4">
          <h4>Status: {shipment?.Status?.Status}</h4>
          <p>AWB: {shipment?.AWB}</p>
          <p>Origin: {shipment?.Origin}</p>
          <p>Destination: {shipment?.Destination}</p>
          <p>Sender: {shipment?.SenderName}</p>
          <p>
            Receiver: {shipment?.Consignee?.Name}, {shipment?.Consignee?.City}
          </p>
          <h5>Scan History:</h5>
          <ul>
            {scans.map((item: any, index: number) => {
              const scan = item.ScanDetail
              return (
                <li key={index}>
                  [{scan.ScanDateTime}] - <strong>{scan.Scan}</strong> - {scan.ScannedLocation}
                </li>
              )
            })}
          </ul>
        </div>
      )
    }

    return <p>No tracking data available.</p>
  }

  return (
    <div>
      <div className="primaryNav">
        <p>Tracking</p>
        <p>Logged in as: {user?.userTypeName}</p>
      </div>

      <div className="trackingContents m-3">
        <div className="flex gap-3 flex-wrap">
          <div className="flex flex-column gap-2">
            <label>Vendor</label>
            <Dropdown
              value={selectedVendor}
              options={vendorOptions}
              onChange={(e) => setSelectedVendor(e.value)}
              placeholder="Select Vendor"
              style={{ minWidth: '200px' }}
            />
          </div>

          <div className="flex flex-column gap-2">
            <label>Tracking Type</label>
            <Dropdown
              value={selectedType}
              options={typeOptions}
              onChange={(e) => setSelectedType(e.value)}
              placeholder="Select Tracking Type"
              style={{ minWidth: '200px' }}
            />
          </div>

          <div className="flex flex-column gap-2">
            <label>Tracking Number</label>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <Truck />
              </span>
              <InputText
                placeholder="Enter Number"
                disabled={!selectedVendor || !selectedType}
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="flex align-items-end">
            <button
              className="p-button p-component"
              onClick={fetchTrackingStatus}
              disabled={!trackingNumber || !selectedVendor || !selectedType}
            >
              Track
            </button>
          </div>
        </div>

        {renderTrackingDetails()}
      </div>
    </div>
  )
}

export default Tracking
