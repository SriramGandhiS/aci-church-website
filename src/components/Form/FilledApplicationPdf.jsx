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

      {/* Clean Compact Action Bar */}
      <div className="pdf-toolbar-clean">
        <button type="button" onClick={onEdit} className="pdf-edit-btn">
          <ArrowLeftIcon size={14} />
          <span>{isTa ? 'விவரங்களைத் திருத்து' : 'Edit Application'}</span>
        </button>

        <button type="button" onClick={handlePrint} className="pdf-print-btn">
          <PrintIcon size={16} color="#ffffff" />
          <span>{isTa ? 'படிவத்தை அச்சிடுக / PDF சேமி' : 'Print / Save Official PDF'}</span>
        </button>
      </div>

      {/* Official Form Render */}
      <div className="pdf-sheets-container">
        <OfficialApplicationForm data={data} isMini={false} />
      </div>

    </div>
  )
}
