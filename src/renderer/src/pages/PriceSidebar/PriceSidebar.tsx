import React from 'react'
import { Dropdown } from 'primereact/dropdown'
import { useState, useEffect } from 'react'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { MultiSelect } from 'primereact/multiselect'
import { InputSwitch } from 'primereact/inputswitch'
import {
  Minimize2,
  Maximize2,
  IndianRupee,
  PencilRuler,
  Ruler,
  ArrowUpFromLine
} from 'lucide-react'
import axios from 'axios'
import decrypt from '../../helper'

type Partner = {
  partnersId: number
  partnersName: string
  name: string // if you're using partner.name elsewhere
}

type Product = {
  id: number
  partner: string
  minWeight: string
  maxWeight: string
  price: string
  length: string
  breadth: string
  height: string
  partnersName?: string // this may be used in filter
}

const PriceSidebar: React.FC = () => {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [partners, setPartners] = useState<Partner[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedPartners, setSelectedPartners] = useState<Partner[]>([])
  const [minWeight, setMinWeight] = useState('')
  const [maxWeight, setMaxWeight] = useState('')
  const [price, setPrice] = useState('')
  const [checked, setChecked] = useState(false)
  const [length, setLength] = useState('')
  const [breadth, setBreadth] = useState('')
  const [height, setHeight] = useState('')

  useEffect(() => {
    getPartners()
    getPartnerDetails()
  }, [])

  const getPartners = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getPartner', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data', data)
        localStorage.setItem('JWTtoken', data.token)

        setPartners(data.partners)
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  const getPartnerDetails = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getPricing', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data line 62', data)
        localStorage.setItem('JWTtoken', data.token)

        setProducts(data.price)
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  const addProduct = () => {
    if (!selectedPartner || !minWeight || !maxWeight || !price) {
      alert('Please fill all the fields!')
      return
    }

    if (checked && (!length || !breadth || !height)) {
      alert('Please fill Length, Breadth, and Height if toggle is enabled!')
      return
    }

    const newProduct = {
      id: products.length + 1,
      partner: selectedPartner.name,
      minWeight,
      maxWeight,
      price,
      length: checked ? length : '-',
      breadth: checked ? breadth : '-',
      height: checked ? height : '-'
    }

    console.log('selectedPartner.partnersId', selectedPartner.partnersId)

    if (checked) {
      axios
        .post(
          import.meta.env.VITE_API_URL + '/Routes/addPricing',
          {
            partnersId: selectedPartner.partnersId,
            minWeight: minWeight,
            maxWeight: maxWeight,
            price: price,
            dimension: true,
            length: length,
            breadth: breadth,
            height: height,
            calculation: 'Volume-based',
            answer: 'Yes'
          },
          {
            headers: { Authorization: localStorage.getItem('JWTtoken') }
          }
        )
        .then((res) => {
          const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
          console.log('data', data)
          localStorage.setItem('JWTtoken', data.token)

          getPartnerDetails()
        })
        .catch((error) => {
          console.error('Error fetching vendor details:', error)
        })
    } else {
      axios
        .post(
          import.meta.env.VITE_API_URL + '/Routes/addPricing',
          {
            partnersId: selectedPartner.partnersId,
            minWeight: minWeight,
            maxWeight: maxWeight,
            price: price,
            dimension: false,
            answer: 'Yes'
          },
          {
            headers: { Authorization: localStorage.getItem('JWTtoken') }
          }
        )
        .then((res) => {
          const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
          console.log('data', data)
          localStorage.setItem('JWTtoken', data.token)
        })
        .catch((error) => {
          console.error('Error fetching vendor details:', error)
        })
    }

    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    localStorage.setItem('pricingDetails', JSON.stringify(updatedProducts))

    setMinWeight('')
    setMaxWeight('')
    setPrice('')
    setLength('')
    setBreadth('')
    setHeight('')
  }

  const filteredProducts = selectedPartners.length
    ? products.filter((p) => selectedPartners.some((sp) => sp.partnersName === p.partnersName))
    : products
  return (
    <div>
      <div className="m-4">
        <h3>Pricing</h3>
        <div className="flex align-items-center gap-3">
          <h3>Choose Vendors</h3>
          <Dropdown
            value={selectedPartner}
            onChange={(e) => {
              setSelectedPartner(e.value)
              console.log('Selected Partner refUserId:', e.value.partnersId)
            }}
            options={partners}
            optionLabel="partnersName"
            placeholder="Select a Partner"
            className="w-full md:w-14rem"
          />
        </div>
        <br />
        {selectedPartner && (
          <>
            <Divider />
            <div className="flex flex-column gap-2">
              <div className="flex gap-2 align-items-center">
                {/* Min Weight */}
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <Minimize2 size={16} />
                  </span>
                  <InputText
                    placeholder="Min. Weight"
                    value={minWeight}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^\d*\.?\d{0,3}$/.test(value)) {
                        setMinWeight(value)
                      }
                    }}
                    onBlur={() => {
                      const num = parseFloat(minWeight)
                      if (!isNaN(num)) setMinWeight(num.toFixed(3))
                    }}
                  />
                </div>

                {/* Max Weight */}
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <Maximize2 size={16} />
                  </span>
                  <InputText
                    placeholder="Max. Weight"
                    value={maxWeight}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^\d*\.?\d{0,3}$/.test(value)) {
                        setMaxWeight(value)
                      }
                    }}
                    onBlur={() => {
                      const num = parseFloat(maxWeight)
                      if (!isNaN(num)) setMaxWeight(num.toFixed(3))
                    }}
                  />
                </div>

                {/* Price */}
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <IndianRupee size={16} />
                  </span>
                  <InputText
                    placeholder="Price"
                    value={price}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^\d*$/.test(value)) {
                        setPrice(value)
                      }
                    }}
                  />
                </div>

                <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
              </div>

              {/* Length, Breadth, Height */}
              <div className="flex gap-2">
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <PencilRuler size={16} />
                  </span>
                  <InputText
                    placeholder="Length"
                    value={length}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^\d*\.?\d?$/.test(value)) {
                        setLength(value)
                      }
                    }}
                    onBlur={() => {
                      const num = parseFloat(length)
                      if (!isNaN(num)) setLength(num.toFixed(1))
                    }}
                    disabled={!checked}
                  />
                </div>

                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <Ruler size={16} />
                  </span>
                  <InputText
                    placeholder="Breadth"
                    value={breadth}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^\d*\.?\d?$/.test(value)) {
                        setBreadth(value)
                      }
                    }}
                    onBlur={() => {
                      const num = parseFloat(breadth)
                      if (!isNaN(num)) setBreadth(num.toFixed(1))
                    }}
                    disabled={!checked}
                  />
                </div>

                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <ArrowUpFromLine size={16} />
                  </span>
                  <InputText
                    placeholder="Height"
                    value={height}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^\d*\.?\d?$/.test(value)) {
                        setHeight(value)
                      }
                    }}
                    onBlur={() => {
                      const num = parseFloat(height)
                      if (!isNaN(num)) setHeight(num.toFixed(1))
                    }}
                    disabled={!checked}
                  />
                </div>

                <Button label="Add" severity="success" onClick={addProduct} />
              </div>
            </div>

            <Divider />
          </>
        )}
        <div className="flex w-full justify-content-end">
          <MultiSelect
            value={selectedPartners}
            onChange={(e) => setSelectedPartners(e.value)}
            options={partners}
            optionLabel="partnersName"
            display="chip"
            placeholder="Select Vendors"
            maxSelectedLabels={3}
            className="w-full md:w-14rem"
          />
        </div>
        <DataTable
          scrollable
          stripedRows
          className="partnersVendorId mt-3"
          value={filteredProducts}
          showGridlines
        >
          <Column
            field="id"
            header="S.No"
            style={{ width: '4rem' }}
            body={(_rowData, { rowIndex }) => rowIndex + 1}
          />
          <Column field="partnersName" header="Partner" style={{ width: '10rem' }} />
          <Column field="minWeight" header="Min." style={{ width: '5rem' }} />
          <Column field="maxWeight" header="Max." style={{ width: '5rem' }} />
          <Column field="price" header="Price" style={{ width: '5rem' }} />
          <Column
            field="refLength"
            header="Length"
            style={{ width: '5rem' }}
            body={(rowData) => rowData.refLength || '-'}
          />
          <Column
            field="refBreadth"
            header="Breadth"
            style={{ width: '5rem' }}
            body={(rowData) => rowData.refBreadth || '-'}
          />
          <Column
            field="refHeight"
            header="Height"
            style={{ width: '5rem' }}
            body={(rowData) => rowData.refHeight || '-'}
          />
        </DataTable>
      </div>
    </div>
  )
}

export default PriceSidebar
