import { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputSwitch } from 'primereact/inputswitch'
import { Divider } from 'primereact/divider'
import axios from 'axios'
import decrypt from '../../helper'
import { FileJson, FolderOpen, LocateFixed, Phone, UsersRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface SetCustomer {
  id: number
  createdAt: string
  createdBy: string
  deletedAt?: string
  deletedBy?: string
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

const VendorSidebar: React.FC = () => {
  const [customerDetails, setCustomersDetails] = useState<SetCustomer[]>([])
  const [showInputSection, setShowInputSection] = useState(false)
  const [customer, setCustomer] = useState('')
  const [code, setCode] = useState('')
  const [phone, setPhone] = useState('')
  const [regularMode, setRegularMode] = useState(false)
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const navigate = useNavigate()

  const [checked, setChecked] = useState(false)
  console.log('checked', checked)

  useEffect(() => {
    getPartners()
  }, [])

  const getPartners = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getCustomers', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data', data)
        if (data.token) {
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

  // const addProduct = () => {
  //   if (customer.trim() && code.trim()) {
  //     const newProduct: SetCustomer = {
  //       id: customerDetails.length + 1, // You might want to handle ID generation differently
  //       createdAt: new Date().toISOString(), // Set default values for required fields
  //       createdBy: 'currentUser ', // Replace with actual user info if available
  //       refAddress: address,
  //       refCode: code,
  //       refCustId: '', // Set appropriate value
  //       refCustomerId: customerDetails.length + 1, // Or however you want to generate this
  //       refCustomerName: customer,
  //       refCustomerType: regularMode,
  //       refDummy4: '', // Set appropriate value
  //       refDummy5: '', // Set appropriate value
  //       refNotes: notes,
  //       refPhone: phone,
  //       updatedAt: new Date().toISOString(), // Set default values for required fields
  //       updatedBy: 'currentUser ' // Replace with actual user info if available
  //     }

  //     const newProducts = [...customerDetails, newProduct]
  //     console.log('newProducts', newProducts)

  //     setCustomersDetails(newProducts)
  //     // localStorage.setItem("vendors", JSON.stringify(newProducts));
  //     try {
  //       axios
  //         .post(
  //           import.meta.env.VITE_API_URL + '/Routes/addCustomer',
  //           {
  //             customerName: customer,
  //             customerCode: code,
  //             customerType: regularMode,
  //             notes: notes,
  //             refAddress: address,
  //             refPhone: phone
  //           },
  //           {
  //             headers: {
  //               Authorization: localStorage.getItem('JWTtoken')
  //             }
  //           }
  //         )
  //         .then((res) => {
  //           const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
  //           console.log('data', data)
  //           if (data.success) {
  //             getPartners()
  //           }
  //         })
  //         .catch((error) => {
  //           console.error('Error fetching vendor details:', error)
  //         })
  //     } catch (error) {
  //       console.error(error)
  //     }
  //     setCustomer('')
  //     setCode('')
  //     setShowInputSection(false)
  //   }
  // }

  const addProduct = () => {
    if (customer.trim() && code.trim()) {
      // Check for duplicates based on customer name and code
      const isDuplicate = customerDetails.some(
        (item) =>
          item.refCustomerName.toLowerCase() === customer.trim().toLowerCase() &&
          item.refCode.toLowerCase() === code.trim().toLowerCase()
      )

      if (isDuplicate) {
        alert('Customer with the same name and code already exists.')
        return
      }

      const newProduct: SetCustomer = {
        id: customerDetails.length + 1,
        createdAt: new Date().toISOString(),
        createdBy: 'currentUser ',
        refAddress: address,
        refCode: code,
        refCustId: '',
        refCustomerId: customerDetails.length + 1,
        refCustomerName: customer,
        refCustomerType: regularMode,
        refDummy4: '',
        refDummy5: '',
        refNotes: notes,
        refPhone: phone,
        updatedAt: new Date().toISOString(),
        updatedBy: 'currentUser '
      }

      const newProducts = [...customerDetails, newProduct]
      setCustomersDetails(newProducts)

      try {
        axios
          .post(
            import.meta.env.VITE_API_URL + '/Routes/addCustomer',
            {
              customerName: customer,
              customerCode: code,
              customerType: regularMode,
              notes: notes,
              refAddress: address,
              refPhone: phone
            },
            {
              headers: {
                Authorization: localStorage.getItem('JWTtoken')
              }
            }
          )
          .then((res) => {
            const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
            if (data.token) {
              if (data.success) {
                localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
                getPartners()
              }
            } else {
              navigate('/login')
            }
          })
          .catch((error) => {
            console.error('Error adding vendor:', error)
          })
      } catch (error) {
        console.error(error)
      }

      // Reset inputs
      setCustomer('')
      setCode('')
      setPhone('')
      setAddress('')
      setNotes('')
      setRegularMode(false)
      setShowInputSection(false)
    }
  }

  const header = (
    <>
      <div className="flex flex-wrap gap-2 align-items-center justify-content-end">
        <Button
          label="Add"
          severity="success"
          onClick={() => setShowInputSection(!showInputSection)}
        />
      </div>
      {showInputSection && (
        <div className="flex flex-column mt-3 gap-2">
          <Divider />
          <div className="flex flex-column gap-2">
            <div className="flex gap-2">
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                  <UsersRound size={20} />{' '}
                </span>
                <InputText
                  placeholder="Customers"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
              </div>
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                  <FileJson size={20} />{' '}
                </span>
                <InputText
                  placeholder="Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                  <Phone size={20} />
                </span>
                <InputText
                  placeholder="Phone"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value
                    if (/^\d*$/.test(value)) {
                      setPhone(value)
                    }
                  }}
                />
              </div>
              <div className="p-inputgroup flex-1 align-items-center justify-content-between">
                <p>{regularMode ? 'Regular' : 'Walk-In'}</p>
                <InputSwitch checked={regularMode} onChange={(e) => setRegularMode(e.value)} />
              </div>
            </div>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <LocateFixed size={20} />
              </span>
              <InputText
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <FolderOpen size={20} />{' '}
              </span>
              <InputText
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3 align-items-center justify-content-end">
            <Button label="Add" severity="info" onClick={addProduct} />
            <Button label="Cancel" severity="danger" onClick={() => setShowInputSection(false)} />
          </div>
          <Divider />
        </div>
      )}
    </>
  )

  const customerTypeTemplate = (rowData) => {
    return (
      <div className="flex align-items-center justify-content-center">
        <InputSwitch checked={rowData.refCustomerType} onChange={(e) => setChecked(e.value)} />
      </div>
    )
  }
  return (
    <div>
      <h3>Customers</h3>
      <DataTable
        scrollable
        stripedRows
        className="partnersVendorId"
        value={customerDetails}
        header={header}
        showGridlines
      >
        <Column field="id" header="S.No" body={(_, rowIndex) => rowIndex.rowIndex + 1}></Column>
        <Column
          field="refCustomerName"
          frozen
          header="Customers"
          style={{ minWidth: '20rem' }}
        ></Column>
        <Column field="refCode" header="Code" style={{ minWidth: '7rem' }}></Column>
        <Column field="refPhone" header="Phone" style={{ minWidth: '10rem' }}></Column>
        <Column field="refAddress" header="Address" style={{ minWidth: '16rem' }}></Column>
        <Column field="refNotes" header="Notes" style={{ minWidth: '10rem' }}></Column>
        <Column
          field="code"
          header="Reg / Walk"
          body={customerTypeTemplate}
          style={{ minWidth: '10rem' }}
        ></Column>
      </DataTable>
    </div>
  )
}

export default VendorSidebar
