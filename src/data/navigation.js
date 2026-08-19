/* ============================================================
   ACI Diocese Navigation Data — Multi-Page Routing
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
    label: 'Activities',
    hasDropdown: true,
    href: '/activities',
    items: [
      { label: 'ORDINATION', href: '/activities#ordination' },
      { label: 'WORD SHARING MEET', href: '/activities#word-sharing' },
      { label: 'ZONAL MEET', href: '/activities#zonal-meet' },
      { label: 'CHURCH VISIT', href: '/activities#church-visit' },
      { label: 'CHILDREN MINISTRY', href: '/activities#children-ministry' },
      { label: 'YOUTH MINISTRY', href: '/activities#youth-ministry' },
      { label: 'OUTREACH', href: '/activities#outreach' },
    ],
  },
  {
    label: 'Partnership',
    hasDropdown: true,
    href: '/partnership',
    items: [
      { label: 'PRAYER', href: '/partnership#prayer' },
      { label: 'PARTNER TESTIMONY', href: '/partnership#testimonies' },
      { label: 'CONTRIBUTIONS', href: '/partnership#contributions' },
      { label: 'DONATION', href: '/partnership#donation' },
      { label: 'OPPORTUNITY TO SOW', href: '/partnership#sow' },
    ],
  },
  {
    label: 'Synod',
    hasDropdown: true,
    href: '/synod',
    items: [
      { label: 'ABOUT SYNOD', href: '/synod#about-synod' },
      { label: 'SYNOD FUNCTIONS', href: '/synod#synod-functions' },
      { label: 'SYNOD PUBLICATIONS', href: '/synod#synod-publications' },
      { label: 'SYNOD MEMBERS', href: '/synod#synod-members' },
    ],
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
    hasDropdown: false,
    href: '/gallery',
  },
  {
    label: 'Contact Us',
    hasDropdown: false,
    href: '/contact',
  },
]
