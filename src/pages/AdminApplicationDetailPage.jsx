import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import OfficialApplicationForm from '../components/Form/OfficialApplicationForm'
import {
  ArrowLeftIcon,
  CheckIcon,
  AlertCircleIcon,
  DocumentIcon,
  PrintIcon,
  UserCheckIcon
} from '../components/Icons/SvgIcons'
import './AdminApplicationDetailPage.css'

export default function AdminApplicationDetailPage() {
  const { id } = useParams()
  const { user, isAdmin, requireAuth } = useAuth()
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const navigate = useNavigate()

  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('official_form') // 'official_form' | 'details' | 'documents' | 'history'

  // Document preview modal
  const [previewDoc, setPreviewDoc] = useState(null)
  const [loadingDoc, setLoadingDoc] = useState(false)

  // Decision Modals
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    requireAuth((loggedUser) => {
      if (!loggedUser.isAdmin) {
        setLoading(false)
        return
      }
      loadApplication(loggedUser.email, id)
    })
  }, [id])

  const loadApplication = async (adminEmail, appId) => {
    setLoading(true)
    try {
      const res = await api.adminGetApplication(adminEmail, appId)
      if (res && res.success && res.application) {
        setApplication(res.application)
      }
    } catch (e) {
      console.warn('Error loading application details:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus, reason = '') => {
    setActionLoading(true)
    setActionError('')
    try {
      const res = await api.adminUpdateStatus(user.email, id, newStatus, reason)
      if (res && res.success) {
        setShowAcceptModal(false)
        setShowRejectModal(false)
        setRejectionReason('')
        // Reload details
        loadApplication(user.email, id)
      } else {
        setActionError(res?.message || 'Failed to update application status.')
      }
    } catch (e) {
      setActionError(e.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleViewDocument = async (doc) => {
    if (doc.base64Url) {
      setPreviewDoc(doc)
      return
    }
    setLoadingDoc(true)
    try {
      const res = await api.getDocumentData(user.email, doc.driveFileId, doc.documentId)
      if (res && res.success) {
        setPreviewDoc({
          ...doc,
          base64Url: res.base64Url
        })
      } else {
        alert('Unable to load document payload.')
      }
    } catch (err) {
      alert('Error fetching document.')
    } finally {
      setLoadingDoc(false)
    }
  }

  if (!user || !isAdmin) {
    return (
      <div className="admin-access-denied-wrap">
        <div className="admin-access-card">
          <h2>Administrator Access Required</h2>
          <button type="button" className="btn btn-primary" onClick={() => requireAuth()}>
            Sign In as Admin
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="admin-detail-loading">
        <div className="app-dash-spinner" />
        <p>Loading application record {id}...</p>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="admin-detail-container">
        <Link to="/admin/applications" className="admin-back-link">
          <ArrowLeftIcon size={16} /> <span>Back to Applications</span>
        </Link>
        <div className="admin-empty-card">
          <h2>Application Not Found</h2>
          <p>Could not locate record with ID {id}.</p>
        </div>
      </div>
    )
  }

  const appData = application.data || {}
  const personal = appData.personal || {}
  const church = appData.church || {}
  const spiritual = appData.spiritual || {}
  const affiliation = appData.affiliation || {}
  const qualifications = appData.qualifications || {}
  const documents = application.documents || []
  const history = application.history || []

  return (
    <div className="admin-detail-container">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="admin-detail-top-nav">
        <Link to="/admin/applications" className="admin-back-link">
          <ArrowLeftIcon size={16} /> <span>Back to All Applications</span>
        </Link>

        {/* Status Action Controls */}
        <div className="admin-action-buttons-group">
          {application.status !== 'UNDER_REVIEW' && application.status !== 'ACCEPTED' && (
            <button
              type="button"
              className="admin-btn-review"
              disabled={actionLoading}
              onClick={() => handleStatusUpdate('UNDER_REVIEW')}
            >
              Mark Under Review
            </button>
          )}

          {application.status !== 'ACCEPTED' && (
            <button
              type="button"
              className="admin-btn-accept"
              disabled={actionLoading}
              onClick={() => setShowAcceptModal(true)}
            >
              ✓ Accept Application
            </button>
          )}

          {application.status !== 'REJECTED' && (
            <button
              type="button"
              className="admin-btn-reject"
              disabled={actionLoading}
              onClick={() => setShowRejectModal(true)}
            >
              ✕ Reject Application
            </button>
          )}
        </div>
      </div>

      {/* Applicant Summary Banner */}
      <div className="admin-applicant-summary-card">
        <div className="summary-card-left">
          <div className="summary-applicant-photo">
            {personal.photoUrl ? (
              <img src={personal.photoUrl} alt={application.applicantName} />
            ) : (
              <span>👤</span>
            )}
          </div>
          <div>
            <div className="summary-title-row">
              <h1 className="summary-name">{application.applicantName || 'Unnamed Applicant'}</h1>
              <span className={`admin-status-badge ${application.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {application.status}
              </span>
            </div>
            <p className="summary-meta-line">
              <strong>{application.applicationId}</strong> • {spiritual.ministryFunction || 'Pastor'} • {personal.permanentAddress?.cityTown || church.cityTown || 'Tamil Nadu'}
            </p>
            <p className="summary-contact-line">
              📧 {application.email} {application.mobileNumber && `• 📞 ${application.mobileNumber}`}
            </p>
          </div>
        </div>

        <div className="summary-card-right">
          <div className="summary-stat-box">
            <span className="stat-lbl">Submitted Date</span>
            <span className="stat-val">
              {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'Draft'}
            </span>
          </div>
          {application.reviewedBy && (
            <div className="summary-stat-box">
              <span className="stat-lbl">Last Reviewed By</span>
              <span className="stat-val text-xs">{application.reviewedBy}</span>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Notice Banner (if rejected) */}
      {application.status === 'REJECTED' && application.rejectionReason && (
        <div className="admin-rejection-alert">
          <strong>⚠️ Rejection Reason on Record:</strong>
          <p>{application.rejectionReason}</p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="admin-detail-tabs">
        <button
          type="button"
          className={`detail-tab-btn ${activeTab === 'official_form' ? 'active' : ''}`}
          onClick={() => setActiveTab('official_form')}
        >
          📄 Official 2-Page Form & PDF
        </button>
        <button
          type="button"
          className={`detail-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          📋 Structured Details
        </button>
        <button
          type="button"
          className={`detail-tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          📁 Uploaded Documents ({documents.length})
        </button>
        <button
          type="button"
          className={`detail-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 Status History ({history.length})
        </button>
      </div>

      {/* Tab 1: Official 2-Page Form */}
      {activeTab === 'official_form' && (
        <div className="admin-official-preview-pane">
          <div className="admin-preview-instructions">
            <span>✨ Exact canonical 2-page digital ACI Diocese form populated from submitted applicant data.</span>
            <button
              type="button"
              className="admin-print-btn"
              onClick={() => window.print()}
            >
              <PrintIcon size={16} /> <span>Print / Save Official PDF</span>
            </button>
          </div>
          <OfficialApplicationForm
            data={appData}
            showActions={false}
            isTa={isTa}
          />
        </div>
      )}

      {/* Tab 2: Structured Details */}
      {activeTab === 'details' && (
        <div className="admin-structured-details-pane">
          <div className="detail-section-card">
            <h3>I. Personal & Contact Information</h3>
            <div className="detail-grid-2">
              <div><strong>Full Name:</strong> {personal.salutation} {personal.name}</div>
              <div><strong>Baptismal Name:</strong> {personal.baptismalName || '—'}</div>
              <div><strong>Date of Birth:</strong> {personal.dob || '—'}</div>
              <div><strong>Nationality:</strong> {personal.nationality}</div>
              <div><strong>Gender & Marital Status:</strong> {personal.gender}, {personal.maritalStatus}</div>
            </div>
            <div className="detail-addresses-grid">
              <div className="address-box">
                <h4>Permanent Address</h4>
                <p>{personal.permanentAddress?.doorNo}, {personal.permanentAddress?.streetName}</p>
                <p>{personal.permanentAddress?.cityTown}, {personal.permanentAddress?.taluk} - {personal.permanentAddress?.pincode}</p>
                <p>{personal.permanentAddress?.district}, {personal.permanentAddress?.state}, {personal.permanentAddress?.country}</p>
              </div>
              <div className="address-box">
                <h4>Contact Address</h4>
                <p>{personal.contactAddress?.doorNo}, {personal.contactAddress?.streetName}</p>
                <p>{personal.contactAddress?.cityTown}, {personal.contactAddress?.taluk} - {personal.contactAddress?.pincode}</p>
                <p>{personal.contactAddress?.district}, {personal.contactAddress?.state}, {personal.contactAddress?.country}</p>
              </div>
            </div>
          </div>

          <div className="detail-section-card">
            <h3>II. Church & Affiliation Details</h3>
            <div className="detail-grid-2">
              <div><strong>Ministry Function:</strong> {spiritual.ministryFunction} {spiritual.otherMinistrySpecify && `(${spiritual.otherMinistrySpecify})`}</div>
              <div><strong>Affiliation Type:</strong> {affiliation.affiliationType}</div>
              <div><strong>Trust Name:</strong> {affiliation.trustName || '—'}</div>
              <div><strong>Church Name:</strong> {church.churchName || '—'}</div>
              <div><strong>Church Location:</strong> {church.doorNo}, {church.streetName}, {church.cityTown} - {church.pincode}</div>
              <div><strong>Church Phone / Mobile:</strong> {church.telephone || '—'} / {church.mobileNumber || '—'}</div>
            </div>
          </div>

          <div className="detail-section-card">
            <h3>III. Qualifications & References</h3>
            <h4>Academic</h4>
            <ul>
              {qualifications.academic?.map((q, idx) => (
                <li key={idx}>• {q.examinationPassed} ({q.year}) - {q.institution}</li>
              ))}
            </ul>
            <h4>Theological</h4>
            <ul>
              {qualifications.theological?.map((q, idx) => (
                <li key={idx}>• {q.examinationPassed} ({q.year}) - {q.institution}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Uploaded Documents */}
      {activeTab === 'documents' && (
        <div className="admin-documents-pane">
          {documents.length > 0 ? (
            <div className="documents-cards-grid">
              {documents.map((doc, idx) => (
                <div key={idx} className="admin-doc-card">
                  <div className="doc-card-icon">
                    <DocumentIcon size={24} />
                  </div>
                  <div className="doc-card-info">
                    <h4>{doc.documentType}</h4>
                    <p className="doc-file-name">{doc.fileName}</p>
                    <small className="text-muted">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</small>
                  </div>
                  <button
                    type="button"
                    className="doc-view-btn"
                    disabled={loadingDoc}
                    onClick={() => handleViewDocument(doc)}
                  >
                    View Document
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-card">
              <p>No separate document attachments found for this application record.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Status History */}
      {activeTab === 'history' && (
        <div className="admin-history-pane">
          <div className="history-timeline">
            {history.map((h, idx) => (
              <div key={idx} className="timeline-entry">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <strong>{h.newStatus}</strong>
                    <span className="timeline-time">{new Date(h.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="timeline-by">Action by: {h.changedBy}</p>
                  {h.reason && <p className="timeline-reason">Reason: "{h.reason}"</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Preview Lightbox Modal */}
      {previewDoc && (
        <div className="doc-modal-overlay" onClick={() => setPreviewDoc(null)}>
          <div className="doc-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="doc-modal-header">
              <h3>{previewDoc.documentType} — {previewDoc.fileName}</h3>
              <button type="button" className="close-btn" onClick={() => setPreviewDoc(null)}>✕</button>
            </div>
            <div className="doc-modal-body">
              {previewDoc.base64Url?.startsWith('data:image') ? (
                <img src={previewDoc.base64Url} alt={previewDoc.fileName} className="doc-preview-image" />
              ) : (
                <iframe src={previewDoc.base64Url} title="Document Preview" className="doc-preview-frame" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Accept Confirmation Modal */}
      {showAcceptModal && (
        <div className="action-modal-overlay" onClick={() => setShowAcceptModal(false)}>
          <div className="action-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Accept Membership Application</h3>
            <p>
              Are you sure you want to approve and affiliate <strong>{application.applicantName}</strong> ({application.applicationId})?
            </p>
            <p className="text-muted text-xs">
              An official approval email will be dispatched to the applicant.
            </p>
            {actionError && <div className="modal-error">{actionError}</div>}
            <div className="action-modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setShowAcceptModal(false)}>Cancel</button>
              <button
                type="button"
                className="btn-confirm-accept"
                disabled={actionLoading}
                onClick={() => handleStatusUpdate('ACCEPTED')}
              >
                {actionLoading ? 'Processing...' : 'Confirm Acceptance'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal (Mandatory Reason) */}
      {showRejectModal && (
        <div className="action-modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="action-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#dc2626' }}>Reject Application</h3>
            <p>
              Please enter the official reason or clarification requested for rejecting application <strong>{application.applicationId}</strong>.
            </p>
            <div className="form-group">
              <label>Rejection Reason / Clarification (Required) <span className="req">*</span></label>
              <textarea
                rows="4"
                required
                className="modal-textarea"
                placeholder="e.g. Please provide a clear, readable copy of your theological ordination certificate."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            {actionError && <div className="modal-error">{actionError}</div>}
            <div className="action-modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button
                type="button"
                className="btn-confirm-reject"
                disabled={actionLoading || !rejectionReason.trim()}
                onClick={() => handleStatusUpdate('REJECTED', rejectionReason.trim())}
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
