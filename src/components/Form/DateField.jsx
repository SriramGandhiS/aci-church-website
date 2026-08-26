import React from 'react'
import './DateField.css'

const MONTHS = [
  { val: '01', labelEn: '01 - January', labelTa: '01 - ஜனவரி' },
  { val: '02', labelEn: '02 - February', labelTa: '02 - பிப்ரவரி' },
  { val: '03', labelEn: '03 - March', labelTa: '03 - மார்ச்' },
  { val: '04', labelEn: '04 - April', labelTa: '04 - ஏப்ரல்' },
  { val: '05', labelEn: '05 - May', labelTa: '05 - மே' },
  { val: '06', labelEn: '06 - June', labelTa: '06 - ஜூன்' },
  { val: '07', labelEn: '07 - July', labelTa: '07 - ஜூலை' },
  { val: '08', labelEn: '08 - August', labelTa: '08 - ஆகஸ்ட்' },
  { val: '09', labelEn: '09 - September', labelTa: '09 - செப்டம்பர்' },
  { val: '10', labelEn: '10 - October', labelTa: '10 - அக்டோபர்' },
  { val: '11', labelEn: '11 - November', labelTa: '11 - நவம்பர்' },
  { val: '12', labelEn: '12 - December', labelTa: '12 - டிசம்பர்' },
]

export default function DateField({ value = '', onChange, isTa = false, required = false, label = '' }) {
  // Value is in YYYY-MM-DD format
  const parts = (value || '').split('-')
  const year = parts[0] || ''
  const month = parts[1] || ''
  const day = parts[2] || ''

  const handleDayChange = (e) => {
    let d = e.target.value.replace(/\D/g, '').slice(0, 2)
    const num = parseInt(d, 10)
    if (!isNaN(num)) {
      if (num > 31) d = '31'
      if (num < 1 && d.length === 2) d = '01'
    }
    const newY = year || new Date().getFullYear().toString()
    const newM = month || '01'
    onChange(`${newY}-${newM}-${d.padStart(2, '0')}`)
  }

  const handleMonthChange = (e) => {
    const m = e.target.value
    const newY = year || new Date().getFullYear().toString()
    const newD = day || '01'
    onChange(`${newY}-${m}-${newD}`)
  }

  const handleYearChange = (e) => {
    let y = e.target.value.replace(/\D/g, '').slice(0, 4)
    const newM = month || '01'
    const newD = day || '01'
    onChange(`${y}-${newM}-${newD}`)
  }

  // Days list 1 to 31
  const daysList = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
  
  // Years list (current year down to 1940)
  const currentYear = new Date().getFullYear()
  const yearsList = Array.from({ length: 85 }, (_, i) => String(currentYear - i))

  return (
    <div className="date-field-wrap">
      {label && (
        <label className="clean-label">
          {label} {required && <span className="req-star">*</span>}
        </label>
      )}

      <div className="date-field-inputs">
        {/* Day Select */}
        <div className="date-select-group">
          <select
            value={day}
            onChange={(e) => {
              const d = e.target.value
              const newY = year || currentYear.toString()
              const newM = month || '01'
              onChange(`${newY}-${newM}-${d}`)
            }}
            className="clean-select date-part-select"
          >
            <option value="">{isTa ? 'தேதி' : 'DD'}</option>
            {daysList.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Month Select */}
        <div className="date-select-group month-group">
          <select
            value={month}
            onChange={handleMonthChange}
            className="clean-select date-part-select"
          >
            <option value="">{isTa ? 'மாதம்' : 'MM - Month'}</option>
            {MONTHS.map((m) => (
              <option key={m.val} value={m.val}>
                {isTa ? m.labelTa : m.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* Year Select */}
        <div className="date-select-group">
          <select
            value={year}
            onChange={(e) => {
              const y = e.target.value
              const newM = month || '01'
              const newD = day || '01'
              onChange(`${y}-${newM}-${newD}`)
            }}
            className="clean-select date-part-select"
          >
            <option value="">{isTa ? 'வருடம்' : 'YYYY'}</option>
            {yearsList.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
