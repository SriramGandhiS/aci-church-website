import { useState, useMemo, useEffect, useRef } from 'react'
import * as XLSX from 'xlsx'
import { useLanguage } from '../context/LanguageContext'
import { getMediaUrl } from '../utils/imageUrl'
import { SearchIcon, IdCardIcon, ChurchIcon, LocationIcon, PhoneIcon, ArrowRightIcon, ShieldIcon } from '../components/Icons/SvgIcons'
import MemberIdCardModal from '../components/MemberIdCard/MemberIdCardModal'
import initialPastorsData from '../data/pastorsData.json'
import './DirectoryPage.css'

const TICKER_PHOTOS = [
  'gallery/23rd Ordination 10.04.2024/4498769c2b5924c919c9336e04979875.jpg',
  'gallery/Madurai Zonal Office Dedication Service/7cc60a065180716a1dd0a3fe4db93be3.jpg',
  'gallery/YOUTH DAY 2022/ecb0b4a539fb2fa8e455481c94fc593c.jpg',
  'gallery/5th Church Visit/c50ad7cfc01b9dfaf710f5bf102b1851.jpg',
  'gallery/Church Dedication /f79744d5293e7c9c16935e976bffa844.jpg',
  'gallery/VBS 2018/c57c7e9fa81e376829a69dc50471b34b.jpg',
  'gallery/21st Ordination Service 12.04.2023/792ee63bd98ef2da8729f4be547e098d.jpg',
  'gallery/22nd Ordination 11.10.2023/63d76b10629ecaa8b1a8080f08960ff2.jpg',
]

const FILTER_ROLES = [
  { id: 'all', labelEn: 'All Ministers', labelTa: 'அனைத்து ஊழியர்கள்' },
  { id: 'pastor', labelEn: 'Pastors', labelTa: 'போதகர்கள்' },
  { id: 'evangelist', labelEn: 'Evangelists', labelTa: 'சுவிசேஷகர்கள்' },
  { id: 'prophet', labelEn: 'Prophets', labelTa: 'தீர்க்கதரிசிகள்' },
  { id: 'bishop', labelEn: 'Bishops & Synod', labelTa: 'பேராயர் & சினோட்' },
  { id: 'teacher', labelEn: 'Teachers', labelTa: 'போதனாசிரியர்கள்' },
]

export default function DirectoryPage() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'

  const [pastors, setPastors] = useState(initialPastorsData)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeRole, setActiveRole] = useState('all')
  const [selectedPastor, setSelectedPastor] = useState(null)
  const [visibleCount, setVisibleCount] = useState(30)
  const fileInputRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Handle Excel upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsName = wb.SheetNames[0]
        const ws = wb.Sheets[wsName]
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })

        const formatted = rows.map((r, i) => {
          const name = String(r['Name'] || '').trim()
          const regRaw = String(r['Reg.No'] || r['Reg No'] || '').trim().toUpperCase()
          const regNo = regRaw.startsWith('TN') && !regRaw.startsWith('TN ') ? 'TN ' + regRaw.slice(2) : regRaw

          return {
            id: regNo ? regNo.replace(/\s+/g, '').toLowerCase() : `p-${i}`,
            sno: i + 1,
            regNo: regNo || `TN ${String(i + 1).padStart(4, '0')}`,
            name: name,
            designation: String(r['Designation'] || r['Office'] || 'Member').trim(),
            office: String(r['Office'] || 'Pastor').trim(),
            church: String(r['Church Name'] || '').trim(),
            district: String(r['District'] || '').trim(),
            state: String(r['State'] || 'Tamil Nadu').trim(),
            phone: String(r['Phone No.'] || r['Phone No'] || '').trim(),
            email: String(r['E-mail Address'] || r['Email'] || '').trim(),
            address: String(r['Contact Address'] || '').trim(),
            ordinationDate: String(r['Date of Ordination'] || '').trim(),
            status: String(r['Status'] || 'Active').trim() || 'Active',
          }
        }).filter(p => p.name && p.name.toLowerCase() !== 'name')

        if (formatted.length > 0) {
          setPastors(formatted)
          alert(isTa ? `வெற்றிகரமாக ${formatted.length} ஊழியர்கள் ஏற்றப்பட்டனர்!` : `Successfully loaded ${formatted.length} ministers!`)
        }
      } catch (err) {
        console.error('Excel parse error:', err)
        alert('Error parsing Excel file. Please ensure it matches the diocesan sheet format.')
      }
    }
    reader.readAsBinaryString(file)
  }

  // Filtered Pastors
  const filteredPastors = useMemo(() => {
    const q = searchTerm.toLowerCase().trim()
    return pastors.filter((p) => {
      // Role filter
      if (activeRole !== 'all') {
        const off = (p.office + ' ' + p.designation).toLowerCase()
        if (activeRole === 'pastor' && !off.includes('pastor')) return false
        if (activeRole === 'evangelist' && !off.includes('evangelist')) return false
        if (activeRole === 'prophet' && !off.includes('prophet')) return false
        if (activeRole === 'bishop' && !off.includes('bishop') && !off.includes('synod') && !off.includes('chairman')) return false
        if (activeRole === 'teacher' && !off.includes('teacher')) return false
      }

      // Search query filter
      if (!q) return true
      const matchName = p.name.toLowerCase().includes(q)
      const matchReg = p.regNo.toLowerCase().replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))
      const matchChurch = p.church?.toLowerCase().includes(q)
      const matchDistrict = p.district?.toLowerCase().includes(q)
      const matchOffice = p.office?.toLowerCase().includes(q)
      return matchName || matchReg || matchChurch || matchDistrict || matchOffice
    })
  }, [pastors, searchTerm, activeRole])

  return (
    <div className="dir-page">

      {/* Hero Header with Animated Gallery Backdrop */}
      <section className="dir-hero">
        <div className="dir-ticker-wrap" aria-hidden="true">
          <div className="dir-ticker-track">
            {TICKER_PHOTOS.concat(TICKER_PHOTOS).map((photo, i) => (
              <img key={i} src={getMediaUrl(photo)} alt="" className="dir-ticker-img" />
            ))}
          </div>
        </div>

        <div className="dir-hero-inner">
          <div className="dir-badge">
            <ShieldIcon size={14} color="#ffffff" />
            <span>{isTa ? 'அதிகாரப்பூர்வ பேராய பதிவேடு' : 'Official Registered Directory'}</span>
          </div>

          <h1 className="dir-title">
            {isTa ? 'பேராய ஊழியர்கள் & மேய்ப்பர்கள் தேடல்' : 'Diocesan Ministerial Directory'}
          </h1>

          <p className="dir-subtitle">
            {isTa
              ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தில் பதிவுசெய்யப்பட்ட அனைத்து எபிஸ்கோபல் போதகர்கள், சுவிசேஷகர்கள் மற்றும் ஊழியர்களின் விவரங்களை தேடி அவர்களின் அதிகாரப்பூர்வ அடையாள அட்டையைக் காண்க.'
              : 'Search across 850+ ordained episcopal pastors, evangelists, and ministers registered under the Apostolic Council of India Diocese and verify their official ministerial credentials.'}
          </p>

          {/* Floating Search Bar */}
          <div className="dir-search-box">
            <SearchIcon size={20} className="dir-search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setVisibleCount(30)
              }}
              placeholder={isTa ? 'பெயர் அல்லது பதிவு எண் மூலம் தேடுக (எ.கா. Anand, TN 0003, Madurai)...' : 'Search by Name or Reg. No (e.g. Anand, TN 0003, Madurai)...'}
              className="dir-search-input"
              autoFocus
            />
            {searchTerm && (
              <button className="dir-clear-btn" onClick={() => setSearchTerm('')} title="Clear search">
                ✕
              </button>
            )}
          </div>

          {/* Quick Role Filters */}
          <div className="dir-filter-row">
            {FILTER_ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRole(r.id)
                  setVisibleCount(30)
                }}
                className={`dir-filter-pill ${activeRole === r.id ? 'active' : ''}`}
              >
                {isTa ? r.labelTa : r.labelEn}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="dir-content">

        {/* Stats Row & Excel Import Option */}
        <div className="dir-stats-bar">
          <p className="dir-count-text">
            {isTa ? 'காட்டப்படும் முடிவுகள்:' : 'Showing'}{' '}
            <span className="dir-count-num">{filteredPastors.length}</span>{' '}
            {isTa ? 'பதிவுபெற்ற ஊழியர்கள்' : 'Registered Ministers'}
            {searchTerm && <span> for &ldquo;<strong>{searchTerm}</strong>&rdquo;</span>}
          </p>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                letterSpacing: '0.04em',
              }}
            >
              📄 {isTa ? 'புதிய எக்செல் தாள் பதிவேற்று' : 'Upload Updated Excel'}
            </button>
          </div>
        </div>

        {/* Ministers Cards Grid */}
        {filteredPastors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.5)' }}>
            <p style={{ fontSize: '20px', marginBottom: '8px', color: '#ffffff' }}>
              {isTa ? 'பொருத்தமான ஊழியர்கள் விபரம் கிடைக்கவில்லை' : 'No registered ministers found matching your search'}
            </p>
            <p style={{ fontSize: '14px', marginBottom: '20px' }}>
              {isTa ? 'தயவுசெய்து வேறு பெயர் அல்லது பதிவு எண்ணை உள்ளிட்டு தேடவும்.' : 'Try checking spelling or search using a TN registration number (e.g. TN 0001, TN 0003).'}
            </p>
            <button
              onClick={() => { setSearchTerm(''); setActiveRole('all') }}
              style={{ background: '#ffffff', color: '#000000', border: 'none', padding: '10px 24px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}
            >
              {isTa ? 'அனைத்து ஊழியர்களையும் காட்டு' : 'Reset All Filters'}
            </button>
          </div>
        ) : (
          <div className="dir-grid">
            {filteredPastors.slice(0, visibleCount).map((pastor) => (
              <div
                key={pastor.id}
                className="dir-card"
                onClick={() => setSelectedPastor(pastor)}
              >
                <div>
                  <div className="dir-card-top">
                    <div className="dir-avatar">
                      <IdCardIcon size={24} color="#ffffff" />
                    </div>
                    <div className="dir-card-titles">
                      <h3 className="dir-card-name">{pastor.name}</h3>
                      <span className="dir-card-office">
                        {pastor.office || pastor.designation || 'Minister'}
                      </span>
                    </div>
                    <span className="dir-reg-tag">{pastor.regNo}</span>
                  </div>

                  <div className="dir-card-meta">
                    {pastor.church && (
                      <div className="dir-meta-row">
                        <ChurchIcon size={14} className="dir-meta-icon" />
                        <span>{pastor.church}</span>
                      </div>
                    )}
                    {pastor.district && (
                      <div className="dir-meta-row">
                        <LocationIcon size={14} className="dir-meta-icon" />
                        <span>{pastor.district}{pastor.state ? `, ${pastor.state}` : ''}</span>
                      </div>
                    )}
                    {pastor.phone && (
                      <div className="dir-meta-row">
                        <PhoneIcon size={14} className="dir-meta-icon" />
                        <span>{pastor.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="dir-card-footer">
                  <span className="dir-view-id-btn">
                    {isTa ? 'அடையாள அட்டை காண்க' : 'View ID Credential'} <ArrowRightIcon size={12} />
                  </span>
                  <span style={{ fontSize: '11px', color: '#ffffff', opacity: 0.8, fontWeight: 600 }}>
                    ● {pastor.status || 'Active'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredPastors.length > visibleCount && (
          <div className="dir-load-more">
            <button
              onClick={() => setVisibleCount((c) => c + 40)}
              className="dir-load-btn"
            >
              {isTa ? `மேலும் ஊழியர்களைக் காட்டு (${filteredPastors.length - visibleCount} மீதம்)` : `Load More Ministers (${filteredPastors.length - visibleCount} remaining)`}
            </button>
          </div>
        )}

      </div>

      {/* Official ID Card Modal */}
      {selectedPastor && (
        <MemberIdCardModal
          pastor={selectedPastor}
          onClose={() => setSelectedPastor(null)}
          isTa={isTa}
        />
      )}

    </div>
  )
}
