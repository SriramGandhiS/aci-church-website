/* ============================================================
   ACI DIOCESE — MEMBERSHIP APPLICATION DATA SCHEMA & DEFAULTS
   Directly modeled on the official 4-page scanned application form
   ============================================================ */

export const SALUTATION_OPTIONS = [
  'Pastor',
  'Rev.',
  'Dr.',
  'Bro.',
  'Mr.',
  'Mrs.',
]

export const GENDER_OPTIONS = [
  { value: 'Male', labelEn: 'Male', labelTa: 'ஆண்' },
  { value: 'Female', labelEn: 'Female', labelTa: 'பெண்' },
]

export const MARITAL_STATUS_OPTIONS = [
  { value: 'Married', labelEn: 'Married', labelTa: 'திருமணமானவர்' },
  { value: 'Bachelor', labelEn: 'Bachelor', labelTa: 'பிரம்மச்சாரி' },
  { value: 'Spinster', labelEn: 'Spinster', labelTa: 'திருமணமாகாதவர்' },
  { value: 'Widowed', labelEn: 'Widowed', labelTa: 'விதவை / விதவை நிலை' },
]

export const MINISTRY_CALLING_OPTIONS = [
  { value: 'Apostle', labelEn: 'Apostle', labelTa: 'அப்போஸ்தலர்' },
  { value: 'Prophet', labelEn: 'Prophet', labelTa: 'தீர்க்கதரிசி' },
  { value: 'Pastor', labelEn: 'Pastor', labelTa: 'மேய்ப்பர்' },
  { value: 'Teacher', labelEn: 'Teacher', labelTa: 'போதகர்' },
  { value: 'Evangelist', labelEn: 'Evangelist', labelTa: 'சுவிசேஷகர்' },
  { value: 'Associate Pastor', labelEn: 'Associate Pastor', labelTa: 'உதவி மேய்ப்பர்' },
  { value: 'Other Ministry', labelEn: 'Other Ministry', labelTa: 'மற்ற ஊழியம்' },
]

export const AFFILIATION_OPTIONS = [
  { value: 'Independent Church', labelEn: 'Independent Church', labelTa: 'சுயாதீன திருச்சபை' },
  { value: 'Denomination', labelEn: 'Denomination', labelTa: 'சபைப் பிரிவு' },
  { value: 'Associate / Assistant', labelEn: 'Associate / Assistant', labelTa: 'இணை, உதவி ஊழியர்' },
  { value: 'None', labelEn: 'No Prior Affiliation', labelTa: 'முந்தைய இணைப்பு இல்லை' },
]

export const REQUIRED_ENCLOSURES = [
  {
    id: 'proofIdentity',
    titleEn: '1. Proof of Identity',
    titleTa: '1. அடையாளச் சான்று',
    descEn: 'Driving License / Passport / Voter ID / Ration Card / Aadhaar Card',
    descTa: 'ஓட்டுநர் உரிமம் / பாஸ்போர்ட் / வாக்காளர் அடையாள அட்டை / குடும்ப அட்டை / ஆதார்',
  },
  {
    id: 'proofAddress',
    titleEn: '2. Proof of Address',
    titleTa: '2. வீட்டு முகவரிச் சான்று',
    descEn: 'Ration Card / Aadhaar Card / Resident Certificate / Affidavit / Driving License / Passport / Voter ID',
    descTa: 'குடும்ப அட்டை / ஆதார் கார்டு / இருப்பிடச் சான்று / அஃபிடவிட் / ஓட்டுநர் உரிமம் / பாஸ்போர்ட்',
  },
  {
    id: 'proofDob',
    titleEn: '3. Proof of Date of Birth',
    titleTa: '3. பிறந்த தேதிக்கான சான்று',
    descEn: 'Transfer Certificate (TC) / 10th, 12th Marksheet / Driving License / Passport / Voter ID',
    descTa: 'பள்ளி மாற்றுச் சான்றிதழ் / 10, 12ம் வகுப்பு மதிப்பெண் பட்டியல் / ஓட்டுநர் உரிமம் / பாஸ்போர்ட்',
  },
  {
    id: 'proofNameChange',
    titleEn: '4. Proof of Name Change (if applicable)',
    titleTa: '4. பெயர் மாற்றத்திற்கான சான்று (பொருந்துமாயின்)',
    descEn: 'Baptism Certificate / Affidavit / Gazette Notification',
    descTa: 'ஞானஸ்நான சான்றிதழ் / அஃபிடவிட் / கெஜட் அறிவிப்பு',
  },
  {
    id: 'passportPhoto',
    titleEn: '5. Recent Passport Size Photo',
    titleTa: '5. சமீபத்தில் எடுத்த பாஸ்போர்ட் புகைப்படம்',
    descEn: 'Color passport size photo to be self-attested',
    descTa: 'சுய கையொப்பமிடப்பட்ட பாஸ்போர்ட் அளவிலான புகைப்படம்',
  },
  {
    id: 'ministryStatement',
    titleEn: '6. Ministry Statement / Summary',
    titleTa: '6. தங்களது ஊழியத்தை பற்றிய விளக்கம்',
    descEn: 'One-page summary of your current ministry activities and field work',
    descTa: 'ஒரு பக்க அளவில் தற்போது தாங்கள் செய்து வரும் ஊழியத்தின் சுருக்கம்',
  },
  {
    id: 'churchPhoto',
    titleEn: '7. Ministry or Church Photo',
    titleTa: '7. தங்களது ஊழியம் / சபையின் புகைப்படம்',
    descEn: 'Photo of yourself with your congregation inside your local church',
    descTa: 'தாங்களும் தங்கள் சபையாரும் சேர்ந்து சபையில் எடுத்த புகைப்படம்',
  },
  {
    id: 'ordinationCertificate',
    titleEn: '8. Ordination Certificate (if already ordained)',
    titleTa: '8. பிரதிஷ்டை சான்றிதழ் நகல் (முன்பே பிரதிஷ்டை பெற்றிருந்தால்)',
    descEn: 'Copy of existing ordination certificate for affiliation recognition',
    descTa: 'பேராயத்தின் இணைப்பைப் பெற தங்களது பிரதிஷ்டை சான்றிதழின் நகல்',
  },
]

export const initialApplicationData = {
  // Step 1: Personal Details (Page 1 of form)
  personal: {
    salutation: 'Pastor',
    name: '',
    baptismalName: '',
    dob: '',
    nationality: 'Indian',
    gender: 'Male',
    maritalStatus: 'Married',
    photoUrl: '',
    applicationDate: new Date().toISOString().split('T')[0],
    permanentAddress: {
      doorNo: '',
      streetName: '',
      cityTown: '',
      pincode: '',
      taluk: '',
      district: '',
      state: 'Tamil Nadu',
      country: 'India',
    },
    contactAddressSameAsPermanent: true,
    contactAddress: {
      doorNo: '',
      streetName: '',
      cityTown: '',
      pincode: '',
      taluk: '',
      district: '',
      state: 'Tamil Nadu',
      country: 'India',
    },
  },

  // Step 2: Spiritual Information (Page 2 of form)
  spiritual: {
    ministryFunction: 'Pastor',
    otherMinistrySpecify: '',
  },

  // Step 3: Affiliation & Church Details (Page 2 of form)
  affiliation: {
    affiliationType: 'Independent Church',
    founderName: '',
    denominationSpecify: '',
    associateChiefPastorName: '',
    associateChurchName: '',
    associateAddress: '',
    trustName: '',
  },
  church: {
    churchName: '',
    doorNo: '',
    streetName: '',
    cityTown: '',
    pincode: '',
    taluk: '',
    district: '',
    state: 'Tamil Nadu',
    country: 'India',
    telephone: '',
    mobileNumber: '',
    emailId: '',
  },

  // Step 4: Ministry History & Calling Milestones (Page 2 & 3 of form)
  ministryHistory: {
    bornAgainDate: '',
    waterBaptismDate: '',
    holySpiritBaptismDate: '',
    callingDate: '',
    ministryStartDate: '',
    wantOrdination: 'Yes',
    wantAffiliation: 'No',
  },

  // Step 5: Academic & Theological Qualifications (Page 3 of form)
  qualifications: {
    academic: [
      { id: 'a-1', examinationPassed: '', year: '', institution: '' },
    ],
    theological: [
      { id: 't-1', examinationPassed: '', year: '', institution: '' },
    ],
  },

  // Step 6: Family Details & Motivation (Page 3 of form)
  family: [
    { id: 'f-1', name: '', dob: '', relationship: '', professionEducation: '' },
  ],
  motivation: {
    reasonToJoin: '',
  },

  // Step 7: References & Required Enclosures (Page 4 of form)
  references: {
    ref1: {
      role: 'District Overseer / Diocesan Member',
      name: '',
      diocesanId: '',
      phone: '',
      knownSince: '',
      relationshipType: 'Personally',
    },
    ref2: {
      role: 'Taluk Co-ordinator / Diocesan Member',
      name: '',
      diocesanId: '',
      phone: '',
      knownSince: '',
      relationshipType: 'Professionally',
    },
  },
  enclosures: {
    proofIdentity: null,
    proofAddress: null,
    proofDob: null,
    proofNameChange: null,
    passportPhoto: null,
    ministryStatement: null,
    churchPhoto: null,
    ordinationCertificate: null,
  },

  // Step 8: Declaration (Page 4 of form)
  declaration: {
    acceptedFaithStatement: false,
    acceptedTerms: false,
    applicantName: '',
    date: new Date().toISOString().split('T')[0],
    place: '',
    signatureConfirmation: false,
  },
}
