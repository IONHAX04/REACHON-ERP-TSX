import React, { useEffect } from 'react'
import { useState } from 'react'
import { RadioButton } from 'primereact/radiobutton'
import { InputText } from 'primereact/inputtext'
import { Truck } from 'lucide-react'

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

  const [user, setUser] = useState<UserDetails>()

  useEffect(() => {
    const storedUser = localStorage.getItem('userDetails')
    console.log('storedUser', storedUser)

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <div>
      <div>
        <div className="primaryNav">
          <p>Tracking</p>
          <p className="">Logged in as: {user?.userTypeName}</p>
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tracking
