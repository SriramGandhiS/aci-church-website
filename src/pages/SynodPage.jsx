import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const S = {
  page: { paddingTop: '80px', background: '#0a0a0a', color: '#fff', minHeight: '100vh' },
  hero: { background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '60px 0 40px' },
  con: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px' },
  sec: { padding: '72px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  h2: { fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingBottom: '12px', borderBottom: '2px solid #c8a96e', display: 'inline-block' },
  lbl: { color: '#c8a96e', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 },
  p: { color: 'rgba(255,255,255,0.85)', lineHeight: 1.85, marginBottom: '14px', fontSize: '16px' },
  pTa: { color: 'rgba(255,255,255,0.8)', lineHeight: 2.1, marginBottom: '14px', fontSize: '15px' },
  subH: { color: '#c8a96e', fontSize: '17px', fontWeight: 600, marginBottom: '12px', marginTop: '28px' },
  divider: { height: '1px', background: 'rgba(255,255,255,0.07)', margin: '28px 0' },
  tbl: { width: '100%', borderCollapse: 'collapse', marginTop: '24px', fontSize: '14px' },
  th: { background: 'rgba(200,169,110,0.15)', color: '#c8a96e', padding: '12px 16px', textAlign: 'left', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid rgba(200,169,110,0.3)' },
  td: { padding: '12px 16px', color: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)', verticalAlign: 'top', lineHeight: 1.7 },
}

export default function SynodPage() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) { setTimeout(() => { const el = document.querySelector(hash); if (el) el.scrollIntoView({ behavior: 'smooth' }) }, 100) }
    else window.scrollTo(0, 0)
  }, [hash])

  const members = [
    {
      sno: 1, name: 'Rt. Rev. S. Johnson Durai', role: isTa ? 'நிர்வாக அறங்காவலர்' : 'Managing Trustee', email: 'rev.johnsondurai@gmail.com',
      tnno: 'TN 0001', ministry: isTa ? 'எபிஸ்கோபல் பேராயர் — வார்த்தையின் வல்லமை சபை' : 'Episcopal Bishop — Power In The Word Church', exp: '25 Years', ordained: '11/06/2015'
    },
    {
      sno: 2, name: 'Rev. R. John Durai', role: isTa ? 'அறங்காவலர்' : 'Trustee', email: 'rjdwonder@gmail.com',
      tnno: 'TN 0005', ministry: isTa ? 'தீர்க்கதரிசி — வொண்டர் வேர்ட் மினிஸ்ட்ரி' : 'Prophet — Wonder Word Ministry', exp: '29 Years', ordained: '11/06/2015'
    },
    {
      sno: 3, name: 'Rev. J.A.D. Samuel', role: isTa ? 'அறங்காவலர்' : 'Trustee', email: 'jadsamuel@gmail.com',
      tnno: 'TN 0146', ministry: isTa ? 'சுவிசேஷகர் — பெத்ரா சர்வீஸ் மிஷன்' : 'Evangelist — Petra Service Mission', exp: '19 Years', ordained: '11/06/2015'
    },
    {
      sno: 4, name: 'Rev. D. Anotony Raj', role: isTa ? 'அறங்காவலர்' : 'Trustee', email: 'd_antoniraj@yahoo.com',
      tnno: 'TN 0466', ministry: isTa ? 'போதகர் — லிவிங் ரிடீமர் சர்ச்' : 'Pastor — Living Redeemer Church', exp: '9 Years', ordained: '12/04/2016'
    },
    {
      sno: 5, name: 'Rev. John Samuel', role: isTa ? 'அறங்காவலர்' : 'Trustee', email: 'john.samuelaft@gmail.com',
      tnno: '—', ministry: isTa ? 'போதகர்' : 'Pastor', exp: '—', ordained: '—'
    },
  ]

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <div style={S.con}>
          <p style={{ ...S.lbl, marginBottom: '16px' }}>{isTa ? 'சினோட் பக்கம்' : 'SYNOD PAGE'}</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(30px,5vw,48px)', fontWeight: 400, marginBottom: '12px', color: '#fff' }}>
            {isTa ? 'சினோட் சபை ஆலோசனை மன்றம்' : 'Synod Advisory Council'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
            {isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தின் ஆவிக்குரிய & நிர்வாக ஆலோசனை மன்றம்' : 'The governing and advisory body of the Apostolic Council of India Diocese'}
          </p>
        </div>
      </div>

      {/* ABOUT SYNOD */}
      <section id="aboutsynod" style={S.sec}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'சினோட் · 01' : 'Synod · 01'}</p>
          <h2 style={S.h2}>{isTa ? 'சினோட் பற்றி (About Synod)' : 'About the Synod'}</h2>
          <div style={{ marginTop: '28px' }}>
            <p style={S.p}>The Synod shall comprise of all the Trustees of the Board and Apostles, Prophets, Evangelists, Pastors Teachers and Clergy and/or Laity, who fulfill any or all of the Ministerial Callings. They will look after the Spiritual needs and welfare of various Committees of Apostolic Council of India Diocese.</p>
            <p style={S.p}><strong style={{ color: '#c8a96e' }}>a)</strong> Episcopal Bishop Rt.Rev.S. Johnson Durai, the Author of the Trust, shall be the Chairman of the Synod for life and shall name the successor who will take his place on his resignation or death.</p>
            <p style={S.p}><strong style={{ color: '#c8a96e' }}>b)</strong> The Chairman of the Synod shall nominate and appoint the members to the synod in consultation with the Board of Trustees. This shall be the first Synod and shall, be responsible for all the committees and their responsibilities.</p>
            <p style={S.p}><strong style={{ color: '#c8a96e' }}>c)</strong> The Synod comprises of not more than TWENTY members and not less than NINE.</p>

            <div style={S.divider} />
            <p style={S.subH}>சபை ஆலோசனை மன்றம் (தமிழ் விளக்கம்):</p>
            <p style={S.pTa}>சபை ஆலோசனை மன்றமானது அனைத்து அறங்காவலர்களையும் மற்றும் பேராயத்தின் அப்போஸ்தலர்கள், தீர்க்கதரிசிகள், சுவிசேஷகர்கள், மேய்ப்பர்கள், போதகர்கள் ஆகியோரை தன்னகத்தே கொண்டுள்ளது.</p>
            <p style={S.pTa}><strong style={{ color: '#c8a96e' }}>அ.</strong> இந்த அறக்கட்டளையின் நிறுவனரும், எபிஸ்கோபல் பேராயருமான பேரருட்திரு ச. ஜான்சன்துரை அவர்கள் இந்த சபை ஆலோசனை மன்றத்தின் தலைவராக, தனது வாழ்நாள் முழுவதும் அல்லது விருப்பத்துடன் பின் வருபவர்க்கு விட்டுக்கொடுக்கும்வரை தொடர்ந்து இருப்பார்.</p>
            <p style={S.pTa}><strong style={{ color: '#c8a96e' }}>ஆ.</strong> சபை ஆலோசனை மன்றத்தின் தலைவர் அறங்காவலர்களுடன் கலந்தாலோசித்து சபை ஆலோசனை மன்றத்திற்கான உறுப்பினர்களை நியமிப்பார்.</p>
            <p style={S.pTa}><strong style={{ color: '#c8a96e' }}>இ.</strong> இந்தசபை ஆலோசனை மன்றமானது அதிகபட்சமாக இருபது உறுப்பினர்களையும் குறைந்த பட்சமாக ஒன்பது உறுப்பினர்களையும் கொண்டதாயிருக்கிறது.</p>
          </div>
        </div>
      </section>

      {/* SYNOD FUNCTIONS */}
      <section id="synodfunctions" style={S.sec}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'சினோட் · 02' : 'Synod · 02'}</p>
          <h2 style={S.h2}>{isTa ? 'சினோட் செயல்பாடுகள் (Synod Functions)' : 'Synod Functions'}</h2>
          <div style={{ marginTop: '28px' }}>
            <ol style={{ paddingLeft: '22px', color: 'rgba(255,255,255,0.85)', lineHeight: 2.2 }}>
              <li>1. Synod members are meeting together once in two months and researching the Word of God.</li>
              <li>2. Documenting the right information found by the research.</li>
            </ol>
            <div style={S.divider} />
            <p style={S.subH}>சபை ஆலோசனை மன்ற செயல்பாடுகள் (தமிழ் விளக்கம்):</p>
            <ol style={{ paddingLeft: '22px', color: 'rgba(255,255,255,0.85)', lineHeight: 2.2 }}>
              <li>1. சபை ஆலோசனை மன்ற அங்கத்தினர்கள் இரண்டு மாதத்திற்கு ஒருமுறை கூடி தேவ வசனத்தை ஆராய்தல்.</li>
              <li>2. ஆராய்ந்து தெளிவு பெற்ற சரியான கருத்துக்களை ஆவணப்படுத்துதல்.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* SYNOD PUBLICATIONS */}
      <section id="synodpublications" style={S.sec}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'சினோட் · 03' : 'Synod · 03'}</p>
          <h2 style={S.h2}>{isTa ? 'சினோட் வெளியீடுகள் (Synod Publications)' : 'Synod Publications'}</h2>
          <div style={{ marginTop: '28px' }}>
            <ol style={{ paddingLeft: '22px', color: 'rgba(255,255,255,0.85)', lineHeight: 2.2 }}>
              <li>1. Uploading the documented information in the Diocesan website for the benefits of many people.</li>
              <li>2. Publishing the documented information as books for future studies in Bible Schools.</li>
            </ol>
            <div style={S.divider} />
            <p style={S.subH}>சபை ஆலோசனை மன்ற வெளியீடுகள் (தமிழ் விளக்கம்):</p>
            <ol style={{ paddingLeft: '22px', color: 'rgba(255,255,255,0.85)', lineHeight: 2.2 }}>
              <li>1. ஆவணப்படுத்தப்பட்டவைகளை எல்லோரும் அறிந்து கொள்ளும்படியாக பேராய வலைதளத்தில் வெளியிடுதல்.</li>
              <li>2. வருங்காலங்களில் வேத கலாசாலைகளில் பயன்படுத்தப்படும்படியாக புத்தகமாக வெளியிடுதல்.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* SYNOD MEMBERS */}
      <section id="synodmembers" style={{ ...S.sec, borderBottom: 'none' }}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'சினோட் · 04' : 'Synod · 04'}</p>
          <h2 style={S.h2}>{isTa ? 'சினோட் உறுப்பினர்கள் (Synod Members)' : 'Synod Members'}</h2>
          <p style={{ ...S.p, marginTop: '20px', marginBottom: '0' }}>
            {isTa ? 'ஏசிஐ பேராயத்தின் சினோட் ஆலோசனை மன்ற உறுப்பினர்களின் விபரம்:' : 'The following ordained members constitute the current Synod of ACI Diocese:'}
          </p>
          <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table style={S.tbl}>
              <thead>
                <tr>
                  <th style={S.th}>{isTa ? 'வரிசை எண்' : 'S.No'}</th>
                  <th style={S.th}>{isTa ? 'பெயர் & தொடர்பு' : 'Name & Contact'}</th>
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
                      <div style={{ fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{m.name}</div>
                      <div style={{ fontSize: '12px', color: '#c8a96e', marginBottom: '2px' }}>{m.role}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{m.email}</div>
                    </td>
                    <td style={S.td}>{m.tnno}</td>
                    <td style={S.td}>
                      <div>{m.ministry}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{m.exp}</div>
                    </td>
                    <td style={S.td}>{m.ordained}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
