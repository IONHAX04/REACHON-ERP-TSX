import decrypt from '@renderer/helper'
import axios from 'axios'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { FileUpload } from 'primereact/fileupload'
import { InputSwitch } from 'primereact/inputswitch'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import * as XLSX from 'xlsx'

interface UploadExcelSidebarProps {
  setVisibleRight: React.Dispatch<React.SetStateAction<boolean>>
}

interface SetJsonData {
  purchasedDate: string
  vendor: string
  vendorLeaf: string
}

const BulkParcelBooking: React.FC<UploadExcelSidebarProps> = ({ setVisibleRight }) => {
  const toast = useRef<Toast>(null)
  const navigate = useNavigate()

  const [checked, setChecked] = useState(false)
  const [uploadedData, setUploadedData] = useState<SetJsonData[] | null>(null)
  const [isDuplicateFound, setIsDuplicateFound] = useState(false)

  const checkRequiredColumns = (data) => {
    const requiredColumns = [
      'DSR_BRANCH_CODE',
      'DSR_CNNO',
      'DSR_CUST_CODE',
      'DSR_BOOKING_DATE'
      // Add any other required columns here
    ]
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

  const formatHeader = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
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

        // Extract first row as headers
        const headers = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 })[0]
        const interfaceFields = headers.map((h) => {
          const cleanKey = h.trim().replace(/\s+/g, '_')
          return `  ${cleanKey}: string`
        })

        const tsInterface = `interface SetJsonData {\n${interfaceFields.join('\n')}\n}`
        console.log('Generated Interface:\n' + tsInterface)

        console.log('Generated Interface:\n' + tsInterface)

        // Proceed with JSON conversion
        let jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { raw: false })

        // Optional: Run validation & duplicate checks
        if (!checkRequiredColumns(jsonData)) return

        let duplicateFound = false

        jsonData = jsonData.map((row, _index) => {
          const formattedRow = { ...row }

          if (formattedRow.purchasedDate) {
            formattedRow.purchasedDate = formatExcelDate(formattedRow.purchasedDate)
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

  const leftToolbarTemplate = () => (
    <div className="flex flex-wrap gap-2">
      <p>
        Download your sample excel sheet for reference & you can upload the leaf for further
        transactions
      </p>
    </div>
  )

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

      axios
        .post(
          import.meta.env.VITE_API_URL + '/route/bulkUpdateBooking',
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
          if (data.token) {
            localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
            if (data.success) {
              toast.current?.show({
                severity: 'success',
                summary: 'Upload Successful',
                detail: 'Data has been successfully uploaded.',
                life: 3000
              })
              setTimeout(() => {
                setVisibleRight(false)
                resetUpload()
              }, 3000)
            } else {
              toast.current?.show({
                severity: 'error',
                summary: 'Error Occured',
                detail: data.message,
                life: 3000
              })
            }
          } else {
            navigate('/login')
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

  return (
    <div>
      Bulk Update progress
      <Toast ref={toast} />
      <Toolbar className="mb-2 mt-2" left={leftToolbarTemplate}></Toolbar>
      {!uploadedData ? (
        <>
          <div className="flex align-items-center">
            {/* <Button icon="pi pi-download" rounded text onClick={downloadSampleExcel} /> */}
            <p className="ml-2">Download Bulk Upload Sample Excel for DTDC</p>
          </div>
          <div className="flex align-items-center">
            {/* <Button icon="pi pi-download" rounded text onClick={downloadSampleExcelDelhivery} /> */}
            <p>Download Bulk Upload Sample Excel for Delhivery</p>
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
            rowsPerPageOptions={[10, 25, 50, 100]}
            showGridlines
            stripedRows
            rowClassName={rowClassName}
          >
            <Column header="S.No" body={(_rowData, { rowIndex }) => rowIndex + 1} />
            {uploadedData &&
              Object.keys(uploadedData[0]).map((key, index) => (
                <Column
                  key={index}
                  field={key}
                  header={formatHeader(key)}
                  style={{ minWidth: '18rem' }}
                />
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
  )
}

export default BulkParcelBooking
