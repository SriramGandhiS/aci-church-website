/* ============================================================
   ACI Diocese Navigation Data — Multi-Page Routing
   All href anchors match the actual section id="" on each page
   ============================================================ */

export const navItems = [
  {
    label: 'Home',
    hasDropdown: false,
    href: '/',
  },
  {
    label: 'About Us',
    hasDropdown: true,
    href: '/about',
    items: [
      { label: 'ABOUT DIOCESE', href: '/about#about-diocese' },
      { label: 'FOUNDER', href: '/about#founder' },
      { label: 'VISION & MISSION', href: '/about#vision-mission' },
      { label: 'STATEMENT OF FAITH', href: '/about#faith-statement' },
      { label: 'ABOUT BOARD', href: '/about#about-board' },
    ],
  },
  {
    label: 'Diocese',
    hasDropdown: true,
    href: '/diocese',
    items: [
      { label: 'ACI TIRUPATTUR DIOCESE', href: '/diocese#tirupattur' },
      { label: 'ACI CHENGALPATTU DIOCESE', href: '/diocese#chengalpattu' },
      { label: 'ACI VILLUPURAM DIOCESE', href: '/diocese#villupuram' },
      { label: 'ACI MADURAI DIOCESE', href: '/diocese#madurai' },
      { label: 'ACI TRICHY DIOCESE', href: '/diocese#trichy' },
      { label: 'ACI VIRUDHUNAGAR DIOCESE', href: '/diocese#virudhunagar' },
      { label: 'ACI KANNIYAKUMARI DIOCESE', href: '/diocese#kanniyakumari' },
    ],
  },
  {
    label: 'Activities',
    hasDropdown: true,
    href: '/activities',
    items: [
      { label: 'ORDINATION', href: '/activities#ordination' },
      { label: 'WORD SHARING MEET', href: '/activities#wordsharingmeet' },
      { label: 'ZONAL MEET', href: '/activities#zonalmeet' },
      { label: 'CHURCH VISIT', href: '/activities#churchvisit' },
      { label: 'CHILDREN MINISTRY', href: '/activities#childrenministry' },
      { label: 'YOUTH MINISTRY', href: '/activities#youthministry' },
      { label: 'OUTREACH', href: '/activities#outreach' },
    ],
  },
  {
    label: 'Partnership',
    hasDropdown: true,
    href: '/partnership',
    items: [
      { label: 'PRAYER', href: '/partnership#prayer' },
      { label: 'PARTNER TESTIMONY', href: '/partnership#partnertestimony' },
      { label: 'CONTRIBUTIONS', href: '/partnership#contributions' },
      { label: 'DONATION', href: '/partnership#donation' },
      { label: 'OPPORTUNITY TO SOW', href: '/partnership#opportunitytosow' },
    ],
  },
  {
    label: 'Synod',
    hasDropdown: true,
    href: '/synod',
    items: [
      { label: 'ABOUT SYNOD', href: '/synod#aboutsynod' },
      { label: 'SYNOD FUNCTIONS', href: '/synod#synodfunctions' },
      { label: 'SYNOD PUBLICATIONS', href: '/synod#synodpublications' },
      { label: 'SYNOD ACADEMIC COUNCIL', href: '/synod#synodacademiccouncil' },
      { label: 'SYNOD GENERAL COUNCIL', href: '/synod#synodgeneralcouncil' },
    ],
  },
  {
    label: 'Directory',
    hasDropdown: false,
    href: '/directory',
  },
  {
    label: 'Media',
    hasDropdown: true,
    href: '/media',
    items: [
      { label: 'MAGAZINES', href: '/media#magazines' },
      { label: 'AUDIO', href: '/media#audio' },
      { label: 'VIDEO', href: '/media#video' },
      { label: 'LITERATURE', href: '/media#literature' },
    ],
  },
  {
    label: 'Gallery',
    hasDropdown: true,
    href: '/gallery',
    items: [
      { label: 'ALL ALBUMS', href: '/gallery' },
      { label: 'ORDINATION', href: '/gallery?cat=Ordination' },
      { label: 'WORD SHARING MEET', href: '/gallery?cat=Word Sharing Meet' },
      { label: 'ZONAL MEET', href: '/gallery?cat=Zonal Meet' },
      { label: 'CHURCH VISIT', href: '/gallery?cat=Church Visit' },
      { label: 'CHILDREN MINISTRY', href: '/gallery?cat=Children Ministry' },
      { label: 'YOUTH MINISTRY', href: '/gallery?cat=Youth Ministry' },
      { label: 'SYNOD', href: '/gallery?cat=Synod' },
    ],
  },
  {
    label: 'Contact Us',
    hasDropdown: false,
    href: '/contact',
  },
]
