import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { Divider } from 'primereact/divider'
import { TabView, TabPanel } from 'primereact/tabview'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { FloatLabel } from 'primereact/floatlabel'
import { InputSwitch } from 'primereact/inputswitch'
import { Button } from 'primereact/button'
import axios from 'axios'
import decrypt from '../../helper'
import { Toast } from 'primereact/toast'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

interface CustomerDetailsProps {
  createdAt: string
  createdBy: string
  deletedAt: string
  deletedBy: string
  refAddress: string
  refCode: string
  refCustId: string
  refCustomerId: number
  refCustomerName: string
  refCustomerType: boolean
  refDummy4: string
  refDummy5: string
  refNotes: string
  refPhone: string
  updatedAt: string
  updatedBy: string
}

interface ParcelBookingProps {
  NoOfPieces: string
  actualWeight: string
  bookedDate: string
  breadth: string
  chargedWeight: string
  consigneeAddress: string
  consigneeEmail: string
  consigneeGSTnumber: string
  consigneeName: string
  consigneePhone: string
  consigneePincode: number
  consignorAddress: string
  consignorEmail: string
  consignorGSTnumber: string
  consignorName: string
  consignorPhone: string
  consignorPincode: number
  contentSpecification: string
  count: number
  createdAt: string
  createdBy: string
  customerRefNo: string
  customerType: boolean
  declaredValue: string
  deletedAt: string
  deletedBy: string
  destination: string
  dimension: boolean
  height: string
  netAmount: number
  origin: string
  paperEnclosed: string
  parcelBookingId: number
  partnersName: string
  paymentId: number
  pickUP: string
  refCustId: string
  refCustomerId: number
  refDummy1: string
  refDummy2: string
  refDummy3: string
  refDummy4: string
  type: string
  updatedAt: string
  updatedBy: string
  vendorLeaf: string
  weight: string
}

const Booking: React.FC = () => {
  const toast = useRef<Toast>(null)

  const [vendors, setVendors] = useState<any[]>([])
  const [partners, setPartners] = useState(null)
  const [value, setValue] = useState('')
  const [parcelType, setParcelType] = useState(null)

  const [customerDetails, setCustomersDetails] = useState<CustomerDetailsProps[] | []>([])
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null)

  const [consignersName, setConsigersName] = useState('')
  const [consignerAddress, setConsigerAddress] = useState('')
  const [consigerGstNumber, setConsigerGstNumber] = useState('')
  const [consigerPhone, setConsigerPhone] = useState('')
  const [consignerPincode, setConsigerPincode] = useState('')
  const [consigerEmail, setConsigerEmail] = useState('')

  const [consigeeRefNumber, setConsigeeRefNumber] = useState('')
  const [consigneName, setConsigneeName] = useState('')
  const [consigeeAddress, setConsigneAddress] = useState('')
  const [consigneeGst, setConsigneeGst] = useState('')
  const [consigneePincode, setConsigneePincode] = useState('')
  const [consigneePhone, setConsigneePhone] = useState('')
  const [consigneeEmail, setConsigneeEmail] = useState('')

  const [contentSpecifications, setContentSpecifications] = useState('')
  const [paperEnclosed, setPaperEnclosed] = useState('')

  const [declaredValue, setDeclaredValue] = useState('')
  const [numberOfPieces, setNumberOfPieces] = useState('')
  const [actualWeight, setActualWeight] = useState('')
  const [checked, setChecked] = useState(false)
  const [customerMode, setCustomerMode] = useState(false)

  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [breadth, setBreadth] = useState('')
  const [chargedWeight, setChargedWeight] = useState('')

  const [count, setCount] = useState<number | null>(1)
  const [modeOfPayment, setModeOfPayment] = useState(null)
  const [netAmoutn, setNetAmount] = useState('')
  const [pickupCharge, setPickupCharge] = useState('')

  const [parcelBookingData, setParcelBookingData] = useState<ParcelBookingProps[]>([])

  const getPartners = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getPartner', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data.partners', data.partners)
        setVendors(data.partners)
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getCustomers', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data ======== ', data)
        setCustomersDetails(data.Customer)
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  const getDetails = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/route/viewPastBooking', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data.partners line 79', data)
        setParcelBookingData(data.data)
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  const handlePayload = () => {
    axios
      .post(
        import.meta.env.VITE_API_URL + '/route/bookingTest',
        {
          partnersName: partners || '-',
          type: parcelType || '-',
          origin: 'Erode',
          destination: value || '-',
          consignorName: consignersName || '-',
          consignorAddress: consignerAddress || '-',
          consignorGSTnumber: consigerGstNumber || '-',
          consignorPhone: consigerPhone || '-',
          consignorEmail: consigerEmail || '-',
          customerRefNo: consigeeRefNumber || '-',
          consigneeName: consigneName || '-',
          consigneeAddress: consigeeAddress || '-',
          consigneeGSTnumber: consigneeGst || '-',
          consigneePhone: consigneePhone || '-',
          consigneeEmail: consigneeEmail || '-',
          contentSpecification: contentSpecifications || '-',
          paperEnclosed: paperEnclosed || '-',
          declaredValue: declaredValue || '-',
          NoOfPieces: numberOfPieces || '-',
          actualWeight: actualWeight || '-',
          dimension: checked || '-',
          height: height || '-',
          weight: weight || '-',
          breadth: breadth || '-',
          chargedWeight: chargedWeight || '-',
          paymentId: 1,
          customerType: true,
          refCustomerId: 1,
          netAmount: netAmoutn,
          pickUP: pickupCharge,
          count: count,
          consignorPincode: consignerPincode,
          consigneePincode: consigneePincode
        },
        {
          headers: { Authorization: localStorage.getItem('JWTtoken') }
        }
      )
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data', data)
        if (data.success) {
          toast.current?.show({
            severity: 'success',
            summary: 'Order Placed',
            detail: `Order Placed Successfully`
          })
          window.open('/testingPDF', '_blank')
        } else {
          toast.current?.show({
            severity: 'warn',
            summary: 'Error Occured',
            detail: `${data.message}`
          })
        }
        getPartners()
      })
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    getPartners()
    getDetails()
  }, [])

  const parcels = [
    { name: 'Non-Document', code: 1 },
    { name: 'Document', code: 2 }
  ]

  const modeOfPaymentOpt = [
    { name: 'Cash', code: 1 },
    { name: 'GPay', code: 2 },
    { name: 'Credited Customer', code: 3 }
  ]

  const [customers, setCustomers] = useState([])
  const [selectedLeaf, setSelectedLeaf] = useState(null)

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

  const actualWeightNumber = parseFloat(actualWeight)

  useEffect(() => {
    if (actualWeightNumber >= 0.5 && actualWeightNumber < 2.0) {
      setNetAmount('50')
    } else if (actualWeightNumber >= 2.0 && actualWeightNumber <= 10.0) {
      setNetAmount('100')
    } else if (actualWeightNumber > 10.0) {
      setNetAmount('150')
    }
  }, [actualWeight])
  return (
    <div>
      <Toast ref={toast} />

      <div className="primaryNav">
        <p>Booking</p>
        <p className="">Logged in as: Admin</p>
      </div>
      <div className="bookingTab m-4">
        <TabView>
          <TabPanel header="Place New Order" className="">
            <div className="mt-2 pb-3">
              <div className="flex justify-content-between gap-3">
                <FloatLabel>
                  <Dropdown
                    value={partners}
                    inputId="partnerDropDown"
                    onChange={(e) => setPartners(e.value)}
                    options={vendors}
                    optionLabel="partnersName"
                    className="w-full md:w-14rem"
                    checkmark={true}
                    highlightOnSelect={false}
                  />
                  <label htmlFor="partnerDropDown">Select Partners</label>
                </FloatLabel>

                <FloatLabel>
                  <Dropdown
                    value={parcelType}
                    inputId="docType"
                    onChange={(e) => setParcelType(e.value)}
                    options={parcels}
                    optionLabel="name"
                    className="w-full md:w-14rem"
                    checkmark={true}
                    highlightOnSelect={false}
                  />
                  <label htmlFor="docType">Type</label>
                </FloatLabel>

                <p className="flex align-items-center">
                  <b>Origin : </b> Erode
                </p>
                <FloatLabel>
                  <InputText
                    id="username"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <label htmlFor="username">Destination</label>
                </FloatLabel>
              </div>

              <div className="flex mt-5 align-items-center justify-content-between">
                <div className="flex align-items-center">
                  <p>
                    {' '}
                    <b>Customer Type:</b>
                  </p>
                  <InputSwitch checked={customerMode} onChange={(e) => setCustomerMode(e.value)} />
                  <p>Regular</p>
                </div>
                <FloatLabel>
                  <Dropdown
                    value={selectedCustomerDetails}
                    inputId="partnerDropDown"
                    onChange={(e) => setSelectedCustomerDetails(e.value)}
                    options={customerDetails}
                    optionLabel="refCustomerName"
                    className="w-full md:w-14rem"
                    disabled={!customerMode}
                    checkmark={true}
                    highlightOnSelect={false}
                  />
                  <label htmlFor="partnerDropDown">Select Customer</label>
                </FloatLabel>

                <div className="flex align-items-center">
                  <p>
                    {' '}
                    <b>Count:</b>
                  </p>
                  <InputNumber value={count} onChange={(e) => setCount(e.value)} />
                </div>
              </div>
              <Divider />

              <div className="flex card justify-content-between">
                <div className="flex flex-column align-items-start gap-3">
                  <p>Consignor</p>
                  <div className="flex flex-column gap-3 align-items-center justify-content-around">
                    <div className="card flex flex-column md:flex-row gap-3">
                      <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                          <i className="pi "></i>
                        </span>
                        <InputText
                          placeholder="Consignor's Name"
                          value={consignersName}
                          onChange={(e) => setConsigersName(e.target.value)}
                        />
                      </div>
                      <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon"></span>
                        <InputText
                          placeholder="Consignor's Address"
                          value={consignerAddress}
                          onChange={(e) => setConsigerAddress(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon"></span>
                        <InputText
                          placeholder="Consignor's Pincode"
                          value={consignerPincode}
                          onChange={(e) => setConsigerPincode(e.target.value)}
                        />
                      </div>
                      <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon"></span>
                        <InputText
                          placeholder="GST Number"
                          value={consigerGstNumber}
                          onChange={(e) => setConsigerGstNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="card flex flex-column md:flex-row gap-3">
                      <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                          <i className="pi "></i>
                        </span>
                        <InputText
                          placeholder="Phone"
                          value={consigerPhone}
                          onChange={(e) => setConsigerPhone(e.target.value)}
                        />
                      </div>
                      <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon"></span>
                        <InputText
                          placeholder="Email"
                          value={consigerEmail}
                          onChange={(e) => setConsigerEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* =================== */}
                <Divider layout="vertical" />
                {/* =================== */}
                <div className="flex flex-column align-items-start gap-3">
                  <p>Consignee</p>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon"></span>
                    <InputText
                      placeholder="Customer Ref No."
                      value={consigeeRefNumber}
                      onChange={(e) => setConsigeeRefNumber(e.target.value)}
                    />
                  </div>
                  <div className="card flex flex-column md:flex-row gap-3">
                    <div className="p-inputgroup flex-1">
                      <span className="p-inputgroup-addon">
                        <i className="pi "></i>
                      </span>
                      <InputText
                        placeholder="Consignee's Name"
                        value={consigneName}
                        onChange={(e) => setConsigneeName(e.target.value)}
                      />
                    </div>
                    <div className="p-inputgroup flex-1">
                      <span className="p-inputgroup-addon"></span>
                      <InputText
                        placeholder="Consignee's Address"
                        value={consigeeAddress}
                        onChange={(e) => setConsigneAddress(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="p-inputgroup flex-1">
                      <span className="p-inputgroup-addon"></span>
                      <InputText
                        placeholder="Consignee's Pincode"
                        value={consigneePincode}
                        onChange={(e) => setConsigneePincode(e.target.value)}
                      />
                    </div>
                    <div className="p-inputgroup flex-1">
                      <span className="p-inputgroup-addon"></span>
                      <InputText
                        placeholder="GST Number"
                        value={consigneeGst}
                        onChange={(e) => setConsigneeGst(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="card flex flex-column md:flex-row gap-3">
                    <div className="p-inputgroup flex-1">
                      <span className="p-inputgroup-addon">
                        <i className="pi "></i>
                      </span>
                      <InputText
                        placeholder="Phone"
                        value={consigneePhone}
                        onChange={(e) => setConsigneePhone(e.target.value)}
                      />
                    </div>
                    <div className="p-inputgroup flex-1">
                      <span className="p-inputgroup-addon"></span>
                      <InputText
                        placeholder="Email"
                        value={consigneeEmail}
                        onChange={(e) => setConsigneeEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Divider />
              <h3>Others</h3>
              <div className="card flex flex-column md:flex-row gap-3">
                <div className="flex-1">
                  <FloatLabel>
                    <Dropdown
                      value={selectedLeaf}
                      inputId="partnerDropDown"
                      onChange={(e) => setSelectedLeaf(e.value)}
                      options={customers}
                      optionLabel="vendorLeaf"
                      filter
                      className="w-full"
                      checkmark={true}
                      highlightOnSelect={false}
                    />
                    <label htmlFor="partnerDropDown">Select Leaf</label>
                  </FloatLabel>
                </div>
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi "></i>
                  </span>
                  <InputText
                    placeholder="Content Specification"
                    value={contentSpecifications}
                    onChange={(e) => setContentSpecifications(e.target.value)}
                  />
                </div>
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi "></i>
                  </span>
                  <InputText
                    placeholder="Paper Enclosed"
                    value={paperEnclosed}
                    onChange={(e) => setPaperEnclosed(e.target.value)}
                  />
                </div>
              </div>

              <Divider />
              <h3>Quantity Details</h3>

              <div className="card flex flex-column md:flex-row gap-3">
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi "></i>
                  </span>
                  <InputText
                    placeholder="Declared Value"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(e.target.value)}
                  />
                </div>
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi "></i>
                  </span>
                  <InputText
                    placeholder="No. Of Pieces"
                    value={numberOfPieces}
                    onChange={(e) => setNumberOfPieces(e.target.value)}
                  />
                </div>
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi "></i>
                  </span>
                  <InputText
                    placeholder="Actual Weight"
                    value={actualWeight}
                    onChange={(e) => setActualWeight(e.target.value)}
                  />
                </div>
              </div>

              <InputSwitch
                checked={checked}
                className="mt-3"
                onChange={(e) => setChecked(e.value)}
              />

              <div className="card flex mt-3 flex-column md:flex-row gap-3">
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi "></i>
                  </span>
                  <InputText
                    placeholder="Height"
                    disabled={!checked}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi "></i>
                  </span>
                  <InputText
                    placeholder="Weight"
                    disabled={!checked}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi "></i>
                  </span>
                  <InputText
                    placeholder="Breadth"
                    disabled={!checked}
                    value={breadth}
                    onChange={(e) => setBreadth(e.target.value)}
                  />
                </div>
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi "></i>
                  </span>
                  <InputText
                    placeholder="Charged Weight"
                    disabled={!checked}
                    value={chargedWeight}
                    onChange={(e) => setChargedWeight(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Divider />
            <div className="flex align-items-center justify-content-between gap-3">
              <h3>Mode of Payment</h3>
              <FloatLabel>
                <Dropdown
                  value={modeOfPayment}
                  inputId="partnerDropDown"
                  onChange={(e) => setModeOfPayment(e.value)}
                  options={modeOfPaymentOpt}
                  optionLabel="name"
                  className="w-full md:w-14rem flex-1"
                  checkmark={true}
                  highlightOnSelect={false}
                />
                <label htmlFor="partnerDropDown">Select Payment</label>
              </FloatLabel>
              <InputText
                className="w-full md:w-14rem "
                placeholder="Net Amount"
                value={netAmoutn}
                onChange={(e) => setNetAmount(e.target.value)}
              />
              <InputText
                className="w-full md:w-14rem "
                placeholder="Pickup Charge"
                value={pickupCharge}
                onChange={(e) => setPickupCharge(e.target.value)}
              />
            </div>
            <div className="flex gap-3" style={{ paddingBottom: '30px' }}>
              <div style={{ marginTop: '20px' }} onClick={() => handlePayload()}>
                <Button>Book Parcel</Button>
              </div>
              {/* <div
                style={{ marginTop: "20px" }}
                onClick={() => handlePdfDownload()}
              >
                <Button>DOWNLOAD</Button>
              </div> */}
            </div>
          </TabPanel>
          <TabPanel header="Overall Report">
            <DataTable
              value={parcelBookingData}
              // ref={dt}
              scrollable
              showGridlines
              stripedRows
              className="transactionDetailsTable"
              // header={header}
              // globalFilter={globalFilter}
              // scrollHeight="350px"
            >
              <Column
                field="id"
                header="S.No"
                style={{ minWidth: '3rem' }}
                body={(_rowData, { rowIndex }) => rowIndex + 1}
              ></Column>
              <Column
                field="vendorLeaf"
                header="Vendor Leaf"
                frozen
                style={{ minWidth: '10rem', textTransform: 'capitalize' }}
              ></Column>
              <Column
                field="refCustId"
                header="Leaf"
                style={{ minWidth: '14rem', textTransform: 'capitalize' }}
              ></Column>
              <Column
                field="partnersName"
                header="Partner Name"
                style={{ minWidth: '10rem', textTransform: 'capitalize' }}
              ></Column>
              <Column
                field="declaredValue"
                header="Declared Value"
                style={{ minWidth: '10rem', textTransform: 'capitalize' }}
              ></Column>
              <Column
                field="weight"
                header="Weight"
                style={{ minWidth: '10rem', textTransform: 'capitalize' }}
              ></Column>
              <Column
                field="netAmount"
                header="Amount"
                style={{ minWidth: '10rem', textTransform: 'capitalize' }}
              ></Column>
              <Column
                field="consigneePincode"
                header="Destination"
                style={{ minWidth: '10rem', textTransform: 'capitalize' }}
              ></Column>
            </DataTable>
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}

export default Booking
