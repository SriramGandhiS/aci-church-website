import React from 'react'
import { Link } from 'react-router-dom'
import { PrintIcon, ArrowLeftIcon, UserCheckIcon } from '../Icons/SvgIcons'
import OfficialApplicationForm from './OfficialApplicationForm'
import './FilledApplicationPdf.css'

export default function FilledApplicationPdf({ data, onEdit, isTa = false }) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="filled-pdf-viewer">

      {/* Standalone Action Bar Directly Above Official Form Preview */}
      <div className="application-actions-bar">
        <button type="button" onClick={onEdit} className="app-action-btn-edit">
          <ArrowLeftIcon size={15} />
          <span>{isTa ? 'விவரங்களைத் திருத்து' : 'Edit Application'}</span>
        </button>

        <Link to="/get-involved/status" className="app-action-btn-status" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0f172a', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          <UserCheckIcon size={15} />
          <span>{isTa ? 'விண்ணப்ப நிலை' : 'Application Status'}</span>
        </Link>

        <button type="button" onClick={handlePrint} className="app-action-btn-print">
          <PrintIcon size={16} color="#ffffff" />
          <span>{isTa ? 'படிவத்தை அச்சிடுக / PDF சேமி' : 'Print / Save Official PDF'}</span>
        </button>
      </div>

      {/* Official Form Preview Container */}
      <div className="official-form-preview-container">
        <OfficialApplicationForm data={data} isMini={false} />
      </div>

    </div>
  )
}
