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
    /*
     * TODO: Connect to email marketing API / backend endpoint.
     * Example: POST /api/newsletter with { firstName, lastName, email }
     * Until a backend is configured, this shows a success state.
     */
    console.info('[ACI Newsletter] Subscribe:', form)
    setSubmitted(true)
  }

  return (
    <section
      ref={sectionRef}
      id="newsletter"
      className="newsletter-section section-pad"
      aria-label="Email Newsletter"
    >
      <div className="container">
        <div className="nl-inner">

          {/* Header */}
          <p className="nl-label t-label reveal">Email Newsletter</p>
          <h2 className="nl-heading reveal reveal-delay-1">Stay Connected</h2>
          <p className="nl-sub t-body reveal reveal-delay-2">
            Receive updates, messages and news from ACI Diocese directly in your inbox.
          </p>

          {/* Form */}
          {submitted ? (
            <div className="nl-success reveal" role="alert">
              <p className="nl-success-text">
                Thank you for subscribing. You will hear from us soon.
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
