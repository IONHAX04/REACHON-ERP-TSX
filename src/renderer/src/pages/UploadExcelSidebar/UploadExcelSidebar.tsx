import React from 'react'
import { Toolbar } from 'primereact/toolbar'
import { Button } from 'primereact/button'
import { FileUpload } from 'primereact/fileupload'
import { InputSwitch } from 'primereact/inputswitch'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useState, useRef } from 'react'
import { Toast } from 'primereact/toast'
import * as XLSX from 'xlsx'

// import sampleExcel from '@/src/renderer/src/assets/excel/sample.xlsx'
import axios from 'axios'
import decrypt from '../../helper'

interface SetJsonData {
  purchasedDate: string
  vendor: string
  vendorLeaf: string
}

const UploadExcelSidebar: React.FC = () => {
  const [checked, setChecked] = useState(false)
  const [uploadedData, setUploadedData] = useState<SetJsonData[] | null>(null)
  const [isDuplicateFound, setIsDuplicateFound] = useState(false)
  const toast = useRef<Toast>(null)

  const leftToolbarTemplate = () => (
    <div className="flex flex-wrap gap-2">
      <p>
        Download your sample excel sheet for reference & you can upload the leaf for further
        transactions
      </p>
    </div>
  )

  const formatExcelDate = (excelDate) => {
    if (!excelDate) return ''

    if (typeof excelDate === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(excelDate)) {
      const [day, month, year] = excelDate.split('-')
      return `${year}-${month}-${day}`
    }

    if (!isNaN(excelDate)) {
      const date = new Date((excelDate - 25569) * 86400 * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    }

    return excelDate
  }

  const checkRequiredColumns = (data) => {
    const requiredColumns = ['vendorLeaf', 'vendor', 'purchasedDate']
    const headers = data[0] ? Object.keys(data[0]) : []

    for (let col of requiredColumns) {
      if (!headers.includes(col)) {
        toast.current?.show({
          severity: 'error',
          summary: 'Missing Columns',
          detail: `The column "${col}" is missing from the Excel file.`,
          life: 3000
        })
        return false
      }
    }
    return true
  }

  const onUploadHandler = (event) => {
    const file = event.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const result = e?.target?.result
        if (!result) throw new Error('File could not be read')

        const data = new Uint8Array(result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        let jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { raw: false })

        // Check for required columns
        if (!checkRequiredColumns(jsonData)) return

        const leafIdSet = new Map()
        const vendorIdSet = new Map()
        let duplicateFound = false

        jsonData = jsonData.map((row, index) => {
          const formattedRow = { ...row }

          // Format the purchasedDate column to yyyy-mm-dd
          if (formattedRow.purchasedDate) {
            formattedRow.purchasedDate = formatExcelDate(formattedRow.purchasedDate)
          }

          const leafId = formattedRow['leafId']
          const vendorId = formattedRow['vendorLeaf']

          if (leafId) {
            if (leafIdSet.has(leafId)) {
              const prevIndex = leafIdSet.get(leafId)
              jsonData[prevIndex].duplicate = true
              formattedRow.duplicate = true
              duplicateFound = true
            }
            leafIdSet.set(leafId, index)
          }

          if (vendorId) {
            if (vendorIdSet.has(vendorId)) {
              const prevIndex = vendorIdSet.get(vendorId)
              jsonData[prevIndex].duplicate = true
              formattedRow.duplicate = true
              duplicateFound = true
            }
            vendorIdSet.set(vendorId, index)
          }

          return formattedRow
        })

        setIsDuplicateFound(duplicateFound)
        console.log('jsonData', jsonData)
        setUploadedData(jsonData as SetJsonData[])
      } catch (error) {
        console.log('error', error)
        toast.current?.show({
          severity: 'error',
          summary: 'Upload Failed',
          detail: 'Invalid file format. Please check the file and try again.',
          life: 3000
        })
      }
    }

    reader.readAsArrayBuffer(file)
  }

  const rowClassName = (rowData) => {
    return rowData.duplicate ? 'p-error' : ''
  }

  const resetUpload = () => {
    setUploadedData(null)
    setIsDuplicateFound(false)
  }

  const uploadToConsole = () => {
    if (uploadedData) {
      console.log('uploadedData', uploadedData)
      console.log('Payload:', JSON.stringify(uploadedData, null, 2))

      // localStorage.setItem("uploadedExcel", JSON.stringify(uploadedData));
      axios
        .post(
          import.meta.env.VITE_API_URL + '/routes/addMapping',
          {
            mappingData: uploadedData
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
              summary: 'Upload Successful',
              detail: 'Data has been successfully uploaded.',
              life: 3000
            })
          } else {
            toast.current?.show({
              severity: 'error',
              summary: 'Error Occured',
              detail: data.message,
              life: 3000
            })
          }
        })
        .catch((error) => {
          console.error('Error fetching vendor details:', error)
        })

      resetUpload()
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Upload Failed',
        detail: 'No data found to upload.',
        life: 3000
      })
    }
  }

  const downloadSampleExcel = () => {
    const excelURL = '../../../public/excel/sample.xlsx'

    fetch(excelURL)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'sample.xlsx' // Specify the filename
        link.click() // Trigger the download
      })
      .catch((err) => console.error('Error downloading the Excel file:', err))
  }

  const formatHeader = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  return (
    <div>
      {' '}
      <div>
        <Toast ref={toast} />

        <Toolbar className="mb-2 mt-2" left={leftToolbarTemplate}></Toolbar>

        {!uploadedData ? (
          <>
            <div className="flex align-items-center">
              <Button icon="pi pi-download" rounded text onClick={downloadSampleExcel} />
              <p>Download Bulk Upload Sample Excel</p>
            </div>
            <div className="flex align-items-center mt-2 mb-2">
              <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
              <p>Upload Excel</p>
            </div>
            <FileUpload
              name="demo"
              disabled={!checked || isDuplicateFound}
              url={'/api/upload'}
              accept=".xls,.xlsx,.csv"
              maxFileSize={1000000}
              multiple={false}
              customUpload
              uploadHandler={onUploadHandler}
              emptyTemplate={
                <p className="m-0">Drag and drop an Excel or CSV file here to upload.</p>
              }
            />
          </>
        ) : (
          <div>
            <DataTable
              className="uploadDataTable"
              value={uploadedData}
              paginator
              rows={10}
              showGridlines
              rowClassName={rowClassName}
            >
              <Column header="S.No" body={(_rowData, { rowIndex }) => rowIndex + 1} />
              {uploadedData &&
                Object.keys(uploadedData[0]).map((key, index) => (
                  <Column key={index} field={key} header={formatHeader(key)} />
                ))}
            </DataTable>

            <div className="mt-2">
              <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-danger"
                onClick={resetUpload}
              />
              <Button
                label="Upload"
                icon="pi pi-cloud-upload"
                className="p-button-success ml-2"
                onClick={uploadToConsole}
                disabled={isDuplicateFound}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadExcelSidebar
