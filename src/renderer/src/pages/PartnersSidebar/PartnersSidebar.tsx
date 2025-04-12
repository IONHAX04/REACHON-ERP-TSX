import { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import axios from 'axios'
import decrypt from '../../helper'

const PartnersSidebar: React.FC = () => {
  const [partnerDetails, setPartnerDetails] = useState([])
  const [showInputSection, setShowInputSection] = useState(false)
  const [partners, setPartners] = useState('')
  const [contactDetails, setContactDetails] = useState('')
  const [validity, setValidity] = useState('')
  const [editingPartner, setEditingPartner] = useState(null)

  useEffect(() => {
    getPartners()
  }, [])

  const getPartners = () => {
    axios
      .get(import.meta.env.VITE_API_URL + '/Routes/getPartner', {
        headers: { Authorization: localStorage.getItem('JWTtoken') }
      })
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        console.log('data', data)
        setPartnerDetails(data.partners)
      })
      .catch((error) => {
        console.error('Error fetching vendor details:', error)
      })
  }

  const handleEdit = (partner) => {
    setPartners(partner.partnersName)
    setContactDetails(partner.phoneNumber)
    setValidity(partner.validity)
    setEditingPartner(partner)
    setShowInputSection(true)
  }

  const addOrUpdatePartner = () => {
    if (partners.trim()) {
      axios
        .post(
          import.meta.env.VITE_API_URL + '/Routes/addPartners',
          {
            partnersName: partners,
            validityDate: validity,
            mobileNumber: contactDetails
          },
          {
            headers: { Authorization: localStorage.getItem('JWTtoken') }
          }
        )
        .then(() => getPartners())
        .catch((error) => console.error(error))

      setPartners('')
      setContactDetails('')
      setValidity('')
      setEditingPartner(null)
      setShowInputSection(false)
    }
  }

  const header = (
    <>
      <div className="flex flex-wrap gap-2 align-items-center justify-content-end">
        <Button
          label="Add"
          severity="success"
          onClick={() => {
            setEditingPartner(null)
            setShowInputSection(!showInputSection)
          }}
        />
      </div>
      {showInputSection && (
        <div className="flex mt-3 gap-2">
          <InputText
            placeholder="Partners"
            value={partners}
            onChange={(e) => setPartners(e.target.value)}
          />
          <InputText
            placeholder="Contact"
            value={contactDetails}
            onChange={(e) => setContactDetails(e.target.value)}
          />
          <InputText
            placeholder="Validity"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
          />
          <Button
            label={editingPartner ? 'Update' : 'Add'}
            severity="info"
            onClick={addOrUpdatePartner}
          />
          <Button label="Cancel" severity="danger" onClick={() => setShowInputSection(false)} />
        </div>
      )}
    </>
  )

  const actionTemplate = (rowData) => (
    <Button
      rounded
      outlined
      text
      severity="info"
      icon="pi pi-pencil"
      onClick={() => handleEdit(rowData)}
    />
  )
  return (
    <div>
      <div>
        <h3>Partners</h3>
        <DataTable scrollable stripedRows value={partnerDetails} header={header} showGridlines>
          <Column field="id" header="S.No" body={(_, rowIndex) => rowIndex.rowIndex + 1}></Column>
          <Column field="partnersName" header="Partners"></Column>
          <Column field="phoneNumber" header="Contact"></Column>
          <Column field="validity" header="Validity"></Column>
          <Column field="edit" header="Actions" body={actionTemplate}></Column>
        </DataTable>
      </div>
    </div>
  )
}

export default PartnersSidebar
