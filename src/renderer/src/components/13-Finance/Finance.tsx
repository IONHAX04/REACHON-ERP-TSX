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

interface FinanceDetailsProps {
  id: string
  refCustomerName: string
  refBalanceAmount: number
  payAmount?: string
  outstanding?: number
  balance?: number
  createdAt: string
  createdBy: string
  deletedAt: string
  deletedBy: string
  refAddress: string
  refCode: string
  refCustId: string
  refCustomerId: number
  refCustomerType: boolean
  refDummy4: string
  refDummy5: string
  refNotes: string
  refPhone: string
  updatedAt: string
  updatedBy: string
}

const Finance: React.FC = () => {
  const [products, setProducts] = useState<FinanceDetailsProps[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [visible, setVisible] = useState(false)

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

    setProducts(updatedProducts as FinanceDetailsProps[])
    localStorage.setItem('balanceStaticData', JSON.stringify(updatedProducts))
  }

  // Handle Payment Confirmation
  const confirmPayment = () => {
    if (!selectedProduct) return

    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id ? { ...product, outstanding: product.balance } : product
    )

    setProducts(updatedProducts)
    localStorage.setItem('balanceStaticData', JSON.stringify(updatedProducts))
    setVisible(false)
  }

  return (
    <div>
      <div>
        <div className="primaryNav">
          <p>Finance</p>
          <p>Logged in as: Admin</p>
        </div>
        <div className="financeContents m-3">
          <DataTable value={products} dataKey="id" showGridlines stripedRows>
            <Column
              header="S.No"
              frozen
              body={(_, { rowIndex }) => rowIndex + 1}
              style={{ minWidth: '3rem' }}
            />
            <Column field="refCustomerName" header="Name" frozen style={{ minWidth: '14rem' }} />
            <Column field="refBalanceAmount" header="Outstanding" style={{ minWidth: '8rem' }} />
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
            <Column field="refBalanceAmount" header="Balance Amount" style={{ minWidth: '8rem' }} />
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
