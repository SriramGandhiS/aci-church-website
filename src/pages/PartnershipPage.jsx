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
  ul: { paddingLeft: '22px', color: 'rgba(255,255,255,0.85)', lineHeight: 2.1, marginBottom: '16px' },
  bank: { background: 'rgba(200,169,110,0.1)', border: '1px solid #c8a96e', padding: '24px 28px', marginTop: '24px', marginBottom: '8px' },
  bankTitle: { color: '#c8a96e', fontWeight: 700, fontSize: '14px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' },
  bankRow: { fontSize: '15px', color: 'rgba(255,255,255,0.9)', marginBottom: '6px' },
  bankVal: { color: '#fff', fontWeight: 700 },
  subH: { color: '#c8a96e', fontSize: '17px', fontWeight: 600, marginBottom: '12px', marginTop: '28px' },
  divider: { height: '1px', background: 'rgba(255,255,255,0.07)', margin: '28px 0' },
  quoteBlock: { borderLeft: '3px solid #c8a96e', paddingLeft: '20px', margin: '20px 0', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', fontSize: '15px', lineHeight: 1.9 },
  byline: { color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginTop: '4px' },
}

function BankDetails({ isTa }) {
  return (
    <div style={S.bank}>
      <p style={S.bankTitle}>{isTa ? 'ஏசிஐ பேராய வங்கி விபரங்கள் (Bank Details)' : 'ACI Diocese Bank Details'}</p>
      <p style={S.bankRow}>{isTa ? 'வங்கி கணக்கு எண் (Account No.):' : 'Account No.:'} <span style={S.bankVal}>1567201000059</span></p>
      <p style={S.bankRow}>{isTa ? 'IFSC குறியீடு (IFSC Code):' : 'IFSC Code:'} <span style={S.bankVal}>CNRB0001567</span></p>
      <p style={S.bankRow}>{isTa ? 'வங்கி பெயர் (Bank Name):' : 'Bank:'} <span style={S.bankVal}>Canara Bank (கனரா வங்கி)</span></p>
      <p style={S.bankRow}>{isTa ? 'கிளை (Branch):' : 'Branch:'} <span style={S.bankVal}>Hanumantharayankottai (ஹனுமந்தராயன்கோட்டை)</span></p>
    </div>
  )
}

export default function PartnershipPage() {
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
          <p style={{ ...S.lbl, marginBottom: '16px' }}>{isTa ? 'பங்களிப்பு பக்கம்' : 'PARTNERSHIP PAGE'}</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(30px,5vw,48px)', fontWeight: 400, marginBottom: '12px', color: '#fff' }}>
            {isTa ? 'பங்களிப்பு, ஜெபம் & விதைப்பதற்கான வாய்ப்புகள்' : 'Partnership, Prayer & Sowing'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
            {isTa ? 'பேராயத்தின் தேவ ஊழியங்களை ஜெபத்தாலும், பங்களிப்பாலும் தாங்குங்கள்' : 'Join hands with ACI Diocese in prayer, contributions and ministry support'}
          </p>
        </div>
      </div>

      {/* PRAYER */}
      <section id="prayer" style={S.sec}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'பங்களிப்பு · 01' : 'Partnership · 01'}</p>
          <h2 style={S.h2}>{isTa ? 'ஜெபம் (Prayer)' : 'Prayer'}</h2>
          <div style={{ marginTop: '28px' }}>
            <ul style={S.ul}>
              <li>Praying daily for the Bishop and his visions by forming prayer groups.</li>
              <li>Praying for the prayer requests sent to the Diocese and the members of this Diocese and their ministries.</li>
              <li>Praying for our Nation and its blessings and the proclamation of the Gospel in our Nation.</li>
              <li>Praying for the people those who are sowing for the development of the Diocese and the supporters of our Diocese.</li>
            </ul>

            <div style={S.divider} />
            <p style={S.subH}>ஜெபம் (தமிழ் விளக்கம்):</p>
            <ul style={{ ...S.ul, color: 'rgba(255,255,255,0.85)' }}>
              <li>1. பேராயருக்காக, அவருடைய தரிசனங்களுக்காக ஜெபக்குழுக்களை ஏற்படுத்தி தினமும் ஜெபித்தல்.</li>
              <li>2. பேராயத்திற்கு வரும் ஜெப விண்ணப்பங்களுக்காகவும், பேராய அங்கத்தினர்களுக்காவும், அவர்களுடைய ஊழியங்களுக்காகவும் ஜெபித்தல்.</li>
              <li>3. தேசத்திற்காக அதின் ஆசீர்வாதத்திற்காக மற்றும் தேசமெங்கும் சுவிசேஷம் அறிவிப்பதற்காக ஜெபித்தல்.</li>
              <li>4. பேராய வளர்ச்சிக்காக விதைப்பவர்கள் மற்றும் தோள் கொடுப்பவர்களுக்காக ஜெபித்தல்.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PARTNER TESTIMONY */}
      <section id="partnertestimony" style={S.sec}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'பங்களிப்பு · 02' : 'Partnership · 02'}</p>
          <h2 style={S.h2}>{isTa ? 'பங்காளர் சாட்சி (Partner Testimony)' : 'Partner Testimony'}</h2>
          <div style={{ marginTop: '28px' }}>
            <p style={{ ...S.p, color: 'rgba(255,255,255,0.55)', fontSize: '13px', textAlign: 'right', marginBottom: '4px' }}>Good Shepherd Revival Churches</p>
            <p style={{ ...S.p, color: 'rgba(255,255,255,0.55)', fontSize: '13px', textAlign: 'right', marginBottom: '4px' }}>PARAVAI &amp; VILANGUDI</p>
            <p style={{ ...S.p, color: 'rgba(255,255,255,0.55)', fontSize: '13px', textAlign: 'right', marginBottom: '20px' }}>Madurai</p>

            <div style={S.quoteBlock}>
              <p>Glory to be the Holy name of our Lord, we are very proud to praise the Lord to stand as witness for his blessings to our churches through Apostolic Council of India Diocese. Since 2014, the day we affiliated with Apostolic Council of India Diocese, we are being blessed in different ways in our ministries and Churches. And also our Church is lifted up in the City of Madurai by believing, teaching and also strengthening through the real shepherding through word by the diocese.</p>
            </div>
            <div style={S.quoteBlock}>
              <p>God has blessed us with a new own land in the centre place of the city and also to construct a building by His grace, while we were worshipping in a temporary place. All these things happened because of we affiliated with the diocese. Our two Churches are blessed abundantly by Means of attending the meetings conducted in the diocese and hearing the real spiritual words from the Bishop and the Vice Chairman and believing their words and testimony.</p>
            </div>
            <div style={S.quoteBlock}>
              <p>Further I have to know discipline, punctuality, orderly conducting meetings and also operate the faith and teach about the blessings through the power in the word. Thus the diocese is the role model for the developing young churches affiliated with the diocese.</p>
            </div>
            <div style={S.quoteBlock}>
              <p>The Diocese is very helpful to our Church and our believers by its various activities like Children ministry training, Village ministry – VBS, Church visit to encourage the local churches affiliated with the diocese and also the valuable counselling of the Bishop.</p>
            </div>
            <div style={S.quoteBlock}>
              <p>Now we and our Churches are the witness and also identified by many people as precious ministry by getting the real spiritual food and believing the same through the vision of our diocese "Shepherding the shepherd". As we believe the Booklet named as "The Church the body of Christ" written by Rt.Rev.S.Johnson Durai, we received a wonderful building for our Church.</p>
            </div>
            <div style={S.quoteBlock}>
              <p><em>All these above blessings are possible to us; because of the affiliation with the vision of the diocese thus we are the witnesses.</em></p>
            </div>
            <p style={{ ...S.p, textAlign: 'center', marginTop: '12px', color: '#c8a96e', fontWeight: 700 }}>" Glory be to God."</p>
            <p style={{ ...S.p, fontWeight: 600, marginTop: '8px' }}>Rev. Helen Daniel M.Th., Ph.D.</p>
            <p style={S.byline}>Episcopal Pastor, Good Shepherd Revival Churches, Paravai and Vilangudi, Madurai.</p>

            <div style={S.divider} />
            <p style={S.subH}>பங்காளர் சாட்சி (தமிழ் முழு உரை):</p>
            <p style={{ ...S.p, textAlign: 'right', color: 'rgba(255,255,255,0.55)', fontSize: '13px', marginBottom: '4px' }}>நல்ல மேய்ப்பன் எழுப்புதல் சபைகள், பரவை - விளாங்குடி, மதுரை.</p>

            <p style={S.pTa}>
              கர்த்தருடைய பரிசுத்த நாமத்திற்கு மகிமை உண்டாவதாக. இந்த நாளிலும் நல்ல மேய்ப்பன் எழுப்புதல் சபைகளின் போதகர் (விளாங்குடி, மதுரை) என்ற அடிப்படையில்; அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தின் மூலமாக, எங்கள் சபைக்கு கர்த்தர் செய்த நன்மைகளின் ஆசீர்வாதத்திற்கு சாட்சியாக இருப்பதில் பெருமையுடன் கர்த்தரைத் துதிக்கிறேன்.
            </p>
            <p style={S.pTa}>
              கடந்த 2014 ஆம் ஆண்டிலே, தேவசித்தத்தின்படி பேராயத்திலே அங்கத்தினராக இணைந்த நாள் முதலாகவே; எங்கள் ஊழியமும், சபையும் வித்தியாசமான விதத்தில் ஆசீர்வதிக்கப்பட்டுக் கொண்டு வருகிறது. இப்பேராயத்தின் மூலமாக அளிக்கப்பட்டு வரும் மெய்யான மேய்ச்சலாகிய வார்த்தையினை விசுவாசிக்கவும் போதிக்கவும், அதிலே பெருகவும் பயிற்றுவிக்கப்பட்டு; அதின்படியே அநேக நன்மைகளுக்குப் பாத்திரமான சாட்சியாய் மதுரைப் பட்டணத்திலே எங்கள் சபை உயர்த்தப்பட்டுள்ளது.
            </p>
            <p style={S.pTa}>
              நிரந்தர இடமில்லாமல் தற்காலியமாய் இயங்கி வந்த சபைக்கு விசுவாசத்தின் மூலமாக, மாநகரின் முக்கியப் பகுதியில் கர்த்தர் ஆலயங்கட்டும்படியாக ஏழு சென்ட் இடத்தினைக் கொடுத்து, சொந்தமாக செணட்ரிங் கட்டிடத்தைக் கட்டி முடிக்க கிருபை செய்தார். இந்தப் பேராயத்தில் இணைந்ததின் வாயிலாகவே இந்த நல்ல மேய்ச்சலைக் கண்டடைய கர்த்தர் கிருபை செய்தார்.
            </p>
            <p style={S.pTa}>
              மட்டுமல்லாது, சரியான சபை ஒழுங்கினை கற்றுக் கொள்ளவும், நேரம் தவறாமை, கிரமமாய்-நேர்த்தியாய் வெற்றிகரமாய் கூட்டங்களை ஒழுங்கு செய்து நடத்துதல், வார்த்தையின் வல்லமையைப் போதிக்கவும், பிரயோகிக்கவும் இப்பேராயம் நல்ல வழிகாட்டியாய் இருப்பது, இதில் இணைந்துள்ள எம் போன்ற ஆரம்ப சபைகளுக்கு மிகுந்த வழிகாட்டுதலாய் இருக்கிறது.
            </p>
            <p style={{ ...S.pTa, textAlign: 'center', color: '#c8a96e', fontWeight: 700 }}>தேவனுக்கே மகிமை உண்டாவதாக!!!!</p>
            <p style={{ ...S.pTa, fontWeight: 600 }}>Rev. ஹெலன் டேனியேல், M.Th. Ph.D.</p>
            <p style={{ ...S.pTa, color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>நல்ல மேய்ப்பன் எழுப்புதல் சபைகள், பரவை - விளாங்குடி, மதுரை.</p>
          </div>
        </div>
      </section>

      {/* CONTRIBUTIONS */}
      <section id="contributions" style={S.sec}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'பங்களிப்பு · 03' : 'Partnership · 03'}</p>
          <h2 style={S.h2}>{isTa ? 'பங்களிப்பு (Contributions)' : 'Contributions'}</h2>
          <div style={{ marginTop: '28px' }}>
            <p style={S.p}>Voluntarily fixing an amount of money for the development of our Diocese as monthly contribution.</p>
            <p style={S.p}>Those who are contributing a promised amount in every month shall become a partner in this diocese.</p>
            <BankDetails isTa={isTa} />
            <div style={S.divider} />
            <p style={S.subH}>பங்களிப்பு (தமிழ் விளக்கம்):</p>
            <p style={S.pTa}>பேராயத்தின் வளர்ச்சிக்காக நிர்ணயித்துக்கொண்ட ஒரு தொகையை மாதந்தோறும் தன்னார்வமாக தங்களது பங்களிப்பை தொடர்ந்து செலுத்தவது. பொருத்தனையோடு கூட மாதந்தோறும் தனது பங்களிப்பை நல்குபவர்கள் பேராயத்தின் பங்காளர்கள் ஆகலாம்.</p>
          </div>
        </div>
      </section>

      {/* DONATION */}
      <section id="donation" style={S.sec}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'பங்களிப்பு · 04' : 'Partnership · 04'}</p>
          <h2 style={S.h2}>{isTa ? 'நன்கொடை (Donation)' : 'Donation'}</h2>
          <div style={{ marginTop: '28px' }}>
            <p style={S.p}>Those who are blessed by this Diocese can send their generous offering to the diocese to support the ministries of this diocese.</p>
            <BankDetails isTa={isTa} />
            <div style={S.divider} />
            <p style={S.subH}>நன்கொடை (தமிழ் விளக்கம்):</p>
            <p style={S.pTa}>இப்பேராயத்தின் மூலமாக தேவனிடமிருந்து ஆசீர்வாதங்களைப் பெற்றுக்கொண்டவர்கள் தங்களது உதாரத்துவமான காணிக்கைகளை நன்கொடையாக பேராயத்திற்கு அளித்து பேராயத்தின் மூலம் நடைபெறும் ஊழியங்களைத் தாங்கலாம்.</p>
          </div>
        </div>
      </section>

      {/* OPPORTUNITY TO SOW */}
      <section id="opportunitytosow" style={{ ...S.sec, borderBottom: 'none' }}>
        <div style={S.con}>
          <p style={S.lbl}>{isTa ? 'பங்களிப்பு · 05' : 'Partnership · 05'}</p>
          <h2 style={S.h2}>{isTa ? 'விதைப்பதற்கான வாய்ப்புகள் (Opportunity to Sow)' : 'Opportunity to Sow'}</h2>
          <div style={{ marginTop: '28px' }}>
            <div style={S.quoteBlock}>
              <p>As the Bible says in 2 Corinthians 9:9, 10 — "He has scattered abroad his gifts to the poor: his righteousness endures forever". Now he who supplies seed to the sower and bread for food will also supply and increase your store of seed and will enlarge the harvest of your righteousness. God bless you always.</p>
            </div>
            <p style={S.p}>Along with the vision of this Diocese God has given us many kinds of ministries to fulfill His purpose.</p>
            <p style={S.p}>Those who are not able to do these ministries directly can join with us by sending your offerings and do the same ministries.</p>
            <p style={S.p}>This is a great chance for everyone by God through this Diocese.</p>
            <div style={S.quoteBlock}>
              <p>"He who goes out weeping, carrying seed to sow, will return with songs of joy, carrying sheaves with him." — Psalm 126:6</p>
            </div>
            <BankDetails isTa={isTa} />
            <div style={S.divider} />
            <p style={S.subH}>விதைப்பதற்கான வாய்ப்புகள் (தமிழ் விளக்கம்):</p>
            <p style={S.pTa}>2 கொரி 9:9,10 — வாரியிறைத்தான், ஏழைகளுக்குக் கொடுத்தான்; அவனுடைய நீதி என்றென்றைக்கும் நிற்கும். விதைக்கிறவனுக்கு விதையும் புசிக்கிறவனுக்கு ஆகாரமும் கொடுக்கிறவர், உங்கள் விதையை பெருகப்பண்ணி, உங்கள் நீதியின் கனிகளை வர்த்திக்கப்பண்ணுவார்.</p>
            <p style={S.pTa}>இப்பேராயத்தின் தரிசனத்துடன் சேர்ந்து தேவன் தமது சித்தத்தை நிறைவேற்ற அநேக வகையான ஊழியங்களை நமக்கு அளித்திருக்கிறார். இந்த ஊழியங்களை நேரடியாக செய்யமுடியாதவர்கள் தங்கள் காணிக்கைகளை அனுப்பி அதே ஊழியங்களில் பங்கு பெறலாம்.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
