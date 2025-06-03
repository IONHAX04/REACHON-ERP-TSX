import React from 'react'
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import axios from 'axios'
import decrypt from '@renderer/helper'
import { useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'

interface Product {
  id: string
  code: string
  name: string
  invoice: string
  outstanding: number
  payAmount: string
  balance: number
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

// interface FinanceDetailsProps {
//   id: string
//   refCustomerName: string
//   refBalanceAmount: number
//   payAmount?: string
//   outstanding?: number
//   balance?: number
//   createdAt: string
//   createdBy: string
//   deletedAt: string
//   deletedBy: string
//   refAddress: string
//   refCode: string
//   refCustId: string
//   refCustomerId: number
//   refCustomerType: boolean
//   refDummy4: string
//   refDummy5: string
//   refNotes: string
//   refPhone: string
//   updatedAt: string
//   updatedBy: string
// }

interface staticData {
  id: string
  code: string
  name: string
  invoice: string
  outstanding: number
  payAmount: string
  balance: number
}
;[]

const Finance: React.FC = () => {
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)
  const [selectedPaymentType, setSelectedPaymentType] = useState<number | null>(null)
  console.log('selectedPaymentType', selectedPaymentType)

  const [products, setProducts] = useState<staticData[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [visible, setVisible] = useState(false)

  const [user, setUser] = useState<UserDetails>()

  useEffect(() => {
    const storedUser = localStorage.getItem('userDetails')
    console.log('storedUser', storedUser)

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const getFinanceDetails = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Finance/viewFinance', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        if (data.token) {
          console.log('data line 94 ============== > ', data)
          localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
          setProducts(data.result)
        } else {
          navigate('/login')
        }
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  useEffect(() => {
    getFinanceDetails()
  }, [])

  const handlePayChange = (e, rowData) => {
    let inputValue = e.target.value
    let payValue = parseFloat(inputValue) || 0
    const outstanding = rowData.outstanding ?? 0

    if (payValue > outstanding) {
      toast.current?.show({
        severity: 'error',
        summary: 'Amount Exceeded',
        detail: 'Pay amount cannot exceed outstanding amount.',
        life: 3000
      })
      return
    }

    const newBalance = outstanding - payValue

    const updatedProducts = products.map((product) =>
      product.id === rowData.id
        ? { ...product, payAmount: inputValue, balance: newBalance }
        : product
    )

    setProducts(updatedProducts)
    localStorage.setItem('balanceStaticData', JSON.stringify(updatedProducts))
  }

  // Handle Payment Confirmation
  const confirmPayment = (paymentType: number) => {
    if (!selectedProduct) return

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/Finance/markPaid`,
        {
          refCustomerName: selectedProduct.name,
          payAmount: parseFloat(selectedProduct.payAmount),
          paymentType
        },
        {
          headers: { Authorization: localStorage.getItem('JWTtoken') }
        }
      )
      .then((res) => {
        console.log('res', res)
        toast.current?.show({
          severity: 'success',
          summary: 'Payment Success',
          detail: 'Amount has been marked as paid.',
          life: 3000
        })
        getFinanceDetails()
        setVisible(false)
        setSelectedProduct(null)
      })
      .catch((err) => {
        console.error(err)
        toast.current?.show({
          severity: 'error',
          summary: 'Payment Failed',
          detail: 'Error marking payment.',
          life: 3000
        })
      })
  }

  return (
    <div>
      <Toast ref={toast} />
      <div>
        <div className="primaryNav">
          <p>Finance</p>
          <p className="">Logged in as: {user?.userTypeName}</p>
        </div>
        <div className="financeContents m-3">
          <DataTable value={products} dataKey="id" showGridlines stripedRows>
            <Column
              header="S.No"
              frozen
              body={(_, { rowIndex }) => rowIndex + 1}
              style={{ minWidth: '3rem' }}
            />
            <Column field="name" header="Name" frozen style={{ minWidth: '14rem' }} />
            <Column
              field="paymentid"
              header="Payment Type"
              frozen
              style={{ minWidth: '14rem' }}
              body={(rowData) => {
                switch (rowData.paymentid) {
                  case 1:
                    return 'Cash'
                  case 2:
                    return 'Gpay'
                  case 3:
                    return 'Credited Customer'
                  default:
                    return 'Unknown'
                }
              }}
            />

            <Column field="outstanding" header="Outstanding" style={{ minWidth: '8rem' }} />
            <Column
              field="payAmount"
              header="Pay Amount"
              body={(rowData) => (
                <InputText
                  type="number"
                  disabled={rowData.paymentid !== 3}
                  value={rowData.payAmount}
                  onChange={(e) => handlePayChange(e, rowData)}
                />
              )}
              style={{ minWidth: '8rem' }}
            />
            <Column field="balance" header="Balance Amount" style={{ minWidth: '8rem' }} />
            <Column
              header="Action"
              body={(rowData) => (
                <Button
                  label="Pay"
                  className="p-button-success"
                  onClick={() => {
                    setSelectedProduct(rowData)
                    setVisible(true)
                  }}
                />
              )}
              style={{ minWidth: '8rem' }}
            />
          </DataTable>
        </div>

        {/* Payment Modal */}
        <Dialog
          visible={visible}
          onHide={() => setVisible(false)}
          header="Select Payment Method"
          footer={
            <>
              <Button
                label="GPay"
                icon="pi pi-wallet"
                className="p-button-primary"
                onClick={() => {
                  setSelectedPaymentType(2)
                  confirmPayment(2)
                }}
              />
              <Button
                label="Cash"
                icon="pi pi-money-bill"
                className="p-button-secondary"
                onClick={() => {
                  setSelectedPaymentType(1)
                  confirmPayment(1)
                }}
              />
            </>
          }
        >
          <p>Choose a payment method for {selectedProduct?.name}.</p>
        </Dialog>
      </div>
    </div>
  )
}

export default Finance
