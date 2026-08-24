import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { CameraIcon, ArrowRightIcon } from '../components/Icons/SvgIcons'

const pageStyles = {
  pageWrapper: {
    paddingTop: '80px',
    background: '#0a0a0a',
    color: '#ffffff',
    minHeight: '100vh',
  },
  heroBanner: {
    background: '#111111',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '60px 0 40px 0',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 24px',
  },
  section: {
    padding: '80px 0',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  sectionHeading: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(26px, 4vw, 38px)',
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '8px',
    paddingBottom: '14px',
    borderBottom: '2px solid #c8a96e',
    display: 'inline-block',
  },
  label: {
    color: '#c8a96e',
    fontSize: '11px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    marginBottom: '10px',
    fontWeight: 600,
  },
  para: {
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.85,
    marginBottom: '16px',
    fontSize: '15px',
  },
  tamilPara: {
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 1.9,
    marginBottom: '16px',
    fontSize: '14.5px',
    fontStyle: 'normal',
  },
  subHeading: {
    color: '#c8a96e',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginTop: '24px',
    marginBottom: '12px',
  },
  list: {
    paddingLeft: '24px',
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 2.1,
    fontSize: '14.5px',
    marginBottom: '20px',
  },
  galleryLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '20px',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '8px 18px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.04)',
    transition: 'all 0.2s',
  },
  divider: {
    height: '1px',
    background: 'rgba(255,255,255,0.08)',
    margin: '32px 0',
  },
}

function SectionHeader({ label, title }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <p style={pageStyles.label}>{label}</p>
      <h2 style={pageStyles.sectionHeading}>{title}</h2>
    </div>
  )
}

export default function ActivitiesPage() {
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

  return (
    <div style={pageStyles.pageWrapper}>
      {/* Header Banner */}
      <div style={pageStyles.heroBanner}>
        <div style={pageStyles.container}>
          <p style={{ ...pageStyles.label, marginBottom: '8px' }}>
            {isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயம்' : 'APOSTOLIC COUNCIL OF INDIA DIOCESE'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, marginBottom: '16px' }}>
            {isTa ? 'பேராயத்தின் முக்கிய செயல்பாடுகள் & ஊழியங்கள்' : 'Activities & Ministries'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '750px', fontSize: '15px', lineHeight: 1.7 }}>
            {isTa
              ? 'தமிழகம் மற்றும் தேசமெங்கும் இயங்கும் 7 முக்கிய ஊழியத் தூண்கள் மூலம் போதகர்களை தாங்கி, திருச்சபைகளை பலப்படுத்துகிறோம்.'
              : 'Detailed overview of the seven core ministerial pillars functioning under the ACI Diocese across India.'}
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
            Episcopal ministers are the servants of God, who are convinced and confirmed of their calling in God&apos;s ministry,
            in any of the fivefold ministries Wz... Apostles, Prophets, Pastors, Teachers and Evangelists. More than the
            Theological studies, day-to-day involvement and activities in God&apos;s work is considered. But for exceptional we
            normally ordain the ministers those who worked actively in God&apos;s vineyard for at least 5 years. Such personals
            are ordained upon confession of their faith and confirmation of calling (oath) as per the Word of God, in presence
            of Episcopal Bishop and ordained episcopal ministers.
          </p>
          <p style={pageStyles.para}>
            While, we strongly believe that any minister is chosen and dedicated by God and ordained by the Holy Spirit, this
            ordination is as per the law of the land in order to exercise the Christian rights. Ordination takes place twice a
            year at Central Diocesan Office.
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
            <CameraIcon size={15} color="#c8a96e" />
            <span>{isTa ? 'பிரதிஷ்டை புகைப்பட ஆல்பங்களைக் காண்க →' : 'View Ordination Photos →'}</span>
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
            <CameraIcon size={15} color="#c8a96e" />
            <span>{isTa ? 'வார்த்தைப் பகிர்வு புகைப்பட ஆல்பங்களைக் காண்க →' : 'View Word Sharing Meet Photos →'}</span>
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
            It&apos;s a fellowship gathering of existing and prospective members of the Diocese at zonal levels. In zonal meet,
            detailed synopsis of the diocesan activities are explained following Praise, Worship and Word teaching.
          </p>

          <div style={pageStyles.divider} />

          <p style={pageStyles.subHeading}>மண்டல கூட்டங்கள் (தமிழ் விளக்கம்):</p>
          <p style={pageStyles.tamilPara}>
            மண்டல அளவில் மறைமாவட்டத்தின் தற்போதைய மற்றும் வருங்கால உறுப்பினர்களின் ஐக்கியக் கூட்டம் இதுவாகும். மண்டல சந்திப்பில்,
            துதி, ஆராதனை மற்றும் வேத போதனையைத் தொடர்ந்து மறைமாவட்ட நடவடிக்கைகளின் விரிவான சுருக்கம் விளக்கப்படுகிறது.
          </p>

          <Link to="/gallery?cat=Zonal Meet" style={pageStyles.galleryLink}>
            <CameraIcon size={15} color="#c8a96e" />
            <span>{isTa ? 'மண்டலக் கூட்ட புகைப்பட ஆல்பங்களைக் காண்க →' : 'View Zonal Meet Photos →'}</span>
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

          <p style={pageStyles.subHeading}>சபை சந்திப்பு (தமிழ் விளக்கம்):</p>
          <p style={pageStyles.tamilPara}>
            வாரியத்தின் அறங்காவலர்கள், டிஓஎஸ் உடன் இணைந்து, உறுப்பினர் தேவாலயங்களை ஊக்குவிக்கவும், தேவையான போதனைகள்,
            ஆலோசனைகளுடன் அவர்களை தயார்படுத்தவும், அவர்களுடன் பிரார்த்தனை செய்யவும் வருகை தருகின்றனர்.
          </p>

          <Link to="/gallery?cat=Church Visit" style={pageStyles.galleryLink}>
            <CameraIcon size={15} color="#c8a96e" />
            <span>{isTa ? 'சபை சந்திப்பு புகைப்பட ஆல்பங்களைக் காண்க →' : 'View Church Visit Photos →'}</span>
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

          <p style={pageStyles.para}>Equipping and training leaders for effective child evangelism:</p>
          <ul style={pageStyles.list}>
            <li>Training Sunday School Teachers and equipping them with resources.</li>
            <li>Children ministry training for those who are interested.</li>
            <li>Conducting Children&apos;s Club in various localities.</li>
            <li>VBS — Teachers Training workshops.</li>
            <li>VBS — Directors Training programs.</li>
            <li>Training the Trainers for long-term impact.</li>
          </ul>

          <div style={pageStyles.divider} />

          <p style={pageStyles.subHeading}>சிறுவர் ஊழியம் (தமிழ் விளக்கம்):</p>
          <ul style={pageStyles.list}>
            <li>ஞாயிறு பள்ளி ஆசிரியர்களுக்கு பயிற்சி அளித்து, அவர்களுக்கு தேவையான வளங்களை வழங்குதல்.</li>
            <li>ஆர்வமுள்ளவர்களுக்கு சிறுவர் ஊழியப் பயிற்சி.</li>
            <li>சிறுவர் கிளப் நடத்துதல்.</li>
            <li>விபிஎஸ் — ஆசிரியர்கள் பயிற்சி.</li>
            <li>விபிஎஸ் — இயக்குநர்கள் பயிற்சி.</li>
            <li>பயிற்சியாளர்களுக்கு பயிற்சி அளித்தல்.</li>
          </ul>

          <Link to="/gallery?cat=Children Ministry" style={pageStyles.galleryLink}>
            <CameraIcon size={15} color="#c8a96e" />
            <span>{isTa ? 'சிறுவர் ஊழிய புகைப்பட ஆல்பங்களைக் காண்க →' : 'View Children Ministry Photos →'}</span>
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

          <p style={pageStyles.para}>Training Youth Leaders across the four foundational pillars:</p>
          <ol style={pageStyles.list}>
            <li>Leadership Training — Developing visionary Christian leaders for the future.</li>
            <li>Discipleship Training — Rooting young people deeply in biblical truth.</li>
            <li>Personality Development — Cultivating character, integrity, and communication.</li>
            <li>Evangelism Skills — Equipping youth to boldly share the Gospel of Jesus Christ.</li>
          </ol>

          <div style={pageStyles.divider} />

          <p style={pageStyles.subHeading}>வாலிபர் ஊழியம் (தமிழ் விளக்கம்):</p>
          <ol style={pageStyles.list}>
            <li>தலைமைத்துவப் பயிற்சி (Leadership Training)</li>
            <li>சீஷத்துவப் பயிற்சி (Discipleship Training)</li>
            <li>ஆளுமை மேம்பாடு (Personality Development)</li>
            <li>சுவிசேஷப் பகிர்வு திறன்கள் (Evangelism Skills)</li>
          </ol>

          <Link to="/gallery?cat=Youth Ministry" style={pageStyles.galleryLink}>
            <CameraIcon size={15} color="#c8a96e" />
            <span>{isTa ? 'வாலிபர் ஊழிய புகைப்பட ஆல்பங்களைக் காண்க →' : 'View Youth Ministry Photos →'}</span>
          </Link>
        </div>
      </section>

      {/* 7. OUTREACH */}
      <section id="outreach" style={{ ...pageStyles.section, borderBottom: 'none' }}>
        <div style={pageStyles.container}>
          <SectionHeader
            label={isTa ? 'செயல்பாடு · 07' : 'Activity · 07'}
            title={isTa ? 'புறசந்திப்பு & சுவிசேஷ ஊழியம் (Outreach)' : 'Outreach & Missions'}
          />

          <ul style={pageStyles.list}>
            <li>Making Gospel teams out of Diocese members — each team containing seven members of our Diocese.</li>
            <li>Finding out places yet to be reached by the Gospel and reaching those places with local Churches of our Diocese.</li>
            <li>Following effective ways to share the Gospel:</li>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li>1. Children ministry through trained Children Ministers.</li>
              <li>2. Film shows Ministry.</li>
              <li>3. Street preaching.</li>
              <li>4. Tract Distribution.</li>
              <li>5. Crusades &amp; Revival meetings.</li>
            </ul>
          </ul>

          <div style={pageStyles.divider} />

          <p style={pageStyles.subHeading}>புறசந்திப்பு (தமிழ் விளக்கம்):</p>
          <ul style={pageStyles.list}>
            <li>இப்பேராயத்திலுள்ள அங்கத்தினர்களில் ஏழு உறுப்பினர்களைக் கொண்ட சுவிசேஷக் குழுக்களை உருவாக்குதல்.</li>
            <li>இந்தக் குழுக்கள் மூலம் சுவிசேஷம் அறிவிக்கப்பட வேண்டிய பகுதிகளைக் கண்டறிந்து ஸ்தல சபையோடு இணைந்து சுவிசேஷம் அறிவித்தல்.</li>
            <li>கீழ்கண்ட வழிகளில் சுவிசேஷம் பகிர்ந்தளித்தல்:</li>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li>1. சிறுவர் ஊழியங்கள் பயிற்சி பெற்ற சிறுவர் ஊழியர்கள் மூலமாக.</li>
              <li>2. படக்காட்சி ஊழியங்கள்.</li>
              <li>3. தெருமுனைப் பிரசங்கங்கள்.</li>
              <li>4. கைப்பிரதி ஊழியங்கள்.</li>
              <li>5. நற்செய்தி பெருங்கூட்டங்கள்.</li>
            </ul>
          </ul>

          <Link to="/gallery?cat=Others" style={pageStyles.galleryLink}>
            <CameraIcon size={15} color="#c8a96e" />
            <span>{isTa ? 'புறசந்திப்பு & நிவாரண புகைப்பட ஆல்பங்களைக் காண்க →' : 'View Outreach Photos →'}</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
