import React, { useState, useEffect } from 'react'
import {
  DISTRICT_LIST,
  getDistrictLocation,
  getAutoReferees,
  BISHOP_REFEREE
} from '../../data/dioceseLocationsData'
import { ShieldIcon, UserCheckIcon, CheckIcon, ArrowRightIcon } from '../Icons/SvgIcons'
import './LocationSelectorModal.css'

export default function LocationSelectorModal({
  isOpen,
  initialDistrict = '',
  initialTaluk = '',
  onConfirm,
  onClose,
  isTa = false,
  canDismiss = false
}) {
  const [selectedState, setSelectedState] = useState('Tamil Nadu')
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict || '')
  const [selectedTaluk, setSelectedTaluk] = useState(initialTaluk || '')

  const locData = selectedDistrict ? getDistrictLocation(selectedDistrict) : null
  const talukList = locData?.taluks || []

  useEffect(() => {
    if (initialDistrict) {
      setSelectedDistrict(initialDistrict)
    }
  }, [initialDistrict])

  const handleDistrictChange = (e) => {
    const dist = e.target.value
    setSelectedDistrict(dist)
    const newLoc = dist ? getDistrictLocation(dist) : null
    const newTaluks = newLoc?.taluks || []
    setSelectedTaluk(newTaluks.length > 0 ? newTaluks[0] : '')
  }

  if (!isOpen) return null

  const refs = selectedDistrict ? getAutoReferees(selectedDistrict, selectedTaluk) : null
  const dos = refs?.ref1 || null
  const isSelectionComplete = !!selectedDistrict && (talukList.length === 0 || !!selectedTaluk)

  const handleApply = () => {
    if (!isSelectionComplete || !locData || !dos) return
    onConfirm({
      state: selectedState,
      district: selectedDistrict,
      districtEn: locData?.districtEn || selectedDistrict,
      taluk: selectedTaluk,
      referees: refs,
      dos: dos
    })
  }

  return (
    <div className="loc-glass-overlay">
      <div className="loc-glass-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Glowing Top Pill Badge */}
        <div className="loc-glass-badge">
          <ShieldIcon size={16} />
          <span>{isTa ? 'அதிகாரப்பூர்வ பேராய ஆட்சி எல்லை தேர்வு' : 'DIOCESE JURISDICTION PRE-SELECTION'}</span>
        </div>

        <h2 className="loc-glass-title">
          {isTa ? 'உங்கள் பேராய மண்டலத்தைத் தேர்ந்தெடுக்கவும்' : 'Select Your Diocese Jurisdiction'}
        </h2>

        <p className="loc-glass-sub">
          {isTa 
            ? 'விண்ணப்பத்தைத் தொடங்குவதற்கு முன், உங்கள் மாநிலம், மாவட்டம் மற்றும் தாலுகாவைத் தேர்ந்தெடுக்கவும்.'
            : 'Before proceeding to the application form, select your location. The system will automatically link your assigned District Overseer (DOS) and approval route.'}
        </p>

        {/* 3 Step Mandatory Selection Form */}
        <div className="loc-glass-form-box">
          <div className="loc-glass-grid">
            
            {/* 1. State */}
            <div className="loc-glass-field">
              <label className="loc-glass-label">
                <span className="loc-step-num">1</span>
                {isTa ? 'மாநிலம் / நாடு' : 'State / Province'}
              </label>
              <select 
                className="loc-glass-select"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="Tamil Nadu">Tamil Nadu (தமிழ்நாடு)</option>
                <option value="Puducherry">Puducherry (புதுச்சேரி)</option>
                <option value="Kerala">Kerala (கேரளா)</option>
                <option value="Karnataka">Karnataka (கர்நாடகா)</option>
                <option value="Andhra Pradesh">Andhra Pradesh (ஆந்திரா)</option>
                <option value="Other">Other / International</option>
              </select>
            </div>

            {/* 2. District (NO DEFAULT - MUST BE SELECTED) */}
            <div className="loc-glass-field">
              <label className="loc-glass-label">
                <span className="loc-step-num">2</span>
                {isTa ? 'பேராய மாவட்டம்' : 'Diocese District'} <span className="loc-req-star">*</span>
              </label>
              <select 
                className={`loc-glass-select highlight ${!selectedDistrict ? 'unselected' : 'has-value'}`}
                value={selectedDistrict}
                onChange={handleDistrictChange}
              >
                <option value="">{isTa ? '-- மாவட்டத்தைத் தேர்ந்தெடுக்கவும் --' : '-- Select Your Diocese District --'}</option>
                {DISTRICT_LIST.map((dist) => {
                  const item = getDistrictLocation(dist)
                  return (
                    <option key={dist} value={dist}>
                      {dist} ({item?.districtTa || dist})
                    </option>
                  )
                })}
              </select>
            </div>

            {/* 3. Taluk (Dynamically Loaded) */}
            <div className="loc-glass-field full-width">
              <label className="loc-glass-label">
                <span className="loc-step-num">3</span>
                {isTa ? 'தாலுகா / வட்டாரம்' : 'Taluk / Ministry Area'} <span className="loc-req-star">*</span>
              </label>
              <select 
                className="loc-glass-select"
                value={selectedTaluk}
                onChange={(e) => setSelectedTaluk(e.target.value)}
                disabled={!selectedDistrict}
              >
                {!selectedDistrict ? (
                  <option value="">{isTa ? '-- முதலில் மாவட்டத்தைத் தேர்ந்தெடுக்கவும் --' : '-- First Select District Above --'}</option>
                ) : (
                  talukList.map((tk) => (
                    <option key={tk} value={tk}>{tk}</option>
                  ))
                )}
              </select>
            </div>

          </div>
        </div>

        {/* Dynamic Assigned DOS Profile Card (Revealed upon selection) */}
        {selectedDistrict && dos ? (
          <div className="loc-glass-dos-card">
            <div className="loc-dos-header">
              <div className="loc-dos-tag">
                <UserCheckIcon size={14} />
                <span>{isTa ? 'ஒதுக்கப்பட்ட மாவட்ட கண்காணிப்பாளர் (DOS)' : 'ASSIGNED DISTRICT OVERSEER (DOS)'}</span>
              </div>
              <span className="loc-dos-reg">{dos.diocesanId || dos.regNo}</span>
            </div>

            <div className="loc-dos-content">
              <div className="loc-dos-name-row">
                <h3 className="loc-dos-name">{dos.name}</h3>
                <span className="loc-dos-district">{selectedDistrict} {isTa ? 'பேராயம்' : 'Diocese'} ({selectedTaluk})</span>
              </div>
              <p className="loc-dos-church">{dos.church}</p>
              <div className="loc-dos-contact">
                <span>📧 {dos.email}</span>
                {dos.phone && <span>📞 {dos.phone}</span>}
              </div>
            </div>

            <div className="loc-glass-pipeline">
              <div className="loc-pipe-step active">
                <span className="loc-pipe-num">1</span>
                <span>{isTa ? 'விண்ணப்பம்' : 'Submission'}</span>
              </div>
              <span className="loc-pipe-arrow">&rarr;</span>
              <div className="loc-pipe-step active">
                <span className="loc-pipe-num">2</span>
                <span>{dos.name.split(' ')[1] || 'DOS'} Review</span>
              </div>
              <span className="loc-pipe-arrow">&rarr;</span>
              <div className="loc-pipe-step">
                <span className="loc-pipe-num">3</span>
                <span>Bishop Sign-Off</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="loc-glass-prompt-box">
            <ShieldIcon size={22} />
            <span>{isTa ? 'மாவட்ட கண்காணிப்பாளர் மற்றும் ஒப்புதல் வழித்தடத்தைக் காண உங்கள் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்.' : 'Please select your District to view the assigned District Overseer and approval route.'}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="loc-glass-actions">
          {canDismiss && onClose && (
            <button
              type="button"
              className="loc-glass-btn-cancel"
              onClick={onClose}
            >
              {isTa ? 'ரத்து செய்' : 'Cancel'}
            </button>
          )}
          
          <button
            type="button"
            className={`loc-glass-btn-proceed ${!isSelectionComplete ? 'disabled' : ''}`}
            onClick={handleApply}
            disabled={!isSelectionComplete}
          >
            <span>{isTa ? 'விண்ணப்பப் படிவத்தைத் தொடரவும்' : 'Confirm Jurisdiction & Begin Application'}</span>
            <ArrowRightIcon size={18} />
          </button>
        </div>

      </div>
    </div>
  )
}
