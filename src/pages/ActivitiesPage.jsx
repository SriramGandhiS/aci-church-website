import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const pageStyles = {
  page: { paddingTop: '80px', background: '#0a0a0a', color: '#ffffff', minHeight: '100vh' },
  hero: { background: '#111', color: '#ffffff', padding: '60px 0 40px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px' },
  section: { padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  sectionHeading: {
    fontSize: 'clamp(22px, 3.5vw, 32px)',
    fontFamily: 'var(--font-serif, Georgia, serif)',
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
    paddingBottom: '12px',
    borderBottom: '2px solid #c8a96e',
    display: 'inline-block',
  },
  sectionLabel: { color: '#c8a96e', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 },
  para: { color: 'rgba(255,255,255,0.88)', lineHeight: 1.85, marginBottom: '16px', fontSize: '16px' },
  tamilPara: { color: 'rgba(255,255,255,0.85)', lineHeight: 2.1, marginBottom: '16px', fontSize: '15px' },
  list: { listStyle: 'disc', paddingLeft: '24px', color: 'rgba(255,255,255,0.85)', lineHeight: 2.1 },
  numberedList: { listStyle: 'decimal', paddingLeft: '24px', color: 'rgba(255,255,255,0.85)', lineHeight: 2.1 },
  galleryLink: { color: '#c8a96e', textDecoration: 'none', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', display: 'inline-block', marginTop: '20px', borderBottom: '1px solid #c8a96e', paddingBottom: '3px' },
  divider: { height: '1px', background: 'rgba(255,255,255,0.08)', margin: '32px 0' },
  subHeading: { color: '#c8a96e', fontSize: '16px', fontWeight: 600, marginBottom: '12px', marginTop: '24px', letterSpacing: '0.05em' },
}

function SectionHeader({ label, title }) {
  return (
    <div style={{ marginBottom: '36px' }}>
      <p style={pageStyles.sectionLabel}>{label}</p>
      <h2 style={pageStyles.sectionHeading}>{title}</h2>
    </div>
  )
}

export default function ActivitiesPage() {
  const { lang, t } = useLanguage()
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

  return (
    <div style={pageStyles.page}>
      {/* Hero */}
      <div style={pageStyles.hero}>
        <div style={pageStyles.container}>
          <p className="t-label" style={{ color: '#c8a96e', marginBottom: '8px', letterSpacing: '0.18em' }}>
            {isTa ? 'செயல்பாடுகள் & ஊழியங்கள்' : 'ACTIVITIES & MINISTRIES'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 400, color: '#fff' }}>
            {isTa ? 'பேராயத்தின் திருச்சபை & நற்செய்தி செயல்பாடுகள்' : 'Diocesan Activities, Ministries & Outreach'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginTop: '8px' }}>
            {isTa ? 'மேய்ப்பர்களை தாங்கி, நற்செய்தியை அறிவிக்கும் ஏழு தூண்கள்' : 'Equipping Shepherds and Transforming Communities Across India'}
          </p>
        </div>
      </div>

      {/* 1. ORDINATION */}
      <section id="ordination" style={pageStyles.section}>
        <div style={pageStyles.container}>
          <SectionHeader
            label={isTa ? 'செயல்பாடு · 01' : 'Activity · 01'}
            title={isTa ? 'பிரதிஷ்டை ஊழியம் (Ordination)' : 'Ordination'}
          />

          <p style={pageStyles.para}>
            Episcopal ministers are the servants of God, who are convinced and confirmed of their calling in God's ministry,
            in any of the fivefold ministries Wz... Apostles, Prophets, Pastors, Teachers and Evangelists. More than the
            Theological studies, day-to-day involvement and activities in God's work is considered. But for exceptional we
            normally ordain the ministers those who worked actively in God's vineyard for at least 5 years. Such personals
            are ordained upon confession of their faith and confirmation of calling (oath) as per the Word of God, in
            presence of Episcopal Bishop and ordained episcopal ministers.
          </p>
          <p style={pageStyles.para}>
            While, we strongly believe that any minister is chosen and dedicated by God and ordained by the Holy Spirit,
            this ordination is as per the law of the land in order to exercise the Christian rights. Ordination takes place
            twice a year at Central Diocesan Office.
          </p>

          <div style={pageStyles.divider} />

          <p style={pageStyles.subHeading}>பிரதிஷ்டை ஊழியம் (தமிழ் விளக்கம்):</p>
          <p style={pageStyles.tamilPara}>
            எபிஸ்கோபல் ஊழியர்கள் தேவனின் சேவகர்களாவர், அவர்கள் தேவனின் ஊழியத்தில் தங்கள் அழைப்பை உறுதிப்படுத்திக்கொண்டவர்கள்.
            ஐந்து மடங்கான ஊழியங்களில் — அப்போஸ்தலர்கள், தீர்க்கதரிசிகள், போதகர்கள், போதனையாளர்கள் மற்றும் சுவிசேஷகர்கள் — யாதொன்றிலும்.
            இறையியல் படிப்புகளை விட, தேவனின் பணியில் தினசரி ஈடுபாடு மதிக்கப்படுகிறது. ஆனால் விதிவிலக்காக, குறைந்தது 5 ஆண்டுகள்
            தேவனின் திராட்சைத் தோட்டத்தில் செயலாக பணிசெய்தவர்களை நாம் நியமிக்கிறோம்.
          </p>
          <p style={pageStyles.tamilPara}>
            தேவனால் தேர்ந்தெடுக்கப்பட்ட மற்றும் பரிசுத்த ஆவியினால் நியமிக்கப்பட்ட ஊழியர்களை நாம் உறுதியாக நம்புகிறோம்;
            இந்த நியமனம் தேசத்தின் சட்டப்படி கிறிஸ்தவ உரிமைகளைப் பயன்படுத்துவதற்காக உள்ளது.
            நியமனம் ஆண்டுக்கு இரண்டு முறை மத்திய மறைமாவட்ட அலுவலகத்தில் நடைபெறுகிறது.
          </p>

          <Link to="/gallery?cat=Ordination" style={pageStyles.galleryLink}>
            📷 {isTa ? 'பிரதிஷ்டை புகைப்பட ஆல்பங்களைக் காண்க →' : 'View Ordination Photos →'}
          </Link>
        </div>
      </section>

      {/* 2. WORD SHARING MEET */}
      <section id="wordsharingmeet" style={pageStyles.section}>
        <div style={pageStyles.container}>
          <SectionHeader
            label={isTa ? 'செயல்பாடு · 02' : 'Activity · 02'}
            title={isTa ? 'வார்த்தைப் பகிர்வு கூட்டம் (Word Sharing Meet)' : 'Word Sharing Meet'}
          />

          <p style={pageStyles.para}>
            The Diocesan members gather together to search and learn the Word of God enabling to grow further and enriching
            themselves under various important titles. Such gathering take place in regular intervals at various places with
            prior information to the members.
          </p>

          <div style={pageStyles.divider} />

          <p style={pageStyles.subHeading}>வார்த்தை பகிர்வு கூட்டம் (தமிழ் விளக்கம்):</p>
          <p style={pageStyles.tamilPara}>
            மறைமாவட்ட அங்கத்தினர்கள் தேவ வார்த்தையை தேடி கற்றுக்கொள்ள ஒன்றுகூடுகின்றனர். இவ்வாறு கூடுவதன் மூலம் அவர்கள்
            பல்வேறு முக்கியமான தலைப்புகளில் மேலும் வளர்ச்சியடைகிறார்கள். இத்தகைய கூட்டங்கள் உறுப்பினர்களுக்கு முன்கூட்டியே
            அறிவிக்கப்பட்டு வழக்கமான இடைவெளிகளில் பல்வேறு இடங்களில் நடைபெறுகின்றன.
          </p>

          <Link to="/gallery?cat=Word Sharing Meet" style={pageStyles.galleryLink}>
            📷 {isTa ? 'வார்த்தைப் பகிர்வு புகைப்பட ஆல்பங்களைக் காண்க →' : 'View Word Sharing Meet Photos →'}
          </Link>
        </div>
      </section>

      {/* 3. ZONAL MEET */}
      <section id="zonalmeet" style={pageStyles.section}>
        <div style={pageStyles.container}>
          <SectionHeader
            label={isTa ? 'செயல்பாடு · 03' : 'Activity · 03'}
            title={isTa ? 'மண்டலக் கூட்டங்கள் (Zonal Meet)' : 'Zonal Meet'}
          />

          <p style={pageStyles.para}>
            It's a fellowship gathering of existing and prospective members of the Diocese at zonal levels. In zonal meet,
            detailed synopsis of the diocesan activities are explained following Praise, Worship and Word teaching.
          </p>

          <div style={pageStyles.divider} />

          <p style={pageStyles.subHeading}>மண்டல கூட்டம் (தமிழ் விளக்கம்):</p>
          <p style={pageStyles.tamilPara}>
            இது மண்டல அளவில் மறைமாவட்டத்தின் தற்போதைய மற்றும் எதிர்கால அங்கத்தினர்களின் சமுதாயக் கூட்டமாகும்.
            மண்டல கூட்டத்தில், புகழ், ஆராதனை மற்றும் வார்த்தை போதனையைத் தொடர்ந்து மறைமாவட்ட செயல்பாடுகளின்
            விரிவான சுருக்கம் விளக்கப்படுகிறது.
          </p>

          <Link to="/gallery?cat=Zonal Meet" style={pageStyles.galleryLink}>
            📷 {isTa ? 'மண்டலக் கூட்ட புகைப்பட ஆல்பங்களைக் காண்க →' : 'View Zonal Meet Photos →'}
          </Link>
        </div>
      </section>

      {/* 4. CHURCH VISIT */}
      <section id="churchvisit" style={pageStyles.section}>
        <div style={pageStyles.container}>
          <SectionHeader
            label={isTa ? 'செயல்பாடு · 04' : 'Activity · 04'}
            title={isTa ? 'சபை சந்திப்பு (Church Visit)' : 'Church Visit'}
          />

          <p style={pageStyles.para}>
            Trustees of the board accompanied by the DOS visit member Churches in order to encourage and equip them with
            required teachings, advise and to pray with them.
          </p>

          <div style={pageStyles.divider} />

          <p style={pageStyles.subHeading}>சபை வருகை (தமிழ் விளக்கம்):</p>
          <p style={pageStyles.tamilPara}>
            குழுமத்தின் அறங்காவலர்கள் DOS உடன் சேர்ந்து அங்கத்தினர் சபைகளை வருகை தந்து, தேவையான போதனைகள்,
            ஆலோசனைகள் வழங்கவும் மற்றும் அவர்களுடன் ஜெபிக்கவும் செல்கிறார்கள்.
          </p>

          <Link to="/gallery?cat=Church Visit" style={pageStyles.galleryLink}>
            📷 {isTa ? 'சபை சந்திப்பு புகைப்பட ஆல்பங்களைக் காண்க →' : 'View Church Visit Photos →'}
          </Link>
        </div>
      </section>

      {/* 5. CHILDREN MINISTRY */}
      <section id="childrenministry" style={pageStyles.section}>
        <div style={pageStyles.container}>
          <SectionHeader
            label={isTa ? 'செயல்பாடு · 05' : 'Activity · 05'}
            title={isTa ? 'சிறுவர் ஊழியம் & VBS (Children Ministry)' : 'Children Ministry & VBS'}
          />

          <p style={pageStyles.para}>We provide comprehensive training and equipping for those serving in children's ministry:</p>
          <ul style={pageStyles.list}>
            <li>Training Sunday School Teachers and equipping them with resources</li>
            <li>Children ministry training for those who are interested</li>
            <li>Conducting Children's Club</li>
            <li>VBS — Teachers Training</li>
            <li>VBS — Directors Training</li>
            <li>Training the Trainers</li>
          </ul>

          <div style={pageStyles.divider} />

          <p style={pageStyles.subHeading}>சிறுவர் ஊழியம் (தமிழ் விளக்கம்):</p>
          <ul style={{ ...pageStyles.list, color: 'rgba(255,255,255,0.85)' }}>
            <li>ஞாயிற்றுப்பள்ளி ஆசிரியர்களுக்கு பயிற்சி அளித்தல் மற்றும் வளங்களுடன் தகுதிப்படுத்துதல்</li>
            <li>ஆர்வமுள்ளவர்களுக்கு சிறுவர் ஊழிய பயிற்சி</li>
            <li>சிறுவர் கிளப் நடத்துதல்</li>
            <li>VBS — ஆசிரியர் பயிற்சி</li>
            <li>VBS — இயக்குனர் பயிற்சி</li>
            <li>பயிற்சியாளர்களுக்கு பயிற்சி</li>
          </ul>

          <Link to="/gallery?cat=Children Ministry" style={pageStyles.galleryLink}>
            📷 {isTa ? 'சிறுவர் ஊழிய புகைப்பட ஆல்பங்களைக் காண்க →' : 'View Children Ministry Photos →'}
          </Link>
        </div>
      </section>

      {/* 6. YOUTH MINISTRY */}
      <section id="youthministry" style={pageStyles.section}>
        <div style={pageStyles.container}>
          <SectionHeader
            label={isTa ? 'செயல்பாடு · 06' : 'Activity · 06'}
            title={isTa ? 'வாலிபர் ஊழியம் (Youth Ministry)' : 'Youth Ministry'}
          />

          <p style={pageStyles.para}>Training Youth Leaders in the following 4 key areas:</p>
          <ol style={pageStyles.numberedList}>
            <li><strong>Leadership Training</strong> — Equipping young leaders with biblical vision.</li>
            <li><strong>Discipleship Training</strong> — Rooted in spiritual maturity and scripture.</li>
            <li><strong>Personality Development</strong> — Character, integrity, and communication skills.</li>
            <li><strong>Evangelism Skills</strong> — Personal soul-winning techniques and campus outreach.</li>
          </ol>

          <div style={pageStyles.divider} />

          <p style={pageStyles.subHeading}>இளையோர் ஊழியம் (தமிழ் விளக்கம்):</p>
          <p style={pageStyles.tamilPara}>இளையோர் தலைவர்களுக்கு பின்வரும் நான்கு முக்கிய துறைகளில் பயிற்சி அளிக்கப்படுகிறது:</p>
          <ol style={{ ...pageStyles.numberedList, color: 'rgba(255,255,255,0.85)' }}>
            <li>தலைமைத்துவ பயிற்சி</li>
            <li>சீடத்துவ பயிற்சி</li>
            <li>ஆளுமை வளர்ச்சி</li>
            <li>சுவிசேஷ திறன்கள்</li>
          </ol>

          <Link to="/gallery?cat=Youth Ministry" style={pageStyles.galleryLink}>
            📷 {isTa ? 'வாலிபர் ஊழிய புகைப்பட ஆல்பங்களைக் காண்க →' : 'View Youth Ministry Photos →'}
          </Link>
        </div>
      </section>

      {/* 7. OUTREACH */}
      <section id="outreach" style={{ ...pageStyles.section, borderBottom: 'none' }}>
        <div style={pageStyles.container}>
          <SectionHeader
            label={isTa ? 'செயல்பாடு · 07' : 'Activity · 07'}
            title={isTa ? 'புறசந்திப்பு & சுவிசேஷ ஊழியங்கள் (Outreach)' : 'Outreach & Crusades'}
          />

          <p style={pageStyles.para}>
            * Making Gospel teams out of Diocese members, each team should contain seven members of our Diocese.
          </p>
          <p style={pageStyles.para}>
            * Finding out the places yet to reach by the Gospel and also reach those places with the help of local Churches of our Diocese.
          </p>
          <p style={pageStyles.para}>* Following of the way to share the Gospel:</p>

          <ol style={pageStyles.numberedList}>
            <li>Children ministry through the trained Children Ministers.</li>
            <li>Film shows Ministry.</li>
            <li>Street preaching.</li>
            <li>Tract Distribution.</li>
            <li>Crusades &amp; Village Conventions.</li>
          </ol>

          <div style={pageStyles.divider} />

          <p style={pageStyles.subHeading}>புறசந்திப்பு (தமிழ் விளக்கம்):</p>
          <p style={pageStyles.tamilPara}>
            இப்பேராயத்திலுள்ள அங்கத்தினர்களில் ஏழு உறுப்பினர்களைக் கொண்ட சுவிசேஷக் குழுக்களை உருவாக்குதல்.
          </p>
          <p style={pageStyles.tamilPara}>
            இந்தக் குழுக்கள் மூலம் சுவிசேஷம் அறிவிக்கப்பட வேண்டிய பகுதிகளைக் கண்டறிந்து ஸ்தல சபையோடு இணைந்து சுவிசேஷம் அறிவித்தல்.
          </p>
          <p style={pageStyles.tamilPara}>கீழ்கண்ட வழிகளில் சுவிசேஷம் பகிர்ந்தளித்தல்:</p>
          <ol style={{ ...pageStyles.numberedList, color: 'rgba(255,255,255,0.85)' }}>
            <li>சிறுவர் ஊழியங்கள் — பயிற்சி பெற்ற சிறுவர் ஊழியர்கள் மூலமாக.</li>
            <li>படக்காட்சி ஊழியங்கள்.</li>
            <li>தெருமுனைப் பிரசங்கங்கள்.</li>
            <li>கைப்பிரதி ஊழியங்கள்.</li>
            <li>சுவிசேஷ கூட்டங்கள் &amp; கிராம ஊழியங்கள்.</li>
          </ol>

          <Link to="/gallery?cat=Others" style={pageStyles.galleryLink}>
            📷 {isTa ? 'புறசந்திப்பு & நிவாரண புகைப்பட ஆல்பங்களைக் காண்க →' : 'View Outreach Photos →'}
          </Link>
        </div>
      </section>
    </div>
  )
}
