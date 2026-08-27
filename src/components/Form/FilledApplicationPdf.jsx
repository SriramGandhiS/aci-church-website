import React from 'react'
import { Link } from 'react-router-dom'
import { PrintIcon, ArrowLeftIcon, UserCheckIcon, CheckIcon } from '../Icons/SvgIcons'
import OfficialApplicationForm from './OfficialApplicationForm'
import './FilledApplicationPdf.css'

export default function FilledApplicationPdf({ data, applicationId, onEdit, isTa = false }) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="filled-pdf-viewer">

      {/* Submission Success Banner */}
      <div style={{ maxWidth: '920px', margin: '16px auto 0', padding: '14px 20px', background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <CheckIcon size={18} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#065f46' }}>
              {isTa ? 'விண்ணப்பம் வெற்றிகரமாக பதிவு செய்யப்பட்டது!' : 'Application Submitted & Saved to Diocesan Database!'}
            </div>
            <div style={{ fontSize: '12px', color: '#047857' }}>
              {applicationId ? `${isTa ? 'விண்ணப்ப எண்' : 'Application ID'}: ${applicationId}` : (isTa ? 'உங்கள் விண்ணப்பம் மத்திய அலுவலக ஆய்வுக்கு அனுப்பப்பட்டுள்ளது.' : 'Your official application has been recorded for diocesan review.')}
            </div>
          </div>
        </div>

        <Link
          to="/get-involved/status"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#059669', color: '#ffffff', padding: '7px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '12.5px', fontWeight: 600, border: 'none' }}
        >
          <UserCheckIcon size={14} color="#ffffff" />
          <span>{isTa ? 'விண்ணப்ப நிலையை கண்காணிக்க' : 'Track Application Status'}</span>
        </Link>
      </div>

      {/* Standalone Action Bar Directly Above Official Form Preview */}
      <div className="application-actions-bar">
        <button type="button" onClick={onEdit} className="app-action-btn-edit">
          <ArrowLeftIcon size={15} />
          <span>{isTa ? 'விவரங்களைத் திருத்து' : 'Edit Application'}</span>
        </button>

        <button type="button" onClick={handlePrint} className="app-action-btn-print">
          <PrintIcon size={16} color="#ffffff" />
          <span>{isTa ? 'அதிகாரப்பூர்வ 2-பக்க படிவத்தை அச்சிடுக / PDF சேமி' : 'Print / Save Official 2-Page PDF'}</span>
        </button>
      </div>

      {/* Official Form Preview Container */}
      <div className="official-form-preview-container">
        <OfficialApplicationForm data={data} isMini={false} showActions={false} />
      </div>

    </div>
  )
}
