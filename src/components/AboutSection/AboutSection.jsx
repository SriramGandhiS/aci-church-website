import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import './AboutSection.css'

const faithArticles = [
  {
    titleEn: 'The Holy Scriptures',
    titleTa: 'பரிசுத்த வேதாகமம்',
    english: 'The Bible is the inspired Word of God, the product of holy men of old who spoke and wrote as they were moved by the Holy Spirit. The New Covenant, as recorded in the New Testament, we accept as our infallible guide in matters pertaining to conduct and doctrine. (2 Timothy 3:16; 1 Thessalonians 2:13; 2 Peter 1:21)',
    tamil: 'வேதபுத்தகம் முழுவதும் (பழைய மற்றும் புதிய ஏற்பாடுகள்) தேவனால் மனிதனுக்கு வெளிப்படுத்தப்பட்ட தெளிவான தவறாத பழுதற்ற கர்த்தருடைய வார்த்தை என்றும், இது ஒவ்வொரு கிறிஸ்தவனுடைய வாழ்விலும் மகா உன்னத அதிகாரம் கொண்ட தேவனுடைய கூற்று என்று விசுவாசிக்கிறோம். (2 தீமோத்தேயு 3:16, 17)',
  },
  {
    titleEn: 'The Godhead',
    titleTa: 'திரியேக தேவன்',
    english: 'Our God is one, manifested in three persons — the Father, the Son, and the Holy Spirit, being co-equal. (Philippians 2:6; 1 Timothy 3:16)',
    tamil: 'சகலத்தையும் படைத்தவரும், ஒப்பில்லாத நேர்த்தியும் நித்தியவாசியுமாகிய கர்த்தர் ஒருவரில் மூவராய் பிதா, குமாரன், பரிசுத்த ஆவியாய் இருக்கிறார் என்றும் விசுவாசிக்கிறோம். (யோவான் 17:3; 1 யோவான் 5:7)',
  },
  {
    titleEn: 'The Deity of Jesus Christ',
    titleTa: 'இயேசு கிறிஸ்துவின் தெய்வத்துவம்',
    english: 'Jesus Christ is God, existed before all things created, and is the only begotten Son of the Living God. He became flesh through His virgin birth, lived a sinless life, died on the cross as our substitute, rose bodily from the dead, and ascended to the right hand of God. (John 1:1-3; Philippians 2:6-7; Romans 5:15; 1 Timothy 3:16)',
    tamil: 'இயேசு கிறிஸ்து முழு தெய்வமும் முழு மனிதனுமானவர். பரிசுத்த ஆவியினால் கன்னி மரியாளிடத்தில் பிறந்து பாவமில்லாதவராய் வாழ்ந்து, நம்முடைய பாவங்களுக்காய் சிலுவையில் பலியானார். மரித்தோரிலிருந்து எழுந்து பரத்திற்கு ஏறி பிதாவின் வலது பாரிசத்தில் உட்கார்ந்து நமக்காக வேண்டுதல் செய்கிற பிரதான ஆசாரியிராயிருக்கிறார். (பிலிப்பியர் 2:6-7)',
  },
  {
    titleEn: 'Man, His Fall, and Redemption',
    titleTa: 'மனிதன், வீழ்ச்சி & மீட்பு',
    english: 'Man is a created being, made in the likeness of God. Through Adam\'s transgression, sin entered the world. Jesus Christ shed His blood to redeem and restore man back to God. (Romans 5:12; Romans 3:23; 1 John 3:8)',
    tamil: 'தேவனுடைய சாயலில் படைக்கப்பட்ட மனிதன் பாவம் செய்து, தேவனை விட்டுப் பிரிந்து, ஆவிக்குரிய மரணத்தையும் சரீர மரணத்தையும் பெற்றுக் கொண்டான். கல்வாரி சிலுவையில் இயேசு கிறிஸ்து சிந்தின இரத்தத்தை விசுவாசிப்பது மட்டுமே இரட்சிப்பின் ஒரே வழியாகும்.',
  },
  {
    titleEn: 'Eternal Life and the New Birth',
    titleTa: 'நித்திய ஜீவன் & மறுபிறப்பு',
    english: 'Man\'s first step toward salvation is godly sorrow that produces repentance. The new birth is necessary to all men, produced by the washing of regeneration and faith in Christ Jesus. (2 Corinthians 7:10; John 3:3-5; Romans 10:9-10)',
    tamil: 'ஆவியின் நித்திய வாழ்விற்கு பரிசுத்த ஆவியினால் மறுபடியும் பிறப்பது கட்டாயம். இயேசு கிறிஸ்துவை இருதயத்தில் விசுவாசித்து, வாயினால் அறிக்கை செய்கிறவன் இரட்சிக்கப்படுவான்.',
  },
  {
    titleEn: 'The Church',
    titleTa: 'சபையாகிய சரீரம்',
    english: 'The Church is the Body of Christ, a spiritual organism made up of all believers of this present age, called to fulfill the Great Commission. (1 Corinthians 12:12-14; Ephesians 1:22-23; Matthew 28:19-20)',
    tamil: 'சபையாகிய மணவாட்டி என்பது மனந்திரும்பி பாவ மன்னிப்பின் நிச்சயத்தை பெற்று, மறுபடியும் பிறந்து, கிறிஸ்துவின் சரீரத்தில் இணைக்கப்பட்ட அனைவரின் சங்கமாகும்.',
  },
  {
    titleEn: 'The Holy Spirit & Spiritual Gifts',
    titleTa: 'பரிசுத்த ஆவியானவர் & ஆவிக்குரிய வரங்கள்',
    english: 'We believe in the deity and personality of the Holy Spirit who regenerates sinners, indwells believers, and empowers with spiritual gifts for ministry. (Acts 5:3-4; 1 Corinthians 12:4-11; Titus 3:5)',
    tamil: 'பரிசுத்த ஆவியானவர் விசுவாசிகள் தேவனுக்கேற்றபடி வாழவும், சேவிக்கவும், பெலன் பெறும்படி தங்கி, வழிநடத்தி, போதிக்கிறார். ஆவிக்குரிய வரங்களை விசுவாசிகளுக்கு அளிக்கிறார்.',
  },
  {
    titleEn: 'Baptism in the Holy Ghost',
    titleTa: 'பரிசுத்த ஆவியின் ஞானஸ்நானம்',
    english: 'The baptism in the Holy Ghost is a gift promised by Jesus Christ to all believers, distinct from the new birth, accompanied by speaking in tongues. (Acts 1:8; Acts 2:4; Acts 2:38-39)',
    tamil: 'புதுபிறப்பிற்கு பின் அதை தொடர்ந்து கேட்கிற விசுவாசிகள் யாவருக்கும் பரிசுத்த ஆவியின் ஞானஸ்நான அனுபவம் கொடுக்கப்படுகிறது. அந்நிய பாஷைகளைப் பேசுதல் வெளி அடையாளமாய் இருக்கிறது.',
  },
  {
    titleEn: 'Water Baptism & Lord\'s Supper',
    titleTa: 'தண்ணீர் ஞானஸ்நானம் & திருவிருந்து',
    english: 'Water baptism is by immersion for believers only. The Lord\'s Supper is a memorial of Jesus\' suffering and death until His second coming. (Matthew 28:19; Romans 6:4; 1 Corinthians 11:26)',
    tamil: 'தண்ணீரில் மூழ்கி ஞானஸ்நானம் பெறுதலும், கிறிஸ்துவின் பாடுகள் மற்றும் உயிர்த்தெழுதலை நினைவுகூர்ந்து திருவிருந்தில் பங்கு கொள்ளுதலும் சபையின் திருவருட்சாதனங்கள் ஆகும்.',
  },
  {
    titleEn: 'Divine Healing & Sanctification',
    titleTa: 'தெய்வீக சுகம் & பரிசுத்தமாதல்',
    english: 'Sanctification is a progressive work of grace. Divine healing is provided in the atonement of Christ for all believers. (Hebrews 12:14; 1 Thessalonians 5:23; 1 Peter 2:24)',
    tamil: 'தேவனுடைய வார்த்தையில் விசுவாசம் கொண்டவர்கள் அதின் வெளிச்சத்தில் பரிசுத்தத்தையும், தெய்வீக சுகத்தையும், ஆத்தும செழிப்பையும் அனுபவிப்பார்கள்.',
  },
  {
    titleEn: 'The Second Coming of Christ',
    titleTa: 'இயேசு கிறிஸ்துவின் இரண்டாம் வருகை',
    english: 'We believe in the imminent rapture of the Church, the visible return of Christ with His saints, and His millennial kingdom. (1 Thessalonians 4:13-18; Revelation 20:1-6)',
    tamil: 'ஆண்டவர் இயேசு கிறிஸ்துவின் ஆயிரம் வருட அரசாட்சிக்கு முன் இயேசுகிறிஸ்து மகிமையுடன் ரகசியமாய் வருவாரென்று விசுவாசிக்கிறோம்.',
  },
  {
    titleEn: 'Final Judgment & Eternity',
    titleTa: 'இறுதி நியாயத்தீர்ப்பு & நித்தியம்',
    english: 'The physical resurrection of all men — the saints to everlasting joy in New Heavens & New Earth, and the wicked to eternal judgment. (Revelation 20:11-15; Revelation 21:1-8; 2 Peter 3:13)',
    tamil: 'இறுதி நியாயத்தீர்ப்பின் நாளிலே இரட்சிக்கப்பட்டவர்கள் புதிய வானம் புதிய பூமியில் நித்தியமாய் வாழ்வார்கள்.',
  },
]

export default function AboutSection() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const sectionRef = useRef(null)
  const [openFaithIndex, setOpenFaithIndex] = useState(0)

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal')
    if (!els?.length) return
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        }),
      { threshold: 0.08 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section section-pad"
      aria-label="About ACI Diocese"
    >
      <div className="container">

        {/* 1. About Diocese Block */}
        <div id="about-diocese" className="reveal" style={{ marginBottom: '64px' }}>
          <p className="t-label" style={{ color: 'var(--color-text-muted)', marginBottom: '12px', letterSpacing: '0.15em' }}>
            {isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயம்' : 'ABOUT APOSTOLIC COUNCIL OF INDIA DIOCESE'}
          </p>
          <h2 className="about-headline t-headline" style={{ marginBottom: '24px', color: 'var(--color-text-dark)' }}>
            {isTa
              ? 'இந்தியா முழுவதும் தேவ ஊழியங்களை தாங்கி நடத்தும் சட்டப்பூர்வ எபிஸ்கோபல் பேராயம்'
              : 'A Christ-Centered Episcopal Council Registered for Kingdom Service Across India'}
          </h2>
          <div style={{ background: 'var(--color-soft-gray)', padding: '28px', borderLeft: '4px solid var(--color-black)' }}>
            <p className="t-body" style={{ fontSize: '16px', lineHeight: '1.75', color: 'var(--color-text-dark)', marginBottom: '16px' }}>
              {isTa ? (
                <>
                  <strong>அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயம்</strong> என்பது உலகெங்கிலும் உள்ள எபிஸ்கோபல் ஊழியர்களைக் கொண்டு பதிவு செய்யப்பட்ட பொது ஆன்மீக அறக்கட்டளையாகும். இது <strong>இந்திய அறக்கட்டளை சட்டம் 1882 (பதிவு எண்: 62/B.k.4/2013)</strong>-ன் கீழும், <strong>இந்திய கிறிஸ்தவ திருமண சட்டம் 1872</strong> (பகுதி I பிரிவு 5(1), பகுதி IV பிரிவு 32-34, 37 &amp; பகுதி VI பிரிவு 64)-ன் கீழும் கிறிஸ்தவ பாரம்பரிய முறைப்படி முறைப்படுத்தப்பட்டு பதிவு செய்யப்பட்டுள்ளது.
                </>
              ) : (
                <>
                  <strong>Apostolic Council of India Diocese</strong> is a registered public religious trust comprising ordained Episcopal ministers from various parts of the world, registered under the <strong>Indian Trust Act 1882 (Reg. No 62/B.k.4/2013)</strong>, under Part I sec 5(1), Part IV sec 32-34, 37 &amp; Part VI sec 64 of the <strong>Indian Christian Marriage Act 1872</strong>, constituted under Christian Clergy Rites and Traditions.
                </>
              )}
            </p>
            <p className="t-body" style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
              {isTa
                ? 'புதன்கிழமை, 16 அக்டோபர் 2013 அன்று தேவ மகிமைக்காக பிரதிஷ்டை செய்யப்பட்டது. மத்திய பேராய அலுவலகம்: 6/110, மேலப்பட்டி, ஹனுமந்தராயன்கோட்டை, திண்டுக்கல் மாவட்டம், தமிழ்நாடு – 624002.'
                : 'Dedicated for the Glory of God on Wednesday, 16th October 2013. Central Diocesan Office: 6/110, Melapatty, Hanumantharayan Kottai, Dindigul District, Tamil Nadu – 624002.'}
            </p>
          </div>
        </div>

        {/* 2. Founder Section */}
        <div id="founder" className="about-grid reveal reveal-delay-1" style={{ marginBottom: '64px' }}>
          <div className="about-left">
            <p className="t-label" style={{ color: 'var(--color-text-muted)', marginBottom: '8px', letterSpacing: '0.15em' }}>
              {isTa ? 'பேராயத்தின் ஸ்தாபகர்' : 'THE FOUNDER'}
            </p>
            <h2 className="t-headline" style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--color-text-dark)' }}>
              {isTa ? 'பேராயர் பேரருட்திரு ச. ஜான்சன் துரை' : 'Bishop Rt. Rev. S. Johnson Durai'}
            </h2>
            <div style={{ borderLeft: '3px solid var(--color-black)', paddingLeft: '16px', margin: '16px 0', color: 'var(--color-text-mid)', fontStyle: 'italic', fontSize: '15px', lineHeight: '1.7' }}>
              {isTa
                ? '“மேய்ப்பர்களுக்கு மேய்ச்சலளித்து, தனிமையில் சத்துருவை எதிர்த்துப் போராடும் மேய்ப்பர்களை தாங்குவதற்கு தேவன் இந்த ஆழமான தரிசனத்தை கொடுத்தார்.” — எசேக்கியேல் 34:23'
                : '“God gave a deep conviction for a shepherd to shelter shepherds who toil alone against the kingdom of the enemy.” — Ezekiel 34:23'}
            </div>
            <p className="t-body" style={{ marginBottom: '16px', color: 'var(--color-text-mid)', lineHeight: '1.75' }}>
              {isTa
                ? 'தேவனால் தெரிந்துகொள்ளப்பட்டு பிரதிஷ்டை செய்யப்பட்ட ஊழியரும், அப்போஸ்தலரும், 25 ஆண்டுகளுக்கும் மேலாக வேதத்தைக் கற்றுக் கொடுத்துவரும் போதகருமான பேரருட்திரு ச. ஜான்சன் துரை அவர்கள். கிறிஸ்தவக் குடும்பத்தில் பிறந்து, இளமையிலேயே இயேசுவை ஏற்றுக்கொண்டு, தேவனுடைய அழைப்பிற்கு கீழ்ப்படிந்து அரசு பதவிகளை உதறிவிட்டு ‘வார்த்தையின் வல்லமை ஊழியங்கள்’ மற்றும் ஏசிஐ பேராயத்தை நிறுவினார்.'
                : 'Ordained minister, Apostle, and Bible teacher with over 25 years of dedicated ministry. Born into a Christian family, he accepted Jesus in his youth. Obeying God\'s call, he and his wife left government positions to establish Power in the Word Ministries and found the ACI Diocese.'}
            </p>
          </div>
          <div className="about-photo-wrap">
            <img src="/migrated/d2.png" alt="Bishop Rt. Rev. S. Johnson Durai" className="about-photo" />
            <div style={{ padding: '12px', background: 'var(--color-near-black)', color: 'var(--color-white)', fontSize: '13px', textAlign: 'center' }}>
              <strong>{isTa ? 'பேராயர் பேரருட்திரு ச. ஜான்சன் துரை' : 'Bishop Rt. Rev. S. Johnson Durai'}</strong> — {isTa ? 'ஸ்தாபகர் & தலைமை பேராயர்' : 'Founder & Senior Bishop'}
            </div>
          </div>
        </div>

        {/* 3. Vision & Mission (Dark Accent Panel in Light Section) */}
        <div id="vision-mission" className="reveal reveal-delay-2" style={{ marginBottom: '64px', background: 'var(--color-near-black)', color: 'var(--color-white)', padding: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '36px' }}>
            <div>
              <p className="t-label" style={{ color: '#c8a96e', marginBottom: '14px', letterSpacing: '0.15em' }}>
                {isTa ? 'நமது தரிசனம் (OUR VISION)' : 'OUR VISION (தரிசனம்)'}
              </p>
              <ul style={{ listStyle: 'square', paddingLeft: '20px', lineHeight: '1.9', fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                {isTa ? (
                  <>
                    <li>இந்த தலைமுறையினர் தேவனுடைய வார்த்தையை விசுவாசித்து ஜெயமுள்ள வாழ்க்கை வாழ செய்தல்.</li>
                    <li>பிரதிஷ்டை செய்யப்பட்ட ஊழியர்களுக்கு வேதம் தரும் வல்லமை மற்றும் அதிகாரத்தை கற்பித்தல்.</li>
                    <li>தேவனுடைய அன்பை தினசரி வாழ்க்கையில் ஊழியர்களுக்கும் விசுவாசிகளுக்கும் வெளிப்படுத்துதல்.</li>
                    <li>தேசத்திற்காக திறப்பின் வாசலில் நிற்கும் ஜெப வீரர்களை உருவாக்குதல்.</li>
                    <li>ஊடகங்கள் மற்றும் நேரடி நற்செய்தி மூலம் அந்தகாரத்தை அகற்றி சுவிசேஷம் அறிவித்தல்.</li>
                    <li>சுவிசேஷம் சென்றடையாத பகுதிகளுக்கு மிஷனெரிகளை அனுப்புதல்.</li>
                  </>
                ) : (
                  <>
                    <li>Ensure contemporary generations live a victorious life believing the Word of God.</li>
                    <li>Teach ordained ministers the power and authority vested in Scripture to save perishing souls.</li>
                    <li>Demonstrate God&apos;s love in daily life to ministers and believers.</li>
                    <li>Raise worshipers and prayer warriors to stand in the gap for the Nation.</li>
                    <li>Preach the Gospel through media and personal outreach to dispel darkness.</li>
                    <li>Send missionaries to reach unreached communities.</li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <p className="t-label" style={{ color: '#c8a96e', marginBottom: '14px', letterSpacing: '0.15em' }}>
                {isTa ? 'நமது செயலாக்கம் (OUR MISSION)' : 'OUR MISSION (செயலாக்கம்)'}
              </p>
              <ul style={{ listStyle: 'circle', paddingLeft: '20px', lineHeight: '1.9', fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                {isTa ? (
                  <>
                    <li>சுயாதீன ஊழியர்களை ஒன்றிணைத்து, ஆவிக்குரிய தகுதி உயர்வு மற்றும் வேதப்பூர்வ பிரதிஷ்டை அளித்தல்.</li>
                    <li>வார்த்தைப் பகிர்வு கூட்டங்கள் மூலம் ஊழியர்களை வேத அறிவில் செழிக்கச் செய்தல்.</li>
                    <li>மண்டல கூட்டங்கள் மூலம் ஸ்தல சபைகளை ஊக்குவித்து உற்சாகப்படுத்துதல்.</li>
                    <li>அங்கத்துவ சபைகளை சந்தித்து தேவ ஆலோசனைகளை வழங்கி தேவராஜ்யத்தை கட்டியெழுப்புதல்.</li>
                  </>
                ) : (
                  <>
                    <li>Bring independent ministers under a centralized setup, offering upgrading training and Biblical ordination.</li>
                    <li>Teach ministers to enrich in Word knowledge through regular Word Sharing Meets.</li>
                    <li>Conduct Zonal Meets to encourage member and non-member churches.</li>
                    <li>Visit member churches to equip, advise, and build the Kingdom of God.</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Statement of Faith */}
        <div id="faith-statement" className="reveal reveal-delay-3" style={{ marginBottom: '64px' }}>
          <p className="t-label" style={{ color: 'var(--color-text-muted)', marginBottom: '12px', letterSpacing: '0.15em' }}>
            {isTa ? 'நமது விசுவாச பிரமாணங்கள்' : 'OUR FAITH STATEMENTS'}
          </p>
          <h2 className="t-headline" style={{ marginBottom: '24px', color: 'var(--color-text-dark)' }}>
            {isTa ? 'ஏசிஐ பேராயத்தின் 15 சத்திய தூண்கள்' : '15 Doctrinal Pillars of ACI Diocese'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faithArticles.map((art, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--color-divider-light)',
                  background: openFaithIndex === idx ? 'var(--color-soft-gray)' : 'var(--color-white)',
                  transition: 'all 0.25s ease',
                }}
              >
                <button
                  onClick={() => setOpenFaithIndex(openFaithIndex === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-dark)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <span>{idx + 1}. {isTa ? art.titleTa : art.titleEn}</span>
                  <span style={{ fontSize: '18px' }}>{openFaithIndex === idx ? '−' : '+'}</span>
                </button>
                {openFaithIndex === idx && (
                  <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid var(--color-divider-light)' }}>
                    <p style={{ fontSize: '14px', lineHeight: '1.75', color: 'var(--color-text-dark)', marginTop: '12px' }}>
                      {isTa ? art.tamil : art.english}
                    </p>
                    <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                      <strong>{isTa ? 'ஆங்கில மூலம்:' : 'Tamil:'}</strong> {isTa ? art.english : art.tamil}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 5. About Board */}
        <div id="about-board" className="reveal" style={{ background: 'var(--color-soft-gray)', padding: '32px', borderLeft: '4px solid var(--color-black)' }}>
          <p className="t-label" style={{ color: 'var(--color-text-muted)', marginBottom: '8px', letterSpacing: '0.15em' }}>
            {isTa ? 'பேராய அறங்காவலர் குழு' : 'DIOCESAN BOARD OF TRUSTEES'}
          </p>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '12px', color: 'var(--color-text-dark)' }}>
            {isTa ? 'ஏழு அர்ப்பணிக்கப்பட்ட அறங்காவலர்கள் & ஆவிக்குரிய மேற்பார்வையாளர்கள்' : 'Seven Committed Trustees & Spiritual Overseers'}
          </h3>
          <p className="t-body" style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--color-text-mid)' }}>
            {isTa
              ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தின் ஆவிக்குரிய, நிர்வாக, சட்ட மற்றும் மிஷனெரி பணிகளை வழிநடத்தும் ஏழு அர்ப்பணிக்கப்பட்ட அறங்காவலர்களைக் கொண்டு இக்குழு இயங்குகிறது.'
              : 'The Diocesan Board comprises seven dedicated trustees who guide the spiritual, administrative, legal, and missionary functions of the Apostolic Council of India Diocese across Tamil Nadu and India.'}
          </p>
        </div>

      </div>
    </section>
  )
}
