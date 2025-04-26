import React from 'react'
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import axios from 'axios'
import decrypt from '@renderer/helper'

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
      .get(import.meta.env.VITE_API_URL + '/route/listFinance', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data line 33 ======== ', data)
        setProducts(data.data)
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  useEffect(() => {
    getFinanceDetails()
  }, [])
  useEffect(() => {
    const storedData = localStorage.getItem('balanceStaticData')
    if (storedData) {
      setProducts(JSON.parse(storedData))
    } else {
      const staticData = [
        {
          id: '1',
          code: '1',
          name: 'Lakshmi Super Market',
          invoice: 'INV1000',
          outstanding: 12000,
          payAmount: '',
          balance: 12000 // Initial balance equals outstanding
        },
        {
          id: '2',
          code: '2',
          name: 'SKM Shop',
          invoice: 'INV1001',
          outstanding: 8500,
          payAmount: '',
          balance: 8500
        },
        {
          id: '3',
          code: '3',
          name: 'SCM Shop',
          invoice: 'INV1002',
          outstanding: 13000,
          payAmount: '',
          balance: 13000
        },
        {
          id: '4',
          code: '4',
          name: 'Valli Exports',
          invoice: 'INV1003',
          outstanding: 9500,
          payAmount: '',
          balance: 9500
        },
        {
          id: '5',
          code: '5',
          name: 'Ram Textiles',
          invoice: 'INV1004',
          outstanding: 11000,
          payAmount: '',
          balance: 11000
        }
      ]
      console.log('staticData', staticData)
      // setProducts(staticData)
    }
  }, [])

  // Handle Pay Amount Change
  // const handlePayChange = (e, rowData) => {
  //   let inputValue = e.target.value
  //   let payValue = parseFloat(inputValue) || 0

  //   let updatedProducts = products.map((product) => {
  //     if (product.id === rowData.id) {
  //       let outstanding = product.outstanding ?? 0
  //       let newBalance =
  //         payValue > outstanding ? `+ ${payValue - outstanding}` : outstanding - payValue

  //       return { ...product, payAmount: inputValue, balance: newBalance }
  //     }
  //     return product
  //   })

  //   console.log('updatedProducts', updatedProducts)
  //   setProducts(updatedProducts)
  //   localStorage.setItem('balanceStaticData', JSON.stringify(updatedProducts))
  // }
  const handlePayChange = (e, rowData) => {
    let inputValue = e.target.value
    let payValue = parseFloat(inputValue) || 0

    let updatedProducts = products.map((product) => {
      if (product.id === rowData.id) {
        let outstanding = product.outstanding ?? 0
        let newBalance =
          payValue > outstanding ? `+ ${payValue - outstanding}` : outstanding - payValue

        return {
          ...product,
          payAmount: inputValue,
          balance: newBalance
        }
      }
      return product
    })

    setProducts(updatedProducts as staticData[])
    localStorage.setItem('balanceStaticData', JSON.stringify(updatedProducts))
  }

  // Handle Payment Confirmation
  const confirmPayment = () => {
    if (!selectedProduct) return

    const updatedProducts = products.map((product) => {
      if (product.id === selectedProduct.id) {
        return {
          ...product,
          outstanding: Number(product.balance), // update outstanding with the new balance
          payAmount: '' // clear the payAmount field
        }
      }
      return product
    })

    setProducts(updatedProducts)
    localStorage.setItem('balanceStaticData', JSON.stringify(updatedProducts))
    setVisible(false)
    setSelectedProduct(null)
  }

  return (
    <div>
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
            <Column field="outstanding" header="Outstanding" style={{ minWidth: '8rem' }} />
            <Column
              field="payAmount"
              header="Pay Amount"
              body={(rowData) => (
                <InputText
                  type="number"
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
                onClick={confirmPayment}
              />
              <Button
                label="Cash"
                icon="pi pi-money-bill"
                className="p-button-secondary"
                onClick={confirmPayment}
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
