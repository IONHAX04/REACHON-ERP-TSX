import React from 'react'
import { useState } from 'react'
import { RadioButton } from 'primereact/radiobutton'
import { InputText } from 'primereact/inputtext'
import { Truck } from 'lucide-react'

const Tracking: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('')

  return (
    <div>
      <div>
        <div className="primaryNav">
          <p>Tracking</p>
          <p className="">Logged in as: Admin</p>
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
