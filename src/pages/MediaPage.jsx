import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getMediaUrl } from '../utils/imageUrl'

const BASE_MEDIA = 'http://acidiocese.org/media_title_img/'

const S = {
  page: { paddingTop: '80px', background: '#0a0a0a', color: '#fff', minHeight: '100vh' },
  hero: { background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '60px 0 40px' },
  con: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px' },
  sec: { padding: '72px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  h2: { fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingBottom: '12px', borderBottom: '2px solid #c8a96e', display: 'inline-block' },
  lbl: { color: '#c8a96e', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 },
  p: { color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: '12px', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px', marginTop: '32px' },
  card: { background: '#111', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', transition: 'transform 0.2s, border-color 0.2s', cursor: 'pointer' },
  cardImg: { width: '100%', height: '180px', objectFit: 'cover', display: 'block', background: '#1a1a1a' },
  cardBody: { padding: '16px' },
  cardTitle: { fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: '#fff' },
  btn: { display: 'inline-block', padding: '8px 16px', background: 'rgba(200,169,110,0.15)', border: '1px solid #c8a96e', color: '#c8a96e', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none', marginRight: '8px', marginTop: '4px', transition: 'background 0.2s' },
}

const magazines = [
  { title: 'July–Sep 2023', img: 'media_title_img/022024/bb40213a776035388b512b46c8d569ed.jpg', pdf: '022024/48d7e8af9012ba63fa98c9ca67a17c86.pdf' },
  { title: 'April–June 2023', img: 'media_title_img/072023/4f100f571faac76fef118ce16ba41c36.jpg', pdf: '072023/922406c553db13317f931bc8cdb11fff.pdf' },
  { title: 'January–March 2022', img: 'media_title_img/052022/6d639377fd5f0e69fabbbab02294140c.jpg', pdf: '052022/fcd70462c313ba02c5c889490d4e08df.pdf' },
  { title: 'October–December 2021', img: 'media_title_img/032022/5b0a9e8f254ddfd5db416f8bafb464e3.jpg', pdf: '032022/c4da7899a8203aa8807992b07380d04b.pdf' },
]

const audios = [
  { title: 'Worship Vol-1 (ஆராதனை தொகுதி-1)', img: 'media_title_img/072017/242712606e594b1005c87f9730c6d1b4.gif', mp3: '072017/59edc8705915219c2fb135b5fc48a33d.mp3' },
  { title: 'Worship Vol-2 (ஆராதனை தொகுதி-2)', img: 'media_title_img/072017/85ec64d2b419c828a65a6a7e2379b487.gif', mp3: '072017/d822adb6f7d6de0eadc46523ebee4253.mp3' },
  { title: 'Worship Vol-3 (ஆராதனை தொகுதி-3)', img: 'media_title_img/072017/4016b8f806a135319eb7525590ff050e.gif', mp3: '072017/878363c95161e6f459171e23aec2ae67.mp3' },
  { title: 'Worship Vol-4 (ஆராதனை தொகுதி-4)', img: 'media_title_img/072017/6fc61a41982b2a3ebc3eab724f6ee681.gif', mp3: '072017/9704c1ccfafe382c2207a2e8eb606e6b.mp3' },
]

const videos = [
  { title: 'Children Ministry (சிறுவர் ஊழியம்)', mp4: '072017/6b7a6717676c5b70a844685724759180.mp4' },
  { title: 'Bishop Worship Service (பேராயர் ஆராதனை செய்தி)', mp4: '022017/8d909946a3974a74f64677f77ce36c79.mp4' },
  { title: 'Bishop Message (பேராயர் தேவ செய்தி)', mp4: '012018/dd0a9c497d5e1f897aca53ef22e5619d.mp4' },
]

const literature = [
  { title: 'Church — The Body Of Christ', img: 'media_title_img/082016/1147f89dd0a5949b70b2f643776ed9ad.gif', pdf: '082016/9515307632e92ed4ce7c566ce7df771b.pdf' },
  { title: 'கிறிஸ்துவின் தெய்வத்துவம்', img: 'media_title_img/022018/b6dca61b3613fab17a9940f061c61e76.jpg', pdf: '022018/6ff334dc48b2102c69dc11084e5b850c.pdf' },
  { title: 'கிறிஸ்துவின் மனு அவதாரம்', img: 'media_title_img/032018/526c7c1bbe95a4c3f9baa3b76664c26f.jpg', pdf: '032018/9edd5dd406e5215154e73c44898ce843.pdf' },
  { title: 'கிறிஸ்துவின் கிரியைகள்-அலுவல்கள்', img: 'media_title_img/062018/801c2fd5bed9035db857f9003b225448.jpg', pdf: '062018/9e551d1ed6efb9a22b39e37de149693f.pdf' },
]

function AudioCard({ item }) {
  return (
    <div style={{ ...S.card, display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,169,110,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
    >
      <img src={getMediaUrl(item.img)} alt={item.title} style={{ ...S.cardImg, height: '160px', objectFit: 'contain', padding: '16px' }} />
      <div style={S.cardBody}>
        <p style={S.cardTitle}>{item.title}</p>
        <audio controls style={{ width: '100%', marginTop: '8px', accentColor: '#c8a96e' }}>
          <source src={`${BASE_MEDIA}${item.mp3}`} type="audio/mpeg" />
          Your browser does not support audio.
        </audio>
      </div>
    </div>
  )
}

export default function MediaPage() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) { setTimeout(() => { const el = document.querySelector(hash); if (el) el.scrollIntoView({ behavior: 'smooth' }) }, 100) }
    else window.scrollTo(0, 0)
  }, [hash])

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <div style={S.con}>
          <p style={{ ...S.lbl, marginBottom: '16px' }}>{isTa ? 'ஊடக மையம்' : 'MEDIA PAGE'}</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(30px,5vw,48px)', fontWeight: 400, marginBottom: '12px', color: '#fff' }}>
            {isTa ? 'இதழ்கள், ஆராதனை பாடல்கள், வீடியோக்கள் & நூல்கள்' : 'Magazines, Audio, Video & Literature'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
            {isTa ? 'ஏசிஐ பேராயத்தின் காலாண்டு இதழ்கள், ஆடியோ பாடல்கள், தேவ செய்திகள் மற்றும் வேத புத்தகங்கள்' : 'Access all ACI Diocese media resources — quarterly magazines, worship music, messages and books'}
          </p>
        </div>
      </div>

      {/* MAGAZINES */}
      <section id="magazines" style={S.sec}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'ஊடகம் · 01' : 'Media · 01'}</p>
          <h2 style={S.h2}>{isTa ? 'பேராய இதழ்கள் (Magazines)' : 'Magazines'}</h2>
          <div style={S.grid}>
            {magazines.map((item, i) => (
              <div key={i} style={S.card}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(200,169,110,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              >
                <img src={getMediaUrl(item.img)} alt={item.title} style={S.cardImg}
                  onError={e => { e.target.style.background = '#1a1a1a'; e.target.style.opacity = '0.3' }} />
                <div style={S.cardBody}>
                  <p style={S.cardTitle}>{item.title}</p>
                  <p style={S.p}>{isTa ? 'ஏசிஐ பேராய காலாண்டு இதழ்' : 'ACI Diocese Quarterly Magazine'}</p>
                  <a href={`${BASE_MEDIA}${item.pdf}`} target="_blank" rel="noopener noreferrer" style={S.btn}>
                    📄 {isTa ? 'PDF படிக்க' : 'Read PDF'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIO */}
      <section id="audio" style={S.sec}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'ஊடகம் · 02' : 'Media · 02'}</p>
          <h2 style={S.h2}>{isTa ? 'ஆராதனை பாடல்கள் (Worship Audio)' : 'Audio — Worship Albums'}</h2>
          <div style={S.grid}>
            {audios.map((item, i) => (
              <AudioCard key={i} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section id="video" style={S.sec}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'ஊடகம் · 03' : 'Media · 03'}</p>
          <h2 style={S.h2}>{isTa ? 'வீடியோ செய்திகள் (Video Messages)' : 'Video Messages & Ministry'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginTop: '32px' }}>
            {videos.map((item, i) => (
              <div key={i} style={{ ...S.card }}>
                <video controls style={{ width: '100%', display: 'block', background: '#000', maxHeight: '220px' }}>
                  <source src={`${BASE_MEDIA}${item.mp4}`} type="video/mp4" />
                  Your browser does not support video.
                </video>
                <div style={S.cardBody}>
                  <p style={{ ...S.cardTitle, marginBottom: '0' }}>{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LITERATURE */}
      <section id="literature" style={{ ...S.sec, borderBottom: 'none' }}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'ஊடகம் · 04' : 'Media · 04'}</p>
          <h2 style={S.h2}>{isTa ? 'வேத புத்தகங்கள் & வெளியீடுகள் (Literature)' : 'Literature & Books'}</h2>
          <div style={S.grid}>
            {literature.map((item, i) => (
              <div key={i} style={S.card}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(200,169,110,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              >
                <img src={getMediaUrl(item.img)} alt={item.title} style={{ ...S.cardImg, objectFit: 'contain', padding: '12px', background: '#0a0a0a' }}
                  onError={e => { e.target.style.opacity = '0.3' }} />
                <div style={S.cardBody}>
                  <p style={S.cardTitle}>{item.title}</p>
                  <p style={S.p}>{isTa ? 'எழுதியவர்: பேரருட்திரு ச. ஜான்சன் துரை' : 'By The Most Rev. S. Johnson Durai'}</p>
                  <a href={`${BASE_MEDIA}${item.pdf}`} target="_blank" rel="noopener noreferrer" style={S.btn}>
                    📖 {isTa ? 'நூலை படிக்க (PDF)' : 'Read PDF'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
