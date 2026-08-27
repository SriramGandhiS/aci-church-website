import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import {
  ShieldIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  UserCheckIcon,
  DocumentIcon,
  CameraIcon,
  UploadIcon,
  TrashIcon,
  EditIcon,
  RefreshIcon,
  SaveIcon,
  PrintIcon,
  InfoIcon,
  AlertCircleIcon
} from '../components/Icons/SvgIcons'
import DateField from '../components/Form/DateField'
import FilledApplicationPdf from '../components/Form/FilledApplicationPdf'
import OfficialApplicationForm from '../components/Form/OfficialApplicationForm'
import { lookupPincode } from '../utils/postalApi'
import {
  initialApplicationData,
  SALUTATION_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  MINISTRY_CALLING_OPTIONS,
  AFFILIATION_OPTIONS,
  REQUIRED_ENCLOSURES
} from '../data/applicationDefaults'
import './ApplicationPage.css'

const STORAGE_KEY = 'aci_app_draft_v1'

const NATIONALITY_OPTIONS = [
  'Indian',
  'Sri Lankan',
  'Malaysian',
  'Singaporean',
  'American',
  'British',
  'Canadian',
  'Australian',
  'Emirati (UAE)',
  'Other',
]

const CLEAN_STEPS = [
  { num: 1, key: 'personal', labelEn: 'Personal Information', labelTa: 'சுய விவரங்கள்' },
  { num: 2, key: 'spiritual', labelEn: 'Ministry Calling', labelTa: 'ஆவிக்குரிய தகவல்கள்' },
  { num: 3, key: 'church', labelEn: 'Affiliation & Church', labelTa: 'இணைப்பு & சபை' },
  { num: 4, key: 'experience', labelEn: 'Milestones & Qualifications', labelTa: 'கல்வி & அனுபவம்' },
  { num: 5, key: 'review', labelEn: 'Review & Declaration', labelTa: 'சரிபார்த்தல் & உறுதிமொழி' },
]

function safeMergeFormData(base, incoming) {
  if (!incoming || typeof incoming !== 'object') return base

  const safeArray = (val, defaultVal) => {
    if (Array.isArray(val)) return val
    if (val && typeof val === 'object') return Object.values(val)
    return defaultVal
  }

  return {
    ...base,
    ...incoming,
    personal: {
      ...(base.personal || {}),
      ...(incoming.personal || {}),
      permanentAddress: { ...(base.personal?.permanentAddress || {}), ...(incoming.personal?.permanentAddress || {}) },
      contactAddress: { ...(base.personal?.contactAddress || {}), ...(incoming.personal?.contactAddress || {}) }
    },
    spiritual: { ...(base.spiritual || {}), ...(incoming.spiritual || {}) },
    affiliation: { ...(base.affiliation || {}), ...(incoming.affiliation || {}) },
    church: {
      ...(base.church || {}),
      ...(incoming.church || {}),
      churchAddress: { ...(base.church?.churchAddress || {}), ...(incoming.church?.churchAddress || {}) }
    },
    ministryHistory: { ...(base.ministryHistory || {}), ...(incoming.ministryHistory || {}) },
    milestones: { ...(base.milestones || {}), ...(incoming.milestones || {}) },
    qualifications: {
      academic: safeArray(incoming.qualifications?.academic, base.qualifications?.academic || []),
      theological: safeArray(incoming.qualifications?.theological, base.qualifications?.theological || [])
    },
    family: safeArray(incoming.family, base.family || []),
    motivation: { ...(base.motivation || {}), ...(incoming.motivation || {}) },
    references: {
      ref1: { ...(base.references?.ref1 || {}), ...(incoming.references?.ref1 || {}) },
      ref2: { ...(base.references?.ref2 || {}), ...(incoming.references?.ref2 || {}) }
    },
    enclosures: { ...(base.enclosures || {}), ...(incoming.enclosures || {}) },
    declaration: { ...(base.declaration || {}), ...(incoming.declaration || {}) }
  }
}

export default function ApplicationPage() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const navigate = useNavigate()
  const { user, requireAuth } = useAuth()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(initialApplicationData)
  const [errors, setErrors] = useState({})
  const [saveStatus, setSaveStatus] = useState('saved') // 'saved' | 'saving'
  const [showResumeBanner, setShowResumeBanner] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [submittedAppId, setSubmittedAppId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewTab, setReviewTab] = useState('summary') // 'summary' | 'official'

  const [permPostalInfo, setPermPostalInfo] = useState({ loading: false, msg: '', results: [] })
  const [churchPostalInfo, setChurchPostalInfo] = useState({ loading: false, msg: '', results: [] })
  const [userEditedPerm, setUserEditedPerm] = useState({ cityTown: false, taluk: false, district: false, state: false })
  const [userEditedChurch, setUserEditedChurch] = useState({ cityTown: false, taluk: false, district: false, state: false })

  const photoInputRef = useRef(null)
  const isInitialMount = useRef(true)

  // 1. Initial Load: Check remote database if logged in, or local draft
  useEffect(() => {
    async function initDraft() {
      if (user?.email) {
        try {
          const res = await api.getMyApplication(user.email, user.googleSub)
          if (res && res.success && res.application?.data) {
            setFormData(safeMergeFormData(initialApplicationData, res.application.data))
            if (res.application.status === 'SUBMITTED' || res.application.status === 'ACCEPTED' || res.application.status === 'UNDER_REVIEW') {
              setSubmittedAppId(res.application.applicationId)
              setIsCompleted(true)
              return
            }
          }
        } catch (e) {}
      }

      // Check localStorage draft
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed && parsed.formData && (parsed.formData.personal?.name || parsed.currentStep > 1)) {
            setShowResumeBanner(true)
          }
        }
      } catch (e) {}
    }

    initDraft()
  }, [user])

  // 2. Debounced Auto-Save to localStorage and Backend
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    setSaveStatus('saving')
    const timer = setTimeout(async () => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            formData,
            currentStep,
            savedAt: new Date().toISOString(),
          })
        )

        // Save to Google Backend if authenticated
        if (user?.email) {
          await api.saveDraft(user.email, user.userId, user.googleSub, formData)
        }
        setSaveStatus('saved')
      } catch (e) {
        setSaveStatus('saved')
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [formData, currentStep, user])

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep, isCompleted])

  // Resume Saved Draft
  const handleResumeDraft = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.formData) setFormData(safeMergeFormData(initialApplicationData, parsed.formData))
        if (parsed.currentStep) setCurrentStep(parsed.currentStep)
      }
    } catch (e) {}
    setShowResumeBanner(false)
  }

  // Dismiss Resume Banner
  const handleDismissResume = () => {
    setShowResumeBanner(false)
  }

  // Clear Application Draft
  const handleClearApplication = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {}
    setFormData(initialApplicationData)
    setCurrentStep(1)
    setIsCompleted(false)
    setShowClearModal(false)
    setShowResumeBanner(false)
    setErrors({})
    setPermPostalInfo({ loading: false, msg: '', results: [] })
    setChurchPostalInfo({ loading: false, msg: '', results: [] })
  }

  // Centralized State Updates
  const updateNested = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const updateAddress = (type, field, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        personal: {
          ...prev.personal,
          [type]: {
            ...prev.personal[type],
            [field]: value,
          },
        },
      }

      // If permanent address changed and contact address is synced, update contact address
      if (type === 'permanentAddress' && prev.personal.contactAddressSameAsPermanent) {
        updated.personal.contactAddress = { ...updated.personal.permanentAddress }
      }
      return updated
    })
  }

  const updateChurchAddress = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      church: {
        ...prev.church,
        [field]: value,
      },
    }))
  }

  // PIN Code Auto-Lookup for Permanent Address
  const handlePermPincodeChange = async (e) => {
    const pin = e.target.value.replace(/\D/g, '').slice(0, 6)
    updateAddress('permanentAddress', 'pincode', pin)

    if (pin.length < 6) {
      setPermPostalInfo({
        loading: false,
        msg: pin.length > 0 ? (isTa ? '6 இலக்க பின்கோடை உள்ளிடவும்' : 'Enter 6-digit PIN') : '',
        results: [],
      })
      return
    }

    if (pin.length === 6) {
      setPermPostalInfo({
        loading: true,
        msg: isTa ? 'பின்கோடு சரிபார்க்கப்படுகிறது...' : 'Checking PIN code...',
        results: [],
      })
      const res = await lookupPincode(pin)

      if (res.status === 'success' && res.results && res.results.length > 0) {
        setPermPostalInfo({ loading: false, msg: res.message, results: res.results })

        // Use the first locality unless manually edited
        const loc = res.results[0]
        setFormData((prev) => {
          const pAddr = prev.personal.permanentAddress
          const newPerm = {
            ...pAddr,
            pincode: pin,
            district: userEditedPerm.district ? pAddr.district : (loc.district || pAddr.district),
            state: userEditedPerm.state ? pAddr.state : (loc.state || pAddr.state),
            taluk: userEditedPerm.taluk ? pAddr.taluk : (loc.taluk || pAddr.taluk),
            cityTown: userEditedPerm.cityTown ? pAddr.cityTown : (loc.cityTown || pAddr.cityTown),
            country: 'India',
          }
          const updated = {
            ...prev,
            personal: { ...prev.personal, permanentAddress: newPerm },
          }
          if (prev.personal.contactAddressSameAsPermanent) {
            updated.personal.contactAddress = { ...newPerm }
          }
          return updated
        })
      } else {
        setPermPostalInfo({ loading: false, msg: res.message || 'PIN not found', results: [] })
      }
    }
  }

  // Select Locality from dropdown for Permanent Address
  const handleSelectPermLocality = (locName) => {
    const loc = permPostalInfo.results.find((r) => r.name === locName)
    if (!loc) return

    setFormData((prev) => {
      const pAddr = prev.personal.permanentAddress
      const newPerm = {
        ...pAddr,
        district: loc.district || pAddr.district,
        state: loc.state || pAddr.state,
        taluk: loc.taluk || pAddr.taluk,
        cityTown: loc.cityTown || pAddr.cityTown,
        country: 'India',
      }
      const updated = {
        ...prev,
        personal: { ...prev.personal, permanentAddress: newPerm },
      }
      if (prev.personal.contactAddressSameAsPermanent) {
        updated.personal.contactAddress = { ...newPerm }
      }
      return updated
    })
  }

  // PIN Code Auto-Lookup for Church Address
  const handleChurchPincodeChange = async (e) => {
    const pin = e.target.value.replace(/\D/g, '').slice(0, 6)
    updateChurchAddress('pincode', pin)

    if (pin.length < 6) {
      setChurchPostalInfo({
        loading: false,
        msg: pin.length > 0 ? (isTa ? '6 இலக்க பின்கோடை உள்ளிடவும்' : 'Enter 6-digit PIN') : '',
        results: [],
      })
      return
    }

    if (pin.length === 6) {
      setChurchPostalInfo({
        loading: true,
        msg: isTa ? 'பின்கோடு சரிபார்க்கப்படுகிறது...' : 'Checking PIN code...',
        results: [],
      })
      const res = await lookupPincode(pin)

      if (res.status === 'success' && res.results && res.results.length > 0) {
        setChurchPostalInfo({ loading: false, msg: res.message, results: res.results })

        const loc = res.results[0]
        setFormData((prev) => {
          const cAddr = prev.church
          return {
            ...prev,
            church: {
              ...cAddr,
              pincode: pin,
              district: userEditedChurch.district ? cAddr.district : (loc.district || cAddr.district),
              state: userEditedChurch.state ? cAddr.state : (loc.state || cAddr.state),
              taluk: userEditedChurch.taluk ? cAddr.taluk : (loc.taluk || cAddr.taluk),
              cityTown: userEditedChurch.cityTown ? cAddr.cityTown : (loc.cityTown || cAddr.cityTown),
              country: 'India',
            },
          }
        })
      } else {
        setChurchPostalInfo({ loading: false, msg: res.message || 'PIN not found', results: [] })
      }
    }
  }

  // Select Locality from dropdown for Church Address
  const handleSelectChurchLocality = (locName) => {
    const loc = churchPostalInfo.results.find((r) => r.name === locName)
    if (!loc) return

    setFormData((prev) => {
      const cAddr = prev.church
      return {
        ...prev,
        church: {
          ...cAddr,
          district: loc.district || cAddr.district,
          state: loc.state || cAddr.state,
          taluk: loc.taluk || cAddr.taluk,
          cityTown: loc.cityTown || cAddr.cityTown,
          country: 'India',
        },
      }
    })
  }

  // Use Contact Address for Church
  const handleCopyContactToChurch = () => {
    const source = formData.personal.contactAddressSameAsPermanent
      ? formData.personal.permanentAddress
      : formData.personal.contactAddress

    setFormData((prev) => ({
      ...prev,
      church: {
        ...prev.church,
        doorNo: source.doorNo || '',
        streetName: source.streetName || '',
        cityTown: source.cityTown || '',
        taluk: source.taluk || '',
        district: source.district || '',
        state: source.state || 'Tamil Nadu',
        pincode: source.pincode || '',
        country: source.country || 'India',
      },
    }))
  }

  // Photo Upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // 5MB limit check
    if (file.size > 5 * 1024 * 1024) {
      alert(isTa ? 'புகைப்படம் 5MB அளவுக்குள் இருக்க வேண்டும்.' : 'Photo file size must be under 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = async (evt) => {
      const base64 = evt.target.result
      updateNested('personal', 'photoUrl', base64)

      if (user?.email) {
        try {
          await api.uploadDocument({
            email: user.email,
            userId: user.userId,
            documentType: 'Passport Photo',
            fileName: file.name,
            base64Data: base64,
            applicationId: submittedAppId || 'DRAFT'
          })
        } catch (err) {}
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    updateNested('personal', 'photoUrl', '')
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  // Handle Document Enclosure Uploads
  const handleEnclosureUpload = (field, e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert(isTa ? 'ஆவணம் 10MB அளவுக்குள் இருக்க வேண்டும்.' : 'Document file size must be under 10MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = async (evt) => {
      const base64 = evt.target.result
      setFormData(prev => ({
        ...prev,
        enclosures: {
          ...prev.enclosures,
          [field]: file.name
        }
      }))

      if (user?.email) {
        try {
          await api.uploadDocument({
            email: user.email,
            userId: user.userId,
            documentType: field,
            fileName: file.name,
            base64Data: base64,
            applicationId: submittedAppId || 'DRAFT'
          })
        } catch (err) {}
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveEnclosure = (field) => {
    setFormData(prev => ({
      ...prev,
      enclosures: {
        ...prev.enclosures,
        [field]: ''
      }
    }))
  }

  // Dynamic Qualifications
  const addAcademicRow = () => {
    setFormData((prev) => ({
      ...prev,
      qualifications: {
        ...prev.qualifications,
        academic: [
          ...prev.qualifications.academic,
          { id: `a-${Date.now()}`, examinationPassed: '', year: '', institution: '' },
        ],
      },
    }))
  }

  const removeAcademicRow = (id) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: {
        ...prev.qualifications,
        academic: prev.qualifications.academic.filter((r) => r.id !== id),
      },
    }))
  }

  const updateAcademicRow = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: {
        ...prev.qualifications,
        academic: prev.qualifications.academic.map((r) =>
          r.id === id ? { ...r, [field]: value } : r
        ),
      },
    }))
  }

  const addTheologicalRow = () => {
    setFormData((prev) => ({
      ...prev,
      qualifications: {
        ...prev.qualifications,
        theological: [
          ...prev.qualifications.theological,
          { id: `t-${Date.now()}`, examinationPassed: '', year: '', institution: '' },
        ],
      },
    }))
  }

  const removeTheologicalRow = (id) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: {
        ...prev.qualifications,
        theological: prev.qualifications.theological.filter((r) => r.id !== id),
      },
    }))
  }

  const updateTheologicalRow = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: {
        ...prev.qualifications,
        theological: prev.qualifications.theological.map((r) =>
          r.id === id ? { ...r, [field]: value } : r
        ),
      },
    }))
  }

  // Dynamic Family
  const addFamilyRow = () => {
    setFormData((prev) => ({
      ...prev,
      family: [
        ...prev.family,
        { id: `f-${Date.now()}`, name: '', dob: '', relationship: '', professionEducation: '' },
      ],
    }))
  }

  const removeFamilyRow = (id) => {
    setFormData((prev) => ({
      ...prev,
      family: prev.family.filter((f) => f.id !== id),
    }))
  }

  const updateFamilyRow = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      family: prev.family.map((f) =>
        f.id === id ? { ...f, [field]: value } : f
      ),
    }))
  }

  // Enclosure document upload
  const handleDocumentUpload = (enclosureId, e) => {
    const file = e.target.files[0]
    if (!file) return

    const encInfo = REQUIRED_ENCLOSURES.find(enc => enc.id === enclosureId)
    const docTitle = encInfo ? encInfo.titleEn : enclosureId

    const reader = new FileReader()
    reader.onload = async (evt) => {
      const base64 = evt.target.result

      setFormData((prev) => ({
        ...prev,
        enclosures: {
          ...prev.enclosures,
          [enclosureId]: file.name,
        },
      }))

      if (user?.email) {
        try {
          await api.uploadDocument({
            email: user.email,
            userId: user.userId,
            documentType: docTitle,
            fileName: file.name,
            base64Data: base64,
            applicationId: submittedAppId || 'DRAFT'
          })
        } catch (err) {}
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveDocument = (enclosureId) => {
    setFormData((prev) => ({
      ...prev,
      enclosures: {
        ...prev.enclosures,
        [enclosureId]: null,
      },
    }))
  }

  // Auto-Fill Sample Data for Testing
  const autoFillTestData = () => {
    setFormData({
      personal: {
        salutation: 'Pastor',
        name: 'S. JOHN SAMUEL',
        baptismalName: 'John Samuel',
        dob: '1988-05-15',
        nationality: 'Indian',
        gender: 'Male',
        maritalStatus: 'Married',
        photoUrl: '/archbishop_new.jpg',
        applicationDate: new Date().toISOString().split('T')[0],
        permanentAddress: {
          doorNo: '6/110',
          streetName: 'Melapatty Street',
          cityTown: 'Hanumantharayankottai',
          pincode: '624002',
          taluk: 'Dindigul',
          district: 'Dindigul',
          state: 'Tamil Nadu',
          country: 'India',
        },
        contactAddressSameAsPermanent: true,
        contactAddress: {
          doorNo: '6/110',
          streetName: 'Melapatty Street',
          cityTown: 'Hanumantharayankottai',
          pincode: '624002',
          taluk: 'Dindigul',
          district: 'Dindigul',
          state: 'Tamil Nadu',
          country: 'India',
        },
      },
      spiritual: {
        ministryFunction: 'Pastor',
        otherMinistrySpecify: '',
      },
      affiliation: {
        affiliationType: 'Independent Church',
        founderName: 'Rev. S. Johnson Durai',
        denominationSpecify: '',
        associateChiefPastorName: '',
        associateChurchName: '',
        associateAddress: '',
        trustName: 'Living Word Ministries Trust',
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
      },
      ministryHistory: {
        bornAgainDate: '2004-03-12',
        waterBaptismDate: '2004-08-20',
        holySpiritBaptismDate: '2005-01-15',
        callingDate: '2008-06-10',
        ministryStartDate: '2012-07-01',
        wantOrdination: 'Yes',
        wantAffiliation: 'Yes',
      },
      qualifications: {
        academic: [
          { id: 'a-1', examinationPassed: 'B.Sc. Mathematics', year: '2009', institution: 'Madurai Kamaraj University' },
          { id: 'a-2', examinationPassed: 'HSC (+2)', year: '2006', institution: 'St. Marys Hr Sec School' },
        ],
        theological: [
          { id: 't-1', examinationPassed: 'B.Th. / M.Div.', year: '2014', institution: 'Berean Bible Seminary' },
        ],
      },
      family: [
        { id: 'f-1', name: 'Mary Samuel', dob: '1992-08-10', relationship: 'Spouse', professionEducation: 'Teacher' },
        { id: 'f-2', name: 'Timothy Samuel', dob: '2018-04-22', relationship: 'Son', professionEducation: 'Student' },
      ],
      motivation: {
        reasonToJoin: 'I am convinced and confirmed of my calling to serve the Lord under the episcopal guidance, fellowship and doctrinal shepherding of the Apostolic Council of India Diocese.',
      },
      references: {
        ref1: {
          role: 'District Overseer / Diocesan Member',
          name: 'Rev. R. John Durai',
          diocesanId: 'TN 0005',
          phone: '9443210987',
          knownSince: '8 Years',
          relationshipType: 'Personally',
        },
        ref2: {
          role: 'Taluk Co-ordinator / Diocesan Member',
          name: 'Rev. D. Antony Raj',
          diocesanId: 'TN 0466',
          phone: '9876543210',
          knownSince: '5 Years',
          relationshipType: 'Professionally',
        },
      },
      enclosures: {
        proofIdentity: 'Aadhaar_Card_JohnSamuel.pdf',
        proofAddress: 'Ration_Card_Family.pdf',
        proofDob: '10th_Marksheet_TC.pdf',
        proofNameChange: null,
        passportPhoto: 'Passport_Photo_Attested.jpg',
        ministryStatement: 'Ministry_Field_Work_Summary.pdf',
        churchPhoto: 'Church_Congregation_Photo.jpg',
        ordinationCertificate: 'Ordination_Certificate_2015.pdf',
      },
      declaration: {
        acceptedFaithStatement: true,
        acceptedTerms: true,
        applicantName: 'S. JOHN SAMUEL',
        date: new Date().toISOString().split('T')[0],
        place: 'Dindigul',
        signatureConfirmation: true,
      },
    })
    setErrors({})
  }

  // Validation Logic with Smooth Focus to Problematic Field
  const validateStep = (step) => {
    const errs = {}
    if (step === 1) {
      if (!formData.personal.name.trim()) {
        errs.name = isTa ? 'முழுப் பெயரை உள்ளிடவும்.' : 'Enter your full name in capital letters.'
      }
      if (!formData.personal.dob) {
        errs.dob = isTa ? 'பிறந்த தேதியைத் தேர்ந்தெடுக்கவும்.' : 'Select your date of birth.'
      }
    }
    if (step === 3) {
      if (!formData.church.churchName.trim()) {
        errs.churchName = isTa ? 'சபையின் பெயரை உள்ளிடவும்.' : 'Enter the official name of your church.'
      }
      if (!formData.church.mobileNumber.trim() || formData.church.mobileNumber.length < 10) {
        errs.mobileNumber = isTa ? 'சரியான 10 இலக்க கைப்பேசி எண்ணை உள்ளிடவும்.' : 'Enter a valid 10-digit mobile number.'
      }
    }
    if (step === 5) {
      if (!formData.declaration.acceptedFaithStatement) {
        errs.faith = isTa ? 'விசுவாச அறிக்கைகளை ஏற்க வேண்டும்.' : 'You must accept the Statement of Faith.'
      }
      if (!formData.declaration.acceptedTerms) {
        errs.terms = isTa ? 'பேராய விதிகளுக்கு ஒப்புதல் அளிக்க வேண்டும்.' : 'You must accept the Diocesan terms and conditions.'
      }
      if (!formData.declaration.signatureConfirmation) {
        errs.sig = isTa ? 'விண்ணப்பதாரர் டிஜிட்டல் உறுதிப்படுத்தல் தேவை.' : 'Digital signature confirmation is required.'
      }
    }

    setErrors(errs)

    if (Object.keys(errs).length > 0) {
      setTimeout(() => {
        const firstErr = document.querySelector('.has-error, .clean-error-text')
        if (firstErr) {
          firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' })
          if (firstErr.focus) firstErr.focus()
        }
      }, 100)
      return false
    }
    return true
  }

  const handleNext = async () => {
    if (!validateStep(currentStep)) return

    if (currentStep < 5) {
      setCurrentStep((s) => s + 1)
      return
    }

    // Step 5 Completed -> Submit Application
    const submitWithUser = async (authenticatedUser) => {
      setIsSubmitting(true)
      try {
        const res = await api.submitApplication(
          authenticatedUser.email,
          authenticatedUser.userId,
          authenticatedUser.googleSub,
          formData
        )

        if (res && res.success) {
          setSubmittedAppId(res.applicationId)
          setIsCompleted(true)
        } else {
          alert(res?.message || 'Submission failed. Please try again.')
        }
      } catch (err) {
        alert('Network error during submission. Your draft is safely saved locally.')
      } finally {
        setIsSubmitting(false)
      }
    }

    if (!user) {
      requireAuth((loggedUser) => {
        submitWithUser(loggedUser)
      })
    } else {
      await submitWithUser(user)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
    } else {
      navigate('/get-involved')
    }
  }

  // If completed, show printable 2-page filled official form
  if (isCompleted) {
    return (
      <FilledApplicationPdf
        data={formData}
        applicationId={submittedAppId}
        onEdit={() => setIsCompleted(false)}
        isTa={isTa}
      />
    )
  }

  // STRICT RULE: No Sign In = No Apply
  if (!user) {
    return (
      <div className="clean-app-page" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 80px' }}>
        <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '44px 32px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 12px 32px rgba(15,23,42,0.08)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#eff6ff', border: '1.5px solid #bfdbfe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <ShieldIcon size={32} color="#1e40af" />
          </div>
          <span style={{ display: 'inline-block', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
            {isTa ? 'உறுப்பினர் சேர்க்கை போர்ட்டல்' : 'Membership Portal'}
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            {isTa ? 'விண்ணப்பிக்க உள்நுழைவு தேவை' : 'Sign In Required to Apply'}
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 26px', lineHeight: 1.55 }}>
            {isTa
              ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தில் இணைய உங்கள் கூகுள் கணக்கு மூலம் உள்நுழையவும்.'
              : 'Please sign in with your Google account or email to open your official application, auto-save drafts, and track progress.'}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px 24px', fontSize: '14.5px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '10px', background: '#1e40af', color: '#ffffff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(30,64,175,0.25)' }}
            onClick={() => requireAuth()}
          >
            <span>{isTa ? 'உள்நுழைய கூகுள் கணக்கை தேர்ந்தெடுக்கவும்' : 'Sign In with Google / Email'}</span>
            <ArrowRightIcon size={15} color="#ffffff" />
          </button>
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#94a3b8' }}>
            🔒 {isTa ? 'அதிகாரப்பூர்வ பேராய முறைமை • ஆவணங்கள் பாதுகாப்பாக வைக்கப்படும்' : 'Official Diocesan Portal • Secured & Private'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="clean-app-page">

      {/* Save Status & Clear Draft Header Bar */}
      <div className="app-save-bar">
        <div className={`app-save-indicator ${saveStatus}`}>
          <SaveIcon size={14} />
          <span>
            {saveStatus === 'saving'
              ? (isTa ? 'சேமிக்கப்படுகிறது...' : 'Saving progress...')
              : (isTa ? 'இந்த சாதனத்தில் சேமிக்கப்பட்டது' : 'Saved on this device')}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowClearModal(true)}
          className="app-clear-draft-btn"
        >
          {isTa ? 'படிவத்தை மீட்டமைக்க' : 'Clear draft & start over'}
        </button>
      </div>

      {/* Resume Banner Prompt */}
      {showResumeBanner && (
        <div className="app-resume-banner">
          <div>
            <div className="app-resume-title">
              {isTa ? 'வரவேற்கிறோம்' : 'Welcome Back'}
            </div>
            <p className="app-resume-sub">
              {isTa
                ? 'உங்கள் விண்ணப்பத்தின் முந்தைய தகவல்கள் இந்த சாதனத்தில் சேமிக்கப்பட்டுள்ளன.'
                : 'You have an active application draft saved on this device.'}
            </p>
          </div>
          <div className="app-resume-actions">
            <button
              type="button"
              onClick={handleResumeDraft}
              className="app-resume-btn-primary"
            >
              {isTa ? 'விண்ணப்பத்தைத் தொடர்க' : 'Continue Application'}
            </button>
            <button
              type="button"
              onClick={handleDismissResume}
              className="app-resume-btn-sec"
            >
              {isTa ? 'நிராகரி' : 'Dismiss'}
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="clean-app-header">
        <div className="clean-app-brand-badge">
          <ShieldIcon size={12} color="#1e40af" />
          <span>{isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயம்' : 'Apostolic Council of India Diocese'}</span>
        </div>

        <h1 className="clean-app-title">
          {isTa ? 'பேராய உறுப்பினர் விண்ணப்பப் படிவம்' : 'Diocesan Membership Application Form'}
        </h1>

        <p className="clean-app-subtitle">
          {isTa
            ? 'அப்போஸ்தல பேராயத்தில் உறுப்பினராக இணைய தேவையான தகவல்களைப் பதிவு செய்யவும்.'
            : 'Complete your official membership application. Your progress is saved automatically on this device.'}
        </p>

        {/* Stepper Progress Bar */}
        <div className="clean-stepper-wrap">
          <div className="clean-stepper-line">
            <div
              className="clean-stepper-line-fill"
              style={{ width: `${((currentStep - 1) / (CLEAN_STEPS.length - 1)) * 100}%` }}
            />
          </div>

          {CLEAN_STEPS.map((s) => {
            const isDone = currentStep > s.num
            const isActive = currentStep === s.num
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`clean-step-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
              >
                <div className="clean-step-circle">
                  {isDone ? <CheckIcon size={13} color="#ffffff" /> : s.num}
                </div>
                <span className="clean-step-label">{isTa ? s.labelTa : s.labelEn}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="clean-form-container">
        <div className="clean-form-card">

          {/* ================= STEP 1: PERSONAL INFORMATION ================= */}
          {currentStep === 1 && (
            <div>
              <div className="clean-form-step-header">
                <h2 className="clean-step-heading">
                  {isTa ? 'படி 1 : விண்ணப்பதாரரின் சுய விவரங்கள்' : 'Step 1: Personal Information of Applicant'}
                </h2>
                <p className="clean-step-sub">
                  {isTa ? 'அடிப்படை விவரங்கள் மற்றும் முகவரிகளை உள்ளிடவும்.' : 'Provide your legal name, baptismal name, date of birth, and addresses.'}
                </p>
              </div>

              {/* Passport Photo Upload Box */}
              <div className="clean-photo-card">
                {formData.personal.photoUrl ? (
                  <img src={formData.personal.photoUrl} alt="Applicant" className="clean-photo-preview" />
                ) : (
                  <div className="clean-photo-preview">
                    <CameraIcon size={22} color="#94a3b8" />
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: '13.5px', fontWeight: 600, margin: '0 0 3px', color: '#0f172a' }}>
                    {isTa ? 'பாஸ்போர்ட் புகைப்படம்' : 'Recent Passport Size Photo'}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px' }}>
                    {isTa ? 'சுய கையொப்பமிடப்பட்ட சமீபத்திய வண்ண புகைப்படம் (JPG அல்லது PNG, அதிகபட்சம் 5MB).' : 'Upload a clear passport photo to be self-attested (JPG or PNG, max 5MB).'}
                  </p>

                  <input
                    type="file"
                    ref={photoInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/jpeg,image/png,image/jpg"
                    style={{ display: 'none' }}
                  />

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="clean-photo-btn"
                    >
                      <UploadIcon size={14} />
                      <span>{formData.personal.photoUrl ? (isTa ? 'புகைப்படத்தை மாற்ற' : 'Replace Photo') : (isTa ? 'புகைப்படம் பதிவேற்ற' : 'Upload Photo')}</span>
                    </button>

                    {formData.personal.photoUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="clean-photo-btn"
                        style={{ color: '#dc2626' }}
                      >
                        <TrashIcon size={13} color="#dc2626" />
                        <span>{isTa ? 'அகற்று' : 'Remove'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={autoFillTestData}
                      className="clean-photo-btn"
                      style={{
                        background: '#eff6ff',
                        borderColor: '#93c5fd',
                        color: '#1d4ed8',
                        fontWeight: 600,
                      }}
                      title="Auto-fill sample data across all steps for testing"
                    >
                      <span>{isTa ? 'மாதிரி விவரங்களை நிரப்பு' : 'Fill Sample Test Data'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Salutation + Full Name */}
              <div className="clean-grid-3">
                <div className="clean-field">
                  <label className="clean-label" htmlFor="salutation">
                    {isTa ? 'அழைப்புப் பட்டம்' : 'Salutation'}
                  </label>
                  <select
                    id="salutation"
                    value={formData.personal.salutation}
                    onChange={(e) => updateNested('personal', 'salutation', e.target.value)}
                    className="clean-select"
                  >
                    {SALUTATION_OPTIONS.map((sal) => (
                      <option key={sal} value={sal}>{sal}</option>
                    ))}
                  </select>
                </div>

                <div className="clean-field" style={{ gridColumn: 'span 2' }}>
                  <label className="clean-label" htmlFor="applicantName">
                    {isTa ? 'முழுப் பெயர் (பெரிய ஆங்கில எழுத்துக்களில்)' : 'Full Name (in Capital Letters)'}
                    <span className="req-star">*</span>
                  </label>
                  <input
                    id="applicantName"
                    type="text"
                    autoComplete="name"
                    value={formData.personal.name}
                    onChange={(e) => updateNested('personal', 'name', e.target.value)}
                    placeholder="e.g. S. JOHN SAMUEL"
                    className={`clean-input ${errors.name ? 'has-error' : ''}`}
                    required
                  />
                  {errors.name && <span className="clean-error-text">{errors.name}</span>}
                </div>
              </div>

              {/* Baptismal Name + DOB DateField + Nationality */}
              <div className="clean-grid-3">
                <div className="clean-field">
                  <label className="clean-label" htmlFor="baptismalName">
                    {isTa ? 'ஞானஸ்நானப் பெயர்' : 'Baptismal Name'}
                    <span className="opt-tag">(Optional)</span>
                  </label>
                  <input
                    id="baptismalName"
                    type="text"
                    value={formData.personal.baptismalName}
                    onChange={(e) => updateNested('personal', 'baptismalName', e.target.value)}
                    placeholder="e.g. John Samuel"
                    className="clean-input"
                  />
                </div>

                {/* Segmented Date Selector */}
                <div className="clean-field">
                  <DateField
                    label={isTa ? 'பிறந்த தேதி' : 'Date of Birth'}
                    value={formData.personal.dob}
                    onChange={(val) => updateNested('personal', 'dob', val)}
                    required
                    isTa={isTa}
                  />
                  {errors.dob && <span className="clean-error-text">{errors.dob}</span>}
                </div>

                {/* Country of Nationality Dropdown */}
                <div className="clean-field">
                  <label className="clean-label" htmlFor="nationality">
                    {isTa ? 'நாட்டுரிமை' : 'Country of Nationality'}
                  </label>
                  <select
                    id="nationality"
                    value={formData.personal.nationality}
                    onChange={(e) => updateNested('personal', 'nationality', e.target.value)}
                    className="clean-select"
                  >
                    {NATIONALITY_OPTIONS.map((nat) => (
                      <option key={nat} value={nat}>{nat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gender + Marital Status */}
              <div className="clean-grid-2" style={{ marginBottom: '14px' }}>
                <div className="clean-field">
                  <label className="clean-label">{isTa ? 'பாலினம்' : 'Gender'}</label>
                  <div className="clean-radio-grid">
                    {GENDER_OPTIONS.map((g) => (
                      <div
                        key={g.value}
                        onClick={() => updateNested('personal', 'gender', g.value)}
                        className={`clean-radio-pill ${formData.personal.gender === g.value ? 'active' : ''}`}
                      >
                        <div className="clean-checkbox-box">
                          {formData.personal.gender === g.value && <CheckIcon size={12} color="#ffffff" />}
                        </div>
                        <span>{isTa ? g.labelTa : g.labelEn}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="clean-field">
                  <label className="clean-label" htmlFor="maritalStatus">
                    {isTa ? 'திருமண நிலை' : 'Marital Status'}
                  </label>
                  <select
                    id="maritalStatus"
                    value={formData.personal.maritalStatus}
                    onChange={(e) => updateNested('personal', 'maritalStatus', e.target.value)}
                    className="clean-select"
                  >
                    {MARITAL_STATUS_OPTIONS.map((m) => (
                      <option key={m.value} value={m.value}>{isTa ? m.labelTa : m.labelEn}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Permanent Address */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {isTa ? 'நிரந்தர முகவரி' : 'Permanent Address'}
                  </h3>
                  {permPostalInfo.msg && (
                    <span className="clean-hint-text" style={{ color: permPostalInfo.loading ? '#2563eb' : (permPostalInfo.results.length > 0 ? '#059669' : '#64748b') }}>
                      {permPostalInfo.msg}
                    </span>
                  )}
                </div>

                <div className="clean-grid-3">
                  <div className="clean-field">
                    <label className="clean-label" htmlFor="permDoor">
                      {isTa ? 'கதவு எண்' : 'Door No.'}
                    </label>
                    <input
                      id="permDoor"
                      type="text"
                      autoComplete="address-line1"
                      value={formData.personal.permanentAddress.doorNo}
                      onChange={(e) => updateAddress('permanentAddress', 'doorNo', e.target.value)}
                      placeholder="e.g. 6/110"
                      className="clean-input"
                    />
                  </div>
                  <div className="clean-field" style={{ gridColumn: 'span 2' }}>
                    <label className="clean-label" htmlFor="permStreet">
                      {isTa ? 'தெருப் பெயர்' : 'Street Name'}
                    </label>
                    <input
                      id="permStreet"
                      type="text"
                      autoComplete="address-line2"
                      value={formData.personal.permanentAddress.streetName}
                      onChange={(e) => updateAddress('permanentAddress', 'streetName', e.target.value)}
                      placeholder="e.g. Melapatty Street"
                      className="clean-input"
                    />
                  </div>
                </div>

                <div className="clean-grid-3">
                  <div className="clean-field">
                    <label className="clean-label" htmlFor="permPin">
                      {isTa ? 'பின்கோடு (6 இலக்கங்கள்)' : 'PIN Code (6 digits)'}
                    </label>
                    <input
                      id="permPin"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      autoComplete="postal-code"
                      value={formData.personal.permanentAddress.pincode}
                      onChange={handlePermPincodeChange}
                      placeholder="e.g. 624002"
                      className="clean-input"
                    />
                  </div>
                  <div className="clean-field">
                    <label className="clean-label" htmlFor="permCity">
                      {isTa ? 'நகரம் / ஊர்' : 'City / Town'}
                    </label>
                    <input
                      id="permCity"
                      type="text"
                      autoComplete="address-level2"
                      value={formData.personal.permanentAddress.cityTown}
                      onChange={(e) => {
                        setUserEditedPerm(prev => ({ ...prev, cityTown: true }))
                        updateAddress('permanentAddress', 'cityTown', e.target.value)
                      }}
                      placeholder="e.g. Hanumantharayankottai"
                      className="clean-input"
                    />
                  </div>
                  <div className="clean-field">
                    <label className="clean-label" htmlFor="permTaluk">
                      {isTa ? 'தாலுகா' : 'Taluk'}
                    </label>
                    <input
                      id="permTaluk"
                      type="text"
                      value={formData.personal.permanentAddress.taluk}
                      onChange={(e) => {
                        setUserEditedPerm(prev => ({ ...prev, taluk: true }))
                        updateAddress('permanentAddress', 'taluk', e.target.value)
                      }}
                      placeholder="e.g. Dindigul"
                      className="clean-input"
                    />
                  </div>
                </div>

                {/* Multiple Localities Dropdown for Permanent Address */}
                {permPostalInfo.results.length > 1 && (
                  <div className="clean-field" style={{ marginBottom: '14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '10px 12px' }}>
                    <label className="clean-label" style={{ color: '#1e40af', marginBottom: '4px' }}>
                      {isTa ? 'பின்கோட்டில் உள்ள தபால் நிலையம் / பகுதியைத் தேர்வு செய்யவும்:' : 'Select your locality / post office from PIN results:'}
                    </label>
                    <select
                      onChange={(e) => handleSelectPermLocality(e.target.value)}
                      value={formData.personal.permanentAddress.cityTown}
                      className="clean-select"
                      style={{ borderColor: '#3b82f6', background: '#ffffff' }}
                    >
                      {permPostalInfo.results.map((loc) => (
                        <option key={loc.name} value={loc.name}>
                          {loc.name} ({loc.branchType || 'Post Office'}) — {loc.district}, {loc.state}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="clean-grid-3">
                  <div className="clean-field">
                    <label className="clean-label" htmlFor="permDistrict">
                      {isTa ? 'மாவட்டம்' : 'District'}
                    </label>
                    <input
                      id="permDistrict"
                      type="text"
                      value={formData.personal.permanentAddress.district}
                      onChange={(e) => {
                        setUserEditedPerm(prev => ({ ...prev, district: true }))
                        updateAddress('permanentAddress', 'district', e.target.value)
                      }}
                      placeholder="e.g. Dindigul"
                      className="clean-input"
                    />
                  </div>
                  <div className="clean-field">
                    <label className="clean-label" htmlFor="permState">
                      {isTa ? 'மாநிலம்' : 'State'}
                    </label>
                    <input
                      id="permState"
                      type="text"
                      autoComplete="address-level1"
                      value={formData.personal.permanentAddress.state}
                      onChange={(e) => {
                        setUserEditedPerm(prev => ({ ...prev, state: true }))
                        updateAddress('permanentAddress', 'state', e.target.value)
                      }}
                      className="clean-input"
                    />
                  </div>
                  <div className="clean-field">
                    <label className="clean-label" htmlFor="permCountry">
                      {isTa ? 'நாடு' : 'Country'}
                    </label>
                    <input
                      id="permCountry"
                      type="text"
                      autoComplete="country-name"
                      value={formData.personal.permanentAddress.country}
                      onChange={(e) => updateAddress('permanentAddress', 'country', e.target.value)}
                      className="clean-input"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Address Sync Checkbox */}
              <div
                className={`clean-checkbox-row ${formData.personal.contactAddressSameAsPermanent ? 'active' : ''}`}
                onClick={() => updateNested('personal', 'contactAddressSameAsPermanent', !formData.personal.contactAddressSameAsPermanent)}
              >
                <div className="clean-checkbox-box">
                  {formData.personal.contactAddressSameAsPermanent && <CheckIcon size={12} color="#ffffff" />}
                </div>
                <span className="clean-checkbox-label">
                  {isTa ? 'தொடர்பு முகவரியும் நிரந்தர முகவரியும் ஒன்றே' : 'Contact address is the same as permanent address'}
                </span>
              </div>

              {/* Separate Contact Address Fields if unchecked */}
              {!formData.personal.contactAddressSameAsPermanent && (
                <div style={{ marginTop: '14px', padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                    {isTa ? 'தொடர்பு முகவரி' : 'Contact Address'}
                  </h3>

                  <div className="clean-grid-3">
                    <div className="clean-field">
                      <label className="clean-label">{isTa ? 'கதவு எண்' : 'Door No.'}</label>
                      <input
                        type="text"
                        value={formData.personal.contactAddress.doorNo}
                        onChange={(e) => updateAddress('contactAddress', 'doorNo', e.target.value)}
                        className="clean-input"
                      />
                    </div>
                    <div className="clean-field" style={{ gridColumn: 'span 2' }}>
                      <label className="clean-label">{isTa ? 'தெருப் பெயர்' : 'Street Name'}</label>
                      <input
                        type="text"
                        value={formData.personal.contactAddress.streetName}
                        onChange={(e) => updateAddress('contactAddress', 'streetName', e.target.value)}
                        className="clean-input"
                      />
                    </div>
                  </div>

                  <div className="clean-grid-3">
                    <div className="clean-field">
                      <label className="clean-label">{isTa ? 'நகரம் / ஊர்' : 'City / Town'}</label>
                      <input
                        type="text"
                        value={formData.personal.contactAddress.cityTown}
                        onChange={(e) => updateAddress('contactAddress', 'cityTown', e.target.value)}
                        className="clean-input"
                      />
                    </div>
                    <div className="clean-field">
                      <label className="clean-label">{isTa ? 'மாவட்டம்' : 'District'}</label>
                      <input
                        type="text"
                        value={formData.personal.contactAddress.district}
                        onChange={(e) => updateAddress('contactAddress', 'district', e.target.value)}
                        className="clean-input"
                      />
                    </div>
                    <div className="clean-field">
                      <label className="clean-label">{isTa ? 'பின்கோடு' : 'PIN Code'}</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={formData.personal.contactAddress.pincode}
                        onChange={(e) => updateAddress('contactAddress', 'pincode', e.target.value.replace(/\D/g, ''))}
                        className="clean-input"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2: SPIRITUAL INFORMATION ================= */}
          {currentStep === 2 && (
            <div>
              <div className="clean-form-step-header">
                <h2 className="clean-step-heading">
                  {isTa ? 'படி 2 : ஆவிக்குரிய தகவல்கள் & ஊழிய அழைப்பு' : 'Step 2: Ministry & Spiritual Calling'}
                </h2>
                <p className="clean-step-sub">
                  {isTa ? 'தாங்கள் செய்யும் முதன்மை ஊழியப் பணியைத் தேர்ந்தெடுக்கவும்.' : 'Select your primary fivefold ecclesiastical ministry function.'}
                </p>
              </div>

              <div className="clean-field" style={{ marginBottom: '20px' }}>
                <label className="clean-label" style={{ marginBottom: '6px' }}>
                  {isTa ? 'தாங்கள் செய்யும் ஊழியத்தைத் தேர்வு செய்க' : 'Select Your Current Ministry Function'}
                </label>

                <div className="clean-radio-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
                  {MINISTRY_CALLING_OPTIONS.map((c) => (
                    <div
                      key={c.value}
                      onClick={() => updateNested('spiritual', 'ministryFunction', c.value)}
                      className={`clean-radio-pill ${formData.spiritual.ministryFunction === c.value ? 'active' : ''}`}
                      style={{ padding: '12px 14px' }}
                    >
                      <div className="clean-checkbox-box">
                        {formData.spiritual.ministryFunction === c.value && <CheckIcon size={12} color="#ffffff" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{isTa ? c.labelTa : c.labelEn}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{isTa ? c.labelEn : c.labelTa}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditional "Other Ministry" Field */}
              {formData.spiritual.ministryFunction === 'Other Ministry' && (
                <div className="clean-field">
                  <label className="clean-label" htmlFor="otherMinistry">
                    {isTa ? 'மற்ற ஊழியத்தை விவரிக்கவும்' : 'Please Specify Your Ministry Details'}
                  </label>
                  <input
                    id="otherMinistry"
                    type="text"
                    value={formData.spiritual.otherMinistrySpecify}
                    onChange={(e) => updateNested('spiritual', 'otherMinistrySpecify', e.target.value)}
                    placeholder="e.g. Youth Pastor / Worship Leader / Media Evangelist"
                    className="clean-input"
                  />
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3: AFFILIATION & CHURCH DETAILS ================= */}
          {currentStep === 3 && (
            <div>
              <div className="clean-form-step-header">
                <h2 className="clean-step-heading">
                  {isTa ? 'படி 3 : பேராய இணைப்பு & சபை விவரங்கள்' : 'Step 3: Affiliation & Church Details'}
                </h2>
                <p className="clean-step-sub">
                  {isTa ? 'முந்தைய திருச்சபை இணைப்பு மற்றும் தாங்கள் ஊழியம் செய்யும் சபையின் முகவரி.' : 'Previous ecclesiastical affiliation and church contact details.'}
                </p>
              </div>

              {/* Affiliation Type */}
              <div className="clean-field" style={{ marginBottom: '18px' }}>
                <label className="clean-label">{isTa ? 'பேராயம் / நிறுவனம் / ஐக்கிய இணைப்பு வகை' : 'Ecclesiastical Affiliation'}</label>
                <div className="clean-radio-grid">
                  {AFFILIATION_OPTIONS.map((aff) => (
                    <div
                      key={aff.value}
                      onClick={() => updateNested('affiliation', 'affiliationType', aff.value)}
                      className={`clean-radio-pill ${formData.affiliation.affiliationType === aff.value ? 'active' : ''}`}
                    >
                      <div className="clean-checkbox-box">
                        {formData.affiliation.affiliationType === aff.value && <CheckIcon size={12} color="#ffffff" />}
                      </div>
                      <span>{isTa ? aff.labelTa : aff.labelEn}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditional: Independent Church */}
              {formData.affiliation.affiliationType === 'Independent Church' && (
                <div className="clean-field">
                  <label className="clean-label" htmlFor="founderName">
                    {isTa ? 'நிறுவனர் பெயர்' : "Founder's Name"}
                  </label>
                  <input
                    id="founderName"
                    type="text"
                    value={formData.affiliation.founderName}
                    onChange={(e) => updateNested('affiliation', 'founderName', e.target.value)}
                    placeholder="Enter Founder's Name"
                    className="clean-input"
                  />
                </div>
              )}

              {/* Conditional: Denomination */}
              {formData.affiliation.affiliationType === 'Denomination' && (
                <div className="clean-field">
                  <label className="clean-label" htmlFor="denomSpecify">
                    {isTa ? 'சபைப் பிரிவு (விவரம்)' : 'Denomination Name (Specify)'}
                  </label>
                  <input
                    id="denomSpecify"
                    type="text"
                    value={formData.affiliation.denominationSpecify}
                    onChange={(e) => updateNested('affiliation', 'denominationSpecify', e.target.value)}
                    placeholder="e.g. Pentecostal / Baptist / Independent"
                    className="clean-input"
                  />
                </div>
              )}

              {/* Conditional: Associate Pastor */}
              {formData.affiliation.affiliationType === 'Associate / Assistant' && (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px', marginBottom: '16px' }}>
                  <div className="clean-grid-2">
                    <div className="clean-field">
                      <label className="clean-label" htmlFor="chiefPastor">
                        {isTa ? 'தலைமை மேய்ப்பரின் பெயர்' : 'Name of Chief Pastor'}
                      </label>
                      <input
                        id="chiefPastor"
                        type="text"
                        value={formData.affiliation.associateChiefPastorName}
                        onChange={(e) => updateNested('affiliation', 'associateChiefPastorName', e.target.value)}
                        className="clean-input"
                      />
                    </div>
                    <div className="clean-field">
                      <label className="clean-label" htmlFor="motherChurch">
                        {isTa ? 'தலைமை சபையின் பெயர்' : 'Name of Church'}
                      </label>
                      <input
                        id="motherChurch"
                        type="text"
                        value={formData.affiliation.associateChurchName}
                        onChange={(e) => updateNested('affiliation', 'associateChurchName', e.target.value)}
                        className="clean-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="clean-field">
                <label className="clean-label" htmlFor="trustName">
                  {isTa ? 'உங்களது டிரஸ்டின் பெயர்' : 'Name of Your Trust'}
                  <span className="opt-tag">(Optional)</span>
                </label>
                <input
                  id="trustName"
                  type="text"
                  value={formData.affiliation.trustName}
                  onChange={(e) => updateNested('affiliation', 'trustName', e.target.value)}
                  placeholder="e.g. Living Word Charitable Trust"
                  className="clean-input"
                />
              </div>

              {/* Church Information */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {isTa ? 'சபையின் தகவல்கள்' : 'Church Details'}
                  </h3>
                  <button
                    type="button"
                    onClick={handleCopyContactToChurch}
                    className="app-review-edit-btn"
                    title="Copy your contact address to church address"
                  >
                    <span>{isTa ? 'முகவரியை இங்கேயும் பயன்படுத்து' : 'Use my contact address for church'}</span>
                  </button>
                </div>

                <div className="clean-field">
                  <label className="clean-label" htmlFor="churchName">
                    {isTa ? 'சபையின் பெயர்' : 'Church Name'}
                    <span className="req-star">*</span>
                  </label>
                  <input
                    id="churchName"
                    type="text"
                    value={formData.church.churchName}
                    onChange={(e) => updateChurchAddress('churchName', e.target.value)}
                    placeholder="e.g. Living Redeemer Apostolic Church"
                    className={`clean-input ${errors.churchName ? 'has-error' : ''}`}
                    required
                  />
                  {errors.churchName && <span className="clean-error-text">{errors.churchName}</span>}
                </div>

                <div className="clean-grid-3">
                  <div className="clean-field">
                    <label className="clean-label">{isTa ? 'கதவு எண்' : 'Door No.'}</label>
                    <input
                      type="text"
                      value={formData.church.doorNo}
                      onChange={(e) => updateChurchAddress('doorNo', e.target.value)}
                      className="clean-input"
                    />
                  </div>
                  <div className="clean-field" style={{ gridColumn: 'span 2' }}>
                    <label className="clean-label">{isTa ? 'தெருப் பெயர்' : 'Street Name'}</label>
                    <input
                      type="text"
                      value={formData.church.streetName}
                      onChange={(e) => updateChurchAddress('streetName', e.target.value)}
                      className="clean-input"
                    />
                  </div>
                </div>

                <div className="clean-grid-3">
                  <div className="clean-field">
                    <label className="clean-label" htmlFor="churchPin">
                      {isTa ? 'பின்கோடு (6 இலக்கங்கள்)' : 'PIN Code (6 digits)'}
                    </label>
                    <input
                      id="churchPin"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={formData.church.pincode}
                      onChange={handleChurchPincodeChange}
                      placeholder="e.g. 624002"
                      className="clean-input"
                    />
                    {churchPostalInfo.msg && (
                      <span className="clean-hint-text" style={{ color: churchPostalInfo.loading ? '#2563eb' : (churchPostalInfo.results.length > 0 ? '#059669' : '#64748b') }}>
                        {churchPostalInfo.msg}
                      </span>
                    )}
                  </div>
                  <div className="clean-field">
                    <label className="clean-label">{isTa ? 'நகரம் / ஊர்' : 'City / Town'}</label>
                    <input
                      type="text"
                      value={formData.church.cityTown}
                      onChange={(e) => {
                        setUserEditedChurch(prev => ({ ...prev, cityTown: true }))
                        updateChurchAddress('cityTown', e.target.value)
                      }}
                      className="clean-input"
                    />
                  </div>
                  <div className="clean-field">
                    <label className="clean-label">{isTa ? 'தாலுகா' : 'Taluk'}</label>
                    <input
                      type="text"
                      value={formData.church.taluk}
                      onChange={(e) => {
                        setUserEditedChurch(prev => ({ ...prev, taluk: true }))
                        updateChurchAddress('taluk', e.target.value)
                      }}
                      className="clean-input"
                    />
                  </div>
                </div>

                {/* Multiple Localities Dropdown for Church Address */}
                {churchPostalInfo.results.length > 1 && (
                  <div className="clean-field" style={{ marginBottom: '14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '10px 12px' }}>
                    <label className="clean-label" style={{ color: '#1e40af', marginBottom: '4px' }}>
                      {isTa ? 'பின்கோட்டில் உள்ள தபால் நிலையம் / பகுதியைத் தேர்வு செய்யவும்:' : 'Select church locality / post office from PIN results:'}
                    </label>
                    <select
                      onChange={(e) => handleSelectChurchLocality(e.target.value)}
                      value={formData.church.cityTown}
                      className="clean-select"
                      style={{ borderColor: '#3b82f6', background: '#ffffff' }}
                    >
                      {churchPostalInfo.results.map((loc) => (
                        <option key={loc.name} value={loc.name}>
                          {loc.name} ({loc.branchType || 'Post Office'}) — {loc.district}, {loc.state}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="clean-grid-3">
                  <div className="clean-field">
                    <label className="clean-label">{isTa ? 'மாவட்டம்' : 'District'}</label>
                    <input
                      type="text"
                      value={formData.church.district}
                      onChange={(e) => {
                        setUserEditedChurch(prev => ({ ...prev, district: true }))
                        updateChurchAddress('district', e.target.value)
                      }}
                      className="clean-input"
                    />
                  </div>
                  <div className="clean-field">
                    <label className="clean-label">{isTa ? 'மாநிலம்' : 'State'}</label>
                    <input
                      type="text"
                      value={formData.church.state}
                      onChange={(e) => {
                        setUserEditedChurch(prev => ({ ...prev, state: true }))
                        updateChurchAddress('state', e.target.value)
                      }}
                      className="clean-input"
                    />
                  </div>
                  <div className="clean-field">
                    <label className="clean-label">{isTa ? 'நாடு' : 'Country'}</label>
                    <input
                      type="text"
                      value={formData.church.country}
                      onChange={(e) => updateChurchAddress('country', e.target.value)}
                      className="clean-input"
                    />
                  </div>
                </div>

                <div className="clean-grid-3">
                  <div className="clean-field">
                    <label className="clean-label">
                      {isTa ? 'தொலைபேசி எண் (Telephone)' : 'Telephone (Landline)'}
                      <span className="opt-tag">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={formData.church.telephone}
                      onChange={(e) => updateChurchAddress('telephone', e.target.value)}
                      placeholder="e.g. 0451 2490100"
                      className="clean-input"
                    />
                  </div>

                  <div className="clean-field">
                    <label className="clean-label">
                      {isTa ? 'கைப்பேசி எண் (Mobile Number)' : 'Mobile Number (10 Digits)'}
                      <span className="req-star">*</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      maxLength={10}
                      value={formData.church.mobileNumber}
                      onChange={(e) => updateChurchAddress('mobileNumber', e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 9486485810"
                      className={`clean-input ${errors.mobileNumber ? 'has-error' : ''}`}
                      required
                    />
                    {errors.mobileNumber && <span className="clean-error-text">{errors.mobileNumber}</span>}
                  </div>

                  <div className="clean-field">
                    <label className="clean-label">
                      {isTa ? 'மின்னஞ்சல் முகவரி' : 'Email ID'}
                      <span className="opt-tag">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={formData.church.emailId}
                      onChange={(e) => updateChurchAddress('emailId', e.target.value)}
                      placeholder="pastor@gmail.com"
                      className="clean-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: MILESTONES & QUALIFICATIONS ================= */}
          {currentStep === 4 && (
            <div>
              <div className="clean-form-step-header">
                <h2 className="clean-step-heading">
                  {isTa ? 'படி 4 : ஊழிய மைல்கற்கள் & தகுதிகள்' : 'Step 4: Ministry Milestones & Qualifications'}
                </h2>
                <p className="clean-step-sub">
                  {isTa ? 'ஆவிக்குரிய தேதிகள் மற்றும் கல்வி/இறையியல் தகுதிகள்.' : 'Spiritual experience dates and academic / theological qualifications.'}
                </p>
              </div>

              {/* 5 Milestone DateFields */}
              <div className="clean-grid-2" style={{ marginBottom: '20px' }}>
                <DateField
                  label={isTa ? '1. எப்பொழுது மறுபிறப்பின் அனுபவத்தைப் பெற்றீர்கள்?' : '1. When were you Born Again?'}
                  value={formData.ministryHistory.bornAgainDate}
                  onChange={(val) => updateNested('ministryHistory', 'bornAgainDate', val)}
                  isTa={isTa}
                />

                <DateField
                  label={isTa ? '2. எப்பொழுது முழுக்கு ஞானஸ்நானம் பெற்றீர்கள்?' : '2. When were you Baptized in Full Immersion?'}
                  value={formData.ministryHistory.waterBaptismDate}
                  onChange={(val) => updateNested('ministryHistory', 'waterBaptismDate', val)}
                  isTa={isTa}
                />

                <DateField
                  label={isTa ? '3. எப்பொழுது பரிசுத்த ஆவியின் அபிஷேகத்தைப் பெற்றீர்கள்?' : '3. When were you Filled with the Holy Spirit?'}
                  value={formData.ministryHistory.holySpiritBaptismDate}
                  onChange={(val) => updateNested('ministryHistory', 'holySpiritBaptismDate', val)}
                  isTa={isTa}
                />

                <DateField
                  label={isTa ? '4. எப்பொழுது ஊழிய அழைப்பைப் பெற்றீர்கள்?' : '4. When were you Called for Ministry?'}
                  value={formData.ministryHistory.callingDate}
                  onChange={(val) => updateNested('ministryHistory', 'callingDate', val)}
                  isTa={isTa}
                />

                <div style={{ gridColumn: 'span 2' }}>
                  <DateField
                    label={isTa ? '5. எப்பொழுது ஊழியத்தைத் துவக்கினீர்கள்?' : '5. When did you Start Active Ministry?'}
                    value={formData.ministryHistory.ministryStartDate}
                    onChange={(val) => updateNested('ministryHistory', 'ministryStartDate', val)}
                    isTa={isTa}
                  />
                </div>
              </div>

              {/* Ordination & Affiliation Intent */}
              <div className="clean-grid-2" style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <div className="clean-field">
                  <label className="clean-label">{isTa ? '6. இந்தப் பேராயத்தால் பிரதிஷ்டை பெற விரும்புகிறீர்களா?' : '6. Do you want to be ordained by ACI Diocese?'}</label>
                  <div className="clean-radio-grid">
                    {['Yes', 'No'].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => updateNested('ministryHistory', 'wantOrdination', opt)}
                        className={`clean-radio-pill ${formData.ministryHistory.wantOrdination === opt ? 'active' : ''}`}
                      >
                        <div className="clean-checkbox-box">
                          {formData.ministryHistory.wantOrdination === opt && <CheckIcon size={12} color="#ffffff" />}
                        </div>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="clean-field">
                  <label className="clean-label">{isTa ? '7. இந்தப் பேராயத்தின் இணைப்பைப் பெற விரும்புகிறீர்களா?' : '7. Do you want to be affiliated with ACI Diocese?'}</label>
                  <div className="clean-radio-grid">
                    {['Yes', 'No'].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => updateNested('ministryHistory', 'wantAffiliation', opt)}
                        className={`clean-radio-pill ${formData.ministryHistory.wantAffiliation === opt ? 'active' : ''}`}
                      >
                        <div className="clean-checkbox-box">
                          {formData.ministryHistory.wantAffiliation === opt && <CheckIcon size={12} color="#ffffff" />}
                        </div>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Academic Qualifications Table */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                  {isTa ? 'VI. பொதுக் கல்வித் தகுதி' : 'VI. Academic Qualifications'}
                </h3>

                {formData.qualifications.academic.map((ac, idx) => (
                  <div key={ac.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af' }}>Entry #{idx + 1}</span>
                      {formData.qualifications.academic.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAcademicRow(ac.id)}
                          style={{ color: '#dc2626', fontSize: '12px', cursor: 'pointer', background: 'none', border: 'none' }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="clean-grid-3">
                      <input
                        type="text"
                        value={ac.examinationPassed}
                        onChange={(e) => updateAcademicRow(ac.id, 'examinationPassed', e.target.value)}
                        placeholder="Exam (e.g. SSLC / B.A.)"
                        className="clean-input"
                      />
                      <input
                        type="text"
                        value={ac.year}
                        onChange={(e) => updateAcademicRow(ac.id, 'year', e.target.value)}
                        placeholder="Year (e.g. 2018)"
                        className="clean-input"
                      />
                      <input
                        type="text"
                        value={ac.institution}
                        onChange={(e) => updateAcademicRow(ac.id, 'institution', e.target.value)}
                        placeholder="School / College / University"
                        className="clean-input"
                      />
                    </div>
                  </div>
                ))}

                <button type="button" onClick={addAcademicRow} className="clean-photo-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
                  + {isTa ? 'கூடுதல் கல்வித் தகுதியை சேர்' : 'Add Academic Qualification'}
                </button>
              </div>

              {/* Theological Qualifications Table */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                  {isTa ? 'VII. இறையியல் தகுதி' : 'VII. Theological Qualifications'}
                </h3>

                {formData.qualifications.theological.map((th, idx) => (
                  <div key={th.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af' }}>Theological #{idx + 1}</span>
                      {formData.qualifications.theological.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTheologicalRow(th.id)}
                          style={{ color: '#dc2626', fontSize: '12px', cursor: 'pointer', background: 'none', border: 'none' }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="clean-grid-3">
                      <input
                        type="text"
                        value={th.examinationPassed}
                        onChange={(e) => updateTheologicalRow(th.id, 'examinationPassed', e.target.value)}
                        placeholder="Course (e.g. B.Th. / M.Div.)"
                        className="clean-input"
                      />
                      <input
                        type="text"
                        value={th.year}
                        onChange={(e) => updateTheologicalRow(th.id, 'year', e.target.value)}
                        placeholder="Year (e.g. 2021)"
                        className="clean-input"
                      />
                      <input
                        type="text"
                        value={th.institution}
                        onChange={(e) => updateTheologicalRow(th.id, 'institution', e.target.value)}
                        placeholder="Seminary / Bible College"
                        className="clean-input"
                      />
                    </div>
                  </div>
                ))}

                <button type="button" onClick={addTheologicalRow} className="clean-photo-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
                  + {isTa ? 'கூடுதல் இறையியல் படிப்பை சேர்' : 'Add Theological Qualification'}
                </button>
              </div>

              {/* Family Details Table */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                  {isTa ? 'VIII. குடும்ப விவரங்கள்' : 'VIII. Family Details'}
                </h3>

                {formData.family.map((fam, idx) => (
                  <div key={fam.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af' }}>Family Member #{idx + 1}</span>
                      {formData.family.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFamilyRow(fam.id)}
                          style={{ color: '#dc2626', fontSize: '12px', cursor: 'pointer', background: 'none', border: 'none' }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="clean-grid-3">
                      <input
                        type="text"
                        value={fam.name}
                        onChange={(e) => updateFamilyRow(fam.id, 'name', e.target.value)}
                        placeholder="Name"
                        className="clean-input"
                      />
                      <input
                        type="text"
                        value={fam.relationship}
                        onChange={(e) => updateFamilyRow(fam.id, 'relationship', e.target.value)}
                        placeholder="Relationship (Spouse/Son/Daughter)"
                        className="clean-input"
                      />
                      <input
                        type="text"
                        value={fam.professionEducation}
                        onChange={(e) => updateFamilyRow(fam.id, 'professionEducation', e.target.value)}
                        placeholder="Profession / Education"
                        className="clean-input"
                      />
                    </div>
                  </div>
                ))}

                <button type="button" onClick={addFamilyRow} className="clean-photo-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
                  + {isTa ? 'குடும்ப உறுப்பினரை சேர்' : 'Add Family Member'}
                </button>
              </div>

              {/* IX. Enclosures & Required Document Uploads */}
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  {isTa ? 'IX. இணைக்கப்பட வேண்டிய சான்றிதழ்கள் & ஆவணங்கள்' : 'IX. Required Document Uploads & Enclosures'}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
                  {isTa ? 'விண்ணப்பத்துடன் தேவையான அனைத்து சான்றிதழ்களையும் பதிவேற்றவும் (PDF, JPG, PNG).' : 'Upload all supporting proof documents (PDF, JPG, PNG up to 10MB each).'}
                </p>

                <div className="clean-grid-2" style={{ gap: '14px' }}>
                  {/* 1. Proof of Identity */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1e40af', display: 'block', marginBottom: '4px' }}>
                      1. {isTa ? 'அடையாளச் சான்று (Aadhaar / Voter ID / Passport)' : 'Proof of Identity (Aadhaar / Voter ID)'}
                    </span>
                    {formData.enclosures.proofIdentity ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                          📄 {formData.enclosures.proofIdentity}
                        </span>
                        <button type="button" onClick={() => handleRemoveEnclosure('proofIdentity')} style={{ color: '#dc2626', fontSize: '11px', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                      </div>
                    ) : (
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleEnclosureUpload('proofIdentity', e)} className="clean-input" style={{ fontSize: '11.5px', padding: '4px' }} />
                    )}
                  </div>

                  {/* 2. Proof of Address */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1e40af', display: 'block', marginBottom: '4px' }}>
                      2. {isTa ? 'முகவரி சான்று (Ration Card / EB Bill / Gas Bill)' : 'Proof of Address (Ration Card / Utility Bill)'}
                    </span>
                    {formData.enclosures.proofAddress ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                          📄 {formData.enclosures.proofAddress}
                        </span>
                        <button type="button" onClick={() => handleRemoveEnclosure('proofAddress')} style={{ color: '#dc2626', fontSize: '11px', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                      </div>
                    ) : (
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleEnclosureUpload('proofAddress', e)} className="clean-input" style={{ fontSize: '11.5px', padding: '4px' }} />
                    )}
                  </div>

                  {/* 3. Proof of DOB */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1e40af', display: 'block', marginBottom: '4px' }}>
                      3. {isTa ? 'பிறந்த தேதி சான்று (10th TC / Birth Certificate)' : 'Proof of DOB (Birth Certificate / 10th TC)'}
                    </span>
                    {formData.enclosures.proofDob ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                          📄 {formData.enclosures.proofDob}
                        </span>
                        <button type="button" onClick={() => handleRemoveEnclosure('proofDob')} style={{ color: '#dc2626', fontSize: '11px', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                      </div>
                    ) : (
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleEnclosureUpload('proofDob', e)} className="clean-input" style={{ fontSize: '11.5px', padding: '4px' }} />
                    )}
                  </div>

                  {/* 4. Proof of Name Change (Optional) */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1e40af', display: 'block', marginBottom: '4px' }}>
                      4. {isTa ? 'பெயர் மாற்ற சான்று (அரசிதழ் / விருப்பத்தேர்வு)' : 'Proof of Name Change (Gazette / Optional)'}
                    </span>
                    {formData.enclosures.proofNameChange ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                          📄 {formData.enclosures.proofNameChange}
                        </span>
                        <button type="button" onClick={() => handleRemoveEnclosure('proofNameChange')} style={{ color: '#dc2626', fontSize: '11px', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                      </div>
                    ) : (
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleEnclosureUpload('proofNameChange', e)} className="clean-input" style={{ fontSize: '11.5px', padding: '4px' }} />
                    )}
                  </div>

                  {/* 5. Ministry Statement */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1e40af', display: 'block', marginBottom: '4px' }}>
                      5. {isTa ? 'ஊழிய அறிக்கை (1-பக்க சுருக்க அறிக்கை)' : 'Ministry Statement (1-Page Summary Report)'}
                    </span>
                    {formData.enclosures.ministryStatement ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                          📄 {formData.enclosures.ministryStatement}
                        </span>
                        <button type="button" onClick={() => handleRemoveEnclosure('ministryStatement')} style={{ color: '#dc2626', fontSize: '11px', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                      </div>
                    ) : (
                      <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={(e) => handleEnclosureUpload('ministryStatement', e)} className="clean-input" style={{ fontSize: '11.5px', padding: '4px' }} />
                    )}
                  </div>

                  {/* 6. Church & Congregation Photo */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1e40af', display: 'block', marginBottom: '4px' }}>
                      6. {isTa ? 'சபை & ஆராதனை புகைப்படங்கள்' : 'Church Building & Congregation Photo'}
                    </span>
                    {formData.enclosures.churchPhoto ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                          📷 {formData.enclosures.churchPhoto}
                        </span>
                        <button type="button" onClick={() => handleRemoveEnclosure('churchPhoto')} style={{ color: '#dc2626', fontSize: '11px', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                      </div>
                    ) : (
                      <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => handleEnclosureUpload('churchPhoto', e)} className="clean-input" style={{ fontSize: '11.5px', padding: '4px' }} />
                    )}
                  </div>

                  {/* 7. Ordination / Theological Degree */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1e40af', display: 'block', marginBottom: '4px' }}>
                      7. {isTa ? 'பட்டமளிப்பு / வேதாகம கல்லூரி சான்றிதழ்' : 'Ordination Certificate / Seminary Degree'}
                    </span>
                    {formData.enclosures.ordinationCertificate ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                          📄 {formData.enclosures.ordinationCertificate}
                        </span>
                        <button type="button" onClick={() => handleRemoveEnclosure('ordinationCertificate')} style={{ color: '#dc2626', fontSize: '11px', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                      </div>
                    ) : (
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleEnclosureUpload('ordinationCertificate', e)} className="clean-input" style={{ fontSize: '11.5px', padding: '4px' }} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 5: REVIEW, REFERENCES & DECLARATION ================= */}
          {currentStep === 5 && (
            <div>
              <div className="clean-form-step-header">
                <h2 className="clean-step-heading">
                  {isTa ? 'படி 5 : சரிபார்த்தல் & உறுதிமொழி அறிக்கை' : 'Step 5: Review, References & Statutory Declaration'}
                </h2>
                <p className="clean-step-sub">
                  {isTa ? 'விவரங்களை சரிபார்த்து, பரிந்துரைகளை உள்ளிட்டு உறுதிமொழியை உறுதிசெய்யவும்.' : 'Review your application summary, provide references, and sign the official declaration.'}
                </p>
              </div>

              {/* Review View Selector Tabs */}
              <div className="app-review-tabs">
                <button
                  type="button"
                  onClick={() => setReviewTab('summary')}
                  className={`app-review-tab-btn ${reviewTab === 'summary' ? 'active' : ''}`}
                >
                  <DocumentIcon size={14} />
                  <span>{isTa ? 'டிஜிட்டல் சுருக்கம்' : 'Digital Summary Review'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewTab('official')}
                  className={`app-review-tab-btn ${reviewTab === 'official' ? 'active' : ''}`}
                >
                  <ShieldIcon size={14} />
                  <span>{isTa ? 'அதிகாரப்பூர்வ 4-பக்க படிவ முன்னோட்டம்' : 'Official 4-Page Form Preview'}</span>
                </button>
              </div>

              {/* TAB 1: Structured Digital Summary Cards with [Edit] Buttons */}
              {reviewTab === 'summary' && (
                <div>
                  {/* Card 1: Personal Details */}
                  <div className="app-review-card">
                    <div className="app-review-card-header">
                      <span className="app-review-card-title">{isTa ? '1. சுய விவரங்கள்' : '1. Personal Details'}</span>
                      <button type="button" onClick={() => setCurrentStep(1)} className="app-review-edit-btn">
                        <EditIcon size={12} />
                        <span>{isTa ? 'திருத்து' : 'Edit'}</span>
                      </button>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">Full Name:</span>
                      <span className="app-review-val">{formData.personal.salutation} {formData.personal.name || '—'}</span>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">Date of Birth:</span>
                      <span className="app-review-val">{formData.personal.dob || '—'} ({formData.personal.gender}, {formData.personal.maritalStatus})</span>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">Permanent Address:</span>
                      <span className="app-review-val">
                        {[formData.personal.permanentAddress.doorNo, formData.personal.permanentAddress.streetName, formData.personal.permanentAddress.cityTown, formData.personal.permanentAddress.district, formData.personal.permanentAddress.pincode].filter(Boolean).join(', ') || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Ministry Calling */}
                  <div className="app-review-card">
                    <div className="app-review-card-header">
                      <span className="app-review-card-title">{isTa ? '2. ஆவிக்குரிய தகவல்கள்' : '2. Ministry Calling'}</span>
                      <button type="button" onClick={() => setCurrentStep(2)} className="app-review-edit-btn">
                        <EditIcon size={12} />
                        <span>{isTa ? 'திருத்து' : 'Edit'}</span>
                      </button>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">Ministry Function:</span>
                      <span className="app-review-val">{formData.spiritual.ministryFunction} {formData.spiritual.otherMinistrySpecify && `(${formData.spiritual.otherMinistrySpecify})`}</span>
                    </div>
                  </div>

                  {/* Card 3: Church Details */}
                  <div className="app-review-card">
                    <div className="app-review-card-header">
                      <span className="app-review-card-title">{isTa ? '3. சபை மற்றும் தொடர்பு' : '3. Church & Contact'}</span>
                      <button type="button" onClick={() => setCurrentStep(3)} className="app-review-edit-btn">
                        <EditIcon size={12} />
                        <span>{isTa ? 'திருத்து' : 'Edit'}</span>
                      </button>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">Church Name:</span>
                      <span className="app-review-val">{formData.church.churchName || '—'}</span>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">Church Mobile:</span>
                      <span className="app-review-val">{formData.church.mobileNumber || '—'}</span>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">Affiliation Type:</span>
                      <span className="app-review-val">{formData.affiliation.affiliationType}</span>
                    </div>
                  </div>

                  {/* Card 4: Milestones & Qualifications */}
                  {/* Card 4: Milestones & Qualifications */}
                  <div className="app-review-card">
                    <div className="app-review-card-header">
                      <span className="app-review-card-title">{isTa ? '4. கல்வி & மைல்கற்கள்' : '4. Milestones & Qualifications'}</span>
                      <button type="button" onClick={() => setCurrentStep(4)} className="app-review-edit-btn">
                        <EditIcon size={12} />
                        <span>{isTa ? 'திருத்து' : 'Edit'}</span>
                      </button>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">Ministry Start Date:</span>
                      <span className="app-review-val">{formData.ministryHistory.ministryStartDate || '—'}</span>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">Academic Entries:</span>
                      <span className="app-review-val">{formData.qualifications.academic.length} recorded</span>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">Theological Entries:</span>
                      <span className="app-review-val">{formData.qualifications.theological.length} recorded</span>
                    </div>
                  </div>

                  {/* Card 5: Attached Proof Documents & Enclosures */}
                  <div className="app-review-card">
                    <div className="app-review-card-header">
                      <span className="app-review-card-title">{isTa ? '5. இணைக்கப்பட்ட சான்றிதழ்கள் & ஆவணங்கள்' : '5. Attached Proofs & Documents'}</span>
                      <button type="button" onClick={() => setCurrentStep(4)} className="app-review-edit-btn">
                        <EditIcon size={12} />
                        <span>{isTa ? 'திருத்து' : 'Edit'}</span>
                      </button>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">ID Proof:</span>
                      <span className="app-review-val">{formData.enclosures.proofIdentity || '—'}</span>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">Address Proof:</span>
                      <span className="app-review-val">{formData.enclosures.proofAddress || '—'}</span>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">DOB Proof:</span>
                      <span className="app-review-val">{formData.enclosures.proofDob || '—'}</span>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">Passport Photo:</span>
                      <span className="app-review-val">{formData.enclosures.passportPhoto || '—'}</span>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">Ministry Statement:</span>
                      <span className="app-review-val">{formData.enclosures.ministryStatement || '—'}</span>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">Church Photo:</span>
                      <span className="app-review-val">{formData.enclosures.churchPhoto || '—'}</span>
                    </div>
                    <div className="app-review-row">
                      <span className="app-review-lbl">Ordination Cert:</span>
                      <span className="app-review-val">{formData.enclosures.ordinationCertificate || '—'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Official Form Preview */}
              {reviewTab === 'official' && (
                <div style={{ marginBottom: '24px', overflowX: 'auto', background: '#f1f5f9', padding: '16px', borderRadius: '8px' }}>
                  <div className="application-actions-bar" style={{ marginBottom: '16px' }}>
                    <button type="button" onClick={() => setReviewTab('summary')} className="app-action-btn-edit">
                      <ArrowLeftIcon size={15} />
                      <span>{isTa ? 'சுருக்கப் பார்வைக்குத் திரும்பு' : 'Edit Application'}</span>
                    </button>

                    <button type="button" onClick={() => window.print()} className="app-action-btn-print">
                      <PrintIcon size={16} color="#ffffff" />
                      <span>{isTa ? 'படிவத்தை அச்சிடுக / PDF சேமி' : 'Print / Save Official PDF'}</span>
                    </button>
                  </div>
                  <OfficialApplicationForm data={formData} isMini={false} />
                </div>
              )}

              {/* Two References Inputs */}
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                  {isTa ? 'X. இரண்டு பேராய அங்கத்தினர்களின் பரிந்துரை' : 'X. Details of Two References (Must)'}
                </h3>

                <div className="clean-grid-2" style={{ marginBottom: '18px' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1e40af' }}>Reference 1: District Overseer / Member</span>
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <input
                        type="text"
                        value={formData.references.ref1.name}
                        onChange={(e) => setFormData(p => ({ ...p, references: { ...p.references, ref1: { ...p.references.ref1, name: e.target.value } } }))}
                        placeholder="Name of Referrer"
                        className="clean-input"
                      />
                      <input
                        type="text"
                        value={formData.references.ref1.diocesanId}
                        onChange={(e) => setFormData(p => ({ ...p, references: { ...p.references, ref1: { ...p.references.ref1, diocesanId: e.target.value } } }))}
                        placeholder="Diocesan ID No (e.g. TN 0146)"
                        className="clean-input"
                      />
                      <input
                        type="tel"
                        inputMode="tel"
                        value={formData.references.ref1.phone}
                        onChange={(e) => setFormData(p => ({ ...p, references: { ...p.references, ref1: { ...p.references.ref1, phone: e.target.value } } }))}
                        placeholder="Mobile Number"
                        className="clean-input"
                      />
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1e40af' }}>Reference 2: Taluk Co-ordinator / Member</span>
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <input
                        type="text"
                        value={formData.references.ref2.name}
                        onChange={(e) => setFormData(p => ({ ...p, references: { ...p.references, ref2: { ...p.references.ref2, name: e.target.value } } }))}
                        placeholder="Name of Referrer"
                        className="clean-input"
                      />
                      <input
                        type="text"
                        value={formData.references.ref2.diocesanId}
                        onChange={(e) => setFormData(p => ({ ...p, references: { ...p.references, ref2: { ...p.references.ref2, diocesanId: e.target.value } } }))}
                        placeholder="Diocesan ID No (e.g. TN 0466)"
                        className="clean-input"
                      />
                      <input
                        type="tel"
                        inputMode="tel"
                        value={formData.references.ref2.phone}
                        onChange={(e) => setFormData(p => ({ ...p, references: { ...p.references, ref2: { ...p.references.ref2, phone: e.target.value } } }))}
                        placeholder="Mobile Number"
                        className="clean-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div className="clean-field" style={{ marginBottom: '20px' }}>
                <label className="clean-label" htmlFor="motivation">
                  IX. {isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தில் இணையக் காரணம் என்ன?' : 'What prompts you to join APOSTOLIC COUNCIL OF INDIA DIOCESE?'}
                </label>
                <textarea
                  id="motivation"
                  rows={3}
                  value={formData.motivation.reasonToJoin}
                  onChange={(e) => updateNested('motivation', 'reasonToJoin', e.target.value)}
                  placeholder="Describe your calling and affinity with ACI Diocese vision..."
                  className="clean-textarea"
                />
              </div>

              {/* Official Statutory Declaration */}
              <div style={{ background: '#f8fafc', border: '1.5px solid #1e40af', borderRadius: '6px', padding: '18px', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', marginBottom: '8px' }}>
                  XI. Statutory Declaration / உறுதிமொழி மற்றும் கையெழுத்து
                </div>
                <p style={{ fontSize: '12.5px', lineHeight: '1.5', color: '#1e293b', margin: '0 0 10px' }}>
                  &ldquo;I hereby declare that the information furnished above is true to the best of my knowledge. I am fully in agreement with the Faith Statement of ACI Diocese. I understand that this is the united Ministry and I shall give attention to this ministry apart from my church ministry. I shall abide by the terms and conditions of ACI Diocese, in force from time to time.&rdquo;
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  <div
                    className={`clean-checkbox-row ${formData.declaration.acceptedFaithStatement ? 'active' : ''}`}
                    onClick={() => updateNested('declaration', 'acceptedFaithStatement', !formData.declaration.acceptedFaithStatement)}
                    style={{ margin: 0 }}
                  >
                    <div className="clean-checkbox-box">
                      {formData.declaration.acceptedFaithStatement && <CheckIcon size={12} color="#ffffff" />}
                    </div>
                    <span className="clean-checkbox-label">
                      {isTa ? 'நான் ஏசிஐ பேராயத்தின் 15 விசுவாச அறிக்கைகளை முழுமையாக ஏற்றுக்கொள்கிறேன்' : 'I am fully in agreement with the 15 Articles of Faith of ACI Diocese'}
                      <span className="req-star">*</span>
                    </span>
                  </div>
                  {errors.faith && <span className="clean-error-text">{errors.faith}</span>}

                  <div
                    className={`clean-checkbox-row ${formData.declaration.acceptedTerms ? 'active' : ''}`}
                    onClick={() => updateNested('declaration', 'acceptedTerms', !formData.declaration.acceptedTerms)}
                    style={{ margin: 0 }}
                  >
                    <div className="clean-checkbox-box">
                      {formData.declaration.acceptedTerms && <CheckIcon size={12} color="#ffffff" />}
                    </div>
                    <span className="clean-checkbox-label">
                      {isTa ? 'பேராயத்தின் சட்ட விதிகளுக்கும் நிபந்தனைகளுக்கும் கட்டுப்பட ஒப்புக்கொள்கிறேன்' : 'I agree to abide by the terms and conditions of ACI Diocese'}
                      <span className="req-star">*</span>
                    </span>
                  </div>
                  {errors.terms && <span className="clean-error-text">{errors.terms}</span>}

                  <div
                    className={`clean-checkbox-row ${formData.declaration.signatureConfirmation ? 'active' : ''}`}
                    onClick={() => updateNested('declaration', 'signatureConfirmation', !formData.declaration.signatureConfirmation)}
                    style={{ margin: 0 }}
                  >
                    <div className="clean-checkbox-box">
                      {formData.declaration.signatureConfirmation && <CheckIcon size={12} color="#ffffff" />}
                    </div>
                    <span className="clean-checkbox-label">
                      {isTa ? 'டிஜிட்டல் கையொப்ப உறுதிப்படுத்தல்' : 'Digital Signature Confirmation by Applicant'}
                      <span className="req-star">*</span>
                    </span>
                  </div>
                  {errors.sig && <span className="clean-error-text">{errors.sig}</span>}
                </div>

                <div className="clean-grid-2" style={{ marginTop: '14px' }}>
                  <div className="clean-field">
                    <label className="clean-label">{isTa ? 'இடம்' : 'Place'}</label>
                    <input
                      type="text"
                      value={formData.declaration.place}
                      onChange={(e) => updateNested('declaration', 'place', e.target.value)}
                      placeholder="e.g. Dindigul"
                      className="clean-input"
                    />
                  </div>
                  <div className="clean-field">
                    <label className="clean-label">{isTa ? 'விண்ணப்பதாரர் பெயர்' : "Applicant's Name"}</label>
                    <input
                      type="text"
                      value={formData.personal.name}
                      readOnly
                      className="clean-input"
                      style={{ background: '#f1f5f9' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Bar (Back / Continue) */}
          <div className="clean-actions-bar">
            <button
              type="button"
              onClick={handleBack}
              className="clean-btn-back"
            >
              <ArrowLeftIcon size={14} />
              <span>{currentStep === 1 ? (isTa ? 'அறிமுகப் பக்கத்திற்கு' : 'Back to Intro') : (isTa ? 'முந்தைய படி' : 'Back')}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="clean-btn-next"
            >
              <span>{currentStep === 5 ? (isTa ? 'அதிகாரப்பூர்வ படிவத்தை உருவாக்கு & அச்சிடு' : 'Generate & Print Official PDF Form') : (isTa ? 'அடுத்த படி' : 'Continue')}</span>
              <ArrowRightIcon size={14} color="#ffffff" />
            </button>
          </div>

        </div>
      </div>

      {/* Clear Draft Confirmation Modal */}
      {showClearModal && (
        <div className="app-modal-overlay">
          <div className="app-modal-box">
            <h3 className="app-modal-title">
              {isTa ? 'படிவத்தை மீட்டமைக்கவா?' : 'Clear Application Draft?'}
            </h3>
            <p className="app-modal-desc">
              {isTa
                ? 'இந்த சாதனத்தில் உள்ள உங்கள் விண்ணப்ப விவரங்கள் அனைத்தும் நீக்கப்படும். இந்த செயலை மீட்டெடுக்க முடியாது.'
                : 'Are you sure you want to clear this application? This will remove all information saved on this device.'}
            </p>
            <div className="app-modal-actions">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="app-modal-btn-cancel"
              >
                {isTa ? 'ரத்து செய்' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleClearApplication}
                className="app-modal-btn-danger"
              >
                {isTa ? 'படிவத்தை அழி' : 'Clear Application'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
