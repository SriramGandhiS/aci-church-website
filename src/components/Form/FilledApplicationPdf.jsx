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

      {/* Step 2: 4-Channel Referee Endorsement Card */}
      <div style={{ maxWidth: '920px', margin: '16px auto 0', padding: '18px 20px', background: '#1e293b', border: '1.5px solid #3b82f6', borderRadius: '12px', color: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '10px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>📲</span>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#93c5fd' }}>
                {isTa ? 'படி 2: பேராய பரிந்துரையாளர் உறுதிப்படுத்தல்' : 'Step 2: Obtain Referee Attestations'}
              </h3>
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '2px 0 0' }}>
                {isTa ? 'தங்களது மாவட்ட மேற்பார்வையாளர் மற்றும் தாலுகா ஒருங்கிணைப்பாளருக்கு WhatsApp அல்லது மின்னஞ்சல் மூலம் இணைப்பை அனுப்பவும்.' : 'Share secure 1-click attestation links with your District Overseer & Taluk Co-ordinator.'}
              </p>
            </div>
          </div>
          <span style={{ fontSize: '11px', background: '#2563eb', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
            {isTa ? 'கட்டாய படி' : 'REQUIRED FOR APPROVAL'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          
          {/* Reference 1: DOS */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#f8fafc' }}>
                  {data?.references?.ref1?.name || 'Rev. R. John Durai'}
                </strong>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {isTa ? 'மாவட்ட மேற்பார்வையாளர் (DOS)' : 'District Overseer (Ref 1)'}
                </div>
              </div>
              <span style={{ fontSize: '10.5px', background: 'rgba(234, 179, 8, 0.2)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.4)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                {data?.references?.ref1?.status === 'ATTESTED' ? '✅ ATTESTED' : '⏳ PENDING'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Dear ${data?.references?.ref1?.name || 'District Overseer'},\n\nI have submitted my ACI Diocesan Membership Application (ID: ${applicationId || 'ACI-2026-000004'}) and listed you as my District Overseer reference.\n\nPlease verify and attest my application by tapping this official link:\n${window.location.origin}/attest?appId=${applicationId || 'ACI-2026-000004'}&ref=ref1`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1, minWidth: '130px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#16a34a', color: '#ffffff', padding: '7px 10px', borderRadius: '6px', textDecoration: 'none', fontSize: '12px', fontWeight: 700 }}
              >
                <span>🟢 WhatsApp Share</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/attest?appId=${applicationId || 'ACI-2026-000004'}&ref=ref1`)
                  alert(isTa ? 'மாவட்ட மேற்பார்வையாளர் இணைப்பு நகலெடுக்கப்பட்டது!' : 'District Overseer Attestation Link copied!')
                }}
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', padding: '7px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer' }}
              >
                📋 Copy Link
              </button>
            </div>
          </div>

          {/* Reference 2: Taluk Coord */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#f8fafc' }}>
                  {data?.references?.ref2?.name || 'Rev. D. Antony Raj'}
                </strong>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {isTa ? 'தாலுகா ஒருங்கிணைப்பாளர்' : 'Taluk Co-ordinator (Ref 2)'}
                </div>
              </div>
              <span style={{ fontSize: '10.5px', background: 'rgba(234, 179, 8, 0.2)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.4)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                {data?.references?.ref2?.status === 'ATTESTED' ? '✅ ATTESTED' : '⏳ PENDING'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Dear ${data?.references?.ref2?.name || 'Taluk Co-ordinator'},\n\nI have submitted my ACI Diocesan Membership Application (ID: ${applicationId || 'ACI-2026-000004'}) and listed you as my Taluk Co-ordinator reference.\n\nPlease verify and attest my application by tapping this official link:\n${window.location.origin}/attest?appId=${applicationId || 'ACI-2026-000004'}&ref=ref2`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1, minWidth: '130px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#16a34a', color: '#ffffff', padding: '7px 10px', borderRadius: '6px', textDecoration: 'none', fontSize: '12px', fontWeight: 700 }}
              >
                <span>🟢 WhatsApp Share</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/attest?appId=${applicationId || 'ACI-2026-000004'}&ref=ref2`)
                  alert(isTa ? 'தாலுகா ஒருங்கிணைப்பாளர் இணைப்பு நகலெடுக்கப்பட்டது!' : 'Taluk Co-ordinator Attestation Link copied!')
                }}
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', padding: '7px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer' }}
              >
                📋 Copy Link
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Standalone Action Bar Directly Above Official Form Preview */}
      <div className="application-actions-bar">
        <button type="button" onClick={onEdit} className="app-action-btn-edit">
          <ArrowLeftIcon size={15} />
          <span>{isTa ? 'விவரங்களைத் திருத்து' : 'Edit Application'}</span>
        </button>

        <button type="button" onClick={handlePrint} className="app-action-btn-print">
          <PrintIcon size={16} color="#ffffff" />
          <span>{isTa ? 'அதிகாரப்பூர்வ 4-பக்க படிவத்தை அச்சிடுக / PDF சேமி' : 'Print / Save Official 4-Page PDF'}</span>
        </button>
      </div>

      {/* Official Form Preview Container */}
      <div className="official-form-preview-container">
        <OfficialApplicationForm data={data} isMini={false} showActions={false} />
      </div>

    </div>
  )
}
