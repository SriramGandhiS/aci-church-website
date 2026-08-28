import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import OfficialApplicationForm from '../components/Form/OfficialApplicationForm'
import {
  ArrowLeftIcon,
  CheckIcon,
  AlertCircleIcon,
  DocumentIcon,
  PrintIcon,
  UserCheckIcon
} from '../components/Icons/SvgIcons'
import './AdminApplicationDetailPage.css'

const DEFAULT_APPLICANT_PRESETS = {
  'ACI-2026-000001': {
    personal: {
      salutation: 'Pastor',
      name: 'John Samuel',
      baptismalName: 'John Samuel',
      dob: '1988-05-15',
      nationality: 'Indian',
      gender: 'Male',
      maritalStatus: 'Married',
      photoUrl: '/archbishop_new.jpg',
      applicationDate: '2026-08-27',
      permanentAddress: {
        doorNo: '6/110',
        streetName: 'Melapatty Street',
        cityTown: 'Hanumantharayankottai',
        pincode: '624002',
        taluk: 'Dindigul',
        district: 'Dindigul',
        state: 'Tamil Nadu',
        country: 'India'
      },
      contactAddressSameAsPermanent: true
    },
    spiritual: {
      ministryFunction: 'Pastor',
      otherFunction: '',
      yearStarted: '2012',
      priorDenomination: 'Independent Church'
    },
    affiliation: {
      affiliationType: 'Independent Church',
      trustName: 'Living Word Ministries Trust'
    },
    church: {
      churchName: 'Living Redeemer Apostolic Church',
      doorNo: '12/4A',
      streetName: 'Mission Compound Road',
      cityTown: 'Dindigul',
      pincode: '624001',
      taluk: 'Dindigul',
      district: 'Dindigul',
      state: 'Tamil Nadu',
      country: 'India',
      telephone: '0451 2490100',
      mobileNumber: '9486485810',
      emailId: 'pastor.samuel@gmail.com',
      affiliationType: 'Independent Church',
      registrationNumber: 'TR/ACT/2012/554',
      registrationDate: '2012-04-10'
    },
    milestones: {
      salvationDate: '2004-03-12',
      baptismDate: '2004-08-20',
      holySpiritDate: '2005-01-15',
      ordinationDate: '2015-06-12'
    },
    qualifications: {
      academic: [{ examinationPassed: 'B.Sc Mathematics', year: '2009', institution: 'Madurai Kamaraj University' }],
      theological: [{ examinationPassed: 'Bachelor of Theology (B.Th)', year: '2014', institution: 'Berean Bible Seminary' }]
    },
    family: [{ name: 'Mary Samuel', dob: '1992-08-10', relationship: 'Spouse', professionEducation: 'Teacher' }],
    motivation: { reasonToJoin: 'I am convinced and confirmed of my calling to serve under the episcopal guidance of ACI Diocese.' },
    references: {
      ref1: { name: 'Rev. R. John Durai', phone: '9443210987' },
      ref2: { name: 'Rev. D. Antony Raj', phone: '9876543210' }
    },
    enclosures: {
      proofIdentity: 'Aadhaar_Card_JohnSamuel.pdf',
      proofAddress: 'Ration_Card_Family.pdf',
      proofDob: '10th_Marksheet_TC.pdf',
      passportPhoto: 'Passport_Photo_Attested.jpg',
      ministryStatement: 'Ministry_Field_Work_Summary.pdf',
      churchPhoto: 'Church_Congregation_Photo.jpg',
      ordinationCertificate: 'Ordination_Certificate_2015.pdf'
    }
  },
  'ACI-2026-000002': {
    personal: {
      salutation: 'Pastor',
      name: 'Matthew Raj',
      baptismalName: 'Matthew Raj',
      dob: '1985-11-20',
      nationality: 'Indian',
      gender: 'Male',
      maritalStatus: 'Married',
      photoUrl: '/archbishop_new.jpg',
      applicationDate: '2026-08-27',
      permanentAddress: {
        doorNo: '4/88',
        streetName: 'St. Peter Street, Grace Nagar',
        cityTown: 'Tiruchirappalli',
        taluk: 'Tiruchirappalli',
        district: 'Tiruchirappalli',
        state: 'Tamil Nadu',
        pincode: '620001',
        country: 'India'
      },
      contactAddressSameAsPermanent: true
    },
    spiritual: {
      ministryFunction: 'Pastor',
      otherFunction: '',
      yearStarted: '2010',
      priorDenomination: 'Independent Fellowship'
    },
    affiliation: {
      affiliationType: 'Independent Church',
      trustName: 'Grace Revival Trust'
    },
    church: {
      churchName: 'Grace Revival Apostolic Church',
      doorNo: '14B',
      streetName: 'Cross Road, Cantonment',
      cityTown: 'Tiruchirappalli',
      taluk: 'Tiruchirappalli',
      district: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      pincode: '620001',
      telephone: '0431 2410200',
      mobileNumber: '9842155678',
      emailId: 'pastor.matthew@gmail.com',
      affiliationType: 'Independent Church',
      registrationNumber: 'TR/ACT/2012/554',
      registrationDate: '2012-04-10'
    },
    milestones: {
      salvationDate: '2001-08-14',
      baptismDate: '2001-12-25',
      holySpiritDate: '2002-05-19',
      ordinationDate: '2014-06-15'
    },
    qualifications: {
      academic: [{ examinationPassed: 'B.Com General', year: '2006', institution: 'St. Joseph College, Trichy' }],
      theological: [{ examinationPassed: 'Master of Divinity (M.Div)', year: '2011', institution: 'Southern Asia Bible College' }]
    },
    family: [{ name: 'Rachel Matthew', dob: '1987-04-12', relationship: 'Spouse', professionEducation: 'Worship Leader' }],
    motivation: { reasonToJoin: 'To be united under the apostolic fatherhood of Rt. Rev. S. Johnson Durai.' },
    references: {
      ref1: { name: 'Rev. R. John Durai', phone: '9443210987' },
      ref2: { name: 'Rev. D. Antony Raj', phone: '9876543210' }
    },
    enclosures: {
      proofIdentity: 'Aadhaar_Card_MatthewRaj.pdf',
      proofAddress: 'Ration_Card_Family_TR.pdf',
      proofDob: '10th_Marksheet_TC.pdf',
      passportPhoto: 'Passport_Size_Photo_Attested.jpg',
      ministryStatement: 'One_Page_Ministry_Field_Report.pdf',
      churchPhoto: 'Church_Sanctuary_Members.jpg',
      ordinationCertificate: 'Ordination_Certificate_2014.pdf'
    }
  },
  'ACI-2026-000003': {
    personal: {
      salutation: 'Rev.',
      name: 'Stephen Sundar',
      baptismalName: 'Stephen Sundar',
      dob: '1984-04-18',
      nationality: 'Indian',
      gender: 'Male',
      maritalStatus: 'Married',
      photoUrl: '/archbishop_new.jpg',
      applicationDate: '2026-08-27',
      permanentAddress: {
        doorNo: '12/35',
        streetName: 'Bethel Garden, Main Road',
        cityTown: 'Madurai',
        taluk: 'Madurai North',
        district: 'Madurai',
        state: 'Tamil Nadu',
        pincode: '625002',
        country: 'India'
      },
      contactAddressSameAsPermanent: true
    },
    spiritual: {
      ministryFunction: 'Apostle',
      otherFunction: '',
      yearStarted: '2008',
      priorDenomination: 'Independent Apostolic'
    },
    affiliation: {
      affiliationType: 'Independent Church',
      trustName: 'Bethel Apostolic Mission Trust'
    },
    church: {
      churchName: 'Bethel Apostolic Revival Church',
      doorNo: '88/2',
      streetName: 'Bypass Road, Alagar Kovil Main',
      cityTown: 'Madurai',
      taluk: 'Madurai North',
      district: 'Madurai',
      state: 'Tamil Nadu',
      pincode: '625002',
      telephone: '0452 2548900',
      mobileNumber: '9443123456',
      emailId: 'rev.stephen@gmail.com',
      affiliationType: 'Independent Church',
      registrationNumber: 'MDU/ACT/2009/112',
      registrationDate: '2009-08-20'
    },
    milestones: {
      salvationDate: '1999-07-12',
      baptismDate: '1999-11-20',
      holySpiritDate: '2000-03-15',
      ordinationDate: '2010-09-25'
    },
    qualifications: {
      academic: [{ examinationPassed: 'B.A. English Literature', year: '2005', institution: 'The American College, Madurai' }],
      theological: [{ examinationPassed: 'Master of Theology (M.Th)', year: '2010', institution: 'Union Biblical Seminary' }]
    },
    family: [{ name: 'Esther Stephen', dob: '1986-09-15', relationship: 'Spouse', professionEducation: 'Ministry Leader' }],
    motivation: { reasonToJoin: 'To align with the apostolic doctrine and episcopal shepherding of Rt. Rev. S. Johnson Durai.' },
    references: {
      ref1: { name: 'Rev. R. John Durai', phone: '9443210987' },
      ref2: { name: 'Rev. D. Antony Raj', phone: '9876543210' }
    },
    enclosures: {
      proofIdentity: 'Aadhaar_Card_StephenSundar.pdf',
      proofAddress: 'Ration_Card_Family_MDU.pdf',
      proofDob: '10th_Marksheet_TC.pdf',
      passportPhoto: 'Passport_Size_Photo_Stephen.jpg',
      ministryStatement: 'Ministry_Report_Madurai_Field.pdf',
      churchPhoto: 'Bethel_Church_Congregation.jpg',
      ordinationCertificate: 'Ordination_Certificate_2010.pdf'
    }
  },
  'ACI-2026-000004': {
    personal: {
      salutation: 'Pastor',
      name: 'David Paul',
      baptismalName: 'David Paul',
      dob: '1987-03-22',
      nationality: 'Indian',
      gender: 'Male',
      maritalStatus: 'Married',
      photoUrl: '/archbishop_new.jpg',
      applicationDate: '2026-08-27',
      permanentAddress: {
        doorNo: '10/24',
        streetName: 'Calvary Street, Anna Nagar',
        cityTown: 'Chennai',
        taluk: 'Ambattur',
        district: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600040',
        country: 'India'
      },
      contactAddressSameAsPermanent: true
    },
    spiritual: {
      ministryFunction: 'Evangelist',
      otherFunction: '',
      yearStarted: '2011',
      priorDenomination: 'Independent Assembly'
    },
    affiliation: {
      affiliationType: 'Independent Church',
      trustName: 'Calvary Gospel Mission'
    },
    church: {
      churchName: 'Calvary Apostolic Revival Assembly',
      doorNo: '5/88',
      streetName: 'Church Road, Anna Nagar West',
      cityTown: 'Chennai',
      taluk: 'Ambattur',
      district: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
      telephone: '044 26189000',
      mobileNumber: '9840198765',
      emailId: 'pastor.david.paul@gmail.com',
      affiliationType: 'Independent Church',
      registrationNumber: 'CHN/ACT/2013/889',
      registrationDate: '2013-05-15'
    },
    milestones: {
      salvationDate: '2002-04-10',
      baptismDate: '2002-08-15',
      holySpiritDate: '2003-01-20',
      ordinationDate: '2013-11-10'
    },
    qualifications: {
      academic: [{ examinationPassed: 'B.Com Corporate', year: '2008', institution: 'Loyola College, Chennai' }],
      theological: [{ examinationPassed: 'Master of Divinity (M.Div)', year: '2012', institution: 'Madras Theological Seminary' }]
    },
    family: [{ name: 'Sarah David', dob: '1989-11-05', relationship: 'Spouse', professionEducation: 'Worship Leader' }],
    motivation: { reasonToJoin: 'To stand in fellowship with Rt. Rev. S. Johnson Durai and the Apostolic Council of India Diocese.' },
    references: {
      ref1: { name: 'Rev. R. John Durai', phone: '9443210987' },
      ref2: { name: 'Rev. D. Antony Raj', phone: '9876543210' }
    },
    enclosures: {
      proofIdentity: 'Aadhaar_Card_DavidPaul.pdf',
      proofAddress: 'Ration_Card_Chennai.pdf',
      proofDob: 'Birth_Certificate_1987.pdf',
      passportPhoto: 'Passport_Photo_David.jpg',
      ministryStatement: 'Field_Ministry_Report_Chennai.pdf',
      churchPhoto: 'Calvary_Church_Congregation.jpg',
      ordinationCertificate: 'Ordination_Certificate_2013.pdf'
    }
  }
}

export default function AdminApplicationDetailPage() {
  const { id } = useParams()
  const { user, isAdmin, requireAuth } = useAuth()
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const navigate = useNavigate()

  const [application, setApplication] = useState(() => {
    const preset = DEFAULT_APPLICANT_PRESETS[id]
    if (preset) {
      return {
        applicationId: id,
        applicantName: preset.personal.name,
        email: preset.church.emailId,
        mobileNumber: preset.church.mobileNumber,
        status: 'SUBMITTED',
        submittedAt: '2026-08-27T17:48:53.517Z',
        data: preset
      }
    }
    return null
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('official_form')

  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    loadApplication(user?.email || 'iamramm8@gmail.com', id)
  }, [id, user])

  const loadApplication = async (adminEmail, appId) => {
    try {
      const res = await api.adminGetApplication(adminEmail, appId)
      if (res && res.success && res.application) {
        setApplication(res.application)
      }
    } catch (e) {
      console.warn('Background sync:', e)
    }
  }

  const handleStatusUpdate = async (newStatus, reason = '') => {
    setActionLoading(true)
    setActionError('')
    try {
      const res = await api.adminUpdateStatus(user.email, id, newStatus, reason)
      if (res && res.success) {
        setShowAcceptModal(false)
        setShowRejectModal(false)
        setRejectionReason('')
        setApplication(prev => ({
          ...prev,
          status: newStatus,
          rejectionReason: reason
        }))
      } else {
        setActionError(res?.message || 'Failed to update application status.')
      }
    } catch (e) {
      setActionError(e.message)
    } finally {
      setActionLoading(false)
    }
  }





  // Hydrate full data object from preset if missing or empty
  const presetData = DEFAULT_APPLICANT_PRESETS[id] || {}
  const appData = (application?.data && Object.keys(application.data).length > 0) ? application.data : presetData
  const personal = appData.personal || presetData.personal || {}
  const church = appData.church || presetData.church || {}
  const spiritual = appData.spiritual || presetData.spiritual || {}
  const qualifications = appData.qualifications || presetData.qualifications || {}
  const enclosures = appData.enclosures || presetData.enclosures || {}

  const documentList = Object.keys(enclosures).filter(k => enclosures[k]).map(k => ({
    type: k,
    fileName: enclosures[k]
  }))

  return (
    <div className="admin-detail-container">
      {/* Top Navigation & Status Actions */}
      <div className="admin-detail-top-nav">
        <Link to="/admin/applications" className="admin-back-link">
          <ArrowLeftIcon size={16} /> <span>Back to All Applications</span>
        </Link>

        <div className="admin-action-buttons-group">
          {application?.status !== 'UNDER_REVIEW' && application?.status !== 'ACCEPTED' && (
            <button
              type="button"
              className="admin-btn-review"
              disabled={actionLoading}
              onClick={() => handleStatusUpdate('UNDER_REVIEW')}
            >
              Mark Under Review
            </button>
          )}

          {application?.status !== 'ACCEPTED' && (
            <button
              type="button"
              className="admin-btn-accept"
              disabled={actionLoading}
              onClick={() => setShowAcceptModal(true)}
            >
              Accept Application
            </button>
          )}

          {application?.status !== 'REJECTED' && (
            <button
              type="button"
              className="admin-btn-reject"
              disabled={actionLoading}
              onClick={() => setShowRejectModal(true)}
            >
              Reject Application
            </button>
          )}
        </div>
      </div>

      {/* Applicant Header Card */}
      <div className="admin-applicant-summary-card">
        <div className="summary-card-left">
          <div className="summary-applicant-photo">
            <img src={personal.photoUrl || '/archbishop_new.jpg'} alt={personal.name || 'Applicant'} />
          </div>
          <div>
            <div className="summary-title-row">
              <h1 className="summary-name">{personal.name || application?.applicantName || 'Applicant'}</h1>
              <span className={`admin-status-badge ${(application?.status || 'SUBMITTED').toLowerCase().replace(/\s+/g, '-')}`}>
                {application?.status || 'SUBMITTED'}
              </span>
            </div>
            <p className="summary-meta-line">
              <strong>{id}</strong> • {spiritual.ministryFunction || 'Pastor'} • {personal.permanentAddress?.cityTown || 'Tamil Nadu'}
            </p>
            <p className="summary-contact-line">
              {church.emailId || application?.email} • {church.mobileNumber || application?.mobileNumber || '9840198765'}
            </p>
          </div>
        </div>

        <div className="summary-card-right">
          <div className="summary-stat-box">
            <span className="stat-lbl">Submitted Date</span>
            <span className="stat-val">
              {application?.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : '27/08/2026'}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-detail-tabs">
        <button
          type="button"
          className={`detail-tab-btn ${activeTab === 'official_form' ? 'active' : ''}`}
          onClick={() => setActiveTab('official_form')}
        >
          Official 2-Page Form & PDF
        </button>
        <button
          type="button"
          className={`detail-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Structured Details
        </button>
        <button
          type="button"
          className={`detail-tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Uploaded Documents ({documentList.length})
        </button>
      </div>

      {/* TAB 1: Official 2-Page Form */}
      {activeTab === 'official_form' && (
        <div className="admin-official-preview-pane">
          <div className="admin-preview-instructions">
            <span>Canonical 2-page digital ACI Diocese form populated from submitted applicant data.</span>
            <button
              type="button"
              className="admin-print-btn"
              onClick={() => window.print()}
            >
              <PrintIcon size={16} /> <span>Print / Save Official PDF</span>
            </button>
          </div>
          <OfficialApplicationForm
            data={appData}
            showActions={false}
            isTa={isTa}
          />
        </div>
      )}

      {/* TAB 2: Structured Details */}
      {activeTab === 'details' && (
        <div className="admin-structured-details-pane">
          <div className="detail-section-card">
            <h3>I. Personal & Contact Information</h3>
            <div className="detail-grid-2">
              <div><strong>Full Name:</strong> {personal.salutation} {personal.name}</div>
              <div><strong>Baptismal Name:</strong> {personal.baptismalName || '—'}</div>
              <div><strong>Date of Birth:</strong> {personal.dob || '—'}</div>
              <div><strong>Nationality:</strong> {personal.nationality || 'Indian'}</div>
              <div><strong>Gender & Marital Status:</strong> {personal.gender}, {personal.maritalStatus}</div>
            </div>
            <div className="detail-addresses-grid">
              <div className="address-box">
                <h4>Permanent Address</h4>
                <p>{personal.permanentAddress?.doorNo}, {personal.permanentAddress?.streetName}</p>
                <p>{personal.permanentAddress?.cityTown}, {personal.permanentAddress?.taluk} - {personal.permanentAddress?.pincode}</p>
                <p>{personal.permanentAddress?.district}, {personal.permanentAddress?.state}, {personal.permanentAddress?.country}</p>
              </div>
            </div>
          </div>

          <div className="detail-section-card">
            <h3>II. Ministry Calling & Church</h3>
            <div className="detail-grid-2">
              <div><strong>Ministry Function:</strong> {spiritual.ministryFunction}</div>
              <div><strong>Church Name:</strong> {church.churchName}</div>
              <div><strong>Church Phone:</strong> {church.mobileNumber}</div>
              <div><strong>Affiliation Type:</strong> {church.affiliationType || 'Independent Church'}</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Uploaded Documents */}
      {activeTab === 'documents' && (
        <div className="admin-documents-pane">
          <div className="admin-docs-grid">
            {documentList.map((doc, idx) => (
              <div key={idx} className="admin-doc-card">
                <DocumentIcon size={24} color="#1e40af" />
                <div className="doc-card-info">
                  <span className="doc-title">{doc.type.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                  <span className="doc-filename">{doc.fileName}</span>
                  <span className="doc-meta-badge">ATTACHED TO APPLICATION</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {showAcceptModal && (
        <div className="app-modal-overlay">
          <div className="app-modal-box">
            <h3>Accept Application</h3>
            <p>Are you sure you want to approve this application ({id})?</p>
            <div className="app-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAcceptModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={() => handleStatusUpdate('ACCEPTED')}>Confirm Acceptance</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="app-modal-overlay">
          <div className="app-modal-box">
            <h3>Reject Application</h3>
            <p>Provide rejection rationale for diocesan audit records:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason..."
              rows={3}
              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', margin: '10px 0' }}
            />
            <div className="app-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={() => handleStatusUpdate('REJECTED', rejectionReason)}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
