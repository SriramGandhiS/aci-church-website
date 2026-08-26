import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import {
  ShieldIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  UserCheckIcon,
  DocumentIcon
} from '../components/Icons/SvgIcons'
import DateField from '../components/Form/DateField'
import FilledApplicationPdf from '../components/Form/FilledApplicationPdf'
import OfficialApplicationForm from '../components/Form/OfficialApplicationForm'
import {
  initialApplicationData,
  SALUTATION_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  MINISTRY_CALLING_OPTIONS,
  AFFILIATION_OPTIONS
} from '../data/applicationDefaults'
import './ApplicationPage.css'

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
  { num: 2, key: 'spiritual', labelEn: 'Ministry & Spiritual Calling', labelTa: 'ஆவிக்குரிய தகவல்கள்' },
  { num: 3, key: 'church', labelEn: 'Affiliation & Church', labelTa: 'இணைப்பு & சபை' },
  { num: 4, key: 'experience', labelEn: 'Milestones & Qualifications', labelTa: 'கல்வி & அனுபவம்' },
  { num: 5, key: 'review', labelEn: 'References & Declaration', labelTa: 'பரிந்துரை & உறுதிமொழி' },
]

export default function ApplicationPage() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(initialApplicationData)
  const [isCompleted, setIsCompleted] = useState(false)
  const [errors, setErrors] = useState({})

  const photoInputRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep, isCompleted])

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
    setFormData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [type]: {
          ...prev.personal[type],
          [field]: value,
        },
      },
    }))
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

  // Photo Upload Simulation
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      updateNested('personal', 'photoUrl', evt.target.result)
    }
    reader.readAsDataURL(file)
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

  // Dynamic Family Rows
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

  // Quick Auto-Fill Sample Data for Testing
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
          { id: 'a-2', examinationPassed: 'HSC (+2)', year: '2006', institution: 'St. Marys Hr Sec School' }
        ],
        theological: [
          { id: 't-1', examinationPassed: 'B.Th. / M.Div.', year: '2014', institution: 'Berean Bible Seminary' }
        ],
      },
      family: [
        { id: 'f-1', name: 'Mary Samuel', dob: '1992-08-10', relationship: 'Spouse', professionEducation: 'Teacher' },
        { id: 'f-2', name: 'Timothy Samuel', dob: '2018-04-22', relationship: 'Son', professionEducation: 'Student' }
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

  // Validation Logic
  const validateStep = (step) => {
    const errs = {}
    if (step === 1) {
      if (!formData.personal.name.trim()) errs.name = isTa ? 'முழுப் பெயர் கட்டாயமாகும்' : 'Full Name is required'
      if (!formData.personal.dob) errs.dob = isTa ? 'பிறந்த தேதி கட்டாயமாகும்' : 'Date of Birth is required'
    }
    if (step === 3) {
      if (!formData.church.churchName.trim()) errs.churchName = isTa ? 'சபையின் பெயர் கட்டாயமாகும்' : 'Church Name is required'
      if (!formData.church.mobileNumber.trim()) errs.mobileNumber = isTa ? 'கைப்பேசி எண் கட்டாயமாகும்' : 'Mobile Number is required'
    }
    if (step === 5) {
      if (!formData.declaration.acceptedFaithStatement) errs.faith = isTa ? 'விசுவாச அறிக்கையை ஏற்க வேண்டும்' : 'You must accept the Statement of Faith'
      if (!formData.declaration.acceptedTerms) errs.terms = isTa ? 'விதிமுறைகளை ஏற்க வேண்டும்' : 'You must accept the terms and conditions'
      if (!formData.declaration.signatureConfirmation) errs.sig = isTa ? 'கையொப்ப உறுதிப்படுத்தல் தேவை' : 'Digital confirmation signature required'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep((s) => s + 1)
      } else {
        // Form Complete -> Render Filled Official PDF Template View
        setIsCompleted(true)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
    } else {
      navigate('/get-involved')
    }
  }

  // If completed, show the full 4-page filled official form template
  if (isCompleted) {
    return (
      <FilledApplicationPdf
        data={formData}
        onEdit={() => setIsCompleted(false)}
        isTa={isTa}
      />
    )
  }

  return (
    <div className="clean-app-page">

      {/* Header Banner */}
      <div className="clean-app-header">
        <div className="clean-app-brand-badge">
          <ShieldIcon size={13} color="#2563eb" />
          <span>{isTa ? 'அதிகாரப்பூர்வ பேராய உறுப்பினர் பதிவு' : 'Official ACI Diocese Membership Register'}</span>
        </div>

        <h1 className="clean-app-title">
          {isTa ? 'பேராய உறுப்பினர் விண்ணப்பப் படிவம்' : 'Diocesan Membership Application Form'}
        </h1>

        <p className="clean-app-subtitle">
          {isTa
            ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தில் இணைய தங்கள் தகவல்களை எளிய முறையில் நிரப்புங்கள்.'
            : 'Welcome to the ACI Diocesan Membership Form: A step-by-step guided application to ensure accuracy and official accreditation.'}
        </p>

        {/* Modern Stepper Progress Bar */}
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
                  {isDone ? <CheckIcon size={14} color="#ffffff" /> : s.num}
                </div>
                <span className="clean-step-label">{isTa ? s.labelTa : s.labelEn}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Dual Pane Layout (Interactive Form + Live Official Paper Form Preview) */}
      <div className="clean-form-layout">

        {/* Main Form Left Column */}
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
                    {isTa ? 'அடிப்படை விவரங்கள் மற்றும் அதிகாரப்பூர்வ முகவரிகளை உள்ளிடவும்.' : 'This section gathers your legal name, baptismal name, DOB, and addresses.'}
                  </p>
                </div>

                {/* Passport Photo Upload Box */}
                <div className="clean-photo-card">
                  {formData.personal.photoUrl ? (
                    <img src={formData.personal.photoUrl} alt="Applicant" className="clean-photo-preview" />
                  ) : (
                    <div className="clean-photo-preview">
                      <UserCheckIcon size={24} color="#94a3b8" />
                    </div>
                  )}
                  <div>
                    <h4 style={{ fontSize: '13.5px', fontWeight: 600, margin: '0 0 4px', color: '#0f172a' }}>
                      {isTa ? 'சமீபத்திய பாஸ்போர்ட் புகைப்படம்' : 'Recent Passport Size Photo'}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px' }}>
                      {isTa ? 'சுய கையொப்பமிடப்பட்ட பாஸ்போர்ட் புகைப்படம் (JPG/PNG)' : 'Upload your color passport photo to be self-attested.'}
                    </p>
                    <input
                      type="file"
                      ref={photoInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="clean-photo-btn"
                      >
                        📷 {isTa ? 'புகைப்படம் தேர்வு செய்' : 'Choose Photo File'}
                      </button>

                      <button
                        type="button"
                        onClick={autoFillTestData}
                        className="clean-photo-btn"
                        style={{
                          background: '#eff6ff',
                          borderColor: '#2563eb',
                          color: '#1d4ed8',
                          fontWeight: 700,
                        }}
                        title="Auto-fill complete sample data across all steps for instant testing"
                      >
                        ⚡ {isTa ? 'தானியங்கி மாதிரி நிரப்பு (Auto-Fill Sample Data)' : 'Auto-Fill Sample Data (For Testing)'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Salutation + Full Name */}
                <div className="clean-grid-3">
                  <div className="clean-field">
                    <label className="clean-label">{isTa ? 'அழைப்புப் பட்டம் (Salutation)' : 'Salutation'}</label>
                    <select
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
                    <label className="clean-label">
                      {isTa ? 'முழுப் பெயர் (Capital Letters)' : 'Full Name (in Capital Letters)'}
                      <span className="req-star">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personal.name}
                      onChange={(e) => updateNested('personal', 'name', e.target.value)}
                      placeholder="Enter your Full Name (e.g. S. JOHN SAMUEL)"
                      className={`clean-input ${errors.name ? 'has-error' : ''}`}
                      required
                    />
                    {errors.name && <span className="clean-error-text">{errors.name}</span>}
                  </div>
                </div>

                {/* Baptismal Name + DOB DateField + Nationality */}
                <div className="clean-grid-3">
                  <div className="clean-field">
                    <label className="clean-label">{isTa ? 'ஞானஸ்நானப் பெயர்' : 'Baptismal Name'}</label>
                    <input
                      type="text"
                      value={formData.personal.baptismalName}
                      onChange={(e) => updateNested('personal', 'baptismalName', e.target.value)}
                      placeholder="Enter Baptismal Name"
                      className="clean-input"
                    />
                  </div>

                  {/* Safe DateField (Prevents typing 20022 or month 31) */}
                  <div className="clean-field">
                    <DateField
                      label={isTa ? 'பிறந்த தேதி (Date of Birth)' : 'Date of Birth'}
                      value={formData.personal.dob}
                      onChange={(val) => updateNested('personal', 'dob', val)}
                      required
                      isTa={isTa}
                    />
                    {errors.dob && <span className="clean-error-text">{errors.dob}</span>}
                  </div>

                  {/* Country of Nationality Dropdown */}
                  <div className="clean-field">
                    <label className="clean-label">{isTa ? 'நாட்டுரிமை (Nationality)' : 'Country of Nationality'}</label>
                    <select
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
                <div className="clean-grid-2" style={{ marginBottom: '18px' }}>
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
                    <label className="clean-label">{isTa ? 'திருமண நிலை (Marital Status)' : 'Marital Status'}</label>
                    <select
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
                <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
                    📍 {isTa ? 'நிரந்தர முகவரி (Permanent Address)' : 'Permanent Address'}
                  </h3>

                  <div className="clean-grid-3">
                    <div className="clean-field">
                      <label className="clean-label">{isTa ? 'கதவு எண்' : 'Door No.'}</label>
                      <input
                        type="text"
                        value={formData.personal.permanentAddress.doorNo}
                        onChange={(e) => updateAddress('permanentAddress', 'doorNo', e.target.value)}
                        placeholder="e.g. 6/110"
                        className="clean-input"
                      />
                    </div>
                    <div className="clean-field" style={{ gridColumn: 'span 2' }}>
                      <label className="clean-label">{isTa ? 'தெருப் பெயர்' : 'Street Name'}</label>
                      <input
                        type="text"
                        value={formData.personal.permanentAddress.streetName}
                        onChange={(e) => updateAddress('permanentAddress', 'streetName', e.target.value)}
                        placeholder="e.g. Melapatty Street"
                        className="clean-input"
                      />
                    </div>
                  </div>

                  <div className="clean-grid-3">
                    <div className="clean-field">
                      <label className="clean-label">{isTa ? 'நகரம் / ஊர்' : 'City / Town'}</label>
                      <input
                        type="text"
                        value={formData.personal.permanentAddress.cityTown}
                        onChange={(e) => updateAddress('permanentAddress', 'cityTown', e.target.value)}
                        placeholder="e.g. Hanumantharayankottai"
                        className="clean-input"
                      />
                    </div>
                    <div className="clean-field">
                      <label className="clean-label">{isTa ? 'தாலுகா' : 'Taluk'}</label>
                      <input
                        type="text"
                        value={formData.personal.permanentAddress.taluk}
                        onChange={(e) => updateAddress('permanentAddress', 'taluk', e.target.value)}
                        placeholder="e.g. Dindigul"
                        className="clean-input"
                      />
                    </div>
                    <div className="clean-field">
                      <label className="clean-label">{isTa ? 'மாவட்டம்' : 'District'}</label>
                      <input
                        type="text"
                        value={formData.personal.permanentAddress.district}
                        onChange={(e) => updateAddress('permanentAddress', 'district', e.target.value)}
                        placeholder="e.g. Dindigul"
                        className="clean-input"
                      />
                    </div>
                  </div>

                  <div className="clean-grid-3">
                    <div className="clean-field">
                      <label className="clean-label">{isTa ? 'மாநிலம்' : 'State'}</label>
                      <input
                        type="text"
                        value={formData.personal.permanentAddress.state}
                        onChange={(e) => updateAddress('permanentAddress', 'state', e.target.value)}
                        className="clean-input"
                      />
                    </div>
                    <div className="clean-field">
                      <label className="clean-label">{isTa ? 'பின்கோடு (6 Digits)' : 'Pincode (6 Digits)'}</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={formData.personal.permanentAddress.pincode}
                        onChange={(e) => updateAddress('permanentAddress', 'pincode', e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 624002"
                        className="clean-input"
                      />
                    </div>
                    <div className="clean-field">
                      <label className="clean-label">{isTa ? 'நாடு' : 'Country'}</label>
                      <input
                        type="text"
                        value={formData.personal.permanentAddress.country}
                        onChange={(e) => updateAddress('permanentAddress', 'country', e.target.value)}
                        className="clean-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Address Toggle */}
                <div
                  className={`clean-checkbox-row ${formData.personal.contactAddressSameAsPermanent ? 'active' : ''}`}
                  onClick={() => updateNested('personal', 'contactAddressSameAsPermanent', !formData.personal.contactAddressSameAsPermanent)}
                >
                  <div className="clean-checkbox-box">
                    {formData.personal.contactAddressSameAsPermanent && <CheckIcon size={12} color="#ffffff" />}
                  </div>
                  <span className="clean-checkbox-label">
                    {isTa ? 'தொடர்பு முகவரியும் நிரந்தர முகவரியும் ஒன்றே (Contact Address is same as Permanent)' : 'Contact Address is same as Permanent Address'}
                  </span>
                </div>
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
                    {isTa ? 'படிவம் பக்கம் 2-ல் உள்ளபடி தங்களது ஐவகை ஊழிய அழைப்பைக் குறிப்பிடவும்.' : 'Select your primary fivefold ecclesiastical office and ministry description.'}
                  </p>
                </div>

                <div className="clean-field" style={{ marginBottom: '24px' }}>
                  <label className="clean-label" style={{ marginBottom: '8px' }}>
                    {isTa ? 'தாங்கள் செய்யும் ஊழியத்தைத் தேர்வு செய்க (Select Ministry Function)' : 'Select Your Current Ministry Function'}
                  </label>

                  <div className="clean-radio-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                    {MINISTRY_CALLING_OPTIONS.map((c) => (
                      <div
                        key={c.value}
                        onClick={() => updateNested('spiritual', 'ministryFunction', c.value)}
                        className={`clean-radio-pill ${formData.spiritual.ministryFunction === c.value ? 'active' : ''}`}
                        style={{ padding: '14px 16px' }}
                      >
                        <div className="clean-checkbox-box">
                          {formData.spiritual.ministryFunction === c.value && <CheckIcon size={12} color="#ffffff" />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{isTa ? c.labelTa : c.labelEn}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{isTa ? c.labelEn : c.labelTa}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.spiritual.ministryFunction === 'Other Ministry' && (
                  <div className="clean-field">
                    <label className="clean-label">
                      {isTa ? 'மற்ற ஊழியத்தை விவரிக்கவும் (Specify Other Ministry)' : 'Please Specify Your Ministry Details'}
                    </label>
                    <input
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
                    {isTa ? 'முந்தைய திருச்சபை இணைப்பு மற்றும் தாங்கள் ஊழியம் செய்யும் சபையின் முகவரி.' : 'Previous ecclesiastical affiliation and full church contact details.'}
                  </p>
                </div>

                {/* Affiliation Type */}
                <div className="clean-field" style={{ marginBottom: '20px' }}>
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

                {formData.affiliation.affiliationType === 'Independent Church' && (
                  <div className="clean-field">
                    <label className="clean-label">{isTa ? 'நிறுவனர் பெயர் (Founder’s Name)' : "Founder's Name"}</label>
                    <input
                      type="text"
                      value={formData.affiliation.founderName}
                      onChange={(e) => updateNested('affiliation', 'founderName', e.target.value)}
                      placeholder="Enter Founder's Name"
                      className="clean-input"
                    />
                  </div>
                )}

                {formData.affiliation.affiliationType === 'Denomination' && (
                  <div className="clean-field">
                    <label className="clean-label">{isTa ? 'சபைப் பிரிவு (Denomination Specify)' : 'Denomination Name (Specify)'}</label>
                    <input
                      type="text"
                      value={formData.affiliation.denominationSpecify}
                      onChange={(e) => updateNested('affiliation', 'denominationSpecify', e.target.value)}
                      placeholder="e.g. Pentecostal / Baptist / Independent"
                      className="clean-input"
                    />
                  </div>
                )}

                {formData.affiliation.affiliationType === 'Associate / Assistant' && (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '18px' }}>
                    <div className="clean-grid-2">
                      <div className="clean-field">
                        <label className="clean-label">{isTa ? 'தலைமை மேய்ப்பரின் பெயர்' : 'Name of Chief Pastor'}</label>
                        <input
                          type="text"
                          value={formData.affiliation.associateChiefPastorName}
                          onChange={(e) => updateNested('affiliation', 'associateChiefPastorName', e.target.value)}
                          className="clean-input"
                        />
                      </div>
                      <div className="clean-field">
                        <label className="clean-label">{isTa ? 'தலைமை சபையின் பெயர்' : 'Name of Church'}</label>
                        <input
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
                  <label className="clean-label">
                    {isTa ? 'உங்களது டிரஸ்டின் பெயர் (Name of your Trust)' : 'Name of Your Trust'}
                    <span className="opt-tag">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.affiliation.trustName}
                    onChange={(e) => updateNested('affiliation', 'trustName', e.target.value)}
                    placeholder="e.g. Living Word Charitable Trust"
                    className="clean-input"
                  />
                </div>

                {/* Church Information */}
                <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
                    ⛪ {isTa ? 'சபையின் தகவல்கள் (Church Information)' : 'Church Details'}
                  </h3>

                  <div className="clean-field">
                    <label className="clean-label">
                      {isTa ? 'சபையின் பெயர் (Church Name)' : 'Church Name'}
                      <span className="req-star">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.church.churchName}
                      onChange={(e) => updateChurchAddress('churchName', e.target.value)}
                      placeholder="e.g. Living Redeemer AG Church"
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
                      <label className="clean-label">{isTa ? 'நகரம் / ஊர்' : 'City / Town'}</label>
                      <input
                        type="text"
                        value={formData.church.cityTown}
                        onChange={(e) => updateChurchAddress('cityTown', e.target.value)}
                        className="clean-input"
                      />
                    </div>
                    <div className="clean-field">
                      <label className="clean-label">{isTa ? 'தாலுகா' : 'Taluk'}</label>
                      <input
                        type="text"
                        value={formData.church.taluk}
                        onChange={(e) => updateChurchAddress('taluk', e.target.value)}
                        className="clean-input"
                      />
                    </div>
                    <div className="clean-field">
                      <label className="clean-label">{isTa ? 'மாவட்டம்' : 'District'}</label>
                      <input
                        type="text"
                        value={formData.church.district}
                        onChange={(e) => updateChurchAddress('district', e.target.value)}
                        className="clean-input"
                      />
                    </div>
                  </div>

                  <div className="clean-grid-3">
                    <div className="clean-field">
                      <label className="clean-label">{isTa ? 'பின்கோடு (6 Digits)' : 'Pincode (6 Digits)'}</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={formData.church.pincode}
                        onChange={(e) => updateChurchAddress('pincode', e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 624002"
                        className="clean-input"
                      />
                    </div>
                    <div className="clean-field">
                      <label className="clean-label">
                        {isTa ? 'தொலைபேசி எண் (Telephone)' : 'Telephone (Landline)'}
                        <span className="opt-tag">(Optional)</span>
                      </label>
                      <input
                        type="tel"
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
                        maxLength={10}
                        value={formData.church.mobileNumber}
                        onChange={(e) => updateChurchAddress('mobileNumber', e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 9486485810"
                        className={`clean-input ${errors.mobileNumber ? 'has-error' : ''}`}
                        required
                      />
                      {errors.mobileNumber && <span className="clean-error-text">{errors.mobileNumber}</span>}
                    </div>
                  </div>

                  <div className="clean-field">
                    <label className="clean-label">
                      {isTa ? 'மின்னஞ்சல் முகவரி (Email ID)' : 'Email ID'}
                      <span className="opt-tag">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={formData.church.emailId}
                      onChange={(e) => updateChurchAddress('emailId', e.target.value)}
                      placeholder="pastor@gmail.com"
                      className="clean-input"
                    />
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
                    {isTa ? 'படிவம் பக்கம் 2 & 3-ல் உள்ள ஆவிக்குரிய தேதிகள் மற்றும் கல்வித் தகுதிகள்.' : 'Spiritual experience dates and academic / theological qualifications.'}
                  </p>
                </div>

                {/* 5 Milestone DateFields */}
                <div className="clean-grid-2" style={{ marginBottom: '24px' }}>
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
                <div className="clean-grid-2" style={{ marginBottom: '28px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
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

                {/* Academic Qualifications */}
                <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
                    🎓 {isTa ? 'VI. பொதுக் கல்வித் தகுதி (Academic Qualifications)' : 'VI. Academic Qualifications'}
                  </h3>

                  {formData.qualifications.academic.map((ac, idx) => (
                    <div key={ac.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#2563eb' }}>Entry #{idx + 1}</span>
                        {formData.qualifications.academic.length > 1 && (
                          <button type="button" onClick={() => removeAcademicRow(ac.id)} style={{ color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>
                            ✕ Remove
                          </button>
                        )}
                      </div>
                      <div className="clean-grid-3">
                        <input
                          type="text"
                          value={ac.examinationPassed}
                          onChange={(e) => updateAcademicRow(ac.id, 'examinationPassed', e.target.value)}
                          placeholder="Exam Passed (e.g. SSLC / B.A.)"
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

                  <button type="button" onClick={addAcademicRow} className="clean-photo-btn" style={{ width: '100%', marginTop: '6px' }}>
                    + {isTa ? 'கூடுதல் கல்வித் தகுதியை சேர்' : 'Add Academic Qualification'}
                  </button>
                </div>

                {/* Theological Qualifications */}
                <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
                    📖 {isTa ? 'VII. இறையியல் தகுதி (Theological Qualifications)' : 'VII. Theological Qualifications'}
                  </h3>

                  {formData.qualifications.theological.map((th, idx) => (
                    <div key={th.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#2563eb' }}>Theological #{idx + 1}</span>
                        {formData.qualifications.theological.length > 1 && (
                          <button type="button" onClick={() => removeTheologicalRow(th.id)} style={{ color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>
                            ✕ Remove
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

                  <button type="button" onClick={addTheologicalRow} className="clean-photo-btn" style={{ width: '100%', marginTop: '6px' }}>
                    + {isTa ? 'கூடுதல் இறையியல் படிப்பை சேர்' : 'Add Theological Qualification'}
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 5: REFERENCES, DECLARATION & SUBMIT ================= */}
            {currentStep === 5 && (
              <div>
                <div className="clean-form-step-header">
                  <h2 className="clean-step-heading">
                    {isTa ? 'படி 5 : பரிந்துரைகள் & உறுதிமொழி அறிக்கை' : 'Step 5: References & Statutory Declaration'}
                  </h2>
                  <p className="clean-step-sub">
                    {isTa ? 'பரிந்துரை விவரங்கள், உறுதிமொழி மற்றும் அதிகாரப்பூர்வ விண்ணப்பத் தயாரிப்பு.' : 'Provide two diocesan references, sign the declaration, and generate the official filled PDF.'}
                  </p>
                </div>

                {/* Two References */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
                    👥 {isTa ? 'X. இரண்டு அங்கத்தினர்களின் பரிந்துரை (Two Personal References)' : 'X. Details of Two References (Must)'}
                  </h3>

                  <div className="clean-grid-2">
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>Reference 1: District Overseer / Member</span>
                      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                          value={formData.references.ref1.phone}
                          onChange={(e) => setFormData(p => ({ ...p, references: { ...p.references, ref1: { ...p.references.ref1, phone: e.target.value } } }))}
                          placeholder="Mobile Number"
                          className="clean-input"
                        />
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>Reference 2: Taluk Co-ordinator / Member</span>
                      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                <div className="clean-field" style={{ marginBottom: '24px' }}>
                  <label className="clean-label">
                    IX. {isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தில் இணையக் காரணம் என்ன?' : 'What prompts you to join APOSTOLIC COUNCIL OF INDIA DIOCESE?'}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.motivation.reasonToJoin}
                    onChange={(e) => updateNested('motivation', 'reasonToJoin', e.target.value)}
                    placeholder="Describe your calling, affinity with ACI Diocese vision of shepherding the shepherd..."
                    className="clean-textarea"
                  />
                </div>

                {/* Official Statutory Declaration */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #2563eb', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    XI. Statutory Declaration / உறுதிமொழி மற்றும் கையெழுத்து
                  </h4>
                  <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#1e293b', margin: '0 0 10px' }}>
                    &ldquo;I hereby declare that the information furnished above is true to the best of my knowledge. I am fully in agreement with the Faith Statement of ACI Diocese. I understand that this is the united Ministry and I shall give attention to this ministry apart from my church ministry. I shall abide by the terms and conditions of ACI Diocese, in force from time to time.&rdquo;
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
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
                        {isTa ? 'டிஜிட்டல் கையொப்ப உறுதிப்படுத்தல் (Digital Signature Confirmation)' : 'Digital Signature Confirmation by Applicant'}
                        <span className="req-star">*</span>
                      </span>
                    </div>
                    {errors.sig && <span className="clean-error-text">{errors.sig}</span>}
                  </div>

                  <div className="clean-grid-2" style={{ marginTop: '16px' }}>
                    <div className="clean-field">
                      <label className="clean-label">{isTa ? 'இடம் (Place)' : 'Place'}</label>
                      <input
                        type="text"
                        value={formData.declaration.place}
                        onChange={(e) => updateNested('declaration', 'place', e.target.value)}
                        placeholder="e.g. Madurai / Dindigul"
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

            {/* Action Bar (Back / Continue / Review) */}
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
                <span>{currentStep === 5 ? (isTa ? 'அதிகாரப்பூர்வ படிவத்தைக் காண்க & அச்சிடுக' : 'Review & Generate Official PDF Form') : (isTa ? 'அடுத்த படி' : 'Continue')}</span>
                <ArrowRightIcon size={14} color="#ffffff" />
              </button>
            </div>

          </div>
        </div>

        {/* Live Official Form Preview Sidebar (Real-Time Synchronized Replica) */}
        <div className="clean-form-preview-sidebar">
          <div className="clean-preview-top-bar">
            <div className="clean-preview-badge">
              <DocumentIcon size={14} color="#2563eb" />
              <span>{isTa ? 'அதிகாரப்பூர்வ படிவ நேரலை முன்னோட்டம்' : 'Official Paper Form Live Preview'}</span>
            </div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              {isTa ? 'நிகழ்நேரப் பிரதி' : 'Live Sync'}
            </span>
          </div>

          <div className="clean-preview-scroll-area">
            <OfficialApplicationForm data={formData} isMini={true} />
          </div>
        </div>

      </div>

    </div>
  )
}
