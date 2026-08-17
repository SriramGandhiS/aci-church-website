import { useState, useRef, useEffect } from 'react'
import './Newsletter.css'

export default function Newsletter() {
  const sectionRef = useRef(null)
  const [form, setForm]       = useState({ firstName: '', lastName: '', email: '' })
  const [errors, setErrors]   = useState({})
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

  const validate = () => {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required'
    if (!form.lastName.trim())  errs.lastName  = 'Last name is required'
    if (!form.email.trim())     errs.email     = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Please enter a valid email'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    console.info('[ACI Newsletter] Subscribe:', form)
    setSubmitted(true)
  }

  return (
    <section
      ref={sectionRef}
      id="give"
      className="newsletter-section section-pad"
      aria-label="Partnership, Giving and Newsletter"
    >
      <div className="container">
        <div className="nl-inner">

          {/* Giving & Sowing Section */}
          <div className="reveal" style={{ marginBottom: '56px', textAlign: 'center' }}>
            <p className="nl-label t-label">PARTNERSHIP &amp; CONTRIBUTIONS</p>
            <h2 className="nl-heading" style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '16px' }}>
              Opportunity to Sow &amp; Support Ministries
            </h2>
            <p className="nl-sub t-body" style={{ maxWidth: '720px', margin: '0 auto 32px auto' }}>
              &ldquo;Now He who supplies seed to the sower and bread for food will also supply and increase your store of seed and will enlarge the harvest of your righteousness.&rdquo; — 2 Corinthians 9:10
            </p>

            {/* Bank details card */}
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '28px', border: '1px solid rgba(255,255,255,0.15)', display: 'inline-block', textAlign: 'left', maxWidth: '540px', width: '100%' }}>
              <h3 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', color: 'var(--color-white)' }}>
                ACI Diocese Bank Details:
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '15px', color: 'rgba(255,255,255,0.9)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Account Name:</strong> Apostolic Council of India Diocese</li>
                <li><strong>Account No.:</strong> <span style={{ color: '#FFD700', fontWeight: 600 }}>1567201000059</span></li>
                <li><strong>IFSC Code:</strong> CNRB0001567</li>
                <li><strong>Bank Name:</strong> Canara Bank</li>
                <li><strong>Branch:</strong> Hanumantharayankottai, Dindigul District</li>
              </ul>
            </div>
          </div>

          <div className="divider divider-dark" style={{ marginBottom: '48px', opacity: 0.2 }} />

          {/* Header */}
          <p className="nl-label t-label reveal">Email Updates</p>
          <h2 className="nl-heading reveal reveal-delay-1">Stay Connected With ACI Diocese</h2>
          <p className="nl-sub t-body reveal reveal-delay-2">
            Receive pastoral messages, event invitations, and magazine publications directly in your inbox.
          </p>

          {/* Form */}
          {submitted ? (
            <div className="nl-success reveal" role="alert">
              <p className="nl-success-text">
                Thank you for subscribing. You will receive official ACI Diocese updates soon.
              </p>
            </div>
          ) : (
            <form
              className="nl-form reveal reveal-delay-3"
              onSubmit={handleSubmit}
              noValidate
              aria-label="Newsletter subscription form"
            >
              <div className="nl-fields">
                <div className="nl-field-wrap">
                  <label htmlFor="nl-first" className="sr-only">First Name</label>
                  <input
                    id="nl-first"
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`nl-input${errors.firstName ? ' error' : ''}`}
                    autoComplete="given-name"
                  />
                  {errors.firstName && (
                    <span className="nl-error" role="alert">{errors.firstName}</span>
                  )}
                </div>

                <div className="nl-field-wrap">
                  <label htmlFor="nl-last" className="sr-only">Last Name</label>
                  <input
                    id="nl-last"
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    className={`nl-input${errors.lastName ? ' error' : ''}`}
                    autoComplete="family-name"
                  />
                  {errors.lastName && (
                    <span className="nl-error" role="alert">{errors.lastName}</span>
                  )}
                </div>

                <div className="nl-field-wrap nl-field-email">
                  <label htmlFor="nl-email" className="sr-only">Email Address</label>
                  <input
                    id="nl-email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    className={`nl-input${errors.email ? ' error' : ''}`}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <span className="nl-error" role="alert">{errors.email}</span>
                  )}
                </div>

                <button type="submit" className="btn btn-light nl-submit">
                  Subscribe <span className="arrow">→</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </section>
  )
}
