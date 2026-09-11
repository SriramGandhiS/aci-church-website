import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import './AboutSection.css'

const faithArticles = [
  {
    titleEn: 'THE HOLY SCRIPTURES',
    titleTa: 'பரிசுத்த வேதாகமம்',
    english: 'The Bible is the inspired Word of God, the product of holy men of old who spoke and wrote as they were moved by the Holy Spirit. The New Covenant, as recorded in the New Testament, we accept as our infallible guide in matters pertaining to conduct and doctrine. (2 Timothy 3:16; 1 Thessalonians 2:13; 2 Peter 1:21)',
    tamil: 'வேதபுத்தகம் முழுவதும் (பழைய மற்றும் புதிய ஏற்பாடுகள்) தேவனால் மனிதனுக்கு வெளிப்படுத்தப்பட்ட தெளிவான தவறாத பழுதற்ற கர்த்தருடைய வார்த்தை என்றும், இது ஒவ்வொரு கிறிஸ்தவனுடைய வாழ்விலும் மகா உன்னத அதிகாரம் கொண்ட தேவனுடைய கூற்று என்று விசுவாசிக்கிறோம். (ஆதார வசனம் : 2 தீமோத்தேயு : 3 : 16, 17; 1 தெச 2: 13; 2 பேதுரு 1: 21)',
  },
  {
    titleEn: 'THE GODHEAD (THE ONE TRUE GOD)',
    titleTa: 'ஒரே மெய்யான தேவன் (திரியேக தேவன்)',
    english: 'Our God is one, manifested in three persons — the Father, the Son, and the Holy Spirit, being co-equal, co-eternal, and of the same essence. (Philippians 2:6; Matthew 28:19; 1 John 5:7; 1 Timothy 3:16)',
    tamil: 'சகலத்தையும் படைத்தவரும், ஒப்பில்லாத நேர்த்தியும் நித்தியவாசியுமாகிய கர்த்தர் ஒருவரில் மூவராய் பிதா, குமாரன், பரிசுத்த ஆவியாய் இருக்கிறார் என்றும் விசுவாசிக்கிறோம். (ஆதார வசனம் : யோவான் : 17 : 3; 1 யோவான் : 5 : 7; பிலிப்பியர் 2:6; 1 தீமோத்தேயு 3:16)',
  },
  {
    titleEn: 'THE DEITY OF JESUS CHRIST',
    titleTa: 'இயேசு கிறிஸ்துவின் தெய்வத்தன்மை',
    english: 'Jesus Christ is God, existed before all things created, and is the only begotten Son of the Living God; that He was the Word, the Word who was with God, and the Word who was God. (John 1:1-2; Colossians 1:17) All things were made through and for Jesus Christ; that without Him nothing was made that was made. (John 1:3; Colossians 1:16) Who he became flesh through His miraculous conception by the Holy Spirit and His virgin birth. Hence, He is perfect Deity and true humanity united in one person forever. He lived a sinless life and voluntarily atoned, for the sins of men by dying on the cross as their substitute, thus satisfying divine justice and accomplishing salvation for all who trust in Him alone. He rose from the dead in the same body, though glorified, in which He lived and died. He ascended bodily into heaven and sat down at the right hand of God the Father, where He, the only mediator between God and man, continually makes intercession for His own. (Philippians 2:6,7; Romans 5:15; 1 Timothy 3:16; 1 Peter 2:24)',
    tamil: 'இயேசு கிறிஸ்து முழு தெய்வமும் முழு மனிதனுமானவர். பரிசுத்த ஆவியினால் கன்னி மரியாளிடத்தில் பிறந்து பாவமில்லாதவராய் வாழ்ந்தார். சுவிசேஷத்தை பிரசங்கித்தலும், அற்புதங்களும், அடையாளங்களும், குணமாக்குதலும் தம் புவி வாழ்வின் ஊழியத்தின் பங்காயிருந்து. நம்முடைய பாவங்களுக்காய் சிலுவையில் பலியானார். மரித்தோரிலிருந்து எழுந்து பரத்திற்கு ஏறி பிதாவின் வலது பாரிசத்தில் உட்கார்ந்து நமக்காக வேண்டுதல் செய்கிற பிரதான ஆசாரியிராயிருக்கிறார் என்றும் விசுவாசிக்கிறோம். (ஆதார வசனம்: பிலிப்பியர் : 2 : 6,7; ரோமர் : 5 : 15; 1 தீமோத்தேயு : 3 : 16; எபிரேயர் : 5 : 10; 1 பேதுரு : 2 : 24)',
  },
  {
    titleEn: 'MAN, HIS FALL, AND REDEMPTION',
    titleTa: 'மனிதனின் வீழ்ச்சி',
    english: 'Man is a created being, made in the likeness and image of God, but through Adam\'s transgression and fall, sin came into the world. "All have sinned and come short of the glory of God." "As it is written, there is none righteous, no, not one." Jesus Christ, the Son of God, was manifested to undo the work of the devil, and gave His life and shed His blood to redeem and restore man back to God. (Romans 5:12; Romans 3:23; Romans 3:10; 1 John 3:8)',
    tamil: 'தேவனுடைய சாயலில் படைக்கப்பட்ட மனிதன் மனமறிந்து பாவம் செய்து, தேவனை விட்டுப் பிரிந்து, ஆவிக்குரிய மரணத்தையும் சரீர மரணத்தையும் பெற்றுக் கொண்டான் என்றும் விசுவாசிக்கிறோம். (ஆதார வசனம் : ஆதியாகமம் : 2 : 17; 3 : 6, 7; ரோமர் 5:12)',
  },
  {
    titleEn: 'ETERNAL LIFE AND THE NEW BIRTH',
    titleTa: 'மனிதனின் இரட்சிப்பு (நித்திய ஜீவன் & மறுபிறப்பு)',
    english: 'Man\'s first step toward salvation is godly sorrow that worketh repentance, meaning a changing of mind and purpose and the turning toward God. The new birth is necessary to all men, and when fulfilled produces eternal life. Man is saved by the washing of regeneration and renewing of the Holy Ghost, and being justified by grace through faith in Christ Jesus. (2 Corinthians 7:10; 1 John 5:12; John 3:3-5; Romans 10:9-10)',
    tamil: 'கல்வாரி சிலுவையில் கர்த்தராகிய இயேசு கிறிஸ்து மனுக்குலத்தின் பாவ நிவிர்த்திக்காக சிந்தின இரத்தத்தை விசுவாசிப்பது மட்டுமே தேவனோடு ஒப்புரவாகும் ஒரே வழியாகும். இயேசு கிறிஸ்துவை தேவனுடைய குமாரன் என்றும், அவரை தேவன் மரித்தோரிலிருந்து எழுப்பினார் என்றும் இருதயத்தில் விசுவாசித்து, வாயினால் அறிக்கை செய்கிறவன் இரட்சிக்கப்படுவான். ஆவியின் நித்திய வாழ்விற்கு பரிசுத்த ஆவியினால் மறுபடியும் பிறப்பது கட்டாயம். அப்படி மறுபடியும் பிறந்தவன் பொல்லாங்கை விட்டு விலகி, தேவனுக்கேற்ற பரிசுத்த வாழ்வு வாழ்கிறான் என்றும் விசுவாசிக்கிறோம். (ஆதார வசனம் : 1 கொரிந்தியர் : 5 : 17, 18; கொலோசெயர் : 1 : 20; ரோமர் : 10 : 9, 5:12, 3: 10,23; 1 யோவான் 3: 8, 5: 12; 2 கொரி 7: 10; யோவான் 3 : 3-10)',
  },
  {
    titleEn: 'THE CHURCH (THE BRIDE OF CHRIST)',
    titleTa: 'சபையாகிய மணவாட்டி',
    english: 'We believe that the Church, the Body of Christ, is a spiritual organism made up of all believers of this present age. And God placed all things under his feet and appointed him to be head over everything for the Church, which is his body, the fullness of him who fills everything in every way. (1 Corinthians 12:12-14; 2 Corinthians 11:2; Ephesians 1:22-23, 5:25-27). Through the church, believers are to be taught to obey the Lord and to testify concerning their faith in Christ as Savior and to honor Him by holy living. We believe in the Great Commission as the primary mission of the Church. It is the obligation of all believers to witness, by word and life, to the truths of God’s Word. The gospel of the grace of God is to be preached to all the world. (Matthew 28:19-20; Acts 1:8; 2 Corinthians 5:19-20)',
    tamil: 'சபையாகிய மணவாட்டி என்பது மனந்திரும்பி பாவ மன்னிப்பின் நிச்சயத்தைப் பெற்று, மறுபடியும் பிறந்து, கிறிஸ்துவின் சரீரத்தில் இணைக்கப்பட்ட அனைவரின் சங்கமாகும். அதன் ஆண்டவரும் தலையுமாயிருக்கிற கிறிஸ்துவுடன் இணைக்கப்பட்டு அவரது பரிபூரண சித்தத்தை நிறைவேற்றும் என்று விசுவாசிக்கிறோம். (ஆதார வசனம் : எபேசியர் : 1 : 23; 5 : 23; 1 கொரிந்தியர் 12:12-14; 2 கொரிந்தியர் 11:2; எபேசியர் 5:25-27)',
  },
  {
    titleEn: 'THE ESTABLISHED LOCAL CHURCH',
    titleTa: 'நிறுவப்பட்ட திருச்சபை',
    english: 'The Church of God is the assembly of those sanctified in Christ Jesus and called to be saints. It is established for mutual edification in faith through love and good works, assembling in the presence of God under the guidance of the Holy Spirit, and for preaching the Gospel to all nations. (1 Corinthians 1:2; Hebrews 10:24-25; Ephesians 4:14-16)',
    tamil: 'தேவனுடைய சபையானது கிறிஸ்து இயேசுவுக்குள் பரிசுத்தமாக்கப்பட்டவர்களாயும், பரிசுத்தவான்களாகும்படி அழைக்கப்பட்டவர்களாயுமிருக்கிற ஜனங்களின் கூட்டமாகும். அன்புக்கும் நற்கிரியைகளுக்கும் பரிசுத்த ஆவியினால் ஏவப்பட்டபடி ஒருவரையொருவர் கவனித்து விசுவாசத்தில் பூரணராகும்படி பக்திவிருத்திக்காக தேவனுடைய சமூகத்தில் கூடி வருகிறதும், சுவிசேஷத்தை பிரசங்கிப்பதற்குமே திருச்சபை என்றும் விசுவாசிக்கிறோம். (ஆதார வசனம் : 1 கொரிந்தியர் : 1 : 2; எபிரேயர் : 10 : 24)',
  },
  {
    titleEn: 'PURPOSES OF THE LOCAL CHURCH',
    titleTa: 'ஸ்தல சபையின் நோக்கங்கள்',
    english: 'The objectives of the local church are to gather mankind to worship God until the coming of Christ, to be a gateway for proclaiming the Gospel to the world, to be a storehouse for all things pertaining to life and godliness, and to encourage and build up every member of the Body of Christ. (Ephesians 4:14-16; 3:10; Hebrews 10:25)',
    tamil: 'கிறிஸ்துவின் வருகை வரை மனிதர்கள் தேவனை ஆராதிக்கும்படி கூட்டிச்சேர்ப்பதும், உலகிற்கு சுவிசேஷத்தை அறிவிக்கும் வாசலாகவும், ஜீவனுக்கும் தேவபக்திக்குமேற்ற சகல காரியங்களின் பண்டகசாலையாகவும், கிறிஸ்துவின் சரீரத்தின் அவயவங்களை ஊக்கப்படுத்துவதுமே ஸ்தல சபையின் நோக்கங்கள் என்றும் விசுவாசிக்கிறோம். (ஆதார வசனம் : எபேசியர் : 4 : 14 - 16; 3 : 10; எபிரேயர் : 10 : 25)',
  },
  {
    titleEn: 'THE FIVEFOLD MINISTRY',
    titleTa: 'ஊழியம் (ஐவகை ஊழியம்)',
    english: 'For the edification of the Church and growth in faith, Christ Himself has appointed Apostles, Prophets, Evangelists, Pastors, and Teachers for the equipping of the saints and the work of the ministry. (Ephesians 4:11-13; 1 Corinthians 12:28)',
    tamil: 'பரிசுத்தவான்களின் சங்கமாகிய சபையின் பக்திவிருத்திக்காகவும், விசுவாசத்தில் வளரும்படியாகவும் கிறிஸ்து தாமே அப்போஸ்தலர்களையும், தீர்க்கதரிசிகளையும், சுவிசேஷகரையும், மேய்ப்பர்களையும், போதகர்களையும் ஏற்படுத்தியிருக்கிறார் என்றும் விசுவாசிக்கிறோம். (ஆதார வசனம் : எபேசியர் : 4 : 12, 13)',
  },
  {
    titleEn: 'THE HOLY SPIRIT AND HIS MINISTRIES',
    titleTa: 'பரிசுத்த ஆவியின் ஊழியங்கள்',
    english: 'We believe in the deity and personality of the Holy Spirit. His primary ministry is to glorify the Lord Jesus Christ. In these days, the Holy Spirit is sent to abide with believers, guide them, teach them, and empower them to live and serve God. From Pentecost until the return of Christ, He imparts spiritual gifts — word of wisdom, word of knowledge, faith, gifts of healing, working of miracles, prophecy, discerning of spirits, divers kinds of tongues, and interpretation of tongues — to all ministers and believers. (1 Corinthians 12:8-11; Acts 5:3-4; Romans 8:9; 1 Corinthians 12:12-14; Ephesians 1:13-14; 2:20; 4:7-12)',
    tamil: 'கர்த்தராகிய இயேசு கிறிஸ்துவை மகிமைப்படுத்துவதே பரிசுத்த ஆவியானவரின் பிரதான ஊழியமாம். இந்நாட்களில் விசுவாசிகள் தேவனுக்கேற்றபடி வாழவும், சேவிக்கவும், பெலன் பெறும்படி அவர்களிடத்தில் தங்கி, வழி நடத்தி, போதிக்கும் படியாக ஆவியானவர் அனுப்பப்பட்டிருக்கிறார். (1) ஞானத்தைப் போதிக்கும் வசனம், (2) அறிவை உணர்த்தும் வசனம், (3) விசுவாசம் (4) குணமாக்கும் வரங்கள், (5) அற்புதங்களை செய்யும் சக்தி, (6) தீர்க்கதரிசனம், (7) ஆவிகளை பகுத்தறிதல், (8) பற்பல பாஷைகளைப் பேசுதல், (9) பாஷைகளை வியாக்கியானம் பண்ணுதல் ஆகிய ஆவிக்குரிய வரங்களை பெந்தகோஸ்தே நாள் முதல் கிறிஸ்துவின் வருகை மட்டும் எல்லா தேவனுடைய ஊழியர்களுக்கும், விசுவாசிகளுக்கும் அளிக்கிறார் என்றும் விசுவாசிக்கிறோம். (ஆதார வசனம் : 1 கொரிந்தியர் : 12 : 8 – 11; அப் 5:3,4; ரோமர் 8:9; 1 கொரி 12:12-14; எபே 1:13,14; 2:20; 4:7-12)',
  },
  {
    titleEn: 'BAPTISM IN THE HOLY GHOST',
    titleTa: 'பரிசுத்த ஆவியின் ஞானஸ்நானம்',
    english: 'The baptism in the Holy Ghost and fire is a gift from God as promised by the Lord Jesus Christ to all believers and is received subsequent to and distinct from the new birth. This experience is accompanied by the Biblical evidence of speaking in other tongues as the Holy Spirit Himself gives utterance. (Matthew 3:11; John 14:16-17; Acts 1:8; Acts 2:38-39; Acts 19:1-7; Acts 2:4; Mark 1:8; 16:17)',
    tamil: 'புதுபிறப்பிற்கு பின் அதை தொடர்ந்து கேட்கிற விசுவாசிகள் யாவருக்கும் பரிசுத்த ஆவியின் ஞானஸ்நான அனுபவம் கொடுக்கப்படுகிறது. பரிசுத்த ஆவியினால் நிரப்பப்பட்ட இந்த அனுபவத்தின் வெளி அடையாளமாய் தேவன் அளிக்கிற அந்நிய பாஷைகளைப் பேசுதல் ஒவ்வொரு விசுவாசியும் பெற்றுக் கொள்ளலாம் என்றும் விசுவாசிக்கிறோம். (ஆதார வசனம் : மாற்கு : 1 : 8; 16 : 17; மத்தேயு 3:11; யோவான் 14:16-17; அப்போஸ்தலர் 1:8; 2:38-39; 19:1-7; 2:4)',
  },
  {
    titleEn: 'CHURCH ORDINANCES (WATER BAPTISM & LORD\'S SUPPER)',
    titleTa: 'சபையின் சடங்குகள் (ஞானஸ்நானம் & திருவிருந்து)',
    english: 'Baptism in water is by immersion and is a direct commandment of our Lord, demonstrating our identification with Christ in His death, burial, and resurrection, though not a means of salvation in itself. (Matthew 28:19; Romans 6:4; Colossians 2:12; Acts 8:36-39). The Lord\'s Supper is a memorial of Jesus\' suffering, death, resurrection, high priestly ministry, and second coming, partaking of the bread and wine as symbols of sharing in His divine nature until He comes. (1 Corinthians 11:23-26; 2 Peter 1:4; John 6:56)',
    tamil: 'கிறிஸ்துவின் மரணம், அடக்கம் பண்ணப்படுதல், உயிர்த்தெழுதல் ஆகியவற்றை உள்ளாக ஏற்றுக் கொண்டதை தண்ணீரில் மூழ்கி ஞானஸ்நானத்தினால் வெளிப்படுத்துகிறோம். ஆயினும் இது இரட்சிப்பை பெற்றுக்கொள்ளும் உபாயம் அல்ல என்று விசுவாசிக்கிறோம். (மத் 28:19; ரோமர் 6:4; அப் 2: 4; 8:36-39; கொலோசெயர் 2:12). கிறிஸ்துவின் பாடுகள், மரணம், உயிர்த்தெழுதல், ஆசாரிய ஊழியம் மற்றும் இரண்டாம் வருகை ஆகியவற்றை நினைவுகூர்ந்து திருவிருந்தில் பங்கு கொள்கிறோம். அப்பமும் இரசமுமாகிய பந்தியின் கூறுகள் கிறிஸ்துவுடனே கூட அவரது தெய்வீக சுபாவத்தில் பங்கு கொள்வதின் அடையாளமாய் இருக்கிறது என்றும் விசுவாசிக்கிறோம். (ஆதார வசனம்: கொலோசெயர்: 2 : 12; யோவான் : 6 : 56; 2 பேதுரு 1:4; 1 கொரிந்தியர் : 11 : 25, 26)',
  },
  {
    titleEn: 'PROSPERITY IN SPIRIT, SOUL, AND BODY (SANCTIFICATION & DIVINE HEALING)',
    titleTa: 'ஆவி, ஆத்துமா, சரீரத்தில் செழிப்பு',
    english: 'Without faith it is impossible to please God. Atonement has been made so that people receive salvation, and health in soul and body. Therefore we are redeemed from curses including poverty, sickness, and death. Those who have faith in God\'s Word will experience prosperity and divine health in its light. (1 Thessalonians 5:23; 1 Corinthians 1:30; 2 Corinthians 3:18; Philippians 3:12-14; 2 Peter 3:18; Hebrews 12:14)',
    tamil: 'விசுவாசமில்லாமல் தேவனுக்குப் பிரியமாயிருப்பது கூடாத காரியம். ஜனங்கள் இரட்சிப்பையும், ஆத்துமாவிலும், சரீரத்திலும், சுகத்தை பெறும்படி பரிகாரம் செலுத்தப்பட்டிருக்கிறது. எனவே நாம் தரித்திரம், வியாதி, மரணம் முதலான சாபங்களிலிருந்து மீட்கப்பட்டிருக்கிறோம். தேவனுடைய வார்த்தையில் விசுவாசம் கொண்டவர்கள் அதின் வெளிச்சத்தில் செழிப்பையும், சுகத்தையும் அனுபவிப்பார்கள் என்றும் விசுவாசிக்கிறோம். (ஆதார வசனம் : 1 தெசலோனிக்கேயர் : 5 : 23; 1 கொரி 1:30; 2 கொரி 3: 18; பிலி 3:12-14; 2 பேதுரு 3:18)',
  },
  {
    titleEn: 'THE CHURCH IN THE SECRET COMING OF CHRIST (THE RAPTURE)',
    titleTa: 'கிறிஸ்துவின் இரகசிய வருகையில் சபை',
    english: 'We believe that before the millennial reign of our Lord Jesus Christ, Jesus Christ will come secretly with glory to rapture His saints. All who have fallen asleep in Christ will rise first, and we who are alive will be transformed to meet Him in the air, delivering us from tribulations and establishing us in the presence of God for eternal life. (1 Thessalonians 4:16-17; Zechariah 14:4-11; Revelation 19:20; 20:11-15; Titus 2:13)',
    tamil: 'நம் ஆண்டவர் இயேசு கிறிஸ்துவின் ஆயிரம் வருட அரசாட்சிக்கு முன் இயேசுகிறிஸ்து மகிமையுடன் ரகசியமாய் வருவாரென்று விசுவாசிக்கிறோம். அப்பொழுது கிறிஸ்துவுக்குள் நித்திரையடைந்த யாவரும் உயிர்த்தெழுவார்கள். உயிரோடிருக்கும் நாமும் மகிமையடைந்து அவரை எதிர்கொள்ளுவோம் என்றும் இந்நிகழ்வு நம்மை உபத்திரவங்களிலிருந்து விடுதலையாக்கி, தேவனுடைய சமூகத்தில் நித்தியவாழ்வுக்கென்று உயிர்த்தெழுந்து ஆசீர்வாதமாய் நிற்கச்செய்யும் என்றும் விசுவாசிக்கிறோம். (ஆதார வசனம் : 1 தெசலோனிக்கேயர் : 4 : 16, 17; சகரியா 14:4-11; வெளி 19:20; 20:11-15)',
  },
  {
    titleEn: 'THE MILLENNIAL REIGN OF CHRIST',
    titleTa: 'கிறிஸ்துவின் ஆயிரம் வருட அரசாட்சி',
    english: 'We believe in the second coming of Christ and His one thousand year reign upon the earth together with His saints. (Revelation 20:4; Zechariah 14:5; Matthew 24:30)',
    tamil: 'கிறிஸ்துவின் இரண்டாம் வருகையையும், பரிசுத்தவான்களுடனே கூட அவரது ஆயிரம் வருட அரசாட்சியையும் விசுவாசிக்கிறோம். (ஆதார வசனம் : வெளிப்படுத்தல் : 20 : 4)',
  },
  {
    titleEn: 'THE FINAL JUDGMENT & THE LAKE OF FIRE',
    titleTa: 'இறுதி நியாயத்தீர்ப்பு, அக்கினிக் கடல்',
    english: 'On the day of the final judgment, all the dead will be raised and judged according to their works. Whosoever is not found written in the Lamb\'s book of life will be cast into the lake burning with fire and brimstone together with the devil, his angels, the beast, and the false prophet to endure eternal punishment. This is the second death. (Revelation 19:20; 20:10, 14, 15; 21:8; Matthew 25:46; Mark 9:43-48; Hebrews 9:27)',
    tamil: 'இறுதி நியாயத்தீர்ப்பின் நாளிலே மரித்தோர் அனைவரும் எழுப்பப்பட்டு, தங்கள் தங்கள் கிரியைகளின்படியே நியாயத்தீர்ப்படைவார்கள். ஆட்டுக்குட்டியானவரின் ஜீவ புஸ்தகத்தில் பேரெழுதப்படாதவர்கள் யாவரும், பிசாசோடும், அவன் தூதர்களோடும், மிருகத்தோடும், கள்ளத் தீர்க்கதரிசியோடும் எரிகிற அக்கினியும் கந்தகமும் நிறைந்த கடலில் நித்திய தண்டனைக்குள்ளாவார்கள். இது இரண்டாம் மரணம் என்றும் விசுவாசிக்கிறோம். (ஆதார வசனம் : வெளிப்படுத்தல் : 19 : 20; 20 : 10, 14, 15; 21 : 8; மத்தே 25 : 46; மாற்கு 9 : 43-48; எபிரே 9:27)',
  },
  {
    titleEn: 'THE NEW HEAVENS AND THE NEW EARTH',
    titleTa: 'புதிய வானம், புதிய பூமி',
    english: 'This heaven and earth will pass away. A new heaven and a new earth will be created, wherein all who are saved will dwell eternally. (Revelation 2:2; 21:1-7; 2 Peter 3:13)',
    tamil: 'இந்த வானமும் பூமியும் ஒழிந்து போகும். புதிய வானமும் புதிய பூமியும் சிருஷ்டிக்கப்படும். இரட்சிக்கப்பட்டவர்கள் எல்லோரும் நித்தியமாய் அதில் வாழுவார்கள் என்றும் விசுவாசிக்கிறோம். (ஆதார வசனம் : வெளிப்படுத்தல் : 2: 2; 21 : 1 – 7; 2 பேதுரு 3:13)',
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
              {isTa ? 'பேராயர் பேரருட்திரு ச. ஜான்சன் துரை' : 'The Most Rev. S. Johnson Durai'}
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
            <img src="/archbishop_new.jpg" alt="The Most Rev. S. Johnson Durai" className="about-photo" />
            <div style={{ padding: '12px', background: 'var(--color-near-black)', color: 'var(--color-white)', fontSize: '13px', textAlign: 'center' }}>
              <strong>{isTa ? 'பேராயர் பேரருட்திரு ச. ஜான்சன் துரை' : 'The Most Rev. S. Johnson Durai'}</strong> — {isTa ? 'ஸ்தாபகர் & தலைமைப் பேராயர்' : 'Founder & Archbishop'}
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
            {isTa ? 'ஏசிஐ பேராயத்தின் விசுவாச சத்திய பிரமாணங்கள்' : 'Doctrinal Statements & Pillars of ACI Diocese'}
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
            {isTa ? 'பத்து அர்ப்பணிக்கப்பட்ட அறங்காவலர்கள் மற்றும் ஏழு மாவட்ட பேராயர்கள் & ஆவிக்குரிய மேற்பார்வையாளர்கள்' : 'Ten Committed Trustees and Seven District Bishops and Spiritual Overseers'}
          </h3>
          <p className="t-body" style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--color-text-mid)' }}>
            {isTa
              ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தின் ஆவிக்குரிய, நிர்வாக, சட்ட மற்றும் மிஷனெரி பணிகளை வழிநடத்தும் பத்து அர்ப்பணிக்கப்பட்ட அறங்காவலர்கள் மற்றும் ஏழு மாவட்ட பேராயர்கள் & ஆவிக்குரிய மேற்பார்வையாளர்களைக் கொண்டு இக்குழு இயங்குகிறது.'
              : 'The Diocesan Board comprises ten committed trustees and seven District Bishops and Spiritual Overseers who guide the spiritual, administrative, legal, and missionary functions of the Apostolic Council of India Diocese across Tamil Nadu and India.'}
          </p>
        </div>

      </div>
    </section>
  )
}
