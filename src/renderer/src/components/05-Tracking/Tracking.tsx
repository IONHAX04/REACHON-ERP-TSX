import React, { useEffect, useState } from 'react'
import { RadioButton } from 'primereact/radiobutton'
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
  const [selectedOption, setSelectedOption] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [user, setUser] = useState<UserDetails>()
  const [trackingData, setTrackingData] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('userDetails')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const fetchTrackingStatus = async () => {
    try {
      const response = await axios.post(
        'https://blktracksvc.dtdc.com/dtdc-api/rest/JSONCnTrk/getTrackDetails',
        {
          trkType: 'cnno',
          strcnno: '7X105432546',
          addtnlDtl: 'Y'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': 'EO1727_trk_json:47906b6b936de5d0500c3b9606edfeb4'
          }
        }
      )

      if (response.data?.statusCode === 200 && response.data?.statusFlag) {
        console.log('Tracking Response:', response.data)
        setTrackingData(response.data)
      } else {
        alert('Tracking failed or number not found.')
      }
    } catch (error) {
      console.error('Tracking Error:', error)
      alert('Error while tracking. Please try again.')
    }
  }

  const checkingApi = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + '/Employee/checkApi',
        {
          amount: 0,
          currency: 'CHF',
          successRedirectUrl: 'https://your-success-url.com',
          failedRedirectUrl: 'https://your-failed-url.com',
          purpose: 'Test Payment'
        },
        {
          headers: {
            Authorization: 'vqdTdCezHYCNEzgFcRsPz4PwvYvZPV',
            'Content-Type': 'application/json'
          }
        }
      )

      const decryptedData = decrypt(
        response.data[1], // Assuming response.data[1] is the encrypted data
        response.data[0], // Assuming response.data[0] is the key or IV
        import.meta.env.VITE_ENCRYPTION_KEY
      )

      if (decryptedData.success) {
        console.log('decryptedData', decryptedData)
        const paymentLink = decryptedData.data[0]?.link
        if (paymentLink) {
          window.location.href = paymentLink // Redirect to Payrexx payment page
        } else {
          alert('Payment link not found.')
        }
      } else {
        alert('Payment creation failed: ' + decryptedData.message)
      }
    } catch (error) {
      console.error('Error while tracking:', error)
      alert('Error while tracking. Please try again.')
    }
  }

  return (
    <div>
      <div className="primaryNav">
        <p>Tracking</p>
        <p>Logged in as: {user?.userTypeName}</p>
      </div>
      <div className="trackingContents m-3">
        <div className="flex gap-3">
          <div className="flex align-items-center flex-1">
            <RadioButton
              inputId="consignment"
              name="trackingOption"
              value="Consignment Number"
              onChange={(e) => setSelectedOption(e.value)}
              checked={selectedOption === 'Consignment Number'}
            />
            <label htmlFor="consignment" className="ml-2">
              Consignment Number
            </label>
          </div>
          <div className="flex align-items-center flex-1">
            <RadioButton
              inputId="reference"
              name="trackingOption"
              value="Reference Number"
              onChange={(e) => setSelectedOption(e.value)}
              checked={selectedOption === 'Reference Number'}
            />
            <label htmlFor="reference" className="ml-2">
              Reference Number
            </label>
          </div>
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <Truck />
            </span>
            <InputText
              placeholder="Enter Number"
              style={{ maxWidth: '20rem' }}
              disabled={!selectedOption}
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </div>
          <button
            className="p-button p-component"
            onClick={fetchTrackingStatus}
            disabled={!trackingNumber || !selectedOption}
          >
            Track
          </button>
        </div>
        {trackingData && (
          <div className="mt-4">
            <h4>Status: {trackingData.trackHeader?.strStatus}</h4>
            <p>Shipment No: {trackingData.trackHeader?.strShipmentNo}</p>
            <p>Booked Date: {trackingData.trackHeader?.strBookedDate}</p>
            <p>Origin: {trackingData.trackHeader?.strOrigin}</p>
            <p>Destination: {trackingData.trackHeader?.strDestination}</p>
            <h5>History:</h5>
            <ul>
              {trackingData.trackDetails?.map((event: any, index: number) => (
                <li key={index}>
                  [{event.strActionDate} {event.strActionTime}] - <strong>{event.strAction}</strong>{' '}
                  - {event.strOrigin} → {event.strDestination}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tracking
