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
// import { DataTable } from 'primereact/datatable'
// import { Column } from 'primereact/column'
import {
  ArrowUpFromLine,
  BadgeIndianRupee,
  Boxes,
  FileStack,
  FileText,
  Landmark,
  LocateFixed,
  Mail,
  MapPin,
  Maximize2,
  Minimize2,
  Phone,
  Ruler,
  ScrollText,
  UserRoundCheck,
  Weight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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

interface SelectedCustomerDetailsProps {
  createdAt: string
  createdBy: string
  deletedAt: string
  deletedBy: string
  refAddress: string
  refCode: string
  refCustId: string
  refCustomerId: any
  refCustomerName: string
  refCustomerType: boolean
  refDummy4: string
  refDummy5: string
  refNotes: string
  refPhone: string
  updatedAt: string
  updatedBy: string
}

const Booking: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [user, setUser] = useState<UserDetails>()

  useEffect(() => {
    const storedUser = localStorage.getItem('userDetails')
    console.log('storedUser', storedUser)

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const [vendors, setVendors] = useState<any[]>([])
  const [partners, setPartners] = useState(null)
  const [value, setValue] = useState('')
  const [parcelType, setParcelType] = useState(null)

  const [customerDetails, setCustomersDetails] = useState<CustomerDetailsProps[] | []>([])
  const [selectedCustomerDetails, setSelectedCustomerDetails] =
    useState<SelectedCustomerDetailsProps | null>(null)

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

  const [_parcelBookingData, setParcelBookingData] = useState<ParcelBookingProps[]>([])

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
    const requiredFields = [
      { label: 'Partner Name', value: partners },
      { label: 'Parcel Type', value: parcelType },
      { label: 'Destination', value: value },
      { label: 'Consignor Name', value: consignersName },
      { label: 'Consignor Address', value: consignerAddress },
      { label: 'Consignor GST Number', value: consigerGstNumber },
      { label: 'Consignor Phone', value: consigerPhone },
      { label: 'Consignor Email', value: consigerEmail },
      { label: 'Customer Ref No', value: consigeeRefNumber },
      { label: 'Consignee Name', value: consigneName },
      { label: 'Consignee Address', value: consigeeAddress },
      { label: 'Consignee GST Number', value: consigneeGst },
      { label: 'Consignee Phone', value: consigneePhone },
      { label: 'Consignee Email', value: consigneeEmail },
      { label: 'Content Specification', value: contentSpecifications },
      { label: 'Paper Enclosed', value: paperEnclosed },
      { label: 'Declared Value', value: declaredValue },
      { label: 'No. of Pieces', value: numberOfPieces },
      { label: 'Actual Weight', value: actualWeight },
      // { label: 'Dimension', value: checked },
      { label: 'Net Amount', value: netAmoutn },
      { label: 'Pickup Charge', value: pickupCharge },
      { label: 'Count', value: count },
      { label: 'Consignor Pincode', value: consignerPincode },
      { label: 'Consignee Pincode', value: consigneePincode }
    ]

    const missingField = requiredFields.find(
      (field) => !field.value || field.value.toString().trim() === ''
    )

    if (missingField) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation Error',
        detail: `Please enter ${missingField.label}`
      })
      return
    }

    console.log('selectedCustomerDetails', selectedCustomerDetails)
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
          refCustomerId: selectedCustomerDetails?.refCustomerId,
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
        localStorage.setItem('JWTtoken', data.token)
        if (data.success) {
          toast.current?.show({
            severity: 'success',
            summary: 'Order Placed',
            detail: `Order Placed Successfully`
          })
          window.open('/testingPDF')
        } else {
          toast.current?.show({
            severity: 'warn',
            summary: 'Error Occured',
            detail: `${data.error}`
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

  const navigate = useNavigate()
  const handlePdfDownload = () => {
    navigate('/testingPDF')
  }

  return (
    <div>
      <Toast ref={toast} />

      <div className="primaryNav">
        <p>Booking</p>
        <p className="">Logged in as: {user?.userTypeName}</p>
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
                          <UserRoundCheck size={20} />{' '}
                        </span>
                        <InputText
                          placeholder="Consignor's Name"
                          value={consignersName}
                          onChange={(e) => setConsigersName(e.target.value)}
                        />
                      </div>
                      <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                          <LocateFixed size={20} />{' '}
                        </span>
                        <InputText
                          placeholder="Consignor's Address"
                          value={consignerAddress}
                          onChange={(e) => setConsigerAddress(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                          <MapPin size={20} />
                        </span>
                        <InputText
                          placeholder="Consignor's Pincode"
                          value={consignerPincode}
                          onChange={(e) => setConsigerPincode(e.target.value)}
                        />
                      </div>
                      <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                          <Landmark size={20} />
                        </span>
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
                          <Phone size={20} />{' '}
                        </span>
                        <InputText
                          placeholder="Phone"
                          value={consigerPhone}
                          onChange={(e) => setConsigerPhone(e.target.value)}
                        />
                      </div>
                      <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                          <Mail size={20} />
                        </span>
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
                    <span className="p-inputgroup-addon">
                      <ScrollText size={20} />
                    </span>
                    <InputText
                      placeholder="Customer Ref No."
                      value={consigeeRefNumber}
                      onChange={(e) => setConsigeeRefNumber(e.target.value)}
                    />
                  </div>
                  <div className="card flex flex-column md:flex-row gap-3">
                    <div className="p-inputgroup flex-1">
                      <span className="p-inputgroup-addon">
                        <UserRoundCheck size={20} />{' '}
                      </span>
                      <InputText
                        placeholder="Consignee's Name"
                        value={consigneName}
                        onChange={(e) => setConsigneeName(e.target.value)}
                      />
                    </div>
                    <div className="p-inputgroup flex-1">
                      <span className="p-inputgroup-addon">
                        <LocateFixed size={20} />{' '}
                      </span>
                      <InputText
                        placeholder="Consignee's Address"
                        value={consigeeAddress}
                        onChange={(e) => setConsigneAddress(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="p-inputgroup flex-1">
                      <span className="p-inputgroup-addon">
                        <MapPin size={20} />
                      </span>
                      <InputText
                        placeholder="Consignee's Pincode"
                        value={consigneePincode}
                        onChange={(e) => setConsigneePincode(e.target.value)}
                      />
                    </div>
                    <div className="p-inputgroup flex-1">
                      <span className="p-inputgroup-addon">
                        <Landmark size={20} />
                      </span>
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
                        <Phone size={20} />{' '}
                      </span>
                      <InputText
                        placeholder="Phone"
                        value={consigneePhone}
                        onChange={(e) => setConsigneePhone(e.target.value)}
                      />
                    </div>
                    <div className="p-inputgroup flex-1">
                      <span className="p-inputgroup-addon">
                        <Mail size={20} />
                      </span>
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
                    <FileText size={20} />{' '}
                  </span>
                  <InputText
                    placeholder="Content Specification"
                    value={contentSpecifications}
                    onChange={(e) => setContentSpecifications(e.target.value)}
                  />
                </div>
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <FileStack size={20} />
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
                    <BadgeIndianRupee size={20} />
                  </span>
                  <InputText
                    placeholder="Declared Value"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(e.target.value)}
                  />
                </div>
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <Boxes size={20} />
                  </span>
                  <InputText
                    placeholder="No. Of Pieces"
                    value={numberOfPieces}
                    onChange={(e) => setNumberOfPieces(e.target.value)}
                  />
                </div>
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <Minimize2 size={20} />
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
                    <ArrowUpFromLine size={20} />
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
                    <Maximize2 size={20} />
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
                    <Ruler size={20} />
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
                    <Weight size={20} />{' '}
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
              <div style={{ marginTop: '20px' }} onClick={() => handlePdfDownload()}>
                <Button>DOWNLOAD</Button>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}

export default Booking
