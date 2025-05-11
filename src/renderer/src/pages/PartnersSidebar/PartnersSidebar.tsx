import { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import axios from 'axios'
import decrypt from '../../helper'
import { useNavigate } from 'react-router-dom'

interface PartnersProps {
  createdAt: string
  createdBy: string
  deletedAt: string
  deletedBy: string
  isDelete: boolean
  partnersId: number
  partnersName: string
  phoneNumber: string
  validity: string
}

const PartnersSidebar: React.FC = () => {
  const navigate = useNavigate()
  const [partnerDetails, setPartnerDetails] = useState([])
  const [showInputSection, setShowInputSection] = useState(false)
  const [partners, setPartners] = useState('')
  const [contactDetails, setContactDetails] = useState('')
  const [validity, setValidity] = useState('')
  const [editingPartner, setEditingPartner] = useState<PartnersProps | null>(null)

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
        if (data.token) {
          console.log('data', data)
          setPartnerDetails(data.partners)
          localStorage.setItem('JWTtoken', 'Bearer ' + data.token)
        } else {
          navigate('/login')
        }
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
    console.log('partnerDetails', editingPartner)
    if (partners.trim()) {
      axios
        .post(
          import.meta.env.VITE_API_URL + '/updateRoutes/updatePartners',
          {
            partnersName: partners,
            validity: validity,
            phoneNumber: contactDetails,
            partnerId: editingPartner?.partnersId
          },
          {
            headers: { Authorization: localStorage.getItem('JWTtoken') }
          }
        )
        .then((res) => {
          const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
          if (data.success) {
            getPartners()
          }
        })
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
      {showInputSection && (
        <div className="flex mt-3 gap-2">
          <InputText
            placeholder="Partners"
            value={partners}
            disabled
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
  const handleDelete = (partnerId: number) => {
    axios
      .post(
        import.meta.env.VITE_API_URL + '/updateRoutes/deletePartners',
        { partnerId: partnerId },
        {
          headers: { Authorization: localStorage.getItem('JWTtoken') }
        }
      )
      .then((res) => {
        const data = decrypt(res.data[1], res.data[0], import.meta.env.VITE_ENCRYPTION_KEY)
        if (data.success) {
          getPartners()
        }
      })
      .catch((error) => console.error('Error deleting partner:', error))
  }

  const actionTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        rounded
        outlined
        text
        severity="info"
        icon="pi pi-pencil"
        onClick={() => handleEdit(rowData)}
      />
      <Button
        rounded
        outlined
        text
        severity="danger"
        icon="pi pi-trash"
        onClick={() => handleDelete(rowData.partnersId)}
      />
    </div>
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
