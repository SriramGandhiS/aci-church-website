import { useState, useEffect, useRef } from 'react'
import './EncounterSection.css'

export default function EncounterSection() {
  const sectionRef = useRef(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) {
      alert('Please fill in your Name, Phone Number, and Prayer Request message.')
      return
    }
    console.info('[ACI Diocese] Prayer Request Submitted:', form)
    setSubmitted(true)
  }

  return (
    <section
      ref={sectionRef}
      id="encounter"
      className="encounter-section section-pad"
      aria-label="Send us your Prayer Requests"
    >
      <div className="container">
        <div className="encounter-inner" style={{ maxWidth: '840px' }}>

          {/* Heading */}
          <p className="t-label reveal" style={{ color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            PRAYER &amp; FELLOWSHIP
          </p>

          <h2 className="encounter-title t-section-serif reveal">
            Send us your Prayer Requests
          </h2>

          {/* Subtext */}
          <p className="encounter-sub t-body reveal reveal-delay-1" style={{ marginBottom: '32px' }}>
            Our bishops, pastors, and prayer team at ACI Diocese are here to stand with you in faith.<br />
            Share your prayer requests or connect with central diocesan guidance.
          </p>

          {/* Form / Actions */}
          {submitted ? (
            <div className="reveal" style={{ padding: '32px', background: 'var(--color-white)', borderLeft: '4px solid var(--color-black)', textAlign: 'left' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '8px' }}>
                Thank you for sharing your prayer request.
              </h3>
              <p className="t-body" style={{ color: 'var(--color-text-mid)' }}>
                Our diocesan prayer ministry team will intercede for you and contact you soon. May God bless you.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="reveal reveal-delay-2" style={{ textAlign: 'left', background: 'var(--color-white)', padding: '32px', border: '1px solid var(--color-divider-light)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label htmlFor="pr-name" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Your Name *</label>
                  <input
                    id="pr-name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ccc', fontSize: '14px', borderRadius: 0 }}
                  />
                </div>
                <div>
                  <label htmlFor="pr-phone" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Your Phone No. *</label>
                  <input
                    id="pr-phone"
                    type="tel"
                    required
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ccc', fontSize: '14px', borderRadius: 0 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label htmlFor="pr-email" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Your Email</label>
                  <input
                    id="pr-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ccc', fontSize: '14px', borderRadius: 0 }}
                  />
                </div>
                <div>
                  <label htmlFor="pr-address" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Your Address</label>
                  <input
                    id="pr-address"
                    type="text"
                    placeholder="Enter your city/address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ccc', fontSize: '14px', borderRadius: 0 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="pr-message" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Your Prayer Request *</label>
                <textarea
                  id="pr-message"
                  required
                  rows={4}
                  placeholder="Share your prayer request here..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ccc', fontSize: '14px', borderRadius: 0 }}
                />
              </div>

              <button type="submit" className="btn btn-dark" style={{ width: '100%', justifyContent: 'center' }}>
                Submit Prayer Request <span className="arrow">→</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </section>
  )
}
