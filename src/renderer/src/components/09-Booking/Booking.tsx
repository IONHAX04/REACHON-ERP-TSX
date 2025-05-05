import { Document, Font, Image, Page, Text, View } from '@react-pdf/renderer'
import React from 'react'
import PopRegular from '../../assets/Fonts/Poppins-Regular.ttf'
import PopBold from '../../assets/Fonts/Poppins-Bold.ttf'
import PopBoldItalic from '../../assets/Fonts/Poppins-BoldItalic.ttf'
import PopSemiboldItalic from '../../assets/Fonts/Poppins-SemiBoldItalic.ttf'
import logo from '../../assets/Logo/LOGO.png'
import cut from '../../assets/PDFTemplate/Cut.png'

import { City, State } from 'country-state-city'

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
import { pdf } from '@react-pdf/renderer'

import {
  ArrowUpFromLine,
  BadgeIndianRupee,
  Boxes,
  Building2,
  FileStack,
  FileText,
  Landmark,
  LocateFixed,
  Mail,
  MapPin,
  MapPinned,
  Maximize2,
  Minimize2,
  Phone,
  Ruler,
  ScrollText,
  UserRoundCheck,
  Weight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'
// import TestingPDF from '../11-TestingPDF/TestingPDF'

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

interface PartnerProps {
  createdAt: string
  createdBy: string
  deletedAt: string
  deletedBy: string
  partnersId: number
  partnersName: string
  phoneNumber: string
  refDummy1: string
  refDummy2: string
  refDummy3: string
  refDummy4: string
  refDummy5: string
  refUserId: string
  updatedAt: string
  updatedBy: string
  validity: string
}

interface ParcelDetailsProps {
  name: string
  code: number
}

interface VendorLeafProps {
  purchasedDate: string
  refStatus: string
  validity: string
  validityDate: string
  vendor: string
  vendorLeaf: string
}

interface Category {
  name: string
  id: string
  refCategoryId: string
  refCategory: string
}

interface SubCategory {
  id: number
  category: string
  subCategory: string
  subcategoryId: number
  refCategoryId: number
}

const Booking: React.FC = () => {
  const navigate = useNavigate()
  Font.register({ family: 'PopRegular', src: PopRegular })
  Font.register({ family: 'PopBoldItalic', src: PopBoldItalic })
  Font.register({ family: 'PopBold', src: PopBold })
  Font.register({ family: 'PopSemiboldItalic', src: PopSemiboldItalic })

  const toast = useRef<Toast>(null)
  const [user, setUser] = useState<UserDetails>()

  const [states, setStates] = useState([])
  const [districts, setDistricts]: any = useState([])

  const [categories, setCategories] = useState<Category[]>([])
  const [data, setData] = useState<SubCategory[]>([])
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([])

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null)

  const handleCategoryChange = (e) => {
    const category = e.value
    setSelectedCategory(category)

    const filtered = data.filter((subCat) => subCat.refCategoryId === category.refCategoryId)
    console.log('filtered', filtered)
    setFilteredSubCategories(filtered)

    setSelectedSubCategory(null)
  }

  useEffect(() => {
    const countryStates: any = State.getStatesOfCountry('IN')
    setStates(countryStates)
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem('userDetails')
    console.log('storedUser', storedUser)

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    getCategory()
    getSubCategory()
  }, [])

  const getCategory = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getCategory', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        if (data.token) {
          console.log('data line 62', data)
          localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
          setCategories(data.Category)
        } else {
          navigate('/login')
        }
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  const getSubCategory = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getSubCategory', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        if (data.token) {
          console.log('data line 62-------', data)
          localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
          setData(data.SubCategory)
        } else {
          navigate('/login')
        }
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  const [vendors, setVendors] = useState<any[]>([])
  const [partners, setPartners] = useState<PartnerProps | null>(null)
  const [value, setValue] = useState('')
  const [parcelType, setParcelType] = useState<ParcelDetailsProps | null>(null)

  const [customers, setCustomers] = useState([])
  const [selectedLeaf, setSelectedLeaf] = useState<VendorLeafProps | null>(null)

  const [customerDetails, setCustomersDetails] = useState<CustomerDetailsProps[] | []>([])
  const [selectedCustomerDetails, setSelectedCustomerDetails] =
    useState<SelectedCustomerDetailsProps | null>(null)

  const [consignersName, setConsigersName] = useState('')
  const [consignerAddress, setConsigerAddress] = useState('')
  const [consigerGstNumber, setConsigerGstNumber] = useState('')
  const [consigerPhone, setConsigerPhone] = useState('')
  const [consignerPincode, setConsigerPincode] = useState('')
  const [consigerEmail, setConsigerEmail] = useState('')
  const [consignorCity, setConsignorCity] = useState('')
  const [consignorState, setConsignorState] = useState('')

  const [consigeeRefNumber, setConsigeeRefNumber] = useState('')
  const [consigneName, setConsigneeName] = useState('')
  const [consigeeAddress, setConsigneAddress] = useState('')
  const [consigneeGst, setConsigneeGst] = useState('')
  const [consigneePincode, setConsigneePincode] = useState('')
  const [consigneePhone, setConsigneePhone] = useState('')
  const [consigneeEmail, setConsigneeEmail] = useState('')
  const [consigneeCity, setConsigneeCity] = useState('')
  const [consigneeState, setConsigneeState] = useState('')

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
        if (data.token) {
          console.log('data.partners', data.partners)
          localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
          setVendors(data.partners)
        } else {
          navigate('/login')
        }
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
        if (data.token) {
          console.log('data ======== ', data)
          localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
          setCustomersDetails(data.Customer)
        } else {
          navigate('/login')
        }
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
        if (data.token) {
          console.log('data.partners line 79', data)
          localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
          setParcelBookingData(data.data)
        } else {
          navigate('/login')
        }
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  const handlePayload = () => {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' }
    const formattedDate = date.toLocaleDateString('en-GB', options).replace(',', '')
    console.log('formattedDate', formattedDate)

    console.log('vendor name:', selectedLeaf)

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

    // if (partners?.partnersName === 'DTDC') {
    //   axios
    //     .post(
    //       'https://dtdcapi.shipsy.io/api/customer/integration/consignment/softdata',
    //       {
    //         consignments: [
    //           {
    //             customer_code: 'EO1727',
    //             service_type_id: 'B2C PRIORITY',
    //             load_type: parcelType?.name,
    //             description: 'test',
    //             dimension_unit: 'cm',
    //             length: length,
    //             width: weight,
    //             height: height,
    //             weight_unit: 'kg',
    //             weight: actualWeight,
    //             declared_value: netAmoutn,
    //             num_pieces: String(count),
    //             origin_details: {
    //               name: consignersName,
    //               phone: consigerPhone,
    //               alternate_phone: consigerPhone,
    //               address_line_1: consignerAddress,
    //               address_line_2: consignerAddress,
    //               pincode: consignerPincode,
    //               city: consignorCity,
    //               state: consignorState
    //             },
    //             destination_details: {
    //               name: consigneName,
    //               phone: consigneePhone,
    //               alternate_phone: consigneePhone,
    //               address_line_1: consignerAddress,
    //               address_line_2: '',
    //               pincode: consigneePincode,
    //               city: consigneeCity,
    //               state: consigneeState
    //             },
    //             return_details: {
    //               address_line_1: consignerAddress,
    //               address_line_2: consignerAddress,
    //               city_name: consignorCity,
    //               name: consignersName,
    //               phone: consigerPhone,
    //               pincode: consignerPincode,
    //               state_name: consignorState,
    //               email: consigerEmail,
    //               alternate_phone: consigerPhone
    //             },
    //             customer_reference_number: selectedLeaf?.vendorLeaf,
    //             cod_collection_mode: '1',
    //             cod_amount: pickupCharge,
    //             commodity_id: '99',
    //             eway_bill: '',
    //             is_risk_surcharge_applicable: false,
    //             invoice_number: 'AB001',
    //             invoice_date: formattedDate,
    //             reference_number: ''
    //           }
    //         ]
    //       },
    //       {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'api-key': '5dd8e4d35166672758bd1ee8953025'
    //         }
    //       }
    //     )
    //     .then((res) => {
    //       if (res.data.status === 'OK') {
    //         const result = res.data.data[0]
    //         if (!result.success) {
    //           toast.current?.show({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: result.message,
    //             life: 3000
    //           })
    //         } else {
    //           toast.current?.show({
    //             severity: 'success',
    //             summary: 'Success',
    //             detail: 'Consignment created successfully',
    //             life: 3000
    //           })
    //         }
    //       }
    //     })
    //     .catch((err) => {
    //       toast.current?.show({
    //         severity: 'error',
    //         summary: 'Request Failed',
    //         detail: err.message || 'Something went wrong',
    //         life: 3000
    //       })
    //     })
    // } else if (partners?.partnersName === 'Delhivery') {
    //   axios.post(
    //     'https://track.delhivery.com/api/cmu/create.json',
    //     {
    //       pickup_location: {
    //         add: consignerAddress + ', ' + consignorCity + ', ' + consignorState,
    //         country: 'India',
    //         pin: consignerPincode,
    //         phone: consigerPhone,
    //         city: consignorCity,
    //         name: consignersName,
    //         state: consignorState
    //       },
    //       shipments: [
    //         {
    //           country: 'India',
    //           city: consigneeCity,
    //           seller_add: '',
    //           cod_amount: pickupCharge,
    //           return_phone: consigneePhone,
    //           seller_inv_date: '',
    //           seller_name: '',
    //           pin: consigneePincode,
    //           seller_inv: '',
    //           state: consigneeState,
    //           return_name: consigneName,
    //           order: '528324',
    //           add: consigeeAddress + ', ' + consigneeCity + ', ' + consigneeState || '-',
    //           payment_mode: 'Prepaid',
    //           quantity: count,
    //           return_add: consigeeAddress + ', ' + consigneeCity + ', ' + consigneeState || '-',
    //           seller_cst: '',
    //           seller_tin: '',
    //           phone: consigneePhone,
    //           total_amount: netAmoutn,
    //           name: consigneName,
    //           return_country: 'India',
    //           return_city: consigneeCity,
    //           return_state: consigneeState,
    //           return_pin: consigneePincode
    //         }
    //       ]
    //     },
    //     {
    //       headers: {
    //         Accept: 'application/json',
    //         Authorization: 'Token f4881f7518b05af9e0e3446b8b697c490dbef74f'
    //       }
    //     }
    //   )
    // }

    console.log('selectedCustomerDetails', selectedCustomerDetails)
    axios
      .post(
        import.meta.env.VITE_API_URL + '/route/bookingTest',
        {
          partnersName: partners || '-',
          leaf: selectedLeaf || '-',
          type: parcelType || '-',
          origin: 'Erode',
          destination: value || '-',
          consignorName: consignersName || '-',
          consignorAddress: consignerAddress + ', ' + consignorCity + ', ' + consignorState || '-',
          consignorGSTnumber: consigerGstNumber || '-',
          consignorPhone: consigerPhone || '-',
          consignorEmail: consigerEmail || '-',
          customerRefNo: consigeeRefNumber || '-',
          consigneeName: consigneName || '-',
          consigneeAddress: consigeeAddress + ', ' + consigneeCity + ', ' + consigneeState || '-',
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
        if (data.token) {
          localStorage.setItem('JWTtoken', 'Bearer ' + data.token)

          if (data.success) {
            toast.current?.show({
              severity: 'success',
              summary: 'Order Placed',
              detail: `Order Placed Successfully`
            })
            handlePdfDownload()
          } else {
            toast.current?.show({
              severity: 'warn',
              summary: 'Error Occured',
              detail: `${data.error}`
            })
          }
          getPartners()
        } else {
          console.log('tesitng data === ')
        }
      })
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    getPartners()
    getDetails()
  }, [])

  const parcels = [
    { name: 'NON-DOCUMENT', code: 1 },
    { name: 'DOCUMENT', code: 2 }
  ]

  const modeOfPaymentOpt = [
    { name: 'Cash', code: 1 },
    { name: 'GPay', code: 2 },
    { name: 'Credited Customer', code: 3 }
  ]

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + '/routes/ListMappingLeaf', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        if (data.token) {
          console.log('data line 63 --------- ', data)
          if (data.success) {
            localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
            console.log('data.success', data.success)
            setCustomers(data.data)
          }
        } else {
          navigate('/login')
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

  const handlePdfDownload = async () => {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' }
    const formattedDate = date.toLocaleDateString('en-GB', options).replace(',', '')
    const doc = (
      <Document>
        <Page size="A4">
          <View
            style={{
              padding: 20,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          >
            {/* Row-1 */}
            <View
              style={{
                width: '100%',
                height: '80px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                border: '1px solid #000'
              }}
            >
              <View
                style={{
                  width: '40%',
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRight: '1px solid #000',
                  padding: '10px'
                }}
              >
                <Image src={logo} style={{ width: '45%', marginBottom: '10px' }} />
                <View
                  style={{
                    fontSize: '7px',
                    fontFamily: 'PopBold',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text>Reachon Express Private Limited</Text>
                  <Text>No 118 Gandhiji Road, Erode HO,</Text>
                  <Text>Erode - 638001 (Near Railway Station)</Text>
                </View>
              </View>
              <View
                style={{
                  width: '30%',
                  height: '80px',
                  borderRight: '1px solid #000'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    height: '40px',
                    display: 'flex',
                    flexDirection: 'row',
                    borderBottom: '1px solid #000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Origin:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>Erode</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    height: '40px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Product:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>Ground Express</Text>
                </View>
              </View>
              <View
                style={{
                  width: '30%',
                  height: '80px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    height: '26px',
                    display: 'flex',
                    flexDirection: 'row',
                    borderBottom: '1px solid #000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Dest:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigneeCity}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    height: '26px',
                    display: 'flex',
                    borderBottom: '1px solid #000',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Type:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{parcelType?.name}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    height: '28px',
                    display: 'flex',
                    borderBottom: '1px solid #000',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Date:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{formattedDate}</Text>
                </View>
              </View>
            </View>

            {/* Row-2 */}
            <View
              style={{
                width: '100%',
                height: '80px',
                display: 'flex',
                flexDirection: 'row',
                borderRight: '1px solid #000',
                borderLeft: '1px solid #000',
                borderBottom: '1px solid #000'
              }}
            >
              <View
                style={{
                  width: '50%',
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: '1px solid #000',
                  padding: '5px',
                  fontSize: '8px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Consignor's Name:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consignersName}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Consignor's Address:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>
                    {consignerAddress + ', ' + consignorCity + ', ' + consignorState}
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>GSTIN No:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigerGstNumber}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Phone No:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigerPhone}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Email:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigerEmail}</Text>
                </View>
              </View>
              <View
                style={{
                  width: '50%',
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  // borderRight: "1px solid #000",
                  padding: '5px',
                  fontSize: '8px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Customer Ref No:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigeeRefNumber}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Consignee's Name:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigneName}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Consignee's Address:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>
                    {consigeeAddress + ', ' + consigneeCity + ', ' + consigneeState}
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>GSTIN No:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigneeGst}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Phone No:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigneePhone}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Email:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigneeEmail}</Text>
                </View>
              </View>
            </View>

            {/* Row-3 */}
            <View
              style={{
                width: '100%',
                height: '120px',
                display: 'flex',
                flexDirection: 'row',
                borderRight: '1px solid #000',
                borderLeft: '1px solid #000'
              }}
            >
              <View
                style={{
                  width: '25%',
                  height: '120px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    height: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    padding: '5px',
                    fontSize: '8px'
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      fontSize: '7px',
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '3px'
                    }}
                  >
                    <Text style={{ fontFamily: 'PopBold' }}>Content Specification:</Text>
                    <Text>{contentSpecifications}</Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      fontSize: '7px',
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '3px'
                    }}
                  >
                    <Text style={{ fontFamily: 'PopBold' }}>Paper Enclosed:</Text>
                    <Text>{paperEnclosed}</Text>
                  </View>
                </View>

                <View
                  style={{
                    width: '100%',
                    height: '80px',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    fontSize: '5px',
                    fontFamily: 'PopRegular',
                    textAlign: 'justify',
                    padding: '5px 5px'
                  }}
                >
                  <Text style={{ textAlign: 'justify' }}>
                    I/We declare that this consignment does not contain personal mail, cash,
                    jewellery, contraband, illegal drugs, any prohibited items and commodities which
                    can cause safety hazards while transporting
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      marginTop: '10px',
                      fontFamily: 'PopBold',
                      textDecoration: 'underline'
                    }}
                  >
                    Sende's Signature & Seal
                  </Text>
                  <Text style={{ textAlign: 'justify', marginTop: '2px' }}>
                    I have read and understood terms & conditions ofcarriage mentioned on website
                    www.dtdc.in, and I agree to the Same.
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: '25%',
                  height: '120px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    height: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    fontSize: '8px'
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      fontSize: '7px',
                      height: '13px',
                      borderBottom: '1px solid #000',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: '3px',
                      // justifyContent: "center",
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Text>Declared Value:</Text>
                    <Text style={{ fontFamily: 'PopBold' }}>{declaredValue}</Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      fontSize: '7px',
                      height: '13px',
                      borderBottom: '1px solid #000',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: '3px',
                      // justifyContent: "center",
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Text>No Of Pieces:</Text>
                    <Text style={{ fontFamily: 'PopBold' }}>{numberOfPieces}</Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      fontSize: '7px',
                      height: '14px',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: '3px',
                      // justifyContent: "center",
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Text>Actual Weight:</Text>
                    <Text style={{ fontFamily: 'PopBold' }}>{actualWeight} Kgs</Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: '26px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    fontSize: '8px'
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      fontSize: '7px',
                      height: '13px',
                      borderBottom: '1px solid #000',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: '3px',
                      // justifyContent: "center",
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Text>Dim:</Text>
                    <Text style={{ fontFamily: 'PopBold' }}>
                      {height} cm X {weight} cm X {breadth} cm
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '100%',
                      fontSize: '7px',
                      height: '13px',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: '3px',
                      // justifyContent: "center",
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Text>Charged weight:</Text>
                    <Text style={{ fontFamily: 'PopBold' }}>{chargedWeight} Kgs</Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: '54px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    fontSize: 5
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: '3px',
                      // justifyContent: "center",
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Text style={{ fontFamily: 'PopBold' }}>Name:</Text>
                    <Text>Reachon Express Private Limited</Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: 3,
                      // justifyContent: "center",
                      alignItems: 'flex-start'
                      // gap: "3px",
                    }}
                  >
                    <Text style={{ width: '18%', fontFamily: 'PopBold' }}>Address:</Text>
                    <Text style={{ width: '75%' }}>
                      No 118 Gandhiji Road, Erode HO, Erode - 638001 (Near Railway Station){' '}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: '3px',
                      // justifyContent: "center",
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Text style={{ fontFamily: 'PopBold' }}>Phone:</Text>
                    <Text>+91 94438 94875</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: '50%',
                  height: '120px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    height: '66px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderBottom: '1px solid #000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '5px',
                    fontSize: 8
                  }}
                >
                  <Text style={{ marginTop: '1px', height: '20px' }}>Place Your Barcode Here</Text>
                  <View
                    style={{
                      width: '100%',
                      fontSize: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                      // alignItems: "ceter",
                      flexDirection: 'row',
                      gap: '3px',
                      paddingTop: '5px'
                    }}
                  >
                    <Text style={{ marginTop: '1px' }}>AWB No:</Text>
                    <Text style={{ fontFamily: 'PopBold' }}>{selectedLeaf?.vendorLeaf}</Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: '66px',
                    display: 'flex',
                    flexDirection: 'row',
                    borderBottom: '1px solid #000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '8px'
                  }}
                >
                  <View
                    style={{
                      width: '50%',
                      height: '60px',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRight: '1px solid #000',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '8px'
                    }}
                  >
                    <Text style={{ fontSize: '10px', fontFamily: 'PopBold' }}>Risk Surcharge</Text>
                  </View>

                  <View
                    style={{
                      width: '50%',
                      height: '60px',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '8px'
                    }}
                  >
                    <View style={{ width: '50%', height: '60px' }}>
                      <View
                        style={{
                          width: '100%',
                          height: '60px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '8px'
                        }}
                      >
                        <View
                          style={{
                            width: '100%',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderBottom: '1px solid #000',
                            borderRight: '1px solid #000'
                          }}
                        >
                          <Text style={{ fontFamily: 'PopBold' }}>Owner</Text>
                        </View>
                        <View
                          style={{
                            width: '100%',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRight: '1px solid #000'
                          }}
                        >
                          <Text style={{ fontFamily: 'PopBold' }}>Carrier</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ width: '50%', height: '60px' }}>
                      <View
                        style={{
                          width: '100%',
                          height: '60px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '8px'
                        }}
                      >
                        <View
                          style={{
                            width: '100%',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderBottom: '1px solid #000'
                          }}
                        >
                          <Text style={{ fontFamily: 'PopBold' }}></Text>
                        </View>
                        <View
                          style={{
                            width: '100%',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Text style={{ fontFamily: 'PopBold' }}></Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Row-4 */}
            <View
              style={{
                width: '100%',
                height: '20px',
                display: 'flex',
                flexDirection: 'row',
                borderRight: '1px solid #000',
                borderLeft: '1px solid #000',
                borderBottom: '1px solid #000'
              }}
            >
              <View
                style={{
                  width: '50%',
                  height: '20px',
                  borderRight: '1px solid #000',
                  fontFamily: 'PopBold',
                  fontSize: '7px',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}
              >
                <Text>reachonexpress.com/</Text>
                <Text>reachonexpress@gmail.com</Text>
                <Text>+91 94438 94875</Text>
              </View>
              <View
                style={{
                  width: '50%',
                  height: '20px',
                  fontFamily: 'PopBold',
                  fontSize: 7,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}
              >
                <Text style={{ paddingLeft: '5px' }}>Amount collected (in Rs.):</Text>
              </View>
            </View>

            {/* Row-5 */}
            <View
              style={{
                width: '100%',
                height: '15px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                borderRight: '1px solid #000',
                borderLeft: '1px solid #000',
                borderBottom: '1px solid #000'
              }}
            >
              <Text style={{ fontSize: '6px', fontFamily: 'PopBold' }}>
                DOCUMENT IS NOT A TAX INVOICE. WEIGHT CAPTURED BY REACHON EXPRESS WILL BE USED FOR
                INVOICE GENERATION.
              </Text>
              <Text style={{ fontSize: '6px', fontFamily: 'PopBold' }}>Sender's Copy</Text>
            </View>

            {/* Line Cut */}
            <View
              style={{
                width: '100%',
                height: '100px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  width: '15%',
                  borderBottom: '1px solid #000',
                  borderStyle: 'dashed'
                }}
              ></View>
              <Image src={cut} style={{ height: '20px' }} />
              <View
                style={{
                  width: '15%',
                  borderBottom: '1px solid #000',
                  borderStyle: 'dashed'
                }}
              ></View>
              <Image src={cut} style={{ height: '20px' }} />
              <View
                style={{
                  width: '15%',
                  borderBottom: '1px solid #000',
                  borderStyle: 'dashed'
                }}
              ></View>
              <Image src={cut} style={{ height: '20px' }} />
              <View
                style={{
                  width: '15%',
                  borderBottom: '1px solid #000',
                  borderStyle: 'dashed'
                }}
              ></View>
              <Image src={cut} style={{ height: '20px' }} />
              <View
                style={{
                  width: '15%',
                  borderBottom: '1px solid #000',
                  borderStyle: 'dashed'
                }}
              ></View>
              <Image src={cut} style={{ height: '20px' }} />
              <View
                style={{
                  width: '15%',
                  borderBottom: '1px solid #000',
                  borderStyle: 'dashed'
                }}
              ></View>
            </View>

            {/* Row-1 */}
            <View
              style={{
                width: '100%',
                height: '80px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                border: '1px solid #000'
              }}
            >
              <View
                style={{
                  width: '40%',
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRight: '1px solid #000',
                  padding: '10px'
                }}
              >
                <Image src={logo} style={{ width: '45%', marginBottom: '10px' }} />
                <View
                  style={{
                    fontSize: '7px',
                    fontFamily: 'PopBold',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text>Reachon Express Private Limited</Text>
                  <Text>No 118 Gandhiji Road, Erode HO,</Text>
                  <Text>Erode - 638001 (Near Railway Station)</Text>
                </View>
              </View>
              <View
                style={{
                  width: '30%',
                  height: '80px',
                  borderRight: '1px solid #000'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    height: '40px',
                    display: 'flex',
                    flexDirection: 'row',
                    borderBottom: '1px solid #000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Origin:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>Erode</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    height: '40px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Product:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>Ground Express</Text>
                </View>
              </View>
              <View
                style={{
                  width: '30%',
                  height: '80px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    height: '26px',
                    display: 'flex',
                    flexDirection: 'row',
                    borderBottom: '1px solid #000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Dest:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigneeCity}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    height: '26px',
                    display: 'flex',
                    borderBottom: '1px solid #000',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Type:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{parcelType?.name}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    height: '28px',
                    display: 'flex',
                    borderBottom: '1px solid #000',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Date:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{formattedDate}</Text>
                </View>
              </View>
            </View>

            {/* Row-2 */}
            <View
              style={{
                width: '100%',
                height: '80px',
                display: 'flex',
                flexDirection: 'row',
                borderRight: '1px solid #000',
                borderLeft: '1px solid #000',
                borderBottom: '1px solid #000'
              }}
            >
              <View
                style={{
                  width: '50%',
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: '1px solid #000',
                  padding: '5px',
                  fontSize: '8px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Consignor's Name:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consignersName}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Consignor's Address:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>
                    {consignerAddress + ', ' + consignorCity + ', ' + consignorState}
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>GSTIN No:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigerGstNumber}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Phone No:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigerPhone}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Email:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigerEmail}</Text>
                </View>
              </View>
              <View
                style={{
                  width: '50%',
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  // borderRight: "1px solid #000",
                  padding: '5px',
                  fontSize: '8px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Customer Ref No:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigeeRefNumber}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Consignee's Name:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigneName}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Consignee's Address:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>
                    {consigeeAddress + ', ' + consigneeCity + ', ' + consigneeState}
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>GSTIN No:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigneeGst}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Phone No:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigneePhone}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text>Email:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>{consigneeEmail}</Text>
                </View>
              </View>
            </View>

            {/* Row-3 */}
            <View
              style={{
                width: '100%',
                height: '120px',
                display: 'flex',
                flexDirection: 'row',
                borderRight: '1px solid #000',
                borderLeft: '1px solid #000'
              }}
            >
              <View
                style={{
                  width: '25%',
                  height: '120px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    height: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    padding: '5px',
                    fontSize: '8px'
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      fontSize: '7px',
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '3px'
                    }}
                  >
                    <Text style={{ fontFamily: 'PopBold' }}>Content Specification:</Text>
                    <Text>{contentSpecifications}</Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      fontSize: '7px',
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '3px'
                    }}
                  >
                    <Text style={{ fontFamily: 'PopBold' }}>Paper Enclosed:</Text>
                    <Text>{paperEnclosed}</Text>
                  </View>
                </View>

                <View
                  style={{
                    width: '100%',
                    height: '80px',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    fontSize: '5px',
                    fontFamily: 'PopRegular',
                    textAlign: 'justify',
                    padding: '5px 5px'
                  }}
                >
                  <Text style={{ textAlign: 'justify' }}>
                    I/We declare that this consignment does not contain personal mail, cash,
                    jewellery, contraband, illegal drugs, any prohibited items and commodities which
                    can cause safety hazards while transporting
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      marginTop: '10px',
                      fontFamily: 'PopBold',
                      textDecoration: 'underline'
                    }}
                  >
                    Sende's Signature & Seal
                  </Text>
                  <Text style={{ textAlign: 'justify', marginTop: '2px' }}>
                    I have read and understood terms & conditions ofcarriage mentioned on website
                    www.dtdc.in, and I agree to the Same.
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: '25%',
                  height: '120px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    height: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    fontSize: '8px'
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      fontSize: '7px',
                      height: '13px',
                      borderBottom: '1px solid #000',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: '3px',
                      // justifyContent: "center",
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Text>Declared Value:</Text>
                    <Text style={{ fontFamily: 'PopBold' }}>{declaredValue}</Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      fontSize: '7px',
                      height: '13px',
                      borderBottom: '1px solid #000',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: '3px',
                      // justifyContent: "center",
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Text>No Of Pieces:</Text>
                    <Text style={{ fontFamily: 'PopBold' }}>{numberOfPieces}</Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      fontSize: '7px',
                      height: '14px',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: '3px',
                      // justifyContent: "center",
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Text>Actual Weight:</Text>
                    <Text style={{ fontFamily: 'PopBold' }}>{actualWeight} Kgs</Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: '26px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    fontSize: '8px'
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      fontSize: '7px',
                      height: '13px',
                      borderBottom: '1px solid #000',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: '3px',
                      // justifyContent: "center",
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Text>Dim:</Text>
                    <Text style={{ fontFamily: 'PopBold' }}>
                      {height} cm X {weight} cm X {breadth} cm
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '100%',
                      fontSize: '7px',
                      height: '13px',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: '3px',
                      // justifyContent: "center",
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Text>Charged weight:</Text>
                    <Text style={{ fontFamily: 'PopBold' }}>{chargedWeight} Kgs</Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: '54px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    fontSize: 5
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: '3px',
                      // justifyContent: "center",
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Text style={{ fontFamily: 'PopBold' }}>Name:</Text>
                    <Text>Reachon Express Private Limited</Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: 3,
                      // justifyContent: "center",
                      alignItems: 'flex-start'
                      // gap: "3px",
                    }}
                  >
                    <Text style={{ width: '18%', fontFamily: 'PopBold' }}>Address:</Text>
                    <Text style={{ width: '75%' }}>
                      No 118 Gandhiji Road, Erode HO, Erode - 638001 (Near Railway Station){' '}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: '3px',
                      // justifyContent: "center",
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Text style={{ fontFamily: 'PopBold' }}>Phone:</Text>
                    <Text>+91 94438 94875</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: '50%',
                  height: '120px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    height: '66px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderBottom: '1px solid #000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '5px',
                    fontSize: 8
                  }}
                >
                  <Text style={{ marginTop: '1px', height: '20px' }}>Place Your Barcode Here</Text>
                  <View
                    style={{
                      width: '100%',
                      fontSize: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                      // alignItems: "ceter",
                      flexDirection: 'row',
                      gap: '3px',
                      paddingTop: '5px'
                    }}
                  >
                    <Text style={{ marginTop: '1px' }}>AWB No:</Text>
                    <Text style={{ fontFamily: 'PopBold' }}>{selectedLeaf?.vendorLeaf}</Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: '66px',
                    display: 'flex',
                    flexDirection: 'row',
                    borderBottom: '1px solid #000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '8px'
                  }}
                >
                  <View
                    style={{
                      width: '50%',
                      height: '60px',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRight: '1px solid #000',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '8px'
                    }}
                  >
                    <Text style={{ fontSize: '10px', fontFamily: 'PopBold' }}>Risk Surcharge</Text>
                  </View>

                  <View
                    style={{
                      width: '50%',
                      height: '60px',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '8px'
                    }}
                  >
                    <View style={{ width: '50%', height: '60px' }}>
                      <View
                        style={{
                          width: '100%',
                          height: '60px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '8px'
                        }}
                      >
                        <View
                          style={{
                            width: '100%',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderBottom: '1px solid #000',
                            borderRight: '1px solid #000'
                          }}
                        >
                          <Text style={{ fontFamily: 'PopBold' }}>Owner</Text>
                        </View>
                        <View
                          style={{
                            width: '100%',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRight: '1px solid #000'
                          }}
                        >
                          <Text style={{ fontFamily: 'PopBold' }}>Carrier</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ width: '50%', height: '60px' }}>
                      <View
                        style={{
                          width: '100%',
                          height: '60px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '8px'
                        }}
                      >
                        <View
                          style={{
                            width: '100%',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderBottom: '1px solid #000'
                          }}
                        >
                          <Text style={{ fontFamily: 'PopBold' }}></Text>
                        </View>
                        <View
                          style={{
                            width: '100%',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Text style={{ fontFamily: 'PopBold' }}></Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Row-4 */}
            <View
              style={{
                width: '100%',
                height: '20px',
                display: 'flex',
                flexDirection: 'row',
                borderRight: '1px solid #000',
                borderLeft: '1px solid #000',
                borderBottom: '1px solid #000'
              }}
            >
              <View
                style={{
                  width: '50%',
                  height: '20px',
                  borderRight: '1px solid #000',
                  fontFamily: 'PopBold',
                  fontSize: '7px',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}
              >
                <Text>reachonexpress.com/</Text>
                <Text>reachonexpress@gmail.com</Text>
                <Text>+91 94438 94875</Text>
              </View>
              <View
                style={{
                  width: '50%',
                  height: '20px',
                  fontFamily: 'PopBold',
                  fontSize: 7,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}
              >
                <Text style={{ paddingLeft: '5px' }}>Amount collected (in Rs.):</Text>
              </View>
            </View>

            {/* Row-5 */}
            <View
              style={{
                width: '100%',
                height: '15px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                borderRight: '1px solid #000',
                borderLeft: '1px solid #000',
                borderBottom: '1px solid #000'
              }}
            >
              <Text style={{ fontSize: '6px', fontFamily: 'PopBold' }}>
                DOCUMENT IS NOT A TAX INVOICE. WEIGHT CAPTURED BY REACHON EXPRESS WILL BE USED FOR
                INVOICE GENERATION.
              </Text>
              <Text style={{ fontSize: '6px', fontFamily: 'PopBold' }}>Sender's Copy</Text>
            </View>
          </View>
        </Page>
      </Document>
    )

    console.log('testing line 410')
    const pdfBlob = await pdf(doc).toBlob()

    const link = document.createElement('a')
    link.href = URL.createObjectURL(pdfBlob)
    link.download = 'Receipt.pdf'
    link.click()

    URL.revokeObjectURL(link.href)
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
                  <label htmlFor="partnerDropDown">Select Partner</label>
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

              <div className="flex mt-5 gap-3 align-items-center justify-content-between">
                <FloatLabel className="flex-1">
                  <Dropdown
                    value={selectedCategory}
                    inputId="refCategoryId"
                    onChange={handleCategoryChange}
                    options={categories}
                    optionLabel="refCategory"
                    className="w-full"
                    checkmark={true}
                    name="category"
                    highlightOnSelect={false}
                  />
                  <label htmlFor="refCategoryId">Select Category</label>
                </FloatLabel>
                <FloatLabel className="flex-1">
                  <Dropdown
                    value={selectedSubCategory}
                    inputId="subcategoryId"
                    onChange={(e) => setSelectedSubCategory(e.value)}
                    options={filteredSubCategories}
                    optionLabel="refSubCategory"
                    className="w-full"
                    name="subCategory"
                    checkmark={true}
                    highlightOnSelect={false}
                    disabled={!selectedCategory}
                  />
                  <label htmlFor="subcategoryId">Select Sub Category</label>
                </FloatLabel>
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
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase()
                            if (/^[0-9A-Z]{0,15}$/.test(value)) {
                              setConsigerGstNumber(value)
                            }
                          }}
                          maxLength={15}
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
                          onChange={(e) => {
                            const value = e.target.value
                            if (/^\d{0,10}$/.test(value)) {
                              setConsigerPhone(value)
                            }
                          }}
                          maxLength={10}
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
                    <div className="card flex flex-column md:flex-row gap-3 w-full">
                      <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                          <MapPinned size={20} />
                        </span>
                        <Dropdown
                          name="state"
                          value={consignorState}
                          filter
                          options={states}
                          style={{ width: '100%' }}
                          optionLabel="name"
                          optionValue="isoCode"
                          placeholder="State"
                          onChange={(e) => {
                            setConsignorState(e.target.value)
                            setDistricts(City.getCitiesOfState('IN', e.target.value))
                          }}
                          required
                        />
                      </div>
                      <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                          <Building2 size={20} />{' '}
                        </span>
                        <Dropdown
                          className="dropDown"
                          name="district"
                          style={{ width: '100%' }}
                          value={consignorCity}
                          filter
                          placeholder="City"
                          options={districts}
                          optionLabel="name"
                          optionValue="name"
                          onChange={(e) => setConsignorCity(e.target.value)}
                          required
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
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase()
                          if (/^[0-9A-Z]{0,15}$/.test(value)) {
                            setConsigneeGst(value)
                          }
                        }}
                        maxLength={15}
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
                        onChange={(e) => {
                          const value = e.target.value
                          if (/^\d{0,10}$/.test(value)) {
                            setConsigneePhone(value)
                          }
                        }}
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
                  <div className="card flex flex-column md:flex-row gap-3 w-full">
                    <div className="p-inputgroup flex-1">
                      <span className="p-inputgroup-addon">
                        <MapPinned size={20} />
                      </span>
                      <Dropdown
                        name="state"
                        value={consigneeState}
                        filter
                        options={states}
                        style={{ width: '100%' }}
                        optionLabel="name"
                        optionValue="isoCode"
                        placeholder="State"
                        onChange={(e) => {
                          setConsigneeState(e.target.value)
                          setDistricts(City.getCitiesOfState('IN', e.target.value))
                        }}
                        required
                      />
                    </div>
                    <div className="p-inputgroup flex-1">
                      <span className="p-inputgroup-addon">
                        <Building2 size={20} />{' '}
                      </span>
                      <Dropdown
                        className="dropDown"
                        name="district"
                        style={{ width: '100%' }}
                        value={consigneeCity}
                        filter
                        placeholder="City"
                        options={districts}
                        optionLabel="name"
                        optionValue="name"
                        onChange={(e) => setConsigneeCity(e.target.value)}
                        required
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
                    placeholder="Length"
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
                    placeholder="Width"
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
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}

export default Booking
