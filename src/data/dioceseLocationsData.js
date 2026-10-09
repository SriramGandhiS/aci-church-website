import { getTalukCoordinator, TALUK_COORDINATORS_MAP } from './talukCoordinatorsData.js'
export { getTalukCoordinator, TALUK_COORDINATORS_MAP }

/**
 * ACI DIOCESE — OFFICIAL JURISDICTION, DISTRICTS, TALUKS & DISTRICT OVERSEERS (DOS) DIRECTORY
 * Used for automatic 2-step location pre-selection and referee routing in ministerial applications.
 */

export const BISHOP_REFEREE = {
  name: 'Rt. Rev. S. Johnson Durai',
  dioceseId: 'TN 0001',
  designation: 'Episcopal Bishop & Chairman',
  church: 'Central Diocesan Secretariat & Synod',
  address: 'Post Box No.1, Aruva Manai, Hanumantharayankottai, Dindigul - 624002, Tamil Nadu',
  phone: '0451 2490100',
  mobile: '+91 94864 85810',
  email: 'rev.johnsondurai@gmail.com',
  status: 'SYNOD_VERIFIED'
}

export const DIOCESE_LOCATIONS = {
  'Tirupattur': {
    districtEn: 'Tirupattur',
    districtTa: 'திருப்பத்தூர்',
    state: 'Tamil Nadu',
    taluks: ['Tirupattur', 'Vaniyambadi', 'Ambur', 'Natrampalli', 'Gudiyatham', 'Arakkonam', 'Uthangarai', 'Madapalli', 'Kottur'],
    dos: {
      name: 'Rev. Y. Santhakumar',
      regNo: 'TN 0283',
      designation: 'District Overseer (D.O.S)',
      church: 'Christ Church',
      address: '24/1, Kathavani, Karappattu (Po) - 635207, Uthangarai (Tk), Tirupattur / Krishnagiri',
      phone: '9443390461',
      email: 'christchurchmmt@gmail.com'
    },
    dosTeam: [
      { name: 'Rev. B. Simson', regNo: 'TN 0518', email: 'johnbsimson2010@gmail.com', phone: '9943759925', taluk: 'Tirupattur', church: 'Nalvazhi Church' },
      { name: 'Rev. D. A. H. Stephen', regNo: 'TN 0569', email: 'jesus4dahs@gmail.com', phone: '7502411000', taluk: 'Arakkonam / Tirupattur', church: 'Apostolic Fellowship Church' },
      { name: 'Rev. G. Kamaraj David', regNo: 'TN 0572', email: 'kamarajsim2020@yahoo.com', phone: '9943294302', taluk: 'Gudiyatham', church: 'Grace Prayer House' },
      { name: 'Rev. D. Vincentvelu', regNo: 'TN 0416', email: 'vincentvelu1978@gmail.com', phone: '9944614333', taluk: 'Madapalli', church: 'Living Faith Ministries' },
      { name: 'Rev. S. Reuban Devakumar', regNo: 'TN 0732', email: 'reubendevakumar164@gmail.com', phone: '9597932918', taluk: 'Vaniyambadi', church: 'Bethel Apostolic Church' }
    ]
  },
  'Madurai': {
    districtEn: 'Madurai',
    districtTa: 'மதுரை',
    state: 'Tamil Nadu',
    taluks: ['Madurai North', 'Madurai South', 'Madurai East', 'Madurai West', 'Melur', 'Thirumangalam', 'Vadipatti', 'Usilampatti', 'Peraiyur'],
    dos: {
      name: 'Rev. J. Joseph',
      regNo: 'TN 0667',
      designation: 'District Overseer (D.O.S)',
      church: 'Wonder Word Ministries',
      address: 'Plot No.4, Anbu Nagar, 2nd Street, Madurai - 625016, Tamil Nadu',
      phone: '9994747045',
      email: 'jojojoseph444@gmail.com'
    }
  },
  'Dindigul': {
    districtEn: 'Dindigul',
    districtTa: 'திண்டுக்கல்',
    state: 'Tamil Nadu',
    taluks: ['Dindigul East', 'Dindigul West', 'Batlagundu', 'Athoor', 'Nilakottai', 'Natham', 'Palani', 'Oddanchatram', 'Vedasandur', 'Kodaikanal'],
    dos: {
      name: 'Rev. R. Gnana Inbavanan',
      regNo: 'TN 0012',
      designation: 'District Overseer & Synod Member (D.O.S)',
      church: 'Blessed Hope Fellowship Church',
      address: 'Gandhi Nagar Main Road, Batlagundu - 624202, Dindigul District, Tamil Nadu',
      phone: '9787023637',
      email: 'rev.gnanainbavanan@acidiocese.org'
    }
  },
  'Trichy': {
    districtEn: 'Trichy (Tiruchirappalli)',
    districtTa: 'திருச்சிராப்பள்ளி',
    state: 'Tamil Nadu',
    taluks: ['Trichy East', 'Trichy West', 'Srirangam', 'Mannarpuram', 'Lalgudi', 'Manapparai', 'Musiri', 'Thuraiyur', 'Thiruverumbur'],
    dos: {
      name: 'Rev. G. Edwin Joseph Selvaraj',
      regNo: 'TN 0214',
      designation: 'District Overseer (D.O.S)',
      church: 'Bethel Faith Prayer House',
      address: '27, 2nd Street, Mannarpuram, Trichy - 620020, Tamil Nadu',
      phone: '9842863701',
      email: 'rev.edwinjoseph.trichy@gmail.com'
    },
    zonalHead: {
      name: 'Rev. F. Anthony Raj',
      regNo: 'TN 0187',
      designation: 'Zonal Head & Overseer',
      church: 'Vinnaha Thoothu',
      address: 'No.3/842, Venugopal Nagar 2nd Street, North Kattur, Trichy - 620019',
      phone: '9543519573',
      email: 'rev.anthonyraj.trichy@gmail.com'
    }
  },
  'Karur': {
    districtEn: 'Karur',
    districtTa: 'கரூர்',
    state: 'Tamil Nadu',
    taluks: ['Karur', 'Aravakurichi', 'Kulithalai', 'Pugalur', 'Krishnarayapuram', 'Kadavur'],
    dos: {
      name: 'Rev. B. Sesan George',
      regNo: 'TN 0023',
      designation: 'District Overseer (D.O.S)',
      church: 'Church Of God',
      address: 'Mohan Nagar 1st Street, Sugar Factory (Opp), Pugalur - 639113, Karur Dt, Tamil Nadu',
      phone: '8925801073',
      email: 'rev.sesangeorge.karur@gmail.com'
    }
  },
  'Virudhunagar': {
    districtEn: 'Virudhunagar (Sivakasi)',
    districtTa: 'விருதுநகர் / சிவகாசி',
    state: 'Tamil Nadu',
    taluks: ['Virudhunagar', 'Sivakasi', 'Srivilliputhur', 'Rajapalayam', 'Aruppukottai', 'Sattur', 'Kariapatti', 'Tiruchuli', 'Watrap'],
    dos: {
      name: 'Rev. A. Chinnappadoss',
      regNo: 'TN 0048',
      designation: 'District Overseer (D.O.S)',
      church: 'Apostolic Christian Ministries Foundation',
      address: '3/274 - D5 Mayiladuthurai, Anuppankulam - 626189, Sivakasi Tk, Virudhunagar Dt, Tamil Nadu',
      phone: '9944662106',
      email: 'rev.chinnappadoss.sivakasi@gmail.com'
    }
  },
  'Kanniyakumari': {
    districtEn: 'Kanniyakumari (Nagercoil)',
    districtTa: 'கன்னியாகுமரி',
    state: 'Tamil Nadu',
    taluks: ['Agastheeswaram', 'Thovalai', 'Kalkulam', 'Vilavancode', 'Killiyoor', 'Thiruvattar', 'Melmidalam', 'Nagercoil'],
    dos: {
      name: 'Rev. C. John Subar Singh',
      regNo: 'TN 0368',
      designation: 'District Overseer (D.O.S)',
      church: 'Vilavancode Apostolic Church',
      address: '9/10 B, Palla Vilai, Melmidalam - 629152, Vilavancode, Kanniyakumari Dt, Tamil Nadu',
      phone: '7639447591',
      email: 'rev.johnsubarsingh.kanyakumari@gmail.com'
    }
  },
  'Kanchipuram': {
    districtEn: 'Kanchipuram / Chengalpattu',
    districtTa: 'காஞ்சிபுரம் / செங்கல்பட்டு',
    state: 'Tamil Nadu',
    taluks: ['Kanchipuram', 'Sriperumbudur', 'Kundrathur', 'Guduvancheri', 'Walajabad', 'Uthiramerur', 'Chengalpattu'],
    dos: {
      name: 'Rev. S. Anand',
      regNo: 'TN 0413',
      designation: 'District Overseer (D.O.S)',
      church: 'Creator Mission Church',
      address: '389, TTC Nagar, Adhanoor, Guduvancheri, Sriperumbudur Tk, Kanchipuram Dt - 603202, Tamil Nadu',
      phone: '9176539539',
      email: 'rev.anand.kanchipuram@gmail.com'
    }
  },
  'Krishnagiri': {
    districtEn: 'Krishnagiri',
    districtTa: 'கிருஷ்ணகிரி',
    state: 'Tamil Nadu',
    taluks: ['Krishnagiri', 'Hosur', 'Pochampalli', 'Uthangarai', 'Denkanikottai', 'Bargur', 'Shoolagiri', 'Anchetty'],
    dos: {
      name: 'Rev. Y. Santhakumar',
      regNo: 'TN 0283',
      designation: 'District Overseer (D.O.S)',
      church: 'Christ Church',
      address: '24/1, Kathavani, Karappattu (Po) - 635207, Uthangarai (Tk), Krishnagiri / Tirupattur Dt, Tamil Nadu',
      phone: '9443390461',
      email: 'christchurchmmt@gmail.com'
    }
  },
  'Vellore': {
    districtEn: 'Vellore',
    districtTa: 'வேலூர்',
    state: 'Tamil Nadu',
    taluks: ['Vellore', 'Katpadi', 'Gudiyatham', 'Anaicut', 'K.V. Kuppam', 'Pernambut'],
    dos: {
      name: 'Rev. B. Simson',
      regNo: 'TN 0518',
      designation: 'District Overseer (D.O.S)',
      church: 'Nalvazhi Church',
      address: '160 A, Nalvazhi Church Street, Ponneri, Tirupattur / Vellore Region - 635601, Tamil Nadu',
      phone: '9943759925',
      email: 'johnbsimson2010@gmail.com'
    }
  },
  'Villupuram': {
    districtEn: 'Villupuram / Tindivanam',
    districtTa: 'விழுப்புரம் / திண்டிவனம்',
    state: 'Tamil Nadu',
    taluks: ['Villupuram', 'Tindivanam', 'Vanur', 'Gingee', 'Marakkanam', 'Vikravandi', 'Kandachipuram'],
    dos: {
      name: 'Rev. A. Pounraj',
      regNo: 'TN 0007',
      designation: 'Zonal Head & Trustee (D.O.S)',
      church: 'Apostolic Fellowship Tabernacle',
      address: 'No:135, Kaloor Road, Appasamy Nagar, Tindivanam - 604002, Tamil Nadu',
      phone: '9894961442',
      email: 'rev.pounraj.tindivanam@gmail.com'
    }
  },
  'Tirunelveli': {
    districtEn: 'Tirunelveli (Nellai)',
    districtTa: 'திருநெல்வேலி',
    state: 'Tamil Nadu',
    taluks: ['Tirunelveli', 'Palayamkottai', 'Nanguneri', 'Radhapuram', 'Ambasamudram', 'Cheranmahadevi', 'Kalakkadu'],
    dos: {
      name: 'Rev. D. John Abraham',
      regNo: 'TN 0135',
      designation: 'District Overseer (D.O.S)',
      church: 'Karunya Pentecostal Church',
      address: '17/1 Indra Nagar, Pathai [Po]- 627501, Kalakkadu [Via], Nanguneri [Tk], Nellai [Dt], Tamil Nadu',
      phone: '9791758596',
      email: 'rev.johnabraham.nellai@gmail.com'
    }
  },
  'Puducherry': {
    districtEn: 'Puducherry',
    districtTa: 'புதுச்சேரி',
    state: 'Puducherry',
    taluks: ['Puducherry', 'Oulgaret', 'Villianur', 'Bahour', 'Karaikal', 'Mahe', 'Yanam'],
    dos: {
      name: 'Rev. T. Sebastian',
      regNo: 'TN 0099',
      designation: 'District Overseer (D.O.S)',
      church: 'Apostolic Faith Church',
      address: '12, Kurunji Street, Kamaraj Nagar, Gorimedu, Pondicherry - 605006',
      phone: '9345421267',
      email: 'rev.sebastian.pondicherry@gmail.com'
    }
  },
  'Idukki South': {
    districtEn: 'Idukki South (Kerala)',
    districtTa: 'இடுக்கி தெற்கு',
    state: 'Kerala',
    taluks: ['Peerumade', 'Vandiperiyar', 'Udumbanchola', 'Kumily', 'Elappara'],
    dos: {
      name: 'Rev. J. Amburose',
      regNo: 'TN 0082',
      designation: 'District Overseer (D.O.S)',
      church: 'Vandiperiyar Faith Church',
      address: 'Dymock Estate Post, Vandiperiyar - 685553, Idukki District, Kerala State',
      phone: '9645478988',
      email: 'rev.amburose.idukki@gmail.com'
    }
  },
  'Idukki North': {
    districtEn: 'Idukki North (Kerala)',
    districtTa: 'இடுக்கி வடக்கு',
    state: 'Kerala',
    taluks: ['Munnar', 'Devikulam', 'Sureyanalli', 'Adimali', 'Nedumkandam'],
    dos: {
      name: 'Rev. M. Chinnathambi Yesudos',
      regNo: 'TN 0102',
      designation: 'District Overseer (D.O.S)',
      church: 'Faith Prayer Fellowship Church',
      address: '251, Sureyanalli [Po], Idukki [Dt], Munnar, Kerala - 685618',
      phone: '9495838152',
      email: 'rev.yesudos.munnar@gmail.com'
    }
  },
  'Chennai': {
    districtEn: 'Chennai',
    districtTa: 'சென்னை',
    state: 'Tamil Nadu',
    taluks: ['Chennai Central', 'Chennai North', 'Chennai South', 'Ambattur', 'Guindy', 'Mylapore', 'Tambaram', 'Avadi', 'Tondiarpet'],
    dos: {
      name: 'Rev. Clemant Alex',
      regNo: 'TN 0004',
      designation: 'District Overseer & Senior Pastor (D.O.S)',
      church: 'Grace Gospel Tabernacle',
      address: 'Diocese City Center, Anna Nagar, Chennai - 600040, Tamil Nadu',
      phone: '9840129033',
      email: 'rev.clemantalex.chennai@gmail.com'
    }
  },
  'Coimbatore': {
    districtEn: 'Coimbatore',
    districtTa: 'கோயம்புத்தூர்',
    state: 'Tamil Nadu',
    taluks: ['Coimbatore North', 'Coimbatore South', 'Pollachi', 'Mettupalayam', 'Sulur', 'Annur', 'Valparai', 'Kinathukadavu'],
    dos: {
      name: 'Rev. T. Anandaraj',
      regNo: 'TN 0003',
      designation: 'District Overseer & Synod Member (D.O.S)',
      church: 'Living Word Fellowship',
      address: 'Diocese Mission House, Gandhipuram, Coimbatore - 641012, Tamil Nadu',
      phone: '9443210987',
      email: 'rev.anandaraj.cbe@gmail.com'
    }
  },
  'Theni': {
    districtEn: 'Theni',
    districtTa: 'தேனி',
    state: 'Tamil Nadu',
    taluks: ['Theni', 'Periyakulam', 'Bodinayakanur', 'Uthamapalayam', 'Andipatti'],
    dos: {
      name: 'Rev. S. Sambath Solomon',
      regNo: 'TN 0081',
      designation: 'District Overseer (D.O.S)',
      church: 'Theni Apostolic Revival Church',
      address: 'Church Road, Allinagaram, Theni - 625531, Tamil Nadu',
      phone: '9443789012',
      email: 'rev.sambathsolomon.theni@gmail.com'
    }
  },
  'Salem': {
    districtEn: 'Salem',
    districtTa: 'சேலம்',
    state: 'Tamil Nadu',
    taluks: ['Salem', 'Attur', 'Mettur', 'Omalur', 'Yercaud', 'Sankari', 'Edappadi'],
    dos: {
      name: 'Rev. Y. Santhakumar',
      regNo: 'TN 0283',
      designation: 'District Overseer (D.O.S)',
      church: 'Christ Church',
      address: 'Regional Overseer Center, Salem / Krishnagiri Zone, Tamil Nadu',
      phone: '9443390461',
      email: 'christchurchmmt@gmail.com'
    }
  },
  'Thanjavur': {
    districtEn: 'Thanjavur',
    districtTa: 'தஞ்சாவூர்',
    state: 'Tamil Nadu',
    taluks: ['Thanjavur', 'Kumbakonam', 'Papanasam', 'Pattukkottai', 'Peravurani', 'Orathanadu', 'Thiruvaiyaru'],
    dos: {
      name: 'Rev. G. Edwin Joseph Selvaraj',
      regNo: 'TN 0214',
      designation: 'Regional Overseer (D.O.S)',
      church: 'Bethel Faith Prayer House',
      address: 'Cauvery Delta Regional Secretariat, Thanjavur / Trichy Zone',
      phone: '9842863701',
      email: 'rev.edwinjoseph.trichy@gmail.com'
    }
  }
}

export const DISTRICT_LIST = Object.keys(DIOCESE_LOCATIONS)

/**
 * Returns location data and mapped DOS for any given district name.
 */
export function getDistrictLocation(districtName) {
  if (!districtName) return null
  const clean = districtName.replace(/\s*Diocese/i, '').trim()
  
  // Exact lookup
  if (DIOCESE_LOCATIONS[clean]) {
    return DIOCESE_LOCATIONS[clean]
  }
  
  // Partial match lookup
  for (const [key, val] of Object.entries(DIOCESE_LOCATIONS)) {
    if (key.toLowerCase().includes(clean.toLowerCase()) || clean.toLowerCase().includes(key.toLowerCase())) {
      return val
    }
  }
  
  // Default fallback to Central Diocese Secretariat
  return {
    districtEn: clean || 'Tamil Nadu Central',
    districtTa: clean || 'மத்திய பேராயம்',
    state: 'Tamil Nadu',
    taluks: ['Central Taluk', 'General Region'],
    dos: {
      name: 'Rt. Rev. S. Johnson Durai',
      regNo: 'TN 0001',
      designation: 'Episcopal Bishop & Chairman',
      church: 'Central Diocesan Secretariat',
      address: 'Post Box No.1, Aruva Manai, Hanumantharayankottai, Dindigul - 624002',
      phone: '0451 2490100',
      email: 'rev.johnsondurai@gmail.com'
    }
  }
}

/**
 * Generates official referee pre-fills based on chosen District & Taluk.
 * Ref 1: District Overseer (D.O.S)
 * Ref 2: Taluk Coordinator (distinct ministerial leader assigned for that taluk)
 */
export function getAutoReferees(districtName, talukName) {
  const loc = getDistrictLocation(districtName)
  const dos = loc ? loc.dos : BISHOP_REFEREE

  // Reference 1 is always the official District Overseer
  const assignedDos = { ...dos }

  // Reference 2 is the Taluk Coordinator extracted from Diocesan Records
  const coord = getTalukCoordinator(districtName, talukName) || {
    name: 'Rev. Diocesan Taluk Coordinator',
    regNo: 'TN 0500',
    phone: '0451 2490100',
    email: 'coordinator@acidiocese.org',
    church: `${talukName || 'Taluk'} Diocesan Fellowship`,
    address: `${talukName || ''}, ${loc?.districtEn || districtName || 'Diocese'}, Tamil Nadu`,
    designation: 'Taluk Coordinator',
    taluk: talukName || ''
  }

  const ref1Data = {
    name: assignedDos.name,
    dioceseId: assignedDos.regNo || assignedDos.dioceseId || 'DOS-OFFICIAL',
    designation: assignedDos.designation || 'District Overseer (D.O.S)',
    church: assignedDos.church || 'Diocesan Parish',
    address: assignedDos.address || `${loc?.districtEn || districtName || 'Diocese'}, Tamil Nadu`,
    phone: assignedDos.phone || '',
    email: assignedDos.email || 'dos@acidiocese.org',
    knownDuration: 'Over 3 Years',
    status: 'PENDING_DOS_RECOMMENDATION'
  }

  const ref2Data = {
    name: coord.name,
    dioceseId: coord.regNo || coord.dioceseId || 'COORD-OFFICIAL',
    designation: 'Taluk Coordinator',
    church: coord.church || `${talukName || 'Taluk'} Diocesan Parish`,
    address: coord.address || `${talukName || ''}, ${loc?.districtEn || districtName || 'Diocese'}, Tamil Nadu`,
    phone: coord.phone || '',
    email: coord.email || 'coordinator@acidiocese.org',
    knownDuration: 'Over 2 Years',
    status: 'PENDING_COORDINATOR_RECOMMENDATION'
  }

  return {
    ref1: ref1Data,
    ref2: ref2Data,
    dos: ref1Data,
    coordinator: ref2Data
  }
}

