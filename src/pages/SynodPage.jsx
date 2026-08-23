import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

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
  tbl: { width: '100%', borderCollapse: 'collapse', marginTop: '24px', fontSize: '14px' },
  th: { background: 'rgba(200,169,110,0.15)', color: '#c8a96e', padding: '12px 16px', textAlign: 'left', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid rgba(200,169,110,0.3)' },
  td: { padding: '14px 16px', color: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)', verticalAlign: 'top', lineHeight: 1.7 },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', transition: 'all 0.25s ease' },
  cardTitle: { color: '#c8a96e', fontSize: '16px', fontWeight: 700, marginBottom: '8px' },
  cardText: { color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: 1.7 },
}

export default function SynodPage() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const { hash } = useLocation()

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

  const members = [
    {
      sno: 1,
      name: 'The Most Rev. S. Johnson Durai',
      role: isTa ? 'தலைவர் & நிர்வாக அறங்காவலர்' : 'Chairman & Managing Trustee',
      email: 'rev.johnsondurai@gmail.com',
      tnno: 'TN 0001',
      ministry: isTa ? 'தலைமைப் பேராயர் (Archbishop) — வார்த்தையின் வல்லமை சபை' : 'Archbishop — Power In The Word Church',
      exp: '25 Years',
      ordained: '11/06/2015'
    },
    {
      sno: 2,
      name: 'Rev. R. John Durai',
      role: isTa ? 'மன்ற உறுப்பினர் & அறங்காவலர்' : 'Council Member & Trustee',
      email: 'rjdwonder@gmail.com',
      tnno: 'TN 0005',
      ministry: isTa ? 'தீர்க்கதரிசி — வொண்டர் வேர்ட் மினிஸ்ட்ரி' : 'Prophet — Wonder Word Ministry',
      exp: '29 Years',
      ordained: '11/06/2015'
    },
    {
      sno: 3,
      name: 'Rev. J.A.D. Samuel',
      role: isTa ? 'மன்ற உறுப்பினர் & அறங்காவலர்' : 'Council Member & Trustee',
      email: 'jadsamuel@gmail.com',
      tnno: 'TN 0146',
      ministry: isTa ? 'சுவிசேஷகர் — பெத்ரா சர்வீஸ் மிஷன்' : 'Evangelist — Petra Service Mission',
      exp: '19 Years',
      ordained: '11/06/2015'
    },
    {
      sno: 4,
      name: 'Rt. Rev. L. Suresh Daniel',
      role: isTa ? 'மன்ற உறுப்பினர் & நிதி அறங்காவலர்' : 'Council Member & Financial Trustee',
      email: '',
      tnno: '—',
      ministry: isTa ? '—' : '—',
      exp: '—',
      ordained: '—'
    },
    {
      sno: 5,
      name: 'Rt. Rev. John Samuel',
      role: isTa ? 'மன்ற உறுப்பினர் & பேராயர் ஆணையாளர்' : 'Council Member & Archbishop Commissary',
      email: 'john.samuelaft@gmail.com',
      tnno: '—',
      ministry: isTa ? 'போதகர் — ஏசிஐ பேராயம்' : 'Pastor — ACI Diocese',
      exp: '—',
      ordained: '—'
    },
  ]

  const generalMembers = [
    ...members,
    {
      sno: 6,
      name: 'Rt. Rev. S. Anand',
      role: isTa ? 'பேராயர் ஏசிஐ செங்கல்பட்டு பேராயம் & சினோட் பொதுச் செயலாளர்' : 'Bishop ACI Chengalpattu Diocese & Synod General Secretary',
      email: '—',
      tnno: '—',
      ministry: isTa ? 'பேராயர் — ஏசிஐ செங்கல்பட்டு பேராயம்' : 'Bishop — ACI Chengalpattu Diocese',
      exp: '—',
      ordained: '—'
    },
    {
      sno: 7,
      name: 'Rt. Rev. A. Pounraj',
      role: isTa ? 'பேராயர் ஏசிஐ விழுப்புரம் பேராயம் & சினோட் உறுப்பினர்' : 'Bishop ACI Villupuram Diocese & Synod Member',
      email: '—',
      tnno: '—',
      ministry: isTa ? 'பேராயர் — ஏசிஐ விழுப்புரம் பேராயம்' : 'Bishop — ACI Villupuram Diocese',
      exp: '—',
      ordained: '—'
    },
    {
      sno: 8,
      name: 'Rt. Rev. G. Edwin Joseph Selvaraj',
      role: isTa ? 'பேராயர் ஏசிஐ திருச்சி பேராயம் & சினோட் உறுப்பினர்' : 'Bishop ACI Trichy Diocese & Synod Member',
      email: '—',
      tnno: '—',
      ministry: isTa ? 'பேராயர் — ஏசிஐ திருச்சி பேராயம்' : 'Bishop — ACI Trichy Diocese',
      exp: '—',
      ordained: '—'
    }
  ]

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
              ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தின் ஆவிக்குரிய, இறையியல், கல்வி மற்றும் பொது நிர்வாக ஆலோசனை மன்றம்.'
              : 'The spiritual, theological, academic, and general governance advisory body of the Apostolic Council of India Diocese.'}
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

      {/* 4. SYNOD ACADEMIC COUNCIL & MEMBERS */}
      <section id="synodacademiccouncil" style={S.sec}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'சினோட் · 04' : 'Synod · 04'}</p>
          <h2 style={S.h2}>{isTa ? 'சினோட் கல்வி ஆலோசனை மன்றம் & உறுப்பினர்கள்' : 'Synod Academic Council & Members'}</h2>
          <div style={{ marginTop: '28px' }}>
            <p style={S.p}>
              {isTa
                ? 'சினோட் கல்வி ஆலோசனை மன்றமானது தலைமைப் பேராயர் (Archbishop) பேரருட்திரு ச. ஜான்சன் துரை அவர்களின் தலைமையில், இறையியல் ஆராய்ச்சி, வேத பாடத்திட்டங்கள் மற்றும் உபதேச வழிகாட்டுதல்களை வழங்கும் அர்ப்பணிக்கப்பட்ட உறுப்பினர்களைக் கொண்டுள்ளது:'
                : 'The Synod Academic Council operates under The Most Reverend Archbishop S. Johnson Durai, comprising dedicated council members and theological overseers:'}
            </p>

            {/* Academic Council Members Table */}
            <div style={{ overflowX: 'auto', marginTop: '20px', border: '1px solid rgba(200, 169, 110, 0.25)' }}>
              <table style={S.tbl}>
                <thead>
                  <tr>
                    <th style={S.th}>{isTa ? 'வரிசை எண்' : 'S.No'}</th>
                    <th style={S.th}>{isTa ? 'உறுப்பினர் பெயர் & பதவி' : 'Member Name & Role'}</th>
                    <th style={S.th}>{isTa ? 'பதிவு எண்' : 'TN No.'}</th>
                    <th style={S.th}>{isTa ? 'ஊழியம் & அனுபவம்' : 'Ministry & Experience'}</th>
                    <th style={S.th}>{isTa ? 'பிரதிஷ்டை தேதி' : 'Ordained On'}</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={S.td}>{m.sno}</td>
                      <td style={S.td}>
                        <div style={{ fontWeight: 700, color: '#fff', marginBottom: '2px', fontSize: '15px' }}>{m.name}</div>
                        <div style={{ fontSize: '12px', color: '#c8a96e', marginBottom: '2px', fontWeight: 600 }}>{m.role}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{m.email}</div>
                      </td>
                      <td style={{ ...S.td, fontWeight: 700, color: '#c8a96e' }}>{m.tnno}</td>
                      <td style={S.td}>
                        <div style={{ color: 'rgba(255,255,255,0.9)' }}>{m.ministry}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{m.exp}</div>
                      </td>
                      <td style={S.td}>{m.ordained}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={S.divider} />
            <p style={S.subH}>{isTa ? 'கல்வி ஆலோசனை மன்ற முக்கிய நோக்கங்கள்:' : 'Academic Council Core Objectives:'}</p>
            <ul style={{ paddingLeft: '22px', color: 'rgba(255,255,255,0.85)', lineHeight: 2.1, listStyle: 'disc' }}>
              <li>{isTa ? 'வேத கலாசாலைகளின் பாடத்திட்டங்களை எபிஸ்கோபல் பாரம்பரியத்தின்படி ஒழுங்குபடுத்துதல்.' : 'Standardizing theological curricula for Bible colleges across Tamil Nadu and India.'}</li>
              <li>{isTa ? 'போதகர்கள் மற்றும் சுவிசேஷகர்களுக்கு தொடர் வேத ஆராய்ச்சி கருத்தரங்குகளை (Word Sharing Seminars) நடத்துதல்.' : 'Conducting bi-monthly Word Sharing meets and deep biblical research seminars.'}</li>
              <li>{isTa ? 'எபிஸ்கோபல் பிரதிஷ்டை பெற விண்ணப்பிக்கும் ஊழியர்களின் விசுவாசம் மற்றும் இறையியல் தகுதிகளை பரிசோதித்து அங்கீகரித்தல்.' : 'Vetting and evaluating candidates for ministerial ordination and episcopal recognition.'}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. SYNOD GENERAL COUNCIL */}
      <section id="synodgeneralcouncil" style={{ ...S.sec, borderBottom: 'none' }}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'சினோட் · 05' : 'Synod · 05'}</p>
          <h2 style={S.h2}>{isTa ? 'சினோட் பொது ஆலோசனைப் பேரவை (Synod General Council)' : 'Synod General Council'}</h2>
          <div style={{ marginTop: '28px' }}>
            <p style={S.p}>
              The <strong>Synod General Council</strong> serves as the apex administrative, legislative, and consultative council of the ACI Diocese across India. It connects the Central Board of Trustees with the 7 Regional Dioceses, District Overseers (DOS), and ordained ministers to guide strategic expansion and church welfare.
            </p>

            {/* General Council Members Table */}
            <div style={{ overflowX: 'auto', marginTop: '20px', border: '1px solid rgba(200, 169, 110, 0.25)' }}>
              <table style={S.tbl}>
                <thead>
                  <tr>
                    <th style={S.th}>{isTa ? 'வரிசை எண்' : 'S.No'}</th>
                    <th style={S.th}>{isTa ? 'உறுப்பினர் பெயர் & பதவி' : 'Member Name & Role'}</th>
                    <th style={S.th}>{isTa ? 'பதிவு எண்' : 'TN No.'}</th>
                    <th style={S.th}>{isTa ? 'ஊழியம் & அனுபவம்' : 'Ministry & Experience'}</th>
                    <th style={S.th}>{isTa ? 'பிரதிஷ்டை தேதி' : 'Ordained On'}</th>
                  </tr>
                </thead>
                <tbody>
                  {generalMembers.map((m, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={S.td}>{m.sno}</td>
                      <td style={S.td}>
                        <div style={{ fontWeight: 700, color: '#fff', marginBottom: '2px', fontSize: '15px' }}>{m.name}</div>
                        <div style={{ fontSize: '12px', color: '#c8a96e', marginBottom: '2px', fontWeight: 600 }}>{m.role}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{m.email}</div>
                      </td>
                      <td style={{ ...S.td, fontWeight: 700, color: '#c8a96e' }}>{m.tnno}</td>
                      <td style={S.td}>
                        <div style={{ color: 'rgba(255,255,255,0.9)' }}>{m.ministry}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{m.exp}</div>
                      </td>
                      <td style={S.td}>{m.ordained}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={S.divider} />
            <p style={S.subH}>பொது ஆலோசனைப் பேரவையின் கூட்டங்கள் (தமிழ் விளக்கம்):</p>
            <p style={S.pTa}>
              சினோட் பொது ஆலோசனைப் பேரவையானது குறிப்பிட்ட கால இடைவெளிகளில் கூடி, திருச்சபைகளின் பாதுகாப்பு, மேய்ப்பர்களின் வாழ்வாதார உதவிகள், சபை சந்திப்புப் பணிகள் மற்றும் சுவிசேஷப் புறசந்திப்பு பணிகளை திட்டமிட்டு முன்னெடுக்கிறது.
            </p>

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

    </div>
  )
}
