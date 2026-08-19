/* ============================================================
   ACI Diocese Navigation Data — Ported from acidiocese.org
   ============================================================ */

export const navItems = [
  {
    label: 'Home',
    hasDropdown: false,
    href: '#',
  },
  {
    label: 'About Us',
    hasDropdown: true,
    items: [
      { label: 'ABOUT DIOCESE', href: '#about-diocese' },
      { label: 'FOUNDER', href: '#founder' },
      { label: 'VISION & MISSION', href: '#vision-mission' },
      { label: 'STATEMENT OF FAITH', href: '#faith-statement' },
      { label: 'ABOUT BOARD', href: '#about-board' },
    ],
  },
  {
    label: 'Activities',
    hasDropdown: true,
    items: [
      { label: 'ORDINATION', href: '#ordination' },
      { label: 'WORD SHARING MEET', href: '#word-sharing' },
      { label: 'ZONAL MEET', href: '#zonal-meet' },
      { label: 'CHURCH VISIT', href: '#church-visit' },
      { label: 'CHILDREN MINISTRY', href: '#children-ministry' },
      { label: 'YOUTH MINISTRY', href: '#youth-ministry' },
      { label: 'OUTREACH', href: '#outreach' },
    ],
  },
  {
    label: 'Partnership',
    hasDropdown: true,
    items: [
      { label: 'PRAYER', href: '#prayer-partnership' },
      { label: 'PARTNER TESTIMONY', href: '#testimonies' },
      { label: 'CONTRIBUTIONS', href: '#contributions' },
      { label: 'DONATION', href: '#donation' },
      { label: 'OPPORTUNITY TO SOW', href: '#give' },
    ],
  },
  {
    label: 'Synod',
    hasDropdown: true,
    items: [
      { label: 'ABOUT SYNOD', href: '#about-synod' },
      { label: 'SYNOD FUNCTIONS', href: '#synod-functions' },
      { label: 'SYNOD PUBLICATIONS', href: '#synod-publications' },
      { label: 'SYNOD MEMBERS', href: '#synod-members' },
    ],
  },
  {
    label: 'Media',
    hasDropdown: true,
    items: [
      { label: 'MAGAZINES', href: '#magazines' },
      { label: 'AUDIO', href: '#audio' },
      { label: 'VIDEO', href: '#video' },
      { label: 'LITERATURE', href: '#literature' },
    ],
  },
  {
    label: 'Gallery',
    hasDropdown: false,
    href: '#gallery',
  },
  {
    label: 'Contact Us',
    hasDropdown: false,
    href: '#contact',
  },
]
