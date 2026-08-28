import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import pastorsData from '../data/pastorsData.json'
import { CloseIcon, PhoneIcon, EmailIcon, LocationIcon, ChurchIcon } from '../components/Icons/SvgIcons'
import './SynodPage.css'

const S = {
  page: { paddingTop: '80px', background: '#0a0a0a', color: '#fff', minHeight: '100vh' },
  hero: { background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '60px 0 40px' },
  con: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px' },
  sec: { padding: '72px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', scrollMarginTop: '90px' },
  h2: { fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingBottom: '12px', borderBottom: '2px solid #c8a96e', display: 'inline-block' },
  lbl: { color: '#c8a96e', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 },
  p: { color: 'rgba(255,255,255,0.85)', lineHeight: 1.85, marginBottom: '14px', fontSize: '16px' },
  pTa: { color: 'rgba(255,255,255,0.8)', lineHeight: 2.1, marginBottom: '14px', fontSize: '15px' },
  subH: { color: '#c8a96e', fontSize: '17px', fontWeight: 600, marginBottom: '12px', marginTop: '28px' },
  divider: { height: '1px', background: 'rgba(255,255,255,0.07)', margin: '28px 0' },
  memberGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
    marginTop: '24px',
  },
  memberHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  memberNumber: {
    color: '#c8a96e',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.1em',
  },
  memberBadge: {
    background: 'rgba(200,169,110,0.15)',
    color: '#c8a96e',
    border: '1px solid rgba(200,169,110,0.35)',
    fontSize: '11px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.05em',
  },
  memberName: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 6px 0',
    lineHeight: 1.35,
  },
  memberDesignation: {
    color: '#c8a96e',
    fontSize: '14px',
    fontWeight: 600,
    margin: '0 0 10px 0',
    lineHeight: 1.45,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    paddingBottom: '10px',
  },
  memberDetail: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 1.6,
    marginTop: '4px',
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '12px',
    marginRight: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  }
}

export default function SynodPage() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const { hash } = useLocation()
  const [selectedMember, setSelectedMember] = useState(null)

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
  }, [hash])

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [selectedMember])

  // 1. General Council: 5 Members
  const generalCouncilMembers = [
    {
      sno: 1,
      regNo: 'TN 0001',
      name: 'The Most Rev. S. Johnson Durai',
      role: isTa ? 'தலைமைப் பேராயர் & தலைவர் & நிர்வாக அறங்காவலர்' : 'Archbishop & Chairman & Managing Trustee',
      excelDesignation: 'Bishop & Chairman / Synod Member',
    },
    {
      sno: 2,
      regNo: 'TN 0005',
      name: 'Rev. Dr. R. John Durai',
      role: isTa ? 'சினோட் துணைத் தலைவர் & அறங்காவலர்' : 'Vice Chairman / Synod Member & Trustee',
      excelDesignation: 'Vice Chairman / Synod Member',
    },
    {
      sno: 3,
      regNo: 'TN 0146',
      name: 'Rev. J.A.D. Samuel',
      role: isTa ? 'சினோட் பொதுச் செயலாளர் & அறங்காவலர்' : 'General Secretary / Synod Member & Trustee',
      excelDesignation: 'General Secretary / Synod Member',
    },
    {
      sno: 4,
      regNo: 'TN 0093',
      name: 'Rt. Rev. Dr. L. Suresh Daniel',
      role: isTa ? 'பேராயர் & நிதி அறங்காவலர் & சினோட் உறுப்பினர்' : 'Bishop & Financial Trustee / Synod Member',
      excelDesignation: 'Bishop & Finance Trustee / Synod Member',
    },
    {
      sno: 5,
      regNo: 'TN 0058',
      name: 'Rt. Rev. John Samuel',
      role: isTa ? 'பேராயர் ஆணையாளர் & அறங்காவலர்' : 'Archbishop Commissary / Trustee',
      excelDesignation: 'Archbishop Commissary / Trustee',
    },
  ]

  // 2. Academic Council: 19 Members (General Council members + Regional Bishops + Council Leaders)
  const academicCouncilMembers = [
    ...generalCouncilMembers,
    {
      sno: 6,
      regNo: 'TN 0413',
      name: 'Rt. Rev. S. Anand',
      role: isTa ? 'பேராயர் ஏசிஐ செங்கல்பட்டு பேராயம் & சினோட் செயலாளர்' : 'Bishop ACI Chengalpattu Diocese & Synod Secretary',
      excelDesignation: 'Bishop & Synod Secretary / Synod Member',
    },
    {
      sno: 7,
      regNo: 'TN 0007',
      name: 'Rt. Rev. A. Pounraj',
      role: isTa ? 'பேராயர் ஏசிஐ விழுப்புரம் பேராயம் & சினோட் அறங்காவலர்' : 'Bishop ACI Villupuram Diocese & Synod Trustee',
      excelDesignation: 'Bishop & Trustee / Synod Member',
    },
    {
      sno: 8,
      regNo: 'TN 0214',
      name: 'Rt. Rev. G. Edwin Joseph Selvaraj',
      role: isTa ? 'பேராயர் ஏசிஐ திருச்சி பேராயம் & சினோட் அறங்காவலர்' : 'Bishop ACI Trichy Diocese & Synod Trustee',
      excelDesignation: 'Bishop & Trustee & Synod Member',
    },
    {
      sno: 9,
      regNo: 'TN 0518',
      name: 'Rt. Rev. B. Simson',
      role: isTa ? 'பேராயர் ஏசிஐ திருப்பத்தூர் பேராயம் & சினோட் உறுப்பினர்' : 'Bishop ACI Tirupattur Diocese & Synod Member',
      excelDesignation: 'Bishop & Synod Member',
    },
    {
      sno: 10,
      regNo: 'TN 0048',
      name: 'Rt. Rev. A. Chinnappadoss',
      role: isTa ? 'பேராயர் ஏசிஐ விருதுநகர் பேராயம் & சினோட் உறுப்பினர்' : 'Bishop ACI Virudhunagar Diocese & Synod Member',
      excelDesignation: 'Bishop & Synod Member',
    },
    {
      sno: 11,
      regNo: 'TN 0514',
      name: 'Rt. Rev. J. Sujin',
      role: isTa ? 'பேராயர் ஏசிஐ கன்னியாகுமரி பேராயம் & சினோட் உறுப்பினர்' : 'Bishop ACI Kanniyakumari Diocese & Synod Member',
      excelDesignation: 'Bishop & Synod Member',
    },
    {
      sno: 12,
      regNo: 'TN 0587',
      name: 'Rev. D. V. Isaac Timothy',
      role: isTa ? 'அறங்காவலர் & D.O.S & சினோட் உறுப்பினர்' : 'Trustee & D.O.S & Synod Member',
      excelDesignation: 'Trustee / D.O.S / Synod Member',
    },
    {
      sno: 13,
      regNo: 'TN 0607',
      name: 'Rev. J. Xavier Paulraj',
      role: isTa ? 'சினோட் உறுப்பினர்' : 'Synod Member',
      excelDesignation: 'Synod Member',
    },
    {
      sno: 14,
      regNo: 'TN 0012',
      name: 'Rev. R. Gnana Inbavanan',
      role: isTa ? 'D.O.S & சினோட் உறுப்பினர்' : 'D.O.S & Synod Member',
      excelDesignation: 'D.O.S & Synod Member',
    },
    {
      sno: 15,
      regNo: 'TN 0853',
      name: 'Rev. Sathees Kumar',
      role: isTa ? 'சினோட் உறுப்பினர்' : 'Synod Member',
      excelDesignation: 'Synod Member',
    },
    {
      sno: 16,
      regNo: 'TN 0397',
      name: 'Rev. A. Joseph DuraiRaj',
      role: isTa ? 'D.O.S & சினோட் உறுப்பினர்' : 'D.O.S & Synod Member',
      excelDesignation: 'D.O.S & Synod Member',
    },
    {
      sno: 17,
      regNo: 'TN 0661',
      name: 'Rev. J. Shyam Raj',
      role: isTa ? 'சினோட் உறுப்பினர்' : 'Synod Member',
      excelDesignation: 'Synod Member',
    },
    {
      sno: 18,
      regNo: 'TN 0714',
      name: 'Rev. S. Moses Prawin paul',
      role: isTa ? 'சினோட் உறுப்பினர்' : 'Synod Member',
      excelDesignation: 'Synod Member',
    },
    {
      sno: 19,
      regNo: 'TN 0203',
      name: 'Rev. M. Rajendran',
      role: isTa ? 'சினோட் உறுப்பினர்' : 'Synod Member',
      excelDesignation: 'Synod Member',
    },
  ]

  // Helper to fetch details from pastorsData.json (the Excel sheet dataset)
  const getMemberData = (member) => {
    const fromExcel = pastorsData.find(p => p.regNo === member.regNo) || {}
    return {
      ...fromExcel,
      sno: member.sno,
      regNo: member.regNo || fromExcel.regNo || '',
      name: member.name || fromExcel.name || '',
      role: member.role || '',
      designation: member.excelDesignation || fromExcel.designation || member.role || 'Synod Member',
      office: member.office || fromExcel.office || 'Pastor',
      church: member.church || fromExcel.church || '',
      dob: member.dob || fromExcel.dob || '',
      ordinationDate: member.ordinationDate || fromExcel.ordinationDate || '',
      phone: member.phone || fromExcel.phone || '',
      email: member.email || fromExcel.email || '',
      address: member.address || fromExcel.address || '',
      district: member.district || fromExcel.district || '',
      state: member.state || fromExcel.state || 'Tamil Nadu',
      status: member.status || fromExcel.status || 'Active'
    }
  }

  const renderMemberCards = (list) => (
    <div style={S.memberGrid}>
      {list.map((m, i) => {
        const fullData = getMemberData(m)
        return (
          <div
            key={i}
            className="synod-member-card"
            onClick={() => setSelectedMember(fullData)}
            title="Click to view full Synod Council profile"
          >
            <div style={S.memberHeader}>
              <span style={S.memberNumber}>#{String(m.sno).padStart(2, '0')}</span>
              {fullData.regNo && <span style={S.memberBadge}>{fullData.regNo}</span>}
            </div>

            {/* Member Name */}
            <h3 style={S.memberName}>{fullData.name}</h3>

            {/* Designation Directly Below the Name */}
            <p style={S.memberDesignation}>{fullData.role}</p>

            {fullData.church && (
              <div style={S.memberDetail}>
                <span style={S.detailLabel}>{isTa ? 'சபை / ஊழியம்:' : 'Church:'}</span> {fullData.church}
              </div>
            )}
            {fullData.district && (
              <div style={S.memberDetail}>
                <span style={S.detailLabel}>{isTa ? 'மாவட்டம்:' : 'District:'}</span> {fullData.district}, {fullData.state}
              </div>
            )}

            <div className="synod-view-badge">
              <span>{isTa ? 'முழு விபரம் பார்க்க' : 'View Full Details'}</span>
              <span>→</span>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div style={S.page}>
      {/* HERO SECTION */}
      <div style={S.hero}>
        <div style={S.con}>
          <p style={{ ...S.lbl, marginBottom: '16px' }}>{isTa ? 'சினோட் பக்கம்' : 'SYNOD PAGE'}</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(30px,5vw,48px)', fontWeight: 400, marginBottom: '12px', color: '#fff' }}>
            {isTa ? 'சினோட் சபை ஆலோசனை மன்றம்' : 'Synod Advisory Council'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', maxWidth: '800px', lineHeight: 1.7 }}>
            {isTa
              ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தின் ஆவிக்குரிய, இறையியல், பொது நிர்வாக மற்றும் கல்வி ஆலோசனை மன்றம்.'
              : 'The spiritual, theological, general governance, and academic advisory body of the Apostolic Council of India Diocese.'}
          </p>
        </div>
      </div>

      {/* 1. ABOUT SYNOD */}
      <section id="aboutsynod" style={S.sec}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'சினோட் · 01' : 'Synod · 01'}</p>
          <h2 style={S.h2}>{isTa ? 'சினோட் பற்றி (About Synod)' : 'About the Synod'}</h2>
          <div style={{ marginTop: '28px' }}>
            <p style={S.p}>The Synod shall comprise of all the Trustees of the Board and Apostles, Prophets, Evangelists, Pastors, Teachers, and Clergy and/or Laity, who fulfill any or all of the Ministerial Callings. They will look after the Spiritual needs and welfare of various Committees of Apostolic Council of India Diocese.</p>
            <p style={S.p}><strong style={{ color: '#c8a96e' }}>a)</strong> The Most Reverend Archbishop S. Johnson Durai, the Author of the Trust, shall be the Chairman of the Synod for life and shall name the successor who will take his place on his resignation or death.</p>
            <p style={S.p}><strong style={{ color: '#c8a96e' }}>b)</strong> The Chairman of the Synod shall nominate and appoint the members to the synod in consultation with the Board of Trustees. This shall be the first Synod and shall be responsible for all the committees and their responsibilities.</p>
            <p style={S.p}><strong style={{ color: '#c8a96e' }}>c)</strong> The Synod comprises of not more than TWENTY members and not less than NINE.</p>

            <div style={S.divider} />
            <p style={S.subH}>சபை ஆலோசனை மன்றம் (தமிழ் விளக்கம்):</p>
            <p style={S.pTa}>சபை ஆலோசனை மன்றமானது அனைத்து அறங்காவலர்களையும் மற்றும் பேராயத்தின் அப்போஸ்தலர்கள், தீர்க்கதரிசிகள், சுவிசேஷகர்கள், மேய்ப்பர்கள், போதகர்கள் ஆகியோரை தன்னகத்தே கொண்டுள்ளது.</p>
            <p style={S.pTa}><strong style={{ color: '#c8a96e' }}>அ.</strong> இந்த அறக்கட்டளையின் நிறுவனரும், தலைமைப் பேராயருமான (Archbishop) பேரருட்திரு ச. ஜான்சன்துரை அவர்கள் இந்த சபை ஆலோசனை மன்றத்தின் தலைவராக, தனது வாழ்நாள் முழுவதும் தொடர்ந்து இருப்பார்.</p>
            <p style={S.pTa}><strong style={{ color: '#c8a96e' }}>ஆ.</strong> சபை ஆலோசனை மன்றத்தின் தலைவர் அறங்காவலர்களுடன் கலந்தாலோசித்து சபை ஆலோசனை மன்றத்திற்கான உறுப்பினர்களை நியமிப்பார்.</p>
            <p style={S.pTa}><strong style={{ color: '#c8a96e' }}>இ.</strong> இந்த சபை ஆலோசனை மன்றமானது அதிகபட்சமாக இருபது உறுப்பினர்களையும் குறைந்தபட்சமாக ஒன்பது உறுப்பினர்களையும் கொண்டதாயிருக்கிறது.</p>
          </div>
        </div>
      </section>

      {/* 2. SYNOD FUNCTIONS */}
      <section id="synodfunctions" style={S.sec}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'சினோட் · 02' : 'Synod · 02'}</p>
          <h2 style={S.h2}>{isTa ? 'சினோட் செயல்பாடுகள் (Synod Functions)' : 'Synod Functions'}</h2>
          <div style={{ marginTop: '28px' }}>
            <ol style={{ paddingLeft: '22px', color: 'rgba(255,255,255,0.85)', lineHeight: 2.2 }}>
              <li>1. Synod members meet together once in two months to research the Word of God and scriptural doctrines.</li>
              <li>2. Documenting the right doctrinal revelations and historical facts established by the research.</li>
              <li>3. Advising diocesan leadership on pastoral welfare, regional development, and ministry standardisation.</li>
            </ol>
            <div style={S.divider} />
            <p style={S.subH}>சபை ஆலோசனை மன்ற செயல்பாடுகள் (தமிழ் விளக்கம்):</p>
            <ol style={{ paddingLeft: '22px', color: 'rgba(255,255,255,0.85)', lineHeight: 2.2 }}>
              <li>1. சபை ஆலோசனை மன்ற அங்கத்தினர்கள் இரண்டு மாதத்திற்கு ஒருமுறை கூடி தேவ வசனத்தை ஆராய்தல்.</li>
              <li>2. ஆராய்ந்து தெளிவு பெற்ற சரியான வேத உபதேச கருத்துக்களை ஆவணப்படுத்துதல்.</li>
              <li>3. பேராய நிர்வாகம், மண்டல வளர்ச்சி மற்றும் மேய்ப்பர்கள் நலப்பணிகளுக்கு ஆலோசனைகளை வழங்குதல்.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* 3. SYNOD PUBLICATIONS */}
      <section id="synodpublications" style={S.sec}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'சினோட் · 03' : 'Synod · 03'}</p>
          <h2 style={S.h2}>{isTa ? 'சினோட் வெளியீடுகள் (Synod Publications)' : 'Synod Publications'}</h2>
          <div style={{ marginTop: '28px' }}>
            <ol style={{ paddingLeft: '22px', color: 'rgba(255,255,255,0.85)', lineHeight: 2.2 }}>
              <li>1. Uploading the documented information in the Diocesan digital portal for the benefit of churches and believers worldwide.</li>
              <li>2. Publishing the documented research as books, study manuals, and reference guides for future studies in Bible Schools.</li>
            </ol>
            <div style={S.divider} />
            <p style={S.subH}>சபை ஆலோசனை மன்ற வெளியீடுகள் (தமிழ் விளக்கம்):</p>
            <ol style={{ paddingLeft: '22px', color: 'rgba(255,255,255,0.85)', lineHeight: 2.2 }}>
              <li>1. ஆவணப்படுத்தப்பட்ட சத்தியங்களை உலகெங்கிலும் உள்ள மக்கள் அறிந்து கொள்ளும்படியாக பேராய வலைதளத்தில் வெளியிடுதல்.</li>
              <li>2. வருங்காலங்களில் வேத கலாசாலைகளில் பயன்படுத்தப்படும்படியாக புத்தகங்கள் மற்றும் ஆய்வு நூல்களாக வெளியிடுதல்.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* 4. SYNOD GENERAL COUNCIL & MEMBERS (5 MEMBERS) */}
      <section id="synodgeneralcouncil" style={S.sec}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'சினோட் · 04' : 'Synod · 04'}</p>
          <h2 style={S.h2}>{isTa ? 'சினோட் பொது ஆலோசனைப் பேரவை & உறுப்பினர்கள்' : 'Synod General Council & Members'}</h2>
          <div style={{ marginTop: '28px' }}>
            <p style={S.p}>
              {isTa
                ? 'சினோட் பொது ஆலோசனைப் பேரவையானது அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தின் உச்ச நிர்வாக மற்றும் தலைமை அறங்காவலர் குழு உறுப்பினர்களைக் கொண்டுள்ளது. (விபரங்களை அறிய உறுப்பினரை கிளிக் செய்யவும்):'
                : 'The Synod General Council serves as the apex administrative and central trustee leadership council of the ACI Diocese across India. (Click on any member card to view complete Excel record details):'}
            </p>

            {/* General Council Members (5 Members) */}
            {renderMemberCards(generalCouncilMembers)}

            <div style={S.divider} />
            <p style={S.subH}>{isTa ? 'பொது ஆலோசனைப் பேரவையின் கூட்டங்கள் (தமிழ் விளக்கம்):' : 'General Council Meetings & Objectives:'}</p>
            <p style={S.pTa}>
              {isTa
                ? 'சினோட் பொது ஆலோசனைப் பேரவையானது குறிப்பிட்ட கால இடைவெளிகளில் கூடி, திருச்சபைகளின் பாதுகாப்பு, மேய்ப்பர்களின் வாழ்வாதார உதவிகள், சபை சந்திப்புப் பணிகள் மற்றும் சுவிசேஷப் புறசந்திப்பு பணிகளை திட்டமிட்டு முன்னெடுக்கிறது.'
                : 'The Synod General Council convenes at regular intervals to plan church protection, pastoral livelihood assistance, fellowship visits, and evangelistic outreaches across all diocesan territories.'}
            </p>
          </div>
        </div>
      </section>

      {/* 5. SYNOD ACADEMIC COUNCIL & MEMBERS (19 MEMBERS) */}
      <section id="synodacademiccouncil" style={{ ...S.sec, borderBottom: 'none' }}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'சினோட் · 05' : 'Synod · 05'}</p>
          <h2 style={S.h2}>{isTa ? 'சினோட் கல்வி ஆலோசனை மன்றம் & உறுப்பினர்கள்' : 'Synod Academic Council & Members'}</h2>
          <div style={{ marginTop: '28px' }}>
            <p style={S.p}>
              {isTa
                ? 'சினோட் கல்வி ஆலோசனை மன்றமானது தலைமைப் பேராயர் (Archbishop) பேரருட்திரு ச. ஜான்சன் துரை அவர்களின் தலைமையில், இறையியல் ஆராய்ச்சி, மண்டல பேராயர்கள் மற்றும் உபதேச வழிகாட்டுதல்களை வழங்கும் அர்ப்பணிக்கப்பட்ட உறுப்பினர்களைக் கொண்டுள்ளது:'
                : 'The Synod Academic Council operates under The Most Reverend Archbishop S. Johnson Durai, comprising dedicated council members, regional diocesan bishops, and theological overseers:'}
            </p>

            {/* Academic Council Members (19 Members) */}
            {renderMemberCards(academicCouncilMembers)}

            <div style={S.divider} />
            <p style={S.subH}>{isTa ? 'கல்வி ஆலோசனை மன்ற முக்கிய நோக்கங்கள்:' : 'Academic Council Core Objectives:'}</p>
            <ul style={{ paddingLeft: '22px', color: 'rgba(255,255,255,0.85)', lineHeight: 2.1, listStyle: 'disc' }}>
              <li>{isTa ? 'வேத கலாசாலைகளின் பாடத்திட்டங்களை எபிஸ்கோபல் பாரம்பரியத்தின்படி ஒழுங்குபடுத்துதல்.' : 'Standardizing theological curricula for Bible colleges across Tamil Nadu and India.'}</li>
              <li>{isTa ? 'போதகர்கள் மற்றும் சுவிசேஷகர்களுக்கு தொடர் வேத ஆராய்ச்சி கருத்தரங்குகளை (Word Sharing Seminars) நடத்துதல்.' : 'Conducting bi-monthly Word Sharing meets and deep biblical research seminars.'}</li>
              <li>{isTa ? 'எபிஸ்கோபல் பிரதிஷ்டை பெற விண்ணப்பிக்கும் ஊழியர்களின் விசுவாசம் மற்றும் இறையியல் தகுதிகளை பரிசோதித்து அங்கீகரித்தல்.' : 'Vetting and evaluating candidates for ministerial ordination and episcopal recognition.'}</li>
            </ul>

            <div style={{ display: 'flex', gap: '14px', marginTop: '28px', flexWrap: 'wrap' }}>
              <Link to="/diocese" className="btn btn-light" style={{ padding: '12px 24px', fontSize: '14px' }}>
                {isTa ? '7 மண்டல பேராயங்கள் பார்க்க' : 'Explore 7 Regional Dioceses'} <span className="arrow">→</span>
              </Link>
              <Link to="/about#about-diocese" className="btn btn-outline-white" style={{ padding: '12px 24px', fontSize: '14px' }}>
                {isTa ? 'பேராய அறக்கட்டளை விபரம்' : 'Central Trust Details'} <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          POPUP DETAIL MODAL — EXACTLY MATCHING MOBILE APP SCREENSHOT
          ============================================================ */}
      {selectedMember && (
        <div
          className="synod-modal-backdrop"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="synod-modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="synod-modal-header">
              <div className="synod-modal-title">
                <span style={{ fontSize: '20px' }}>🏛️</span>
                <span>Synod Council</span>
              </div>
              <button
                className="synod-modal-close-btn"
                onClick={() => setSelectedMember(null)}
                aria-label="Close"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {/* Member Hero / Top Banner */}
            <div className="synod-modal-hero">
              <h2 className="synod-hero-name">{selectedMember.name}</h2>
              <p className="synod-hero-role">{selectedMember.designation}</p>
              <div className="synod-hero-badges">
                {selectedMember.regNo && (
                  <span className="synod-pill synod-pill-gold">Reg: {selectedMember.regNo}</span>
                )}
                {selectedMember.status && (
                  <span className="synod-pill synod-pill-green">{selectedMember.status}</span>
                )}
              </div>
            </div>

            {/* Modal Details List (With Exact Icons as in Screenshot) */}
            <div className="synod-modal-body">
              {/* 1. Office */}
              {selectedMember.office && (
                <div className="synod-detail-row">
                  <div className="synod-icon-box">🏢</div>
                  <div className="synod-detail-content">
                    <div className="synod-detail-label">Office</div>
                    <div className="synod-detail-val">{selectedMember.office}</div>
                  </div>
                </div>
              )}

              {/* 2. Church */}
              {selectedMember.church && (
                <div className="synod-detail-row">
                  <div className="synod-icon-box">
                    <ChurchIcon size={18} color="#c8a96e" />
                  </div>
                  <div className="synod-detail-content">
                    <div className="synod-detail-label">Church</div>
                    <div className="synod-detail-val">{selectedMember.church}</div>
                  </div>
                </div>
              )}

              {/* 3. Date of Birth */}
              {selectedMember.dob && (
                <div className="synod-detail-row">
                  <div className="synod-icon-box">📅</div>
                  <div className="synod-detail-content">
                    <div className="synod-detail-label">Date of Birth</div>
                    <div className="synod-detail-val">{selectedMember.dob}</div>
                  </div>
                </div>
              )}

              {/* 4. Ordination Date */}
              {selectedMember.ordinationDate && (
                <div className="synod-detail-row">
                  <div className="synod-icon-box">🎖️</div>
                  <div className="synod-detail-content">
                    <div className="synod-detail-label">Ordination Date</div>
                    <div className="synod-detail-val">{selectedMember.ordinationDate}</div>
                  </div>
                </div>
              )}

              {/* 5. Phone */}
              {selectedMember.phone && (
                <div className="synod-detail-row">
                  <div className="synod-icon-box">
                    <PhoneIcon size={18} color="#c8a96e" />
                  </div>
                  <div className="synod-detail-content">
                    <div className="synod-detail-label">Phone</div>
                    <div className="synod-detail-val">
                      <a href={`tel:${selectedMember.phone}`}>{selectedMember.phone}</a>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Email */}
              {selectedMember.email && (
                <div className="synod-detail-row">
                  <div className="synod-icon-box">
                    <EmailIcon size={18} color="#c8a96e" />
                  </div>
                  <div className="synod-detail-content">
                    <div className="synod-detail-label">Email</div>
                    <div className="synod-detail-val">
                      <a href={`mailto:${selectedMember.email}`}>{selectedMember.email}</a>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. Address */}
              {selectedMember.address && (
                <div className="synod-detail-row">
                  <div className="synod-icon-box">
                    <LocationIcon size={18} color="#c8a96e" />
                  </div>
                  <div className="synod-detail-content">
                    <div className="synod-detail-label">Address</div>
                    <div className="synod-detail-val">{selectedMember.address}</div>
                  </div>
                </div>
              )}

              {/* 8. District */}
              {selectedMember.district && (
                <div className="synod-detail-row">
                  <div className="synod-icon-box">🗺️</div>
                  <div className="synod-detail-content">
                    <div className="synod-detail-label">District</div>
                    <div className="synod-detail-val">{selectedMember.district}</div>
                  </div>
                </div>
              )}

              {/* 9. State */}
              {selectedMember.state && (
                <div className="synod-detail-row">
                  <div className="synod-icon-box">🚩</div>
                  <div className="synod-detail-content">
                    <div className="synod-detail-label">State</div>
                    <div className="synod-detail-val">{selectedMember.state}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
