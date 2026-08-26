import React from 'react'
import { PrintIcon, ArrowLeftIcon } from '../Icons/SvgIcons'
import OfficialApplicationForm from './OfficialApplicationForm'
import './FilledApplicationPdf.css'

export default function FilledApplicationPdf({ data, onEdit, isTa = false }) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="filled-pdf-viewer">

      {/* Action Toolbar */}
      <div className="pdf-toolbar">
        <div>
          <h3 className="pdf-toolbar-title">
            📄 {isTa ? 'அதிகாரப்பூர்வ பேராய விண்ணப்பப் படிவம் (முழுமையாக நிரப்பப்பட்டது)' : 'Official Diocesan Membership Application (Digitally Completed Form)'}
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0' }}>
            {isTa ? 'அதிகாரப்பூர்வ 4 பக்க வடிவத்தில் நிரப்பப்பட்ட படிவம். அச்சு / PDF ஆக சேமிக்கலாம்.' : 'Exact 4-page replica of the official ACI Diocese paper form with your data placed into corresponding fields.'}
          </p>
        </div>

        <div className="pdf-toolbar-actions">
          <button type="button" onClick={onEdit} className="pdf-edit-btn">
            <ArrowLeftIcon size={13} />
            <span>{isTa ? 'விவரங்களைத் திருத்து' : 'Edit Application'}</span>
          </button>

          <button type="button" onClick={handlePrint} className="pdf-print-btn">
            <PrintIcon size={15} color="#ffffff" />
            <span>{isTa ? 'படிவத்தை அச்சிடுக / PDF சேமி' : 'Print / Save Official PDF'}</span>
          </button>
        </div>
      </div>

      {/* Official 4-Page Form Render */}
      <div className="pdf-sheets-container">
        <OfficialApplicationForm data={data} isMini={false} />
      </div>

    </div>
  )
}
