import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import {
  ShieldIcon,
  CrossIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  IdCardIcon,
  ChurchIcon,
  UserCheckIcon,
  DocumentIcon,
  InfoIcon
} from '../components/Icons/SvgIcons'
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

const STEPS = [
  { num: 1, key: 'personal', titleEn: 'Personal Details', titleTa: 'சுய விவரங்கள்' },
  { num: 2, key: 'spiritual', titleEn: 'Spiritual Info', titleTa: 'ஆவிக்குரிய தகவல்கள்' },
  { num: 3, key: 'affiliation', titleEn: 'Affiliation & Church', titleTa: 'இணைப்பு & சபை' },
  { num: 4, key: 'ministry', titleEn: 'Ministry Milestones', titleTa: 'ஊழிய மைல்கற்கள்' },
  { num: 5, key: 'qualifications', titleEn: 'Qualifications', titleTa: 'கல்வித் தகுதி' },
  { num: 6, key: 'family', titleEn: 'Family & Motivation', titleTa: 'குடும்பம் & நோக்கம்' },
  { num: 7, key: 'references', titleEn: 'References & Documents', titleTa: 'பரிந்துரை & ஆவணங்கள்' },
  { num: 8, key: 'review', titleEn: 'Declaration & Review', titleTa: 'உறுதிமொழி & சரிபார்ப்பு' },
]

export default function ApplicationPage() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(initialApplicationData)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errors, setErrors] = useState({})

  const photoInputRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep])

  // Helper updates
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

  // Enclosure file upload simulation
  const handleEnclosureUpload = (enclosureId, e) => {
    const file = e.target.files[0]
    if (!file) return
    setFormData((prev) => ({
      ...prev,
      enclosures: {
        ...prev.enclosures,
        [enclosureId]: file.name,
      },
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

  // Step Validation & Navigation
  const validateStep = (step) => {
    const errs = {}
    if (step === 1) {
      if (!formData.personal.name.trim()) errs.name = isTa ? 'பெயர் கட்டாயமாகும்' : 'Full Name is required'
      if (!formData.personal.dob) errs.dob = isTa ? 'பிறந்த தேதி கட்டாயமாகும்' : 'Date of Birth is required'
    }
    if (step === 3) {
      if (!formData.church.churchName.trim()) errs.churchName = isTa ? 'சபையின் பெயர் கட்டாயமாகும்' : 'Church Name is required'
      if (!formData.church.mobileNumber.trim()) errs.mobileNumber = isTa ? 'கைப்பேசி எண் கட்டாயமாகும்' : 'Mobile Number is required'
    }
    if (step === 8) {
      if (!formData.declaration.acceptedFaithStatement) errs.faith = isTa ? 'விசுவாச அறிக்கையை ஏற்க வேண்டும்' : 'You must accept the Statement of Faith'
      if (!formData.declaration.acceptedTerms) errs.terms = isTa ? 'விதிமுறைகளை ஏற்க வேண்டும்' : 'You must accept the terms and conditions'
      if (!formData.declaration.signatureConfirmation) errs.sig = isTa ? 'கையொப்ப உறுதிப்படுத்தல் தேவை' : 'Digital confirmation signature required'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 8) {
        setCurrentStep((s) => s + 1)
      } else {
        // Final submit review
        setShowSuccessModal(true)
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

  const progressPercent = Math.round((currentStep / 8) * 100)

  return (
    <div className="app-page">

      {/* Stepper Header Bar */}
      <div className="app-header-bar">
        <div className="app-header-inner">
          <div className="app-header-top">
            <div>
              <span className="app-step-counter">
                <ShieldIcon size={14} color="#c8a96e" />
                {isTa ? `படி ${currentStep} / 8 : ${STEPS[currentStep - 1].titleTa}` : `Step ${currentStep} of 8: ${STEPS[currentStep - 1].titleEn}`}
              </span>
            </div>
            <span className="app-step-progress-percent">
              {progressPercent}% {isTa ? 'நிறைவடைந்தது' : 'Completed'}
            </span>
          </div>

          <div className="app-progress-track">
            <div className="app-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          {/* Stepper Navigation Pills */}
          <div className="app-steps-nav">
            {STEPS.map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`app-step-pill ${currentStep === s.num ? 'active' : ''} ${currentStep > s.num ? 'completed' : ''}`}
              >
                <span>{s.num}.</span>
                <span>{isTa ? s.titleTa : s.titleEn}</span>
                {currentStep > s.num && <CheckIcon size={12} color="#c8a96e" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid Layout: Form (Left) + Live Preview (Right) */}
      <div className="app-layout-grid">

        {/* Left Form Container */}
        <div className="app-form-card">

          {/* ================= STEP 1: PERSONAL DETAILS ================= */}
          {currentStep === 1 && (
            <div>
              <h2 className="app-form-step-title">
                {isTa ? '1. சுய விவரங்கள்' : '1. Personal Details'}
              </h2>
              <p className="app-form-step-subtitle">
                {isTa
                  ? 'விண்ணப்பதாரரின் முழுப் பெயர், ஞானஸ்நானப் பெயர் மற்றும் முகவரி விவரங்களை உள்ளிடவும்.'
                  : 'Enter your legal name, baptismal name, date of birth, and official addresses.'}
              </p>

              {/* Passport Photo Upload Simulation */}
              <div className="app-photo-upload-wrap">
                {formData.personal.photoUrl ? (
                  <img src={formData.personal.photoUrl} alt="Applicant" className="app-photo-avatar-preview" />
                ) : (
                  <div className="app-photo-avatar-preview">
                    <UserCheckIcon size={24} />
                  </div>
                )}
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#ffffff' }}>
                    {isTa ? 'சமீபத்திய பாஸ்போர்ட் புகைப்படம்' : 'Recent Passport Size Photo'}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>
                    {isTa ? 'சுய கையொப்பமிடப்பட்ட பாஸ்போர்ட் புகைப்படம் (JPG/PNG)' : 'Upload your color passport photo to be self-attested.'}
                  </p>
                  <input
                    type="file"
                    ref={photoInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="app-photo-btn"
                  >
                    📷 {isTa ? 'புகைப்படம் தேர்வு செய்' : 'Choose Photo File'}
                  </button>
                </div>
              </div>

              {/* Salutation + Full Name */}
              <div className="app-grid-3">
                <div className="app-field-group">
                  <label className="app-label">{isTa ? 'அழைப்புப் பட்டம் (Salutation)' : 'Salutation'}</label>
                  <select
                    value={formData.personal.salutation}
                    onChange={(e) => updateNested('personal', 'salutation', e.target.value)}
                    className="app-select"
                  >
                    {SALUTATION_OPTIONS.map((sal) => (
                      <option key={sal} value={sal}>{sal}</option>
                    ))}
                  </select>
                </div>

                <div className="app-field-group" style={{ gridColumn: 'span 2' }}>
                  <label className="app-label">
                    {isTa ? 'முழுப் பெயர் (Capital Letters)' : 'Full Name (in Capital Letters)'}
                    <span className="app-label-req">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.personal.name}
                    onChange={(e) => updateNested('personal', 'name', e.target.value)}
                    placeholder="e.g. S. JOHN SAMUEL"
                    className="app-input"
                    required
                  />
                  {errors.name && <span style={{ color: '#ff4d4f', fontSize: '12px' }}>{errors.name}</span>}
                </div>
              </div>

              {/* Baptismal Name + DOB + Nationality */}
              <div className="app-grid-3">
                <div className="app-field-group">
                  <label className="app-label">{isTa ? 'ஞானஸ்நானப் பெயர்' : 'Baptismal Name'}</label>
                  <input
                    type="text"
                    value={formData.personal.baptismalName}
                    onChange={(e) => updateNested('personal', 'baptismalName', e.target.value)}
                    placeholder="Baptismal Name"
                    className="app-input"
                  />
                </div>

                <div className="app-field-group">
                  <label className="app-label">
                    {isTa ? 'பிறந்த தேதி' : 'Date of Birth'}
                    <span className="app-label-req">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.personal.dob}
                    onChange={(e) => updateNested('personal', 'dob', e.target.value)}
                    className="app-input"
                    required
                  />
                  {errors.dob && <span style={{ color: '#ff4d4f', fontSize: '12px' }}>{errors.dob}</span>}
                </div>

                <div className="app-field-group">
                  <label className="app-label">{isTa ? 'நாட்டுரிமை' : 'Nationality'}</label>
                  <input
                    type="text"
                    value={formData.personal.nationality}
                    onChange={(e) => updateNested('personal', 'nationality', e.target.value)}
                    className="app-input"
                  />
                </div>
              </div>

              {/* Gender + Marital Status */}
              <div className="app-grid-2" style={{ marginBottom: '24px' }}>
                <div className="app-field-group">
                  <label className="app-label">{isTa ? 'பாலினம்' : 'Gender'}</label>
                  <div className="app-radio-grid">
                    {GENDER_OPTIONS.map((g) => (
                      <div
                        key={g.value}
                        onClick={() => updateNested('personal', 'gender', g.value)}
                        className={`app-radio-card ${formData.personal.gender === g.value ? 'active' : ''}`}
                      >
                        <div className="app-radio-dot" />
                        <span className="app-radio-text">{isTa ? g.labelTa : g.labelEn}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="app-field-group">
                  <label className="app-label">{isTa ? 'திருமண நிலை' : 'Marital Status'}</label>
                  <select
                    value={formData.personal.maritalStatus}
                    onChange={(e) => updateNested('personal', 'maritalStatus', e.target.value)}
                    className="app-select"
                  >
                    {MARITAL_STATUS_OPTIONS.map((m) => (
                      <option key={m.value} value={m.value}>{isTa ? m.labelTa : m.labelEn}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Permanent Address */}
              <div className="app-form-section">
                <p className="app-section-subtitle">
                  <ChurchIcon size={14} color="#c8a96e" />
                  <span>{isTa ? 'நிரந்தர முகவரி (Permanent Address)' : 'Permanent Address'}</span>
                </p>

                <div className="app-grid-3">
                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'கதவு எண்' : 'Door No.'}</label>
                    <input
                      type="text"
                      value={formData.personal.permanentAddress.doorNo}
                      onChange={(e) => updateAddress('permanentAddress', 'doorNo', e.target.value)}
                      placeholder="e.g. 6/110"
                      className="app-input"
                    />
                  </div>

                  <div className="app-field-group" style={{ gridColumn: 'span 2' }}>
                    <label className="app-label">{isTa ? 'தெருப் பெயர்' : 'Street Name'}</label>
                    <input
                      type="text"
                      value={formData.personal.permanentAddress.streetName}
                      onChange={(e) => updateAddress('permanentAddress', 'streetName', e.target.value)}
                      placeholder="e.g. Melapatty Street"
                      className="app-input"
                    />
                  </div>
                </div>

                <div className="app-grid-3">
                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'நகரம் / ஊர்' : 'City / Town'}</label>
                    <input
                      type="text"
                      value={formData.personal.permanentAddress.cityTown}
                      onChange={(e) => updateAddress('permanentAddress', 'cityTown', e.target.value)}
                      placeholder="e.g. Hanumantharayankottai"
                      className="app-input"
                    />
                  </div>

                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'தாலுகா' : 'Taluk'}</label>
                    <input
                      type="text"
                      value={formData.personal.permanentAddress.taluk}
                      onChange={(e) => updateAddress('permanentAddress', 'taluk', e.target.value)}
                      placeholder="e.g. Dindigul"
                      className="app-input"
                    />
                  </div>

                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'மாவட்டம்' : 'District'}</label>
                    <input
                      type="text"
                      value={formData.personal.permanentAddress.district}
                      onChange={(e) => updateAddress('permanentAddress', 'district', e.target.value)}
                      placeholder="e.g. Dindigul"
                      className="app-input"
                    />
                  </div>
                </div>

                <div className="app-grid-3">
                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'மாநிலம்' : 'State'}</label>
                    <input
                      type="text"
                      value={formData.personal.permanentAddress.state}
                      onChange={(e) => updateAddress('permanentAddress', 'state', e.target.value)}
                      className="app-input"
                    />
                  </div>

                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'பின்கோடு' : 'Pincode'}</label>
                    <input
                      type="text"
                      value={formData.personal.permanentAddress.pincode}
                      onChange={(e) => updateAddress('permanentAddress', 'pincode', e.target.value)}
                      placeholder="e.g. 624002"
                      className="app-input"
                    />
                  </div>

                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'நாடு' : 'Country'}</label>
                    <input
                      type="text"
                      value={formData.personal.permanentAddress.country}
                      onChange={(e) => updateAddress('permanentAddress', 'country', e.target.value)}
                      className="app-input"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Address Same As Permanent Checkbox */}
              <div
                className={`app-checkbox-row ${formData.personal.contactAddressSameAsPermanent ? 'active' : ''}`}
                onClick={() => updateNested('personal', 'contactAddressSameAsPermanent', !formData.personal.contactAddressSameAsPermanent)}
              >
                <div className="app-checkbox-box">
                  {formData.personal.contactAddressSameAsPermanent && <CheckIcon size={12} color="#000000" />}
                </div>
                <span className="app-checkbox-label">
                  {isTa ? 'தொடர்பு முகவரியும் நிரந்தர முகவரியும் ஒன்றே (Contact Address same as Permanent Address)' : 'Contact Address is the same as Permanent Address'}
                </span>
              </div>

              {/* Contact Address (Conditional) */}
              {!formData.personal.contactAddressSameAsPermanent && (
                <div className="app-form-section">
                  <p className="app-section-subtitle">
                    <ChurchIcon size={14} color="#c8a96e" />
                    <span>{isTa ? 'தொடர்பு முகவரி (Contact Address)' : 'Contact Address'}</span>
                  </p>
                  <div className="app-grid-3">
                    <div className="app-field-group">
                      <label className="app-label">{isTa ? 'கதவு எண்' : 'Door No.'}</label>
                      <input
                        type="text"
                        value={formData.personal.contactAddress.doorNo}
                        onChange={(e) => updateAddress('contactAddress', 'doorNo', e.target.value)}
                        className="app-input"
                      />
                    </div>
                    <div className="app-field-group" style={{ gridColumn: 'span 2' }}>
                      <label className="app-label">{isTa ? 'தெருப் பெயர்' : 'Street Name'}</label>
                      <input
                        type="text"
                        value={formData.personal.contactAddress.streetName}
                        onChange={(e) => updateAddress('contactAddress', 'streetName', e.target.value)}
                        className="app-input"
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
              <h2 className="app-form-step-title">
                {isTa ? '2. ஆவிக்குரிய தகவல்கள்' : '2. Spiritual Information'}
              </h2>
              <p className="app-form-step-subtitle">
                {isTa
                  ? 'படிவம் பக்கம் 2-ல் உள்ளபடி, தாங்கள் செய்யும் தற்போதைய இறை ஊழிய அழைப்பைக் குறிப்பிடவும்.'
                  : 'Specify your primary fivefold ministry calling as requested on Page 2 of the official form.'}
              </p>

              <div className="app-field-group" style={{ marginBottom: '24px' }}>
                <label className="app-label" style={{ marginBottom: '10px' }}>
                  {isTa ? 'தாங்கள் செய்யும் ஊழியத்தை குறிப்பிடவும் (Current Ministry Function)' : 'Select Your Current Ministry Function'}
                </label>

                <div className="app-radio-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                  {MINISTRY_CALLING_OPTIONS.map((c) => (
                    <div
                      key={c.value}
                      onClick={() => updateNested('spiritual', 'ministryFunction', c.value)}
                      className={`app-radio-card ${formData.spiritual.ministryFunction === c.value ? 'active' : ''}`}
                      style={{ padding: '16px' }}
                    >
                      <div className="app-radio-dot" />
                      <div>
                        <div className="app-radio-text" style={{ fontSize: '14px', fontWeight: 600 }}>
                          {isTa ? c.labelTa : c.labelEn}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                          {isTa ? c.labelEn : c.labelTa}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditional "Other Ministry" Input */}
              {formData.spiritual.ministryFunction === 'Other Ministry' && (
                <div className="app-field-group" style={{ marginTop: '16px' }}>
                  <label className="app-label">
                    {isTa ? 'மற்ற ஊழியத்தை விவரிக்கவும் (Specify Other Ministry)' : 'Please Specify Your Ministry Details'}
                  </label>
                  <input
                    type="text"
                    value={formData.spiritual.otherMinistrySpecify}
                    onChange={(e) => updateNested('spiritual', 'otherMinistrySpecify', e.target.value)}
                    placeholder="e.g. Youth Minister / Worship Leader / Media Evangelist"
                    className="app-input"
                  />
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3: AFFILIATION & CHURCH DETAILS ================= */}
          {currentStep === 3 && (
            <div>
              <h2 className="app-form-step-title">
                {isTa ? '3. இணைப்பு & சபையின் விவரங்கள்' : '3. Affiliation & Church Details'}
              </h2>
              <p className="app-form-step-subtitle">
                {isTa
                  ? 'முந்தைய இணைப்பு விவரங்கள் மற்றும் தாங்கள் ஊழியம் செய்யும் சபையின் முகவரி, தொலைபேசி எண்கள்.'
                  : 'Provide previous ecclesiastical affiliation and full church contact details.'}
              </p>

              {/* Affiliation Selection */}
              <div className="app-form-section">
                <p className="app-section-subtitle">
                  <ShieldIcon size={14} color="#c8a96e" />
                  <span>{isTa ? 'பேராயம் / நிறுவனம் / ஐக்கிய இணைப்பு' : 'Ecclesiastical Affiliation'}</span>
                </p>

                <div className="app-radio-grid" style={{ marginBottom: '20px' }}>
                  {AFFILIATION_OPTIONS.map((aff) => (
                    <div
                      key={aff.value}
                      onClick={() => updateNested('affiliation', 'affiliationType', aff.value)}
                      className={`app-radio-card ${formData.affiliation.affiliationType === aff.value ? 'active' : ''}`}
                    >
                      <div className="app-radio-dot" />
                      <span className="app-radio-text">{isTa ? aff.labelTa : aff.labelEn}</span>
                    </div>
                  ))}
                </div>

                {/* Conditional Affiliation Fields */}
                {formData.affiliation.affiliationType === 'Independent Church' && (
                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'நிறுவனர் பெயர் (Founder’s Name)' : "Founder's Name"}</label>
                    <input
                      type="text"
                      value={formData.affiliation.founderName}
                      onChange={(e) => updateNested('affiliation', 'founderName', e.target.value)}
                      placeholder="Name of the Founder"
                      className="app-input"
                    />
                  </div>
                )}

                {formData.affiliation.affiliationType === 'Denomination' && (
                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'சபைப் பிரிவு (Denomination Name)' : 'Denomination Name (Specify)'}</label>
                    <input
                      type="text"
                      value={formData.affiliation.denominationSpecify}
                      onChange={(e) => updateNested('affiliation', 'denominationSpecify', e.target.value)}
                      placeholder="e.g. Pentecostal / Baptist / Independent Fellowship"
                      className="app-input"
                    />
                  </div>
                )}

                {formData.affiliation.affiliationType === 'Associate / Assistant' && (
                  <div className="app-dynamic-card">
                    <p style={{ fontSize: '12.5px', color: '#c8a96e', marginBottom: '12px', fontWeight: 600 }}>
                      {isTa ? 'இணை, உதவி ஊழியர் கூடுதல் விவரங்கள்' : 'Chief Pastor & Mother Church Details'}
                    </p>
                    <div className="app-grid-2">
                      <div className="app-field-group">
                        <label className="app-label">{isTa ? 'தலைமை மேய்ப்பரின் பெயர்' : 'Name of Chief Pastor'}</label>
                        <input
                          type="text"
                          value={formData.affiliation.associateChiefPastorName}
                          onChange={(e) => updateNested('affiliation', 'associateChiefPastorName', e.target.value)}
                          className="app-input"
                        />
                      </div>
                      <div className="app-field-group">
                        <label className="app-label">{isTa ? 'சபையின் பெயர்' : 'Name of the Church'}</label>
                        <input
                          type="text"
                          value={formData.affiliation.associateChurchName}
                          onChange={(e) => updateNested('affiliation', 'associateChurchName', e.target.value)}
                          className="app-input"
                        />
                      </div>
                    </div>
                    <div className="app-field-group">
                      <label className="app-label">{isTa ? 'தலைமை சபை முகவரி' : 'Church Address'}</label>
                      <input
                        type="text"
                        value={formData.affiliation.associateAddress}
                        onChange={(e) => updateNested('affiliation', 'associateAddress', e.target.value)}
                        className="app-input"
                      />
                    </div>
                  </div>
                )}

                <div className="app-field-group">
                  <label className="app-label">{isTa ? 'உங்களது டிரஸ்டின் பெயர் (Name of your Trust, if any)' : 'Name of Your Trust (if applicable)'}</label>
                  <input
                    type="text"
                    value={formData.affiliation.trustName}
                    onChange={(e) => updateNested('affiliation', 'trustName', e.target.value)}
                    placeholder="e.g. Grace Educational & Charitable Trust"
                    className="app-input"
                  />
                </div>
              </div>

              {/* Church Information */}
              <div className="app-form-section">
                <p className="app-section-subtitle">
                  <ChurchIcon size={14} color="#c8a96e" />
                  <span>{isTa ? 'சபையின் தகவல்கள் (Church Information)' : 'Church Details'}</span>
                </p>

                <div className="app-field-group">
                  <label className="app-label">
                    {isTa ? 'சபையின் பெயர் (Church Name)' : 'Church Name'}
                    <span className="app-label-req">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.church.churchName}
                    onChange={(e) => updateChurchAddress('churchName', e.target.value)}
                    placeholder="e.g. Living Redeemer AG Church"
                    className="app-input"
                    required
                  />
                  {errors.churchName && <span style={{ color: '#ff4d4f', fontSize: '12px' }}>{errors.churchName}</span>}
                </div>

                <div className="app-grid-3">
                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'கதவு எண்' : 'Door No.'}</label>
                    <input
                      type="text"
                      value={formData.church.doorNo}
                      onChange={(e) => updateChurchAddress('doorNo', e.target.value)}
                      className="app-input"
                    />
                  </div>
                  <div className="app-field-group" style={{ gridColumn: 'span 2' }}>
                    <label className="app-label">{isTa ? 'தெருப் பெயர்' : 'Street Name'}</label>
                    <input
                      type="text"
                      value={formData.church.streetName}
                      onChange={(e) => updateChurchAddress('streetName', e.target.value)}
                      className="app-input"
                    />
                  </div>
                </div>

                <div className="app-grid-3">
                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'நகரம் / ஊர்' : 'City / Town'}</label>
                    <input
                      type="text"
                      value={formData.church.cityTown}
                      onChange={(e) => updateChurchAddress('cityTown', e.target.value)}
                      className="app-input"
                    />
                  </div>
                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'தாலுகா' : 'Taluk'}</label>
                    <input
                      type="text"
                      value={formData.church.taluk}
                      onChange={(e) => updateChurchAddress('taluk', e.target.value)}
                      className="app-input"
                    />
                  </div>
                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'மாவட்டம்' : 'District'}</label>
                    <input
                      type="text"
                      value={formData.church.district}
                      onChange={(e) => updateChurchAddress('district', e.target.value)}
                      className="app-input"
                    />
                  </div>
                </div>

                <div className="app-grid-3">
                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'பின்கோடு' : 'Pincode'}</label>
                    <input
                      type="text"
                      value={formData.church.pincode}
                      onChange={(e) => updateChurchAddress('pincode', e.target.value)}
                      className="app-input"
                    />
                  </div>
                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'தொலைபேசி' : 'Telephone (Landline)'}</label>
                    <input
                      type="tel"
                      value={formData.church.telephone}
                      onChange={(e) => updateChurchAddress('telephone', e.target.value)}
                      className="app-input"
                    />
                  </div>
                  <div className="app-field-group">
                    <label className="app-label">
                      {isTa ? 'கைப்பேசி எண்' : 'Mobile Number'}
                      <span className="app-label-req">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.church.mobileNumber}
                      onChange={(e) => updateChurchAddress('mobileNumber', e.target.value)}
                      placeholder="+91 94864 85810"
                      className="app-input"
                      required
                    />
                    {errors.mobileNumber && <span style={{ color: '#ff4d4f', fontSize: '12px' }}>{errors.mobileNumber}</span>}
                  </div>
                </div>

                <div className="app-field-group">
                  <label className="app-label">{isTa ? 'மின்னஞ்சல் முகவரி (Email ID)' : 'Church Email ID'}</label>
                  <input
                    type="email"
                    value={formData.church.emailId}
                    onChange={(e) => updateChurchAddress('emailId', e.target.value)}
                    placeholder="pastor@church.org"
                    className="app-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: MINISTRY MILESTONES & ORDINATION ================= */}
          {currentStep === 4 && (
            <div>
              <h2 className="app-form-step-title">
                {isTa ? '4. ஊழிய மைல்கற்கள் & பிரதிஷ்டை' : '4. Ministry Milestones & Ordination'}
              </h2>
              <p className="app-form-step-subtitle">
                {isTa
                  ? 'படிவம் பக்கம் 2 & 3-ல் உள்ள 5 ஆவிக்குரிய மைல்கல் தேதிகள் மற்றும் பிரதிஷ்டை விருப்பம்.'
                  : 'Key spiritual milestone dates and your desire for episcopal ordination or affiliation.'}
              </p>

              {/* 5 Milestone Dates */}
              <div className="app-grid-2" style={{ marginBottom: '32px' }}>
                <div className="app-field-group">
                  <label className="app-label">
                    1. {isTa ? 'எப்பொழுது மறுபிறப்பின் அனுபவத்தைப் பெற்றீர்கள்?' : 'When were you Born Again?'}
                  </label>
                  <input
                    type="date"
                    value={formData.ministryHistory.bornAgainDate}
                    onChange={(e) => updateNested('ministryHistory', 'bornAgainDate', e.target.value)}
                    className="app-input"
                  />
                </div>

                <div className="app-field-group">
                  <label className="app-label">
                    2. {isTa ? 'எப்பொழுது முழுக்கு ஞானஸ்நானம் பெற்றீர்கள்?' : 'When were you Baptized in Full Immersion?'}
                  </label>
                  <input
                    type="date"
                    value={formData.ministryHistory.waterBaptismDate}
                    onChange={(e) => updateNested('ministryHistory', 'waterBaptismDate', e.target.value)}
                    className="app-input"
                  />
                </div>

                <div className="app-field-group">
                  <label className="app-label">
                    3. {isTa ? 'எப்பொழுது பரிசுத்த ஆவியின் அபிஷேகத்தைப் பெற்றீர்கள்?' : 'When were you Filled with the Holy Spirit?'}
                  </label>
                  <input
                    type="date"
                    value={formData.ministryHistory.holySpiritBaptismDate}
                    onChange={(e) => updateNested('ministryHistory', 'holySpiritBaptismDate', e.target.value)}
                    className="app-input"
                  />
                </div>

                <div className="app-field-group">
                  <label className="app-label">
                    4. {isTa ? 'எப்பொழுது ஊழிய அழைப்பைப் பெற்றீர்கள்?' : 'When were you Called for Ministry?'}
                  </label>
                  <input
                    type="date"
                    value={formData.ministryHistory.callingDate}
                    onChange={(e) => updateNested('ministryHistory', 'callingDate', e.target.value)}
                    className="app-input"
                  />
                </div>

                <div className="app-field-group" style={{ gridColumn: 'span 2' }}>
                  <label className="app-label">
                    5. {isTa ? 'எப்பொழுது ஊழியத்தைத் துவக்கினீர்கள்?' : 'When did you Start Active Ministry?'}
                  </label>
                  <input
                    type="date"
                    value={formData.ministryHistory.ministryStartDate}
                    onChange={(e) => updateNested('ministryHistory', 'ministryStartDate', e.target.value)}
                    className="app-input"
                  />
                </div>
              </div>

              {/* Ordination & Affiliation Questions (Page 3) */}
              <div className="app-form-section">
                <p className="app-section-subtitle">
                  <CrossIcon size={14} color="#c8a96e" />
                  <span>{isTa ? 'பிரதிஷ்டை & இணைப்பு விருப்பம்' : 'Ordination & Affiliation Intent'}</span>
                </p>

                <div className="app-field-group" style={{ marginBottom: '20px' }}>
                  <label className="app-label">
                    6. {isTa ? 'இந்தப் பேராயத்தால் பிரதிஷ்டை செய்யப்பட விரும்புகிறீர்களா? (Do you want to be ordained by us?)' : 'Do you want to be ordained by ACI Diocese?'}
                  </label>
                  <div className="app-radio-grid">
                    {['Yes', 'No'].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => updateNested('ministryHistory', 'wantOrdination', opt)}
                        className={`app-radio-card ${formData.ministryHistory.wantOrdination === opt ? 'active' : ''}`}
                      >
                        <div className="app-radio-dot" />
                        <span className="app-radio-text">{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="app-field-group">
                  <label className="app-label">
                    7. {isTa ? 'இந்தப் பேராயத்தின் அதிகாரப்பூர்வ இணைப்பைப் பெற விரும்புகிறீர்களா? (Do you want to be affiliated with us?)' : 'Do you want to be affiliated with ACI Diocese?'}
                  </label>
                  <div className="app-radio-grid">
                    {['Yes', 'No'].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => updateNested('ministryHistory', 'wantAffiliation', opt)}
                        className={`app-radio-card ${formData.ministryHistory.wantAffiliation === opt ? 'active' : ''}`}
                      >
                        <div className="app-radio-dot" />
                        <span className="app-radio-text">{opt}</span>
                      </div>
                    ))}
                  </div>
                  {formData.ministryHistory.wantAffiliation === 'Yes' && (
                    <p style={{ fontSize: '12px', color: '#c8a96e', marginTop: '8px' }}>
                      ℹ️ {isTa ? 'ஆம் என்றால் தங்களது தற்போதைய பிரதிஷ்டை சான்றிதழின் நகலை படி 7-ல் இணைக்கவும்.' : 'Please attach a copy of your existing ordination certificate in Step 7.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 5: QUALIFICATIONS ================= */}
          {currentStep === 5 && (
            <div>
              <h2 className="app-form-step-title">
                {isTa ? '5. கல்வி & இறையியல் தகுதிகள்' : '5. Academic & Theological Qualifications'}
              </h2>
              <p className="app-form-step-subtitle">
                {isTa
                  ? 'படிவம் பக்கம் 3-ல் உள்ளபடி, தங்களது பள்ளி, கல்லூரி மற்றும் வேத கலாசாலை படிப்புகளை சேர்க்கவும்.'
                  : 'Add your secular education and biblical/theological training.'}
              </p>

              {/* VI. Academic Qualifications */}
              <div className="app-form-section">
                <p className="app-section-subtitle">
                  <DocumentIcon size={14} color="#c8a96e" />
                  <span>VI. {isTa ? 'பொதுக் கல்வித் தகுதி (Academic Qualification)' : 'Academic Qualifications'}</span>
                </p>

                {formData.qualifications.academic.map((ac, idx) => (
                  <div key={ac.id} className="app-dynamic-card">
                    <div className="app-dynamic-card-top">
                      <span className="app-dynamic-card-badge">
                        {isTa ? `கல்வி பதிவு #${idx + 1}` : `Academic Entry #${idx + 1}`}
                      </span>
                      {formData.qualifications.academic.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAcademicRow(ac.id)}
                          className="app-remove-btn"
                        >
                          <TrashIcon size={13} color="#ff4d4f" />
                          <span>{isTa ? 'நீக்கு' : 'Remove'}</span>
                        </button>
                      )}
                    </div>

                    <div className="app-grid-3">
                      <div className="app-field-group">
                        <label className="app-label">{isTa ? 'தேர்ச்சி பெற்ற தேர்வு' : 'Examination Passed'}</label>
                        <input
                          type="text"
                          value={ac.examinationPassed}
                          onChange={(e) => updateAcademicRow(ac.id, 'examinationPassed', e.target.value)}
                          placeholder="e.g. SSLC / HSC / B.A. / B.Sc."
                          className="app-input"
                        />
                      </div>
                      <div className="app-field-group">
                        <label className="app-label">{isTa ? 'வருடம்' : 'Year'}</label>
                        <input
                          type="text"
                          value={ac.year}
                          onChange={(e) => updateAcademicRow(ac.id, 'year', e.target.value)}
                          placeholder="e.g. 2018"
                          className="app-input"
                        />
                      </div>
                      <div className="app-field-group">
                        <label className="app-label">{isTa ? 'பள்ளி / கல்லூரி / பல்கலைக்கழகம்' : 'School / College / University'}</label>
                        <input
                          type="text"
                          value={ac.institution}
                          onChange={(e) => updateAcademicRow(ac.id, 'institution', e.target.value)}
                          placeholder="e.g. Madurai Kamaraj University"
                          className="app-input"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addAcademicRow}
                  className="app-add-row-btn"
                >
                  <PlusIcon size={14} color="#c8a96e" />
                  <span>+ {isTa ? 'கூடுதல் கல்வித் தகுதியை சேர்' : 'Add Academic Qualification'}</span>
                </button>
              </div>

              {/* VII. Theological Qualifications */}
              <div className="app-form-section" style={{ marginTop: '36px' }}>
                <p className="app-section-subtitle">
                  <BookIcon size={14} color="#c8a96e" />
                  <span>VII. {isTa ? 'இறையியல் தகுதி (Theological Qualification)' : 'Theological Qualifications'}</span>
                </p>

                {formData.qualifications.theological.map((th, idx) => (
                  <div key={th.id} className="app-dynamic-card">
                    <div className="app-dynamic-card-top">
                      <span className="app-dynamic-card-badge">
                        {isTa ? `இறையியல் பதிவு #${idx + 1}` : `Theological Entry #${idx + 1}`}
                      </span>
                      {formData.qualifications.theological.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTheologicalRow(th.id)}
                          className="app-remove-btn"
                        >
                          <TrashIcon size={13} color="#ff4d4f" />
                          <span>{isTa ? 'நீக்கு' : 'Remove'}</span>
                        </button>
                      )}
                    </div>

                    <div className="app-grid-3">
                      <div className="app-field-group">
                        <label className="app-label">{isTa ? 'தேர்ச்சி பெற்ற தேர்வு' : 'Course / Degree Passed'}</label>
                        <input
                          type="text"
                          value={th.examinationPassed}
                          onChange={(e) => updateTheologicalRow(th.id, 'examinationPassed', e.target.value)}
                          placeholder="e.g. B.Th. / M.Div. / Dip.Th."
                          className="app-input"
                        />
                      </div>
                      <div className="app-field-group">
                        <label className="app-label">{isTa ? 'வருடம்' : 'Year'}</label>
                        <input
                          type="text"
                          value={th.year}
                          onChange={(e) => updateTheologicalRow(th.id, 'year', e.target.value)}
                          placeholder="e.g. 2021"
                          className="app-input"
                        />
                      </div>
                      <div className="app-field-group">
                        <label className="app-label">{isTa ? 'வேத கலாசாலை / பல்கலைக்கழகம்' : 'School / Seminary / University'}</label>
                        <input
                          type="text"
                          value={th.institution}
                          onChange={(e) => updateTheologicalRow(th.id, 'institution', e.target.value)}
                          placeholder="e.g. Berean Bible College"
                          className="app-input"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addTheologicalRow}
                  className="app-add-row-btn"
                >
                  <PlusIcon size={14} color="#c8a96e" />
                  <span>+ {isTa ? 'கூடுதல் இறையியல் படிப்பை சேர்' : 'Add Theological Qualification'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 6: FAMILY & MOTIVATION ================= */}
          {currentStep === 6 && (
            <div>
              <h2 className="app-form-step-title">
                {isTa ? '6. குடும்ப விவரங்கள் & நோக்கம்' : '6. Family Details & Motivation'}
              </h2>
              <p className="app-form-step-subtitle">
                {isTa
                  ? 'குடும்ப உறுப்பினர்களின் தகவல்கள் மற்றும் பேராயத்தில் இணைய தூண்டிய காரணம்.'
                  : 'Family details and what prompts you to join the Apostolic Council of India Diocese.'}
              </p>

              {/* VIII. Family Details */}
              <div className="app-form-section">
                <p className="app-section-subtitle">
                  <UserCheckIcon size={14} color="#c8a96e" />
                  <span>VIII. {isTa ? 'குடும்ப விவரங்கள் (Family Details)' : 'Family Members'}</span>
                </p>

                {formData.family.map((f, idx) => (
                  <div key={f.id} className="app-dynamic-card">
                    <div className="app-dynamic-card-top">
                      <span className="app-dynamic-card-badge">
                        {isTa ? `குடும்ப உறுப்பினர் #${idx + 1}` : `Family Member #${idx + 1}`}
                      </span>
                      {formData.family.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFamilyRow(f.id)}
                          className="app-remove-btn"
                        >
                          <TrashIcon size={13} color="#ff4d4f" />
                          <span>{isTa ? 'நீக்கு' : 'Remove'}</span>
                        </button>
                      )}
                    </div>

                    <div className="app-grid-2">
                      <div className="app-field-group">
                        <label className="app-label">{isTa ? 'பெயர்' : 'Name'}</label>
                        <input
                          type="text"
                          value={f.name}
                          onChange={(e) => updateFamilyRow(f.id, 'name', e.target.value)}
                          placeholder="e.g. Mary Samuel"
                          className="app-input"
                        />
                      </div>
                      <div className="app-field-group">
                        <label className="app-label">{isTa ? 'பிறந்த தேதி' : 'Date of Birth'}</label>
                        <input
                          type="date"
                          value={f.dob}
                          onChange={(e) => updateFamilyRow(f.id, 'dob', e.target.value)}
                          className="app-input"
                        />
                      </div>
                    </div>

                    <div className="app-grid-2">
                      <div className="app-field-group">
                        <label className="app-label">{isTa ? 'விண்ணப்பதாரருக்கு உறவு' : "Applicant's Relationship"}</label>
                        <input
                          type="text"
                          value={f.relationship}
                          onChange={(e) => updateFamilyRow(f.id, 'relationship', e.target.value)}
                          placeholder="e.g. Spouse / Son / Daughter"
                          className="app-input"
                        />
                      </div>
                      <div className="app-field-group">
                        <label className="app-label">{isTa ? 'தொழில் / படிப்பு' : 'Profession / Education'}</label>
                        <input
                          type="text"
                          value={f.professionEducation}
                          onChange={(e) => updateFamilyRow(f.id, 'professionEducation', e.target.value)}
                          placeholder="e.g. Teacher / Student"
                          className="app-input"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addFamilyRow}
                  className="app-add-row-btn"
                >
                  <PlusIcon size={14} color="#c8a96e" />
                  <span>+ {isTa ? 'கூடுதல் குடும்ப உறுப்பினரை சேர்' : 'Add Family Member'}</span>
                </button>
              </div>

              {/* IX. Motivation Question */}
              <div className="app-form-section" style={{ marginTop: '36px' }}>
                <p className="app-section-subtitle">
                  <ShieldIcon size={14} color="#c8a96e" />
                  <span>IX. {isTa ? 'இணையக் காரணம்' : 'Motivation to Join'}</span>
                </p>

                <div className="app-field-group">
                  <label className="app-label">
                    {isTa
                      ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தில் இணையக் காரணம் என்ன? (What prompts you to join APOSTOLIC COUNCIL OF INDIA DIOCESE?)'
                      : 'What prompts you to join APOSTOLIC COUNCIL OF INDIA DIOCESE?'}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.motivation.reasonToJoin}
                    onChange={(e) => updateNested('motivation', 'reasonToJoin', e.target.value)}
                    placeholder={isTa ? 'பேராயத்தின் தரிசனம், விசுவாச அறிக்கை மற்றும் ஐக்கியத்தில் இணைய உங்களை உந்திய காரணத்தை விவரிக்கவும்...' : 'Describe your calling, affinity with ACI Diocese vision of shepherding the shepherd, and desire for fellowship...'}
                    className="app-textarea"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 7: REFERENCES & DOCUMENTS ================= */}
          {currentStep === 7 && (
            <div>
              <h2 className="app-form-step-title">
                {isTa ? '7. பரிந்துரைகள் & ஆவணங்கள்' : '7. References & Required Enclosures'}
              </h2>
              <p className="app-form-step-subtitle">
                {isTa
                  ? 'படிவம் பக்கம் 4-ல் உள்ள இரண்டு நற்பெயர் பரிந்துரைகள் மற்றும் இணைக்க வேண்டிய சான்றிதழ்கள்.'
                  : 'Two diocesan references and required official enclosures listed on Page 4 of the form.'}
              </p>

              {/* X. Details of Two References */}
              <div className="app-form-section">
                <p className="app-section-subtitle">
                  <UserCheckIcon size={14} color="#c8a96e" />
                  <span>X. {isTa ? 'இரண்டு அங்கத்தினர்களின் பரிந்துரை (Two Personal References)' : 'Details of Two References (Must)'}</span>
                </p>

                {/* Reference 1 */}
                <div className="app-dynamic-card">
                  <span className="app-dynamic-card-badge">
                    {isTa ? 'பரிந்துரை 1 : மாவட்ட மேற்பார்வையாளர் / பேராய அங்கத்தினர்' : 'Reference 1: District Overseer (Diocesan Member)'}
                  </span>
                  <div className="app-grid-2" style={{ marginTop: '10px' }}>
                    <div className="app-field-group">
                      <label className="app-label">{isTa ? 'பெயர்' : 'Reference Name'}</label>
                      <input
                        type="text"
                        value={formData.references.ref1.name}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            references: { ...p.references, ref1: { ...p.references.ref1, name: e.target.value } },
                          }))
                        }
                        placeholder="Name of Referrer"
                        className="app-input"
                      />
                    </div>
                    <div className="app-field-group">
                      <label className="app-label">{isTa ? 'பேராய பதிவு எண்' : 'Diocesan ID Number'}</label>
                      <input
                        type="text"
                        value={formData.references.ref1.diocesanId}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            references: { ...p.references, ref1: { ...p.references.ref1, diocesanId: e.target.value } },
                          }))
                        }
                        placeholder="e.g. TN 0146"
                        className="app-input"
                      />
                    </div>
                  </div>
                  <div className="app-grid-3">
                    <div className="app-field-group">
                      <label className="app-label">{isTa ? 'தொலைபேசி / கைப்பேசி' : 'Phone / Mobile'}</label>
                      <input
                        type="tel"
                        value={formData.references.ref1.phone}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            references: { ...p.references, ref1: { ...p.references.ref1, phone: e.target.value } },
                          }))
                        }
                        className="app-input"
                      />
                    </div>
                    <div className="app-field-group">
                      <label className="app-label">{isTa ? 'தெரிந்த காலம் (வருடங்கள்)' : 'Known Since (Years)'}</label>
                      <input
                        type="text"
                        value={formData.references.ref1.knownSince}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            references: { ...p.references, ref1: { ...p.references.ref1, knownSince: e.target.value } },
                          }))
                        }
                        placeholder="e.g. 5 Years"
                        className="app-input"
                      />
                    </div>
                    <div className="app-field-group">
                      <label className="app-label">{isTa ? 'உறவு வகை' : 'Relationship'}</label>
                      <select
                        value={formData.references.ref1.relationshipType}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            references: { ...p.references, ref1: { ...p.references.ref1, relationshipType: e.target.value } },
                          }))
                        }
                        className="app-select"
                      >
                        <option value="Personally">Personally</option>
                        <option value="Professionally">Professionally</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Reference 2 */}
                <div className="app-dynamic-card">
                  <span className="app-dynamic-card-badge">
                    {isTa ? 'பரிந்துரை 2 : தாலுகா ஒருங்கிணைப்பாளர் / பேராய அங்கத்தினர்' : 'Reference 2: Taluk Co-ordinator (Diocesan Member)'}
                  </span>
                  <div className="app-grid-2" style={{ marginTop: '10px' }}>
                    <div className="app-field-group">
                      <label className="app-label">{isTa ? 'பெயர்' : 'Reference Name'}</label>
                      <input
                        type="text"
                        value={formData.references.ref2.name}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            references: { ...p.references, ref2: { ...p.references.ref2, name: e.target.value } },
                          }))
                        }
                        placeholder="Name of Referrer"
                        className="app-input"
                      />
                    </div>
                    <div className="app-field-group">
                      <label className="app-label">{isTa ? 'பேராய பதிவு எண்' : 'Diocesan ID Number'}</label>
                      <input
                        type="text"
                        value={formData.references.ref2.diocesanId}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            references: { ...p.references, ref2: { ...p.references.ref2, diocesanId: e.target.value } },
                          }))
                        }
                        placeholder="e.g. TN 0466"
                        className="app-input"
                      />
                    </div>
                  </div>
                  <div className="app-grid-3">
                    <div className="app-field-group">
                      <label className="app-label">{isTa ? 'தொலைபேசி / கைப்பேசி' : 'Phone / Mobile'}</label>
                      <input
                        type="tel"
                        value={formData.references.ref2.phone}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            references: { ...p.references, ref2: { ...p.references.ref2, phone: e.target.value } },
                          }))
                        }
                        className="app-input"
                      />
                    </div>
                    <div className="app-field-group">
                      <label className="app-label">{isTa ? 'தெரிந்த காலம் (வருடங்கள்)' : 'Known Since (Years)'}</label>
                      <input
                        type="text"
                        value={formData.references.ref2.knownSince}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            references: { ...p.references, ref2: { ...p.references.ref2, knownSince: e.target.value } },
                          }))
                        }
                        placeholder="e.g. 3 Years"
                        className="app-input"
                      />
                    </div>
                    <div className="app-field-group">
                      <label className="app-label">{isTa ? 'உறவு வகை' : 'Relationship'}</label>
                      <select
                        value={formData.references.ref2.relationshipType}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            references: { ...p.references, ref2: { ...p.references.ref2, relationshipType: e.target.value } },
                          }))
                        }
                        className="app-select"
                      >
                        <option value="Professionally">Professionally</option>
                        <option value="Personally">Personally</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* XII. Required Enclosures Upload UI */}
              <div className="app-form-section" style={{ marginTop: '36px' }}>
                <p className="app-section-subtitle">
                  <DocumentIcon size={14} color="#c8a96e" />
                  <span>XII. {isTa ? 'இணைக்க வேண்டிய சான்றுகள் (Enclosures to be Attached)' : 'Required Enclosures'}</span>
                </p>

                {REQUIRED_ENCLOSURES.map((enc) => {
                  const isUploaded = !!formData.enclosures[enc.id]
                  return (
                    <div key={enc.id} className="app-enclosure-item">
                      <div className="app-enclosure-info">
                        <h4 className="app-enclosure-title">{isTa ? enc.titleTa : enc.titleEn}</h4>
                        <p className="app-enclosure-desc">{isTa ? enc.descTa : enc.descEn}</p>
                      </div>

                      <div>
                        {isUploaded ? (
                          <div className="app-uploaded-tag">
                            <CheckIcon size={14} color="#52c41a" />
                            <span>{formData.enclosures[enc.id]}</span>
                          </div>
                        ) : (
                          <label className="app-upload-pill-btn">
                            <UploadIcon size={13} />
                            <span>{isTa ? 'கோப்பு தேர்வு' : 'Choose File'}</span>
                            <input
                              type="file"
                              onChange={(e) => handleEnclosureUpload(enc.id, e)}
                              style={{ display: 'none' }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 8: DECLARATION & REVIEW ================= */}
          {currentStep === 8 && (
            <div>
              <h2 className="app-form-step-title">
                {isTa ? '8. உறுதிமொழி & விண்ணப்ப சரிபார்ப்பு' : '8. Declaration & Final Review'}
              </h2>
              <p className="app-form-step-subtitle">
                {isTa
                  ? 'படிவம் பக்கம் 4-ல் உள்ள அதிகாரப்பூர்வ உறுதிமொழி அறிக்கை மற்றும் உள்ளிடப்பட்ட அனைத்து தகவல்களின் தொகுப்பு.'
                  : 'Official statutory declaration and comprehensive review of your membership application.'}
              </p>

              {/* Verbatim Official Declaration */}
              <div style={{ background: '#171717', border: '1px solid rgba(200, 169, 110, 0.35)', borderRadius: '6px', padding: '24px', marginBottom: '28px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#c8a96e', textTransform: 'uppercase', marginBottom: '10px' }}>
                  XI. {isTa ? 'உறுதிமொழி மற்றும் கையெழுத்து' : 'Disclaimer and Statutory Declaration'}
                </p>

                <p style={{ fontSize: '13.5px', lineHeight: '1.75', color: '#ffffff', marginBottom: '14px' }}>
                  &ldquo;I hereby declare that the information furnished above is true to the best of my knowledge. I am fully in agreement with the Faith Statement of ACI Diocese. I understand that this is the united Ministry and I shall give attention to this ministry apart from my church ministry. I shall abide by the terms and conditions of ACI Diocese, in force from time to time.&rdquo;
                </p>

                <p style={{ fontSize: '13px', lineHeight: '1.75', color: 'rgba(255,255,255,0.85)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                  &ldquo;மேலே குறிப்பிட்டுள்ள தகவல்கள் எல்லாம் உண்மை என்றும், இந்தப் பேராயத்தின் விசுவாச அறிக்கையை முழுமையாக சம்மதிக்கிறேன் என்றும், இந்த ஐக்கியத்தின் ஊழியத்தைப் புரிந்துகொண்டு, எனது தனிப்பட்ட ஊழியத்தின் மத்தியிலும், இதில் கவனம் செலுத்துவேன் என்றும், காலத்திற்கேற்ப தேவையான பேராயத்தின் விதிகளையும், நிபந்தனைகளையும் ஏற்றுக் கொள்வேன் என்றும் உறுதி கூறுகிறேன்.&rdquo;
                </p>

                {/* Declaration Checkboxes */}
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    className={`app-checkbox-row ${formData.declaration.acceptedFaithStatement ? 'active' : ''}`}
                    onClick={() => updateNested('declaration', 'acceptedFaithStatement', !formData.declaration.acceptedFaithStatement)}
                    style={{ margin: 0 }}
                  >
                    <div className="app-checkbox-box">
                      {formData.declaration.acceptedFaithStatement && <CheckIcon size={12} color="#000000" />}
                    </div>
                    <span className="app-checkbox-label">
                      {isTa ? 'நான் ஏசிஐ பேராயத்தின் 15 விசுவாச அறிக்கைகளை முழுமையாக ஏற்றுக்கொள்கிறேன்' : 'I am fully in agreement with the 15 Articles of Faith of ACI Diocese'}
                      <span className="app-label-req">*</span>
                    </span>
                  </div>
                  {errors.faith && <span style={{ color: '#ff4d4f', fontSize: '12px' }}>{errors.faith}</span>}

                  <div
                    className={`app-checkbox-row ${formData.declaration.acceptedTerms ? 'active' : ''}`}
                    onClick={() => updateNested('declaration', 'acceptedTerms', !formData.declaration.acceptedTerms)}
                    style={{ margin: 0 }}
                  >
                    <div className="app-checkbox-box">
                      {formData.declaration.acceptedTerms && <CheckIcon size={12} color="#000000" />}
                    </div>
                    <span className="app-checkbox-label">
                      {isTa ? 'பேராயத்தின் சட்ட விதிகளுக்கும் நிபந்தனைகளுக்கும் கட்டுப்பட ஒப்புக்கொள்கிறேன்' : 'I agree to abide by the terms and conditions of ACI Diocese'}
                      <span className="app-label-req">*</span>
                    </span>
                  </div>
                  {errors.terms && <span style={{ color: '#ff4d4f', fontSize: '12px' }}>{errors.terms}</span>}

                  <div
                    className={`app-checkbox-row ${formData.declaration.signatureConfirmation ? 'active' : ''}`}
                    onClick={() => updateNested('declaration', 'signatureConfirmation', !formData.declaration.signatureConfirmation)}
                    style={{ margin: 0 }}
                  >
                    <div className="app-checkbox-box">
                      {formData.declaration.signatureConfirmation && <CheckIcon size={12} color="#000000" />}
                    </div>
                    <span className="app-checkbox-label">
                      {isTa ? 'டிஜிட்டல் கையொப்ப உறுதிப்படுத்தல் (Digital Signature Confirmation)' : 'Digital Signature Confirmation by Applicant'}
                      <span className="app-label-req">*</span>
                    </span>
                  </div>
                  {errors.sig && <span style={{ color: '#ff4d4f', fontSize: '12px' }}>{errors.sig}</span>}
                </div>

                <div className="app-grid-3" style={{ marginTop: '20px' }}>
                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'விண்ணப்பதாரர் பெயர்' : "Applicant's Name"}</label>
                    <input
                      type="text"
                      value={formData.personal.name}
                      readOnly
                      className="app-input"
                      style={{ opacity: 0.8 }}
                    />
                  </div>
                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'இடம் (Place)' : 'Place'}</label>
                    <input
                      type="text"
                      value={formData.declaration.place}
                      onChange={(e) => updateNested('declaration', 'place', e.target.value)}
                      placeholder="e.g. Madurai"
                      className="app-input"
                    />
                  </div>
                  <div className="app-field-group">
                    <label className="app-label">{isTa ? 'விண்ணப்பிக்கும் தேதி' : 'Date'}</label>
                    <input
                      type="date"
                      value={formData.declaration.date}
                      onChange={(e) => updateNested('declaration', 'date', e.target.value)}
                      className="app-input"
                    />
                  </div>
                </div>
              </div>

              {/* Complete Structured Review Cards */}
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#c8a96e', marginBottom: '16px' }}>
                📋 {isTa ? 'முழு விண்ணப்பத் தொகுப்பு சரிபார்ப்பு' : 'Application Summary Dossier'}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="app-dynamic-card">
                  <span className="app-dynamic-card-badge">{isTa ? '1. சுய விவரங்கள்' : '1. Personal Information'}</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '13px', marginTop: '8px' }}>
                    <div><strong>Name:</strong> {formData.personal.salutation} {formData.personal.name || '—'}</div>
                    <div><strong>DOB:</strong> {formData.personal.dob || '—'}</div>
                    <div><strong>Gender / Marital:</strong> {formData.personal.gender} / {formData.personal.maritalStatus}</div>
                    <div><strong>District:</strong> {formData.personal.permanentAddress.district || '—'}</div>
                  </div>
                </div>

                <div className="app-dynamic-card">
                  <span className="app-dynamic-card-badge">{isTa ? '2. ஆவிக்குரிய & சபை விவரங்கள்' : '2. Spiritual & Church Details'}</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '13px', marginTop: '8px' }}>
                    <div><strong>Ministry Calling:</strong> {formData.spiritual.ministryFunction}</div>
                    <div><strong>Church Name:</strong> {formData.church.churchName || '—'}</div>
                    <div><strong>Mobile:</strong> {formData.church.mobileNumber || '—'}</div>
                    <div><strong>Email:</strong> {formData.church.emailId || '—'}</div>
                  </div>
                </div>

                <div className="app-dynamic-card">
                  <span className="app-dynamic-card-badge">{isTa ? '3. மைல்கற்கள் & தகுதிகள்' : '3. Milestones & Qualifications'}</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '13px', marginTop: '8px' }}>
                    <div><strong>Ministry Started:</strong> {formData.ministryHistory.ministryStartDate || '—'}</div>
                    <div><strong>Want Ordination:</strong> {formData.ministryHistory.wantOrdination}</div>
                    <div><strong>Academic Entries:</strong> {formData.qualifications.academic.length}</div>
                    <div><strong>Theological Entries:</strong> {formData.qualifications.theological.length}</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Form Action Controls (Back / Continue) */}
          <div className="app-form-actions">
            <button
              type="button"
              onClick={handleBack}
              className="app-back-btn"
            >
              <ArrowLeftIcon size={14} />
              <span>{currentStep === 1 ? (isTa ? 'அறிமுகப் பக்கத்திற்கு' : 'Back to Intro') : (isTa ? 'முந்தைய படி' : 'Back')}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="app-continue-btn"
            >
              <span>{currentStep === 8 ? (isTa ? 'விண்ணப்பத்தை உறுதிப்படுத்து' : 'Application Ready for Submission') : (isTa ? 'அடுத்த படி' : 'Continue')}</span>
              <ArrowRightIcon size={14} />
            </button>
          </div>

        </div>

        {/* Right Column: Live Credential Dossier Preview */}
        <aside className="app-preview-panel">
          <div className="app-preview-card">
            <div className="app-preview-badge-live">
              <span className="app-preview-live-dot" />
              <span>{isTa ? 'நேரடி விண்ணப்ப முன்னோட்டம்' : 'LIVE APPLICATION PREVIEW'}</span>
            </div>

            <div className="app-preview-header">
              <img src="/aci-logo.png" alt="ACI Diocese" className="app-preview-seal" onError={(e) => { e.target.src = '/aci-logo.jpg' }} />
              <div>
                <p className="app-preview-title">ACI DIOCESE</p>
                <span className="app-preview-meta">Membership Dossier • Reg: 62/B.k.4/2013</span>
              </div>
            </div>

            <div className="app-preview-avatar-row">
              {formData.personal.photoUrl ? (
                <img src={formData.personal.photoUrl} alt="Preview" className="app-preview-avatar" />
              ) : (
                <div className="app-preview-avatar">
                  <IdCardIcon size={26} color="#c8a96e" />
                </div>
              )}
              <div>
                <h3 className="app-preview-name">
                  {formData.personal.salutation} {formData.personal.name || (isTa ? 'விண்ணப்பதாரர் பெயர்' : 'Applicant Name')}
                </h3>
                <span className="app-preview-calling-tag">
                  {formData.spiritual.ministryFunction || 'PASTOR'}
                </span>
              </div>
            </div>

            <div className="app-preview-grid">
              <div className="app-preview-row">
                <span className="app-preview-key">{isTa ? 'சபை' : 'Church'}:</span>
                <span className="app-preview-val">{formData.church.churchName || '—'}</span>
              </div>
              <div className="app-preview-row">
                <span className="app-preview-key">{isTa ? 'மாவட்டம்' : 'District'}:</span>
                <span className="app-preview-val">{formData.personal.permanentAddress.district || formData.church.district || '—'}</span>
              </div>
              <div className="app-preview-row">
                <span className="app-preview-key">{isTa ? 'கைப்பேசி' : 'Contact'}:</span>
                <span className="app-preview-val">{formData.church.mobileNumber || '—'}</span>
              </div>
              <div className="app-preview-row">
                <span className="app-preview-key">{isTa ? 'பிறந்த தேதி' : 'DOB'}:</span>
                <span className="app-preview-val">{formData.personal.dob || '—'}</span>
              </div>
              <div className="app-preview-row">
                <span className="app-preview-key">{isTa ? 'கல்வி' : 'Qualifications'}:</span>
                <span className="app-preview-val">
                  {formData.qualifications.academic.filter(q => q.examinationPassed).length + formData.qualifications.theological.filter(q => q.examinationPassed).length} Entries
                </span>
              </div>
              <div className="app-preview-row">
                <span className="app-preview-key">{isTa ? 'குடும்பம்' : 'Family'}:</span>
                <span className="app-preview-val">{formData.family.filter(f => f.name).length} Members</span>
              </div>
            </div>

            <p className="app-preview-footer">
              Apostolic Council of India Diocese • Episcopal Secretariat<br />
              Shepherding the Shepherds
            </p>
          </div>
        </aside>

      </div>

      {/* Success Modal (Frontend Only Confirmation) */}
      {showSuccessModal && (
        <div className="app-modal-overlay">
          <div className="app-success-modal">
            <div className="app-success-icon-wrap">
              <CheckIcon size={28} color="#c8a96e" />
            </div>

            <h3 className="app-success-title">
              {isTa ? 'விண்ணப்பம் வெற்றிகரமாக தயார்!' : 'Application Ready for Submission'}
            </h3>

            <p className="app-success-text">
              {isTa
                ? `மதிப்பிற்குரிய ${formData.personal.salutation} ${formData.personal.name}, தங்களது பேராய உறுப்பினர் விண்ணப்ப விவரங்கள் அனைத்தும் வெற்றிகரமாக சரிபார்க்கப்பட்டு தயார் நிலையில் உள்ளது. அடுத்த கட்டமாக இந்த தரவுகள் பேராய சினோட் ஆலோசனை மன்ற மதிப்பாய்விற்கு இணைக்கப்படும்.`
                : `Dear ${formData.personal.salutation} ${formData.personal.name || 'Applicant'}, your diocesan membership application has been verified and is ready for the Synod Review Council.`}
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="app-continue-btn"
                style={{ background: '#c8a96e', color: '#000000' }}
              >
                {isTa ? 'விவரங்களை மீண்டும் காண்க' : 'Review Information'}
              </button>
              <Link
                to="/"
                className="app-back-btn"
              >
                {isTa ? 'முகப்பு பக்கத்திற்கு' : 'Return to Home'}
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
