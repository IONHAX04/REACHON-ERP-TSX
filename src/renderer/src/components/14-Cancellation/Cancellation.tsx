import axios from 'axios'
import { Truck } from 'lucide-react'
import { InputText } from 'primereact/inputtext'
import { RadioButton } from 'primereact/radiobutton'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'

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

const Cancellation: React.FC = () => {
  const [user, setUser] = useState<UserDetails>()
  const [selectedOption, setSelectedOption] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [dialogVisible, setDialogVisible] = useState(false)
  const [dialogContent, setDialogContent] = useState<{
    status: string
    waybill: string
    remark: string
    orderId: string
  }>({
    status: '',
    waybill: '',
    remark: '',
    orderId: ''
  })

  const toast = useRef<Toast>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('userDetails')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const fetchTrackingStatus = async () => {
    try {
      const response = await axios.post(
        'https://track.delhivery.com/api/p/edit',
        {
          waybill: trackingNumber,
          cancellation: 'true'
        },
        {
          headers: {
            Authorization: 'Token f4881f7518b05af9e0e3446b8b697c490dbef74f',
            'Content-Type': 'application/json'
          },
          responseType: 'text' // 👈 Important to treat XML as plain text
        }
      )

      const xmlData = response.data as string
      console.log('Raw XML:', xmlData)

      // Manual extraction from XML
      const extractValue = (tag: string) => {
        const match = xmlData.match(new RegExp(`<${tag}>(.*?)</${tag}>`))
        return match ? match[1] : ''
      }

      const parsedData = {
        status: extractValue('status'),
        waybill: extractValue('waybill'),
        remark: extractValue('remark'),
        orderId: extractValue('order_id')
      }

      console.log('Parsed Data:', parsedData)

      setDialogContent(parsedData)
      setDialogVisible(true)

      if (parsedData.status.toLowerCase() === 'true') {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Shipment cancelled successfully!',
          life: 3000
        })
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Cancellation failed.',
          life: 3000
        })
      }
    } catch (error) {
      console.error('Tracking Error:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while deleting. Please try again.' + error,
        life: 3000
      })
    }
  }

  return (
    <div>
      <Toast ref={toast} />

      <Dialog
        header="Cancellation Details"
        visible={dialogVisible}
        style={{ width: '30vw' }}
        onHide={() => setDialogVisible(false)}
      >
        <div className="flex flex-column gap-2">
          <div>
            <strong>Status:</strong> {dialogContent.status}
          </div>
          <div>
            <strong>Waybill:</strong> {dialogContent.waybill}
          </div>
          <div>
            <strong>Remark:</strong> {dialogContent.remark}
          </div>
          <div>
            <strong>Order ID:</strong> {dialogContent.orderId}
          </div>
        </div>
      </Dialog>

      <div className="primaryNav">
        <p>Cancellation</p>
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
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cancellation
