import React from 'react'
import { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import axios from 'axios'
import decrypt from '../../helper'

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
}

const CategoriesSidebar: React.FC = () => {
  const [showInputSection, setShowInputSection] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [newCategory, setNewCategory] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [subCategory, setSubCategory] = useState('')
  const [data, setData] = useState<SubCategory[]>([])

  useEffect(() => {
    getCategory()
    getSubCategory()
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]')
    setCategories(storedCategories)
    const storedData = JSON.parse(localStorage.getItem('subCategories') || '[]')
    setData(storedData)
  }, [])

  const getCategory = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getCategory', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data line 62', data)
        setCategories(data.Category)
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
        console.log('data line 62-------', data)
        setData(data.SubCategory)
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  const handleDropdownChange = (e) => {
    if (e.value.id === 'add_new') {
      setShowInput(true)
      setSelectedCategory(null)
    } else {
      setSelectedCategory(e.value)
      setShowInput(false)
    }
  }

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      // const updatedCategories = [
      //   ...categories,
      //   { name: newCategory, id: categories.length + 1 },
      // ];
      axios
        .post(
          import.meta.env.VITE_API_URL + '/Routes/addCategory',
          {
            category: newCategory
          },
          {
            headers: { Authorization: localStorage.getItem('JWTtoken') }
          }
        )
        .then((res) => {
          const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
          console.log('data - line 60', data)
          if (data.success) {
            getCategory()
          }
        })
        .catch((error) => {
          console.error('Error fetching vendor details:', error)
        })
      // setCategories(updatedCategories);
      // localStorage.setItem("categories", JSON.stringify(updatedCategories));
      setNewCategory('')
      setShowInput(false)
    }
  }

  const handleAddSubCategory = () => {
    console.log('selectedCategory', selectedCategory)
    console.log('selectedCategory && subCategory.trim()', selectedCategory && subCategory.trim())
    if (selectedCategory) {
      const newData = [
        ...data,
        { id: data.length + 1, category: selectedCategory.name, subCategory }
      ]

      console.log('selectedCategory line 107', selectedCategory)
      axios
        .post(
          import.meta.env.VITE_API_URL + '/Routes/addSubCategory',
          {
            categoryId: selectedCategory.refCategoryId,
            subcategory: subCategory
          },
          {
            headers: { Authorization: localStorage.getItem('JWTtoken') }
          }
        )
        .then((res) => {
          const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
          console.log('data - line 60', data)
          if (data.success) {
            getCategory()
            getSubCategory()
          }
        })
        .catch((error) => {
          console.error('Error fetching vendor details:', error)
        })
      console.log('newData', newData)
      setData(newData)
      // localStorage.setItem("subCategories", JSON.stringify(newData));
      setSubCategory('')
    }
  }

  const categoryOptions = [
    ...(categories || []),
    { refCategory: 'Add New Category', id: 'add_new' }
  ]

  const representativeBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{rowData.refCategory}</span>
      </div>
    )
  }

  // const quantityTemplate = (rowData) => (
  //   <Button
  //     rounded
  //     outlined
  //     text
  //     severity="info"
  //     icon="pi pi-pencil"
  //     onClick={() => console.log('Edit quantity for', rowData.id)}
  //   />
  // )

  return (
    <div>
      <h3>Categories</h3>
      <div className="flex flex-wrap gap-2 mb-3 align-items-center justify-content-end">
        <Button
          label="Add"
          severity="success"
          onClick={() => setShowInputSection(!showInputSection)}
        />
      </div>
      {showInputSection && (
        <div className="flex flex-column mb-3 gap-2">
          <Divider />
          <div className="flex align-items-center gap-2">
            <p>Categories:</p>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi "></i>
              </span>
              <Dropdown
                value={selectedCategory}
                onChange={handleDropdownChange}
                options={categoryOptions}
                optionLabel="refCategory"
                filter
                placeholder="Select Category"
                style={{ maxWidth: '14rem' }}
                checkmark={true}
                highlightOnSelect={false}
              />
            </div>
            {showInput && (
              <div className="flex flex-1 align-items-center gap-2">
                <InputText
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category"
                />
                <Button label="Add" icon="pi pi-check" onClick={handleAddCategory} />
              </div>
            )}
          </div>
          <div className="flex align-items-center gap-2">
            <p>Sub-Categories:</p>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi "></i>
              </span>
              <InputText
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="Add Sub Category"
                style={{ maxWidth: '14rem' }}
              />
            </div>
          </div>
          <div className="flex gap-3 align-items-center justify-content-end">
            <Button label="Add" severity="info" onClick={handleAddSubCategory} />
            <Button label="Cancel" severity="danger" onClick={() => setShowInputSection(false)} />
          </div>
          <Divider />
        </div>
      )}
      <DataTable
        value={data}
        showGridlines
        stripedRows
        scrollable
        scrollHeight="400px"
        rowGroupMode="rowspan"
        groupRowsBy="refCategory"
        sortMode="single"
        sortField="refCategory"
        sortOrder={1}
      >
        <Column
          header="S.No"
          headerStyle={{ width: '3rem' }}
          body={(_data, options) => options.rowIndex + 1}
        ></Column>
        <Column
          field="refCategory"
          header="Category"
          body={representativeBodyTemplate}
          style={{ minWidth: '200px' }}
        ></Column>
        <Column field="refSubCategory" header="Sub Category" style={{ minWidth: '200px' }}></Column>
        {/* <Column field="edit" header="Actions" style={{ width: '4rem' }} body={quantityTemplate} /> */}
      </DataTable>
    </div>
  )
}

export default CategoriesSidebar
