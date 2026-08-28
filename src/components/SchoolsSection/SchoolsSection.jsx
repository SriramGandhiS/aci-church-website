import { useEffect, useRef } from 'react'
import './SchoolsSection.css'

const synodMembersList = [
  {
    sno: '1',
    tnNo: 'TN 0001',
    name: 'The Most Rev. S. Johnson Durai',
    role: 'Managing Trustee & Archbishop',
    email: 'rev.johnsondurai@gmail.com',
    ministry: 'Power In The Word Church',
    exp: '25 Years',
    ordained: '11/06/2015',
  },
  {
    sno: '2',
    tnNo: 'TN 0005',
    name: 'Rev. Dr. R. John Durai',
    role: 'Trustee & Prophet',
    email: 'rjdwonder@gmail.com',
    ministry: 'Wonder Word Ministry',
    exp: '29 Years',
    ordained: '11/06/2015',
  },
  {
    sno: '3',
    tnNo: 'TN 0146',
    name: 'Rev. J.A.D. Samuel',
    role: 'Trustee & Evangelist',
    email: 'jadsamuel@gmail.com',
    ministry: 'Petra Service Mission',
    exp: '19 Years',
    ordained: '11/06/2015',
  },
  {
    sno: '4',
    tnNo: 'TN 0466',
    name: 'Rev. D. Antony Raj',
    role: 'Trustee & Pastor',
    email: 'd_antoniraj@yahoo.com',
    ministry: 'Living Redeemer Church',
    exp: '9 Years',
    ordained: '12/04/2016',
  },
  {
    sno: '5',
    tnNo: 'TN 0244',
    name: 'Rev. John Samuel',
    role: 'Trustee & Pastor',
    email: 'john.samuelaft@gmail.com',
    ministry: 'AFT Ministry',
    exp: '15+ Years',
    ordained: '11/06/2015',
  },
]

export default function SchoolsSection() {
  const sectionRef = useRef(null)

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
      { threshold: 0.1 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="synod"
      className="schools-section section-pad"
      aria-label="The Synod of ACI Diocese"
    >
      <div className="container">

        {/* 1. About Synod */}
        <div id="about-synod" className="reveal" style={{ marginBottom: '48px' }}>
          <p className="sch-label t-label">THE SYNOD (சபை ஆலோசனை மன்றம்)</p>
          <h2 className="sch-headline" style={{ marginBottom: '20px' }}>
            Governance, Spiritual Guidance &amp; Pastoral Welfare
          </h2>
          <div style={{ background: 'var(--color-white)', padding: '28px', border: '1px solid var(--color-divider-light)' }}>
            <p className="t-body" style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--color-text-dark)', marginBottom: '16px' }}>
              The Synod comprises all the Trustees of the Board and ordained Apostles, Prophets, Evangelists, Pastors, and Teachers. They look after the spiritual needs, doctrine, and welfare of the Apostolic Council of India Diocese.
            </p>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6', color: 'var(--color-text-mid)' }}>
              <li><strong>Chairman:</strong> The Most Reverend Archbishop S. Johnson Durai, Author of the Trust, serves as Chairman for life.</li>
              <li><strong>Appointment:</strong> Synod members are nominated in consultation with the Board of Trustees.</li>
              <li><strong>Composition:</strong> The Synod consists of between 9 and 20 dedicated ordained leaders.</li>
            </ul>
          </div>
        </div>

        {/* 2. Synod Functions & Publications */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          
          <div id="synod-functions" className="reveal" style={{ background: 'var(--color-white)', padding: '24px', border: '1px solid var(--color-divider-light)' }}>
            <p className="t-label" style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>FUNCTIONS (செயல்பாடுகள்)</p>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Synod Functions</h3>
            <ul style={{ listStyle: 'square', paddingLeft: '18px', fontSize: '14px', lineHeight: '1.6', color: 'var(--color-text-dark)' }}>
              <li>Meeting bi-monthly (once every 2 months) to research scripture truths.</li>
              <li>Documenting right theological doctrine and pastoral guidelines.</li>
            </ul>
          </div>

          <div id="synod-publications" className="reveal" style={{ background: 'var(--color-white)', padding: '24px', border: '1px solid var(--color-divider-light)' }}>
            <p className="t-label" style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>PUBLICATIONS (வெளியீடுகள்)</p>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Synod Publications</h3>
            <ul style={{ listStyle: 'square', paddingLeft: '18px', fontSize: '14px', lineHeight: '1.6', color: 'var(--color-text-dark)' }}>
              <li>Publishing documented research on the Diocesan Website for public benefit.</li>
              <li>Publishing theological books and manuals for Bible Schools and training institutes.</li>
            </ul>
          </div>

        </div>

        {/* 3. Synod Members Table */}
        <div id="synod-members" className="reveal">
          <p className="sch-label t-label">SYNOD MEMBERS &amp; TRUSTEES</p>
          <h2 className="sch-headline" style={{ marginBottom: '24px' }}>
            Board of Trustees &amp; Council Leaders
          </h2>
          <div style={{ overflowX: 'auto', background: 'var(--color-white)', border: '1px solid var(--color-divider-light)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'var(--color-near-black)', color: 'var(--color-white)', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>
                  <th style={{ padding: '14px 16px' }}>S.No</th>
                  <th style={{ padding: '14px 16px' }}>TN No</th>
                  <th style={{ padding: '14px 16px' }}>Name &amp; Role</th>
                  <th style={{ padding: '14px 16px' }}>Ministry &amp; Experience</th>
                  <th style={{ padding: '14px 16px' }}>Email Contact</th>
                </tr>
              </thead>
              <tbody>
                {synodMembersList.map((m, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-divider-light)', background: idx % 2 === 0 ? 'var(--color-white)' : 'var(--color-soft-gray)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{m.sno}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)', fontSize: '13px' }}>{m.tnNo}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ display: 'block', color: 'var(--color-text-dark)' }}>{m.name}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{m.role}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'block', color: 'var(--color-text-dark)' }}>{m.ministry}</span>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Exp: {m.exp}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <a href={`mailto:${m.email}`} style={{ color: 'var(--color-black)', textDecoration: 'none', fontWeight: 500 }}>
                        {m.email}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  )
}
