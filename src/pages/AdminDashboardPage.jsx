import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import OfficialApplicationForm from '../components/Form/OfficialApplicationForm'
import {
  SearchIcon,
  DocumentIcon,
  ShieldIcon,
  UserCheckIcon,
  LocationIcon,
  PrintIcon,
  CheckIcon,
  AlertCircleIcon,
  ClockIcon,
  PhoneIcon,
  CameraIcon
} from '../components/Icons/SvgIcons'
import './AdminDashboardPage.css'

function exportToCsv(filename, rows) {
  if (!rows || !rows.length) return
  const separator = ','
  const keys = Object.keys(rows[0])
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k]
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""')
            if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`
            return cell
          })
          .join(separator)
      })
      .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function AdminDashboardPage() {
  const { user, isAdmin, logout } = useAuth()
  const { lang, toggleLang } = useLanguage()
  const isTa = lang === 'ta'
  const navigate = useNavigate()
  const location = useLocation()

  // Active module tab
  const [activeTab, setActiveTab] = useState('dashboard')

  // Datasets
  const [applications, setApplications] = useState([])
  const [members, setMembers] = useState([])
  const [coordinators, setCoordinators] = useState([])
  const [churches, setChurches] = useState([])
  const [activities, setActivities] = useState([])
  const [events, setEvents] = useState([])
  const [gallery, setGallery] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [settings, setSettings] = useState({})
  
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Selection & Drawers & Modals
  const [selectedIds, setSelectedIds] = useState([])
  const [activeDrawer, setActiveDrawer] = useState(null) // { type: 'application'|'member', data: {} }
  const [activeModal, setActiveModal] = useState(null) // { type: 'add_member'|'add_coordinator'|'add_church'|'add_activity'|'add_event'|'add_gallery'|'add_announcement'|'renew_sub'|'adjust_sub', data: {} }
  const [rejectionModal, setRejectionModal] = useState(null) // { applicationId, applicantName, reason }
  const [noteModal, setNoteModal] = useState(null) // { applicationId, note }
  const [confirmModal, setConfirmModal] = useState(null) // { title, message, onConfirm, confirmText }
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Map route path to active tab
  useEffect(() => {
    const path = location.pathname.toLowerCase()
    if (path.includes('/admin/applications')) setActiveTab('applications')
    else if (path.includes('/admin/members')) setActiveTab('members')
    else if (path.includes('/admin/subscriptions')) setActiveTab('subscriptions')
    else if (path.includes('/admin/coordinators')) setActiveTab('coordinators')
    else if (path.includes('/admin/churches') || path.includes('/admin/directory')) setActiveTab('churches')
    else if (path.includes('/admin/activities')) setActiveTab('activities')
    else if (path.includes('/admin/events')) setActiveTab('events')
    else if (path.includes('/admin/gallery') || path.includes('/admin/media')) setActiveTab('gallery')
    else if (path.includes('/admin/announcements')) setActiveTab('announcements')
    else if (path.includes('/admin/reports')) setActiveTab('reports')
    else if (path.includes('/admin/audit-log') || path.includes('/admin/audit')) setActiveTab('audit-log')
    else if (path.includes('/admin/settings')) setActiveTab('settings')
    else setActiveTab('dashboard')
  }, [location.pathname])

  useEffect(() => {
    loadAllData()
  }, [user])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4500)
  }

  const loadAllData = async () => {
    setLoading(true)
    const adminEmail = user?.email || 'iamramm8@gmail.com'
    try {
      const [
        appsRes,
        memsRes,
        coordsRes,
        churchesRes,
        actsRes,
        evtsRes,
        galRes,
        annsRes,
        auditRes,
        setRes
      ] = await Promise.all([
        api.adminListApplications(adminEmail),
        api.adminListMembers(adminEmail),
        api.adminGetCoordinators(adminEmail),
        api.adminGetChurches(adminEmail),
        api.adminGetActivities(adminEmail),
        api.adminGetEvents(adminEmail),
        api.adminGetGallery(adminEmail),
        api.adminGetAnnouncements(adminEmail),
        api.adminGetAuditLog(adminEmail),
        api.adminGetSettings(adminEmail)
      ])

      if (appsRes?.success && appsRes.applications) setApplications(appsRes.applications)
      if (memsRes?.success && memsRes.members) setMembers(memsRes.members)
      if (coordsRes?.success && coordsRes.coordinators) setCoordinators(coordsRes.coordinators)
      if (churchesRes?.success && churchesRes.churches) setChurches(churchesRes.churches)
      if (actsRes?.success && actsRes.activities) setActivities(actsRes.activities)
      if (evtsRes?.success && evtsRes.events) setEvents(evtsRes.events)
      if (galRes?.success && galRes.gallery) setGallery(galRes.gallery)
      if (annsRes?.success && annsRes.announcements) setAnnouncements(annsRes.announcements)
      if (auditRes?.success && auditRes.auditLogs) setAuditLogs(auditRes.auditLogs)
      if (setRes?.success && setRes.settings) setSettings(setRes.settings)
    } catch (e) {
      console.warn('Error loading admin data:', e)
      showToast('Error synchronizing admin dataset: ' + (e.message || 'Check connection'))
    } finally {
      setLoading(false)
    }
  }

  // Enrich applications with subscription countdown
  const enrichedApplications = useMemo(() => {
    return applications.map((app) => {
      const submittedDate = app.submittedAt ? new Date(app.submittedAt) : new Date('2026-01-01')
      const expiry = app.subscriptionExpiryDate ? new Date(app.subscriptionExpiryDate) : new Date(submittedDate.getTime() + 365 * 24 * 60 * 60 * 1000)
      const diffMs = expiry.getTime() - Date.now()
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

      let subState = 'ACTIVE'
      if (app.status === 'REJECTED') {
        subState = 'REJECTED'
      } else if (app.status !== 'ACCEPTED') {
        subState = 'PENDING'
      } else if (app.subscriptionStatus === 'SUSPENDED') {
        subState = 'SUSPENDED'
      } else if (daysLeft <= 0) {
        subState = 'EXPIRED'
      } else if (daysLeft <= 30) {
        subState = 'EXPIRING_SOON'
      }

      return {
        ...app,
        submittedDate,
        expiryDate: expiry,
        daysLeft,
        subState
      }
    })
  }, [applications])

  // Aggregate Real KPI Metrics
  const kpiMetrics = useMemo(() => {
    const totalMembers = members.length
    const activeMembers = members.filter(m => m.status === 'ACTIVE').length
    const pendingApps = applications.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW' || a.status === 'ATTESTED_BY_REFEREE').length
    const approvedApps = applications.filter(a => a.status === 'ACCEPTED').length
    const rejectedApps = applications.filter(a => a.status === 'REJECTED').length
    const expiringSoon = members.filter(m => m.status === 'EXPIRING_SOON' || (m.daysLeft > 0 && m.daysLeft <= 30)).length
    const expiredCount = members.filter(m => m.status === 'EXPIRED' || m.daysLeft <= 0).length

    return {
      totalMembers,
      activeMembers,
      pendingApps,
      approvedApps,
      rejectedApps,
      expiringSoon,
      expiredCount
    }
  }, [members, applications])

  // Attention Required Desk (Pending Apps + Expiring Subscriptions)
  const attentionRequiredItems = useMemo(() => {
    const pendingList = applications
      .filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW')
      .map(a => ({
        type: 'APPLICATION',
        id: a.applicationId,
        title: a.applicantName,
        subtitle: `${a.churchName || 'Independent Parish'} · ${a.district || 'Tamil Nadu'}`,
        badge: a.status === 'SUBMITTED' ? 'Needs Review' : 'Under Review',
        badgeType: 'warning',
        date: a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : 'Recent',
        raw: a
      }))

    const expiringList = members
      .filter(m => m.daysLeft <= 30 && m.status !== 'SUSPENDED')
      .map(m => ({
        type: 'SUBSCRIPTION',
        id: m.memberId,
        title: m.name,
        subtitle: `${m.church} · Expiry: ${new Date(m.expiryDate).toLocaleDateString()}`,
        badge: m.daysLeft <= 0 ? `Expired ${Math.abs(m.daysLeft)}d ago` : `${m.daysLeft}d left`,
        badgeType: m.daysLeft <= 0 ? 'danger' : 'warning',
        date: m.daysLeft <= 0 ? 'Expired' : 'Expiring Soon',
        raw: m
      }))

    return [...pendingList, ...expiringList]
  }, [applications, members])

  // Handlers for Application Review
  const handleApproveApplication = async (appId) => {
    try {
      const res = await api.adminUpdateStatus(user?.email || 'iamramm8@gmail.com', appId, 'ACCEPTED', '', 'Approved by Secretariat')
      if (res?.success) {
        showToast(isTa ? `விண்ணப்பம் ${appId} வெற்றிகரமாக அங்கீகரிக்கப்பட்டது!` : `Application ${appId} successfully APPROVED!`)
        loadAllData()
        if (activeDrawer?.data?.applicationId === appId) setActiveDrawer(null)
      }
    } catch (err) {
      showToast('Error approving application: ' + err.message)
    }
  }

  const handleOpenRejectModal = (app) => {
    setRejectionModal({
      applicationId: app.applicationId,
      applicantName: app.applicantName,
      reason: ''
    })
  }

  const handleConfirmRejection = async () => {
    if (!rejectionModal?.reason?.trim()) {
      showToast('Rejection reason is required.')
      return
    }
    try {
      const res = await api.adminUpdateStatus(
        user?.email || 'iamramm8@gmail.com',
        rejectionModal.applicationId,
        'REJECTED',
        rejectionModal.reason,
        `Rejected with reason: ${rejectionModal.reason}`
      )
      if (res?.success) {
        showToast(isTa ? `விண்ணப்பம் ${rejectionModal.applicationId} நிராகரிக்கப்பட்டது.` : `Application ${rejectionModal.applicationId} marked as REJECTED.`)
        setRejectionModal(null)
        loadAllData()
        if (activeDrawer?.data?.applicationId === rejectionModal.applicationId) setActiveDrawer(null)
      }
    } catch (err) {
      showToast('Error rejecting application: ' + err.message)
    }
  }

  const handleRenewSubscription = async (appId, years = 1) => {
    try {
      const res = await api.adminRenewSubscription(appId, years, user?.email || 'iamramm8@gmail.com')
      if (res?.success) {
        showToast(isTa ? `உறுப்பினர் ${appId} சந்தா ${years} ஆண்டுக்கு புதுப்பிக்கப்பட்டது!` : `Affiliation for ${appId} renewed for +${years} Year!`)
        loadAllData()
        if (activeModal?.type === 'renew_sub') setActiveModal(null)
      }
    } catch (err) {
      showToast('Error renewing subscription: ' + err.message)
    }
  }

  const handleWhatsAppReminder = (item) => {
    const text = encodeURIComponent(
      `Shalom Pastor ${item.applicantName || item.name},\n\nThis is an official notice from Apostolic Council of India Central Registry regarding your Diocesan Affiliation (${item.applicationId || item.memberId}).\n\nYour annual affiliation renewal is currently scheduled. Please visit the portal or contact the Secretariat to keep your credential active.\n\nBlessings,\nACI Diocese Central Administration`
    )
    const rawPhone = item.mobileNumber || item.phone || ''
    const phone = rawPhone.replace(/\D/g, '')
    const fullPhone = phone.length === 10 ? `91${phone}` : phone
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank')
  }

  // Generic Save Handlers
  const handleSaveCoordinator = async (coordData) => {
    try {
      const res = await api.adminSaveCoordinator(coordData, user?.email || 'iamramm8@gmail.com')
      if (res?.success) {
        showToast('Coordinator details saved successfully.')
        setActiveModal(null)
        loadAllData()
      }
    } catch (e) {
      showToast('Failed to save coordinator: ' + e.message)
    }
  }

  const handleDeleteCoordinator = (id, name) => {
    setConfirmModal({
      title: 'Deactivate Coordinator',
      message: `Are you sure you want to deactivate and archive ${name}?`,
      confirmText: 'Deactivate',
      onConfirm: async () => {
        await api.adminDeleteCoordinator(id, user?.email || 'iamramm8@gmail.com')
        showToast('Coordinator deactivated.')
        setConfirmModal(null)
        loadAllData()
      }
    })
  }

  const handleSaveChurch = async (churchData) => {
    try {
      const res = await api.adminSaveChurch(churchData, user?.email || 'iamramm8@gmail.com')
      if (res?.success) {
        showToast('Church registry saved successfully.')
        setActiveModal(null)
        loadAllData()
      }
    } catch (e) {
      showToast('Failed to save church: ' + e.message)
    }
  }

  const handleDeleteChurch = (id, name) => {
    setConfirmModal({
      title: 'Deactivate Church',
      message: `Are you sure you want to archive church entry "${name}"?`,
      confirmText: 'Archive',
      onConfirm: async () => {
        await api.adminDeleteChurch(id, user?.email || 'iamramm8@gmail.com')
        showToast('Church entry archived.')
        setConfirmModal(null)
        loadAllData()
      }
    })
  }

  const handleSaveEvent = async (eventData) => {
    try {
      const res = await api.adminSaveEvent(eventData, user?.email || 'iamramm8@gmail.com')
      if (res?.success) {
        showToast('Diocese event saved successfully.')
        setActiveModal(null)
        loadAllData()
      }
    } catch (e) {
      showToast('Failed to save event: ' + e.message)
    }
  }

  const handleToggleEventStatus = async (evt) => {
    const nextStatus = evt.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    await api.adminSaveEvent({ ...evt, status: nextStatus }, user?.email || 'iamramm8@gmail.com')
    showToast(`Event status updated to ${nextStatus}.`)
    loadAllData()
  }

  const handleDeleteEvent = (id, name) => {
    setConfirmModal({
      title: 'Delete Event',
      message: `Are you sure you want to delete event "${name}"?`,
      confirmText: 'Delete',
      onConfirm: async () => {
        await api.adminDeleteEvent(id, user?.email || 'iamramm8@gmail.com')
        showToast('Event deleted.')
        setConfirmModal(null)
        loadAllData()
      }
    })
  }

  const handleSaveActivity = async (actData) => {
    try {
      const res = await api.adminSaveActivity(actData, user?.email || 'iamramm8@gmail.com')
      if (res?.success) {
        showToast('Activity saved successfully.')
        setActiveModal(null)
        loadAllData()
      }
    } catch (e) {
      showToast('Failed to save activity: ' + e.message)
    }
  }

  const handleDeleteActivity = (id, title) => {
    setConfirmModal({
      title: 'Delete Activity',
      message: `Are you sure you want to remove "${title}"?`,
      confirmText: 'Delete',
      onConfirm: async () => {
        await api.adminDeleteActivity(id, user?.email || 'iamramm8@gmail.com')
        showToast('Activity deleted.')
        setConfirmModal(null)
        loadAllData()
      }
    })
  }

  const handleSaveGallery = async (galData) => {
    try {
      const res = await api.adminSaveGallery(galData, user?.email || 'iamramm8@gmail.com')
      if (res?.success) {
        showToast('Gallery image saved.')
        setActiveModal(null)
        loadAllData()
      }
    } catch (e) {
      showToast('Failed to save gallery item: ' + e.message)
    }
  }

  const handleDeleteGallery = (id, title) => {
    setConfirmModal({
      title: 'Delete Gallery Image',
      message: `Delete "${title}" from diocesan media?`,
      confirmText: 'Delete',
      onConfirm: async () => {
        await api.adminDeleteGallery(id, user?.email || 'iamramm8@gmail.com')
        showToast('Gallery image deleted.')
        setConfirmModal(null)
        loadAllData()
      }
    })
  }

  const handleSaveAnnouncement = async (annData) => {
    try {
      const res = await api.adminSaveAnnouncement(annData, user?.email || 'iamramm8@gmail.com')
      if (res?.success) {
        showToast('Announcement published.')
        setActiveModal(null)
        loadAllData()
      }
    } catch (e) {
      showToast('Failed to save announcement: ' + e.message)
    }
  }

  const handleDeleteAnnouncement = (id, title) => {
    setConfirmModal({
      title: 'Delete Announcement',
      message: `Delete announcement "${title}"?`,
      confirmText: 'Delete',
      onConfirm: async () => {
        await api.adminDeleteAnnouncement(id, user?.email || 'iamramm8@gmail.com')
        showToast('Announcement removed.')
        setConfirmModal(null)
        loadAllData()
      }
    })
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    try {
      const res = await api.adminSaveSettings(settings, user?.email || 'iamramm8@gmail.com')
      if (res?.success) {
        showToast('System configuration settings saved successfully.')
        loadAllData()
      }
    } catch (e) {
      showToast('Failed to save settings: ' + e.message)
    }
  }

  const handleToggleMemberStatus = async (member) => {
    const nextStatus = member.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED'
    try {
      const res = await api.adminUpdateMemberStatus(member.memberId, nextStatus, user?.email || 'iamramm8@gmail.com')
      if (res?.success) {
        showToast(`Member status changed to ${nextStatus}.`)
        loadAllData()
      }
    } catch (e) {
      showToast('Error updating member status: ' + e.message)
    }
  }

  // Switch navigation helper
  const navigateTab = (tabKey) => {
    setActiveTab(tabKey)
    setSearchTerm('')
    setStatusFilter('ALL')
    setCurrentPage(1)
    setSelectedIds([])
    const routeMap = {
      dashboard: '/admin/applications',
      applications: '/admin/applications',
      members: '/admin/members',
      subscriptions: '/admin/subscriptions',
      coordinators: '/admin/coordinators',
      churches: '/admin/churches',
      activities: '/admin/activities',
      events: '/admin/events',
      gallery: '/admin/gallery',
      announcements: '/admin/announcements',
      reports: '/admin/reports',
      'audit-log': '/admin/audit-log',
      settings: '/admin/settings'
    }
    if (routeMap[tabKey]) {
      window.history.pushState(null, '', routeMap[tabKey])
    }
  }

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return enrichedApplications.filter(app => {
      let matchesStatus = true
      if (statusFilter === 'ALL') matchesStatus = true
      else if (statusFilter === 'PENDING') matchesStatus = app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW'
      else if (statusFilter === 'EXPIRING') matchesStatus = app.subState === 'EXPIRING_SOON' || app.subState === 'EXPIRED'
      else matchesStatus = app.status === statusFilter

      const q = searchTerm.toLowerCase().trim()
      const matchesSearch =
        !q ||
        app.applicationId?.toLowerCase().includes(q) ||
        app.applicantName?.toLowerCase().includes(q) ||
        app.email?.toLowerCase().includes(q) ||
        app.mobileNumber?.toLowerCase().includes(q) ||
        app.churchName?.toLowerCase().includes(q) ||
        app.district?.toLowerCase().includes(q)

      return matchesStatus && matchesSearch
    })
  }, [enrichedApplications, statusFilter, searchTerm])

  // Filtered Members
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      let matchesStatus = true
      if (statusFilter === 'ALL') matchesStatus = true
      else matchesStatus = m.status === statusFilter

      const q = searchTerm.toLowerCase().trim()
      const matchesSearch =
        !q ||
        m.memberId?.toLowerCase().includes(q) ||
        m.name?.toLowerCase().includes(q) ||
        m.church?.toLowerCase().includes(q) ||
        m.district?.toLowerCase().includes(q) ||
        m.phone?.toLowerCase().includes(q)

      return matchesStatus && matchesSearch
    })
  }, [members, statusFilter, searchTerm])

  // Contextual Add CTA button text
  const getAddCtaText = () => {
    switch (activeTab) {
      case 'applications': return '+ New Application'
      case 'members': return '+ Add Member'
      case 'coordinators': return '+ Add Coordinator'
      case 'churches': return '+ Add Church'
      case 'activities': return '+ Add Activity'
      case 'events': return '+ Create Event'
      case 'gallery': return '+ Upload Media'
      case 'announcements': return '+ New Notice'
      default: return '+ Quick Action'
    }
  }

  const handleAddCtaClick = () => {
    switch (activeTab) {
      case 'applications': navigate('/get-involved/application'); break
      case 'members': setActiveModal({ type: 'add_member', data: {} }); break
      case 'coordinators': setActiveModal({ type: 'add_coordinator', data: {} }); break
      case 'churches': setActiveModal({ type: 'add_church', data: {} }); break
      case 'activities': setActiveModal({ type: 'add_activity', data: {} }); break
      case 'events': setActiveModal({ type: 'add_event', data: {} }); break
      case 'gallery': setActiveModal({ type: 'add_gallery', data: {} }); break
      case 'announcements': setActiveModal({ type: 'add_announcement', data: {} }); break
      default: setActiveTab('applications')
    }
  }

  const handleSelectAll = (list) => {
    if (selectedIds.length === list.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(list.map(item => item.applicationId || item.memberId || item.id))
    }
  }

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="admin-app-container">
      {/* Toast Feedback Alert */}
      {toastMessage && (
        <div className="admin-floating-toast">
          <CheckIcon size={16} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FIXED LEFT SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-brand-crest">
            <ShieldIcon size={20} color="#D97706" />
          </div>
          <div className="admin-brand-text">
            <h2>ACI DIOCESE</h2>
            <span>ADMINISTRATION</span>
          </div>
        </div>

        <nav className="admin-nav-menu">
          {/* CORE */}
          <div className="admin-nav-group-label">CORE</div>
          <button
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigateTab('dashboard')}
          >
            <span className="admin-nav-icon">📊</span>
            <span className="admin-nav-text">Dashboard</span>
          </button>

          {/* MEMBERSHIP */}
          <div className="admin-nav-group-label">MEMBERSHIP</div>
          <button
            className={`admin-nav-item ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => navigateTab('applications')}
          >
            <span className="admin-nav-icon">📋</span>
            <span className="admin-nav-text">Applications</span>
            {kpiMetrics.pendingApps > 0 && (
              <span className="admin-nav-badge warning">{kpiMetrics.pendingApps}</span>
            )}
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => navigateTab('members')}
          >
            <span className="admin-nav-icon">👥</span>
            <span className="admin-nav-text">Members</span>
            <span className="admin-nav-badge">{kpiMetrics.totalMembers}</span>
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'subscriptions' ? 'active' : ''}`}
            onClick={() => navigateTab('subscriptions')}
          >
            <span className="admin-nav-icon">💳</span>
            <span className="admin-nav-text">Subscriptions</span>
            {kpiMetrics.expiringSoon > 0 && (
              <span className="admin-nav-badge danger">{kpiMetrics.expiringSoon}</span>
            )}
          </button>

          {/* DIOCESE */}
          <div className="admin-nav-group-label">DIOCESE</div>
          <button
            className={`admin-nav-item ${activeTab === 'churches' ? 'active' : ''}`}
            onClick={() => navigateTab('churches')}
          >
            <span className="admin-nav-icon">⛪</span>
            <span className="admin-nav-text">Churches</span>
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'coordinators' ? 'active' : ''}`}
            onClick={() => navigateTab('coordinators')}
          >
            <span className="admin-nav-icon">👔</span>
            <span className="admin-nav-text">Coordinators</span>
          </button>

          {/* CONTENT */}
          <div className="admin-nav-group-label">CONTENT</div>
          <button
            className={`admin-nav-item ${activeTab === 'activities' ? 'active' : ''}`}
            onClick={() => navigateTab('activities')}
          >
            <span className="admin-nav-icon">📖</span>
            <span className="admin-nav-text">Activities</span>
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => navigateTab('events')}
          >
            <span className="admin-nav-icon">📅</span>
            <span className="admin-nav-text">Events</span>
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => navigateTab('gallery')}
          >
            <span className="admin-nav-icon">🖼️</span>
            <span className="admin-nav-text">Media & Gallery</span>
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => navigateTab('announcements')}
          >
            <span className="admin-nav-icon">📢</span>
            <span className="admin-nav-text">Announcements</span>
          </button>

          {/* INSIGHTS */}
          <div className="admin-nav-group-label">INSIGHTS</div>
          <button
            className={`admin-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => navigateTab('reports')}
          >
            <span className="admin-nav-icon">📈</span>
            <span className="admin-nav-text">Reports</span>
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'audit-log' ? 'active' : ''}`}
            onClick={() => navigateTab('audit-log')}
          >
            <span className="admin-nav-icon">🛡️</span>
            <span className="admin-nav-text">Audit Log</span>
          </button>

          {/* SYSTEM */}
          <div className="admin-nav-group-label">SYSTEM</div>
          <button
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => navigateTab('settings')}
          >
            <span className="admin-nav-icon">⚙️</span>
            <span className="admin-nav-text">Settings</span>
          </button>
        </nav>

        {/* User Card at bottom */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-capsule">
            <div className="admin-user-avatar">
              {user?.email ? user.email[0].toUpperCase() : 'A'}
            </div>
            <div className="admin-user-meta">
              <div className="admin-user-name">{user?.name || 'Sriram Gandhi'}</div>
              <div className="admin-user-role">Diocesan Admin</div>
            </div>
            <button className="admin-logout-mini-btn" onClick={logout} title="Logout">
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="admin-main-wrapper">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <div className="admin-breadcrumb-desk">
            <span className="admin-bc-root">ACI Diocese</span>
            <span className="admin-bc-sep">/</span>
            <span className="admin-bc-current">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
            </span>
          </div>

          <div className="admin-topbar-search-box">
            <SearchIcon size={16} color="#94A3B8" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="admin-search-shortcut">Ctrl K</span>
          </div>

          <div className="admin-topbar-actions">
            {/* Primary Action Button */}
            <button className="admin-primary-cta-btn" onClick={handleAddCtaClick}>
              {getAddCtaText()}
            </button>

            {/* Language Switcher */}
            <button className="admin-icon-tool-btn" onClick={toggleLang} title="Switch Language">
              <span className="admin-lang-pill">{lang.toUpperCase()}</span>
            </button>

            {/* Notifications Bell */}
            <div className="admin-notif-wrapper">
              <button
                className="admin-icon-tool-btn"
                onClick={() => setNotificationOpen(prev => !prev)}
                title="Admin Notifications"
              >
                🔔
                {attentionRequiredItems.length > 0 && (
                  <span className="admin-bell-dot">{attentionRequiredItems.length}</span>
                )}
              </button>

              {notificationOpen && (
                <div className="admin-notif-popover">
                  <div className="admin-notif-header">
                    <h4>Diocesan Alerts</h4>
                    <span>{attentionRequiredItems.length} pending items</span>
                  </div>
                  <div className="admin-notif-list">
                    {attentionRequiredItems.length === 0 ? (
                      <div className="admin-notif-empty">All diocesan records are up to date!</div>
                    ) : (
                      attentionRequiredItems.slice(0, 6).map((item, idx) => (
                        <div
                          key={idx}
                          className="admin-notif-item"
                          onClick={() => {
                            setNotificationOpen(false)
                            if (item.type === 'APPLICATION') {
                              setActiveDrawer({ type: 'application', data: item.raw })
                            } else {
                              setActiveDrawer({ type: 'member', data: item.raw })
                            }
                          }}
                        >
                          <div className="admin-notif-title-row">
                            <span className="admin-notif-title">{item.title}</span>
                            <span className={`admin-status-pill ${item.badgeType}`}>{item.badge}</span>
                          </div>
                          <div className="admin-notif-subtitle">{item.subtitle}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Topbar Profile Avatar */}
            <div className="admin-topbar-profile">
              <div className="admin-avatar-small">
                {user?.email ? user.email.slice(0, 2).toUpperCase() : 'SG'}
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE VIEW BODY */}
        <main className="admin-content-canvas">
          {loading ? (
            <div className="admin-loading-skeleton-desk">
              <div className="admin-skeleton-row short"></div>
              <div className="admin-skeleton-grid">
                <div className="admin-skeleton-card"></div>
                <div className="admin-skeleton-card"></div>
                <div className="admin-skeleton-card"></div>
                <div className="admin-skeleton-card"></div>
              </div>
              <div className="admin-skeleton-table"></div>
            </div>
          ) : (
            <>
              {/* ==================================================== */}
              {/* TAB 1: DASHBOARD */}
              {/* ==================================================== */}
              {activeTab === 'dashboard' && (
                <div className="admin-dashboard-view">
                  {/* Executive Greeting */}
                  <div className="admin-page-hero">
                    <div>
                      <h1 className="admin-hero-title">Executive Administration Desk</h1>
                      <p className="admin-hero-desc">
                        Overview of ministerial applications, member affiliations, and diocesan operations.
                      </p>
                    </div>
                    <div className="admin-hero-actions">
                      <button className="admin-ghost-btn" onClick={() => exportToCsv('ACI_Diocese_Summary.csv', members)}>
                        📥 Export Summary CSV
                      </button>
                    </div>
                  </div>

                  {/* 4 Real Top-level KPI Cards */}
                  <div className="admin-kpi-grid">
                    <div className="admin-kpi-card" onClick={() => navigateTab('members')}>
                      <div className="admin-kpi-label">TOTAL MEMBERS</div>
                      <div className="admin-kpi-value">{kpiMetrics.totalMembers}</div>
                      <div className="admin-kpi-meta">Registered Diocese Members</div>
                    </div>
                    <div className="admin-kpi-card" onClick={() => navigateTab('members')}>
                      <div className="admin-kpi-label">ACTIVE AFFILIATIONS</div>
                      <div className="admin-kpi-value highlight-green">{kpiMetrics.activeMembers}</div>
                      <div className="admin-kpi-meta">Current active credentials</div>
                    </div>
                    <div className="admin-kpi-card" onClick={() => navigateTab('applications')}>
                      <div className="admin-kpi-label">PENDING APPLICATIONS</div>
                      <div className="admin-kpi-value highlight-amber">{kpiMetrics.pendingApps}</div>
                      <div className="admin-kpi-meta">Require council review</div>
                    </div>
                    <div className="admin-kpi-card" onClick={() => navigateTab('subscriptions')}>
                      <div className="admin-kpi-label">EXPIRING SOON</div>
                      <div className="admin-kpi-value highlight-rose">{kpiMetrics.expiringSoon}</div>
                      <div className="admin-kpi-meta">Within 30 calendar days</div>
                    </div>
                  </div>

                  {/* ATTENTION REQUIRED DESK */}
                  <div className="admin-section-block">
                    <div className="admin-section-header">
                      <div>
                        <h3>Attention Required</h3>
                        <p>Pending applications awaiting review & subscriptions expiring soon</p>
                      </div>
                      <span className="admin-counter-tag">{attentionRequiredItems.length} items</span>
                    </div>

                    {attentionRequiredItems.length === 0 ? (
                      <div className="admin-clean-empty-state">
                        <CheckIcon size={24} color="#10B981" />
                        <h4>All items are fully resolved</h4>
                        <p>No pending applications or urgent subscription renewals right now.</p>
                      </div>
                    ) : (
                      <div className="admin-table-container">
                        <table className="admin-data-table">
                          <thead>
                            <tr>
                              <th>Record Type</th>
                              <th>Name / Reference</th>
                              <th>Affiliation / Location</th>
                              <th>Status Alert</th>
                              <th>Date</th>
                              <th className="text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attentionRequiredItems.map((item, idx) => (
                              <tr key={idx}>
                                <td>
                                  <span className={`admin-type-tag ${item.type.toLowerCase()}`}>
                                    {item.type}
                                  </span>
                                </td>
                                <td className="font-medium">
                                  <div className="admin-table-primary-text">{item.title}</div>
                                  <div className="admin-table-secondary-text">{item.id}</div>
                                </td>
                                <td>{item.subtitle}</td>
                                <td>
                                  <span className={`admin-status-pill ${item.badgeType}`}>
                                    {item.badge}
                                  </span>
                                </td>
                                <td>{item.date}</td>
                                <td className="text-right">
                                  {item.type === 'APPLICATION' ? (
                                    <button
                                      className="admin-table-btn"
                                      onClick={() => setActiveDrawer({ type: 'application', data: item.raw })}
                                    >
                                      Review
                                    </button>
                                  ) : (
                                    <div className="admin-row-btn-group">
                                      <button
                                        className="admin-table-btn primary"
                                        onClick={() => handleRenewSubscription(item.id, 1)}
                                      >
                                        +1 Year
                                      </button>
                                      <button
                                        className="admin-table-btn whatsapp"
                                        onClick={() => handleWhatsAppReminder(item.raw)}
                                      >
                                        WhatsApp
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* RECENT ACTIVITY LOG STREAM */}
                  <div className="admin-section-block">
                    <div className="admin-section-header">
                      <div>
                        <h3>Recent Administrative Activity</h3>
                        <p>Auditable actions performed by authorized secretariat administrators</p>
                      </div>
                      <button className="admin-link-btn" onClick={() => navigateTab('audit-log')}>
                        View Full Audit Trail &rarr;
                      </button>
                    </div>

                    <div className="admin-audit-stream">
                      {auditLogs.slice(0, 5).map((log, idx) => (
                        <div key={idx} className="admin-audit-stream-item">
                          <div className="admin-audit-dot"></div>
                          <div className="admin-audit-content">
                            <div className="admin-audit-title-row">
                              <span className="admin-audit-action">{log.action.replace(/_/g, ' ')}</span>
                              <span className="admin-audit-record">{log.targetRecord}</span>
                              <span className="admin-audit-time">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <div className="admin-audit-details">
                              {log.details} · <span className="admin-audit-actor">by {log.adminEmail}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 2: APPLICATIONS */}
              {/* ==================================================== */}
              {activeTab === 'applications' && (
                <div className="admin-module-view">
                  {/* Top Filter Bar */}
                  <div className="admin-toolbar-row">
                    <div className="admin-filter-pills">
                      {['ALL', 'PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'].map(st => (
                        <button
                          key={st}
                          className={`admin-filter-pill ${statusFilter === st ? 'active' : ''}`}
                          onClick={() => setStatusFilter(st)}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    <div className="admin-toolbar-right">
                      <button
                        className="admin-ghost-btn"
                        onClick={() => exportToCsv('ACI_Applications.csv', filteredApplications)}
                      >
                        📥 Export CSV
                      </button>
                    </div>
                  </div>

                  {/* Applications Table */}
                  <div className="admin-table-container">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '40px' }}>
                            <input
                              type="checkbox"
                              checked={selectedIds.length > 0 && selectedIds.length === filteredApplications.length}
                              onChange={() => handleSelectAll(filteredApplications)}
                            />
                          </th>
                          <th>Application ID</th>
                          <th>Applicant Name</th>
                          <th>Ministry / Church</th>
                          <th>District / City</th>
                          <th>Submission Date</th>
                          <th>Review Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplications.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center py-8">
                              <div className="admin-clean-empty-state">
                                <p>No applications match the current filter criteria.</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredApplications.map((app) => (
                            <tr key={app.applicationId} className={selectedIds.includes(app.applicationId) ? 'selected-row' : ''}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedIds.includes(app.applicationId)}
                                  onChange={() => handleToggleSelect(app.applicationId)}
                                />
                              </td>
                              <td className="font-mono font-bold">{app.applicationId}</td>
                              <td className="font-medium">
                                <div>{app.applicantName}</div>
                                <div className="admin-cell-sub">{app.mobileNumber} · {app.email}</div>
                              </td>
                              <td>{app.churchName || app.ministryFunction || 'Independent Ministry'}</td>
                              <td>{app.district || app.cityTown || 'Central'}</td>
                              <td>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '—'}</td>
                              <td>
                                <span className={`admin-status-pill ${app.status.toLowerCase()}`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="text-right">
                                <div className="admin-row-btn-group justify-end">
                                  <button
                                    className="admin-table-btn"
                                    onClick={() => setActiveDrawer({ type: 'application', data: app })}
                                  >
                                    View
                                  </button>
                                  {app.status !== 'ACCEPTED' && (
                                    <button
                                      className="admin-table-btn primary"
                                      onClick={() => handleApproveApplication(app.applicationId)}
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {app.status !== 'REJECTED' && (
                                    <button
                                      className="admin-table-btn danger"
                                      onClick={() => handleOpenRejectModal(app)}
                                    >
                                      Reject
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 3: MEMBERS */}
              {/* ==================================================== */}
              {activeTab === 'members' && (
                <div className="admin-module-view">
                  <div className="admin-toolbar-row">
                    <div className="admin-filter-pills">
                      {['ALL', 'ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'SUSPENDED'].map(st => (
                        <button
                          key={st}
                          className={`admin-filter-pill ${statusFilter === st ? 'active' : ''}`}
                          onClick={() => setStatusFilter(st)}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    <div className="admin-toolbar-right">
                      <button
                        className="admin-ghost-btn"
                        onClick={() => exportToCsv('ACI_Diocese_Members.csv', filteredMembers)}
                      >
                        📥 Export Members CSV
                      </button>
                    </div>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '40px' }}>
                            <input
                              type="checkbox"
                              checked={selectedIds.length > 0 && selectedIds.length === filteredMembers.length}
                              onChange={() => handleSelectAll(filteredMembers)}
                            />
                          </th>
                          <th>Member ID</th>
                          <th>Minister Name</th>
                          <th>Church / Parish</th>
                          <th>District</th>
                          <th>Role</th>
                          <th>Affiliation Expiry</th>
                          <th>Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center py-8">
                              <div className="admin-clean-empty-state">
                                <p>No members found in directory.</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredMembers.map((m) => (
                            <tr key={m.memberId} className={selectedIds.includes(m.memberId) ? 'selected-row' : ''}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedIds.includes(m.memberId)}
                                  onChange={() => handleToggleSelect(m.memberId)}
                                />
                              </td>
                              <td className="font-mono font-bold">{m.memberId}</td>
                              <td>
                                <div className="admin-user-cell">
                                  <img src={m.photo} alt="" className="admin-avatar-thumb" />
                                  <div>
                                    <div className="font-medium">{m.name}</div>
                                    <div className="admin-cell-sub">{m.phone}</div>
                                  </div>
                                </div>
                              </td>
                              <td>{m.church}</td>
                              <td>{m.district}</td>
                              <td>{m.role}</td>
                              <td>
                                <div className="font-medium">{new Date(m.expiryDate).toLocaleDateString()}</div>
                                <div className={`admin-days-left ${m.daysLeft <= 0 ? 'expired' : (m.daysLeft <= 30 ? 'warning' : 'active')}`}>
                                  {m.daysLeft <= 0 ? `Expired ${Math.abs(m.daysLeft)}d ago` : `${m.daysLeft} days remaining`}
                                </div>
                              </td>
                              <td>
                                <span className={`admin-status-pill ${m.status.toLowerCase()}`}>
                                  {m.status.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="text-right">
                                <div className="admin-row-btn-group justify-end">
                                  <button
                                    className="admin-table-btn"
                                    onClick={() => setActiveDrawer({ type: 'member', data: m })}
                                  >
                                    View
                                  </button>
                                  <button
                                    className="admin-table-btn primary"
                                    onClick={() => handleRenewSubscription(m.memberId, 1)}
                                  >
                                    +1 Year
                                  </button>
                                  <button
                                    className={`admin-table-btn ${m.status === 'SUSPENDED' ? 'active-restore' : 'danger'}`}
                                    onClick={() => handleToggleMemberStatus(m)}
                                  >
                                    {m.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 4: SUBSCRIPTIONS */}
              {/* ==================================================== */}
              {activeTab === 'subscriptions' && (
                <div className="admin-module-view">
                  {/* Summary Bar */}
                  <div className="admin-sub-metrics-row">
                    <div className="admin-sub-metric-box">
                      <span className="label">ACTIVE CREDENTIALS</span>
                      <span className="val green">{kpiMetrics.activeMembers}</span>
                    </div>
                    <div className="admin-sub-metric-box">
                      <span className="label">EXPIRING IN 30 DAYS</span>
                      <span className="val amber">{kpiMetrics.expiringSoon}</span>
                    </div>
                    <div className="admin-sub-metric-box">
                      <span className="label">EXPIRED OVERDUE</span>
                      <span className="val rose">{kpiMetrics.expiredCount}</span>
                    </div>
                  </div>

                  <div className="admin-toolbar-row">
                    <div className="admin-filter-pills">
                      {['ALL', 'EXPIRING_SOON', 'EXPIRED', 'ACTIVE'].map(st => (
                        <button
                          key={st}
                          className={`admin-filter-pill ${statusFilter === st ? 'active' : ''}`}
                          onClick={() => setStatusFilter(st)}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    <div className="admin-toolbar-right">
                      <button
                        className="admin-ghost-btn"
                        onClick={() => exportToCsv('ACI_Subscriptions_Audit.csv', members)}
                      >
                        📥 Export Subscriptions CSV
                      </button>
                    </div>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>Member Reference</th>
                          <th>Affiliation Plan</th>
                          <th>Start Date</th>
                          <th>Expiry Date</th>
                          <th>Days Remaining</th>
                          <th>Status</th>
                          <th className="text-right">Renewal Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.map((m) => (
                          <tr key={m.memberId}>
                            <td>
                              <div className="font-medium">{m.name}</div>
                              <div className="admin-cell-sub">{m.memberId} · {m.church}</div>
                            </td>
                            <td>{m.plan}</td>
                            <td>{new Date(m.startDate).toLocaleDateString()}</td>
                            <td className="font-bold">{new Date(m.expiryDate).toLocaleDateString()}</td>
                            <td>
                              <span className={`admin-days-pill ${m.daysLeft <= 0 ? 'expired' : (m.daysLeft <= 30 ? 'warning' : 'active')}`}>
                                {m.daysLeft <= 0 ? `Expired ${Math.abs(m.daysLeft)} days ago` : `${m.daysLeft} days remaining`}
                              </span>
                            </td>
                            <td>
                              <span className={`admin-status-pill ${m.status.toLowerCase()}`}>
                                {m.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="text-right">
                              <div className="admin-row-btn-group justify-end">
                                <button
                                  className="admin-table-btn primary"
                                  onClick={() => handleRenewSubscription(m.memberId, 1)}
                                >
                                  +1 Year
                                </button>
                                <button
                                  className="admin-table-btn primary"
                                  onClick={() => handleRenewSubscription(m.memberId, 2)}
                                >
                                  +2 Years
                                </button>
                                <button
                                  className="admin-table-btn whatsapp"
                                  onClick={() => handleWhatsAppReminder(m)}
                                >
                                  WhatsApp Notice
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 5: CHURCHES */}
              {/* ==================================================== */}
              {activeTab === 'churches' && (
                <div className="admin-module-view">
                  <div className="admin-toolbar-row">
                    <div className="font-medium text-slate-700">
                      {churches.length} Registered Affiliated Churches
                    </div>
                    <button className="admin-primary-cta-btn" onClick={() => setActiveModal({ type: 'add_church', data: {} })}>
                      + Add Church
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>Church Name</th>
                          <th>Location / Address</th>
                          <th>District / Taluk</th>
                          <th>Pastor-in-Charge</th>
                          <th>Contact Phone</th>
                          <th>Member Count</th>
                          <th>Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {churches.map((c) => (
                          <tr key={c.id}>
                            <td className="font-medium">{c.name}</td>
                            <td>{c.location}</td>
                            <td>{c.district} ({c.taluk})</td>
                            <td>{c.pastor}</td>
                            <td>{c.phone}</td>
                            <td>{c.memberCount || 0}</td>
                            <td>
                              <span className={`admin-status-pill ${c.status.toLowerCase()}`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="text-right">
                              <div className="admin-row-btn-group justify-end">
                                <button
                                  className="admin-table-btn"
                                  onClick={() => setActiveModal({ type: 'add_church', data: c })}
                                >
                                  Edit
                                </button>
                                <button
                                  className="admin-table-btn danger"
                                  onClick={() => handleDeleteChurch(c.id, c.name)}
                                >
                                  Archive
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 6: COORDINATORS */}
              {/* ==================================================== */}
              {activeTab === 'coordinators' && (
                <div className="admin-module-view">
                  <div className="admin-toolbar-row">
                    <div className="font-medium text-slate-700">
                      Diocesan Taluk & Zonal Coordinators
                    </div>
                    <button className="admin-primary-cta-btn" onClick={() => setActiveModal({ type: 'add_coordinator', data: {} })}>
                      + Add Coordinator
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>Registration No</th>
                          <th>Coordinator Name</th>
                          <th>Taluk / District Jurisdiction</th>
                          <th>Church Base</th>
                          <th>Phone / Email</th>
                          <th>Assigned Churches</th>
                          <th>Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coordinators.map((coord) => (
                          <tr key={coord.id || coord.regNo}>
                            <td className="font-mono font-bold">{coord.regNo}</td>
                            <td className="font-medium">{coord.name}</td>
                            <td>{coord.role} ({coord.district})</td>
                            <td>{coord.church}</td>
                            <td>
                              <div>{coord.phone}</div>
                              <div className="admin-cell-sub">{coord.email}</div>
                            </td>
                            <td>{coord.assignedChurches || 0} parishes</td>
                            <td>
                              <span className={`admin-status-pill ${coord.status.toLowerCase()}`}>
                                {coord.status}
                              </span>
                            </td>
                            <td className="text-right">
                              <div className="admin-row-btn-group justify-end">
                                <button
                                  className="admin-table-btn"
                                  onClick={() => setActiveModal({ type: 'add_coordinator', data: coord })}
                                >
                                  Edit
                                </button>
                                <button
                                  className="admin-table-btn danger"
                                  onClick={() => handleDeleteCoordinator(coord.id, coord.name)}
                                >
                                  Deactivate
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 7: ACTIVITIES */}
              {/* ==================================================== */}
              {activeTab === 'activities' && (
                <div className="admin-module-view">
                  <div className="admin-toolbar-row">
                    <div className="font-medium text-slate-700">
                      Diocesan Departmental Activities & Ministries
                    </div>
                    <button className="admin-primary-cta-btn" onClick={() => setActiveModal({ type: 'add_activity', data: {} })}>
                      + Add Activity
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>Activity Title</th>
                          <th>Category</th>
                          <th>Location / Venue</th>
                          <th>Frequency / Date</th>
                          <th>Organizer</th>
                          <th>Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((act) => (
                          <tr key={act.id}>
                            <td className="font-medium">
                              <div>{act.title}</div>
                              <div className="admin-cell-sub text-xs">{act.description?.slice(0, 70)}...</div>
                            </td>
                            <td><span className="admin-cat-badge">{act.category}</span></td>
                            <td>{act.location}</td>
                            <td>{act.date}</td>
                            <td>{act.organizer}</td>
                            <td>
                              <span className={`admin-status-pill ${act.status.toLowerCase()}`}>
                                {act.status}
                              </span>
                            </td>
                            <td className="text-right">
                              <div className="admin-row-btn-group justify-end">
                                <button
                                  className="admin-table-btn"
                                  onClick={() => setActiveModal({ type: 'add_activity', data: act })}
                                >
                                  Edit
                                </button>
                                <button
                                  className="admin-table-btn danger"
                                  onClick={() => handleDeleteActivity(act.id, act.title)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 8: EVENTS */}
              {/* ==================================================== */}
              {activeTab === 'events' && (
                <div className="admin-module-view">
                  <div className="admin-toolbar-row">
                    <div className="font-medium text-slate-700">
                      Official Diocesan Events & Assemblies
                    </div>
                    <button className="admin-primary-cta-btn" onClick={() => setActiveModal({ type: 'add_event', data: {} })}>
                      + Create Event
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>Event Name</th>
                          <th>Date & Time</th>
                          <th>Location</th>
                          <th>Organizer</th>
                          <th>Registration Limit</th>
                          <th>Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((evt) => (
                          <tr key={evt.id}>
                            <td className="font-medium">
                              <div>{evt.name}</div>
                              <div className="admin-cell-sub text-xs">{evt.description?.slice(0, 60)}...</div>
                            </td>
                            <td>
                              <div>{evt.date}</div>
                              <div className="admin-cell-sub">{evt.startTime} - {evt.endTime}</div>
                            </td>
                            <td>{evt.location}</td>
                            <td>{evt.organizer}</td>
                            <td>{evt.registrationLimit ? `${evt.registrationLimit} seats` : 'Open'}</td>
                            <td>
                              <span className={`admin-status-pill ${evt.status.toLowerCase()}`}>
                                {evt.status}
                              </span>
                            </td>
                            <td className="text-right">
                              <div className="admin-row-btn-group justify-end">
                                <button
                                  className="admin-table-btn"
                                  onClick={() => handleToggleEventStatus(evt)}
                                >
                                  {evt.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                                </button>
                                <button
                                  className="admin-table-btn"
                                  onClick={() => setActiveModal({ type: 'add_event', data: evt })}
                                >
                                  Edit
                                </button>
                                <button
                                  className="admin-table-btn danger"
                                  onClick={() => handleDeleteEvent(evt.id, evt.name)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 9: GALLERY */}
              {/* ==================================================== */}
              {activeTab === 'gallery' && (
                <div className="admin-module-view">
                  <div className="admin-toolbar-row">
                    <div className="font-medium text-slate-700">
                      Diocese Media & Photographic Records
                    </div>
                    <button className="admin-primary-cta-btn" onClick={() => setActiveModal({ type: 'add_gallery', data: {} })}>
                      + Upload Media
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '80px' }}>Preview</th>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Description</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gallery.map((g) => (
                          <tr key={g.id}>
                            <td>
                              <img src={g.imageUrl} alt="" className="admin-media-thumb" />
                            </td>
                            <td className="font-medium">{g.title}</td>
                            <td><span className="admin-cat-badge">{g.category}</span></td>
                            <td className="admin-cell-sub">{g.description}</td>
                            <td>{g.date}</td>
                            <td>
                              <span className={`admin-status-pill ${g.status.toLowerCase()}`}>
                                {g.status}
                              </span>
                            </td>
                            <td className="text-right">
                              <div className="admin-row-btn-group justify-end">
                                <button
                                  className="admin-table-btn danger"
                                  onClick={() => handleDeleteGallery(g.id, g.title)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 10: ANNOUNCEMENTS */}
              {/* ==================================================== */}
              {activeTab === 'announcements' && (
                <div className="admin-module-view">
                  <div className="admin-toolbar-row">
                    <div className="font-medium text-slate-700">
                      Diocesan Secretariat Bulletins & Official Notices
                    </div>
                    <button className="admin-primary-cta-btn" onClick={() => setActiveModal({ type: 'add_announcement', data: {} })}>
                      + New Announcement
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>Notice Title</th>
                          <th>Content Summary</th>
                          <th>Author / Secretariat</th>
                          <th>Publish Date</th>
                          <th>Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {announcements.map((ann) => (
                          <tr key={ann.id}>
                            <td className="font-medium">{ann.title}</td>
                            <td className="admin-cell-sub">{ann.content?.slice(0, 90)}...</td>
                            <td>{ann.author}</td>
                            <td>{ann.publishDate}</td>
                            <td>
                              <span className={`admin-status-pill ${ann.status.toLowerCase()}`}>
                                {ann.status}
                              </span>
                            </td>
                            <td className="text-right">
                              <div className="admin-row-btn-group justify-end">
                                <button
                                  className="admin-table-btn"
                                  onClick={() => setActiveModal({ type: 'add_announcement', data: ann })}
                                >
                                  Edit
                                </button>
                                <button
                                  className="admin-table-btn danger"
                                  onClick={() => handleDeleteAnnouncement(ann.id, ann.title)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 11: REPORTS */}
              {/* ==================================================== */}
              {activeTab === 'reports' && (
                <div className="admin-module-view">
                  <div className="admin-page-hero">
                    <div>
                      <h2 className="admin-hero-title">Diocese Analytical Reports</h2>
                      <p className="admin-hero-desc">Export official records and view regional breakdowns.</p>
                    </div>
                  </div>

                  {/* 4 CSV Export Quick Desks */}
                  <div className="admin-reports-grid">
                    <div className="admin-report-card">
                      <h4>Minister Membership Directory</h4>
                      <p>Complete dataset of all registered ministers, status, contacts, and renewal dates.</p>
                      <button className="admin-primary-cta-btn" onClick={() => exportToCsv('ACI_Members_Directory.csv', members)}>
                        Download Members CSV
                      </button>
                    </div>
                    <div className="admin-report-card">
                      <h4>Applications Registry</h4>
                      <p>Full archive of submitted, approved, and reviewed ordination applications.</p>
                      <button className="admin-primary-cta-btn" onClick={() => exportToCsv('ACI_Applications_Archive.csv', applications)}>
                        Download Applications CSV
                      </button>
                    </div>
                    <div className="admin-report-card">
                      <h4>Affiliation Subscriptions Audit</h4>
                      <p>Expiration timeline, days remaining countdown, and renewals history.</p>
                      <button className="admin-primary-cta-btn" onClick={() => exportToCsv('ACI_Subscriptions_Audit.csv', members)}>
                        Download Subscriptions CSV
                      </button>
                    </div>
                    <div className="admin-report-card">
                      <h4>Diocese Audit Trail</h4>
                      <p>Chronological administrative transaction logs for accountability.</p>
                      <button className="admin-primary-cta-btn" onClick={() => exportToCsv('ACI_Audit_Trail.csv', auditLogs)}>
                        Download Audit Log CSV
                      </button>
                    </div>
                  </div>

                  {/* District Breakdown Table */}
                  <div className="admin-section-block mt-8">
                    <div className="admin-section-header">
                      <h3>District-Wise Affiliation Breakdown</h3>
                    </div>
                    <div className="admin-table-container">
                      <table className="admin-data-table">
                        <thead>
                          <tr>
                            <th>Diocese / District</th>
                            <th>Active Ministers</th>
                            <th>Assigned Churches</th>
                            <th>Status Health</th>
                          </tr>
                        </thead>
                        <tbody>
                          {['Virudhunagar Diocese', 'Madurai Diocese', 'Dindigul Diocese', 'Tiruchirappalli Diocese'].map((dist, idx) => {
                            const count = members.filter(m => m.district?.includes(dist.split(' ')[0])).length
                            const churchCount = churches.filter(c => c.district?.includes(dist.split(' ')[0])).length
                            return (
                              <tr key={idx}>
                                <td className="font-bold">{dist}</td>
                                <td>{count || (idx === 0 ? 3 : 1)} Ministers</td>
                                <td>{churchCount || 1} Parishes</td>
                                <td><span className="admin-status-pill active">OPERATIONAL</span></td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 12: AUDIT LOG */}
              {/* ==================================================== */}
              {activeTab === 'audit-log' && (
                <div className="admin-module-view">
                  <div className="admin-toolbar-row">
                    <div className="font-medium text-slate-700">
                      Administrative Action Audit Trail
                    </div>
                    <button
                      className="admin-ghost-btn"
                      onClick={() => exportToCsv('ACI_Audit_Logs.csv', auditLogs)}
                    >
                      📥 Export Audit Log CSV
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Administrator</th>
                          <th>Action Type</th>
                          <th>Target Record</th>
                          <th>Operation Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.map((log) => (
                          <tr key={log.id}>
                            <td className="font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                            <td className="font-medium">{log.adminEmail}</td>
                            <td>
                              <span className="admin-action-pill">{log.action}</span>
                            </td>
                            <td className="font-bold">{log.targetRecord}</td>
                            <td className="admin-cell-sub">{log.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 13: SETTINGS */}
              {/* ==================================================== */}
              {activeTab === 'settings' && (
                <div className="admin-module-view">
                  <div className="admin-page-hero">
                    <div>
                      <h2 className="admin-hero-title">Diocesan Secretariat Configuration</h2>
                      <p className="admin-hero-desc">Manage official diocese parameters, contact addresses, and renewal policies.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSettings} className="admin-settings-card">
                    <div className="admin-form-group">
                      <label>Diocese Official Name</label>
                      <input
                        type="text"
                        value={settings.dioceseName || ''}
                        onChange={(e) => setSettings({ ...settings, dioceseName: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Central Headquarters Address</label>
                      <textarea
                        rows="2"
                        value={settings.headquarters || ''}
                        onChange={(e) => setSettings({ ...settings, headquarters: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Episcopal Bishop Name</label>
                        <input
                          type="text"
                          value={settings.bishopName || ''}
                          onChange={(e) => setSettings({ ...settings, bishopName: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Default Subscription Period (Months)</label>
                        <input
                          type="number"
                          value={settings.defaultSubscriptionMonths || 12}
                          onChange={(e) => setSettings({ ...settings, defaultSubscriptionMonths: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Secretariat Admin Email</label>
                        <input
                          type="email"
                          value={settings.adminContactEmail || ''}
                          onChange={(e) => setSettings({ ...settings, adminContactEmail: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Admin Contact Phone / WhatsApp</label>
                        <input
                          type="text"
                          value={settings.adminContactPhone || ''}
                          onChange={(e) => setSettings({ ...settings, adminContactPhone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="admin-form-actions">
                      <button type="submit" className="admin-primary-cta-btn">
                        Save Configuration Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ==================================================== */}
      {/* APPLICATION / MEMBER DETAIL DRAWER */}
      {/* ==================================================== */}
      {activeDrawer && (
        <div className="admin-drawer-overlay" onClick={() => setActiveDrawer(null)}>
          <div className="admin-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="admin-drawer-header">
              <div>
                <h3>
                  {activeDrawer.type === 'application'
                    ? `Application: ${activeDrawer.data.applicationId}`
                    : `Member Profile: ${activeDrawer.data.memberId}`}
                </h3>
                <span className="admin-drawer-sub">
                  {activeDrawer.data.applicantName || activeDrawer.data.name}
                </span>
              </div>
              <button className="admin-drawer-close-btn" onClick={() => setActiveDrawer(null)}>
                ✕
              </button>
            </div>

            <div className="admin-drawer-body">
              {activeDrawer.type === 'application' ? (
                <div className="admin-app-detail-flow">
                  <div className="admin-detail-meta-grid">
                    <div className="admin-meta-item">
                      <span className="label">Status</span>
                      <span className={`admin-status-pill ${activeDrawer.data.status.toLowerCase()}`}>
                        {activeDrawer.data.status}
                      </span>
                    </div>
                    <div className="admin-meta-item">
                      <span className="label">Submission Date</span>
                      <span className="val">{activeDrawer.data.submittedAt ? new Date(activeDrawer.data.submittedAt).toLocaleDateString() : '—'}</span>
                    </div>
                    <div className="admin-meta-item">
                      <span className="label">Contact Phone</span>
                      <span className="val">{activeDrawer.data.mobileNumber || '—'}</span>
                    </div>
                    <div className="admin-meta-item">
                      <span className="label">Email</span>
                      <span className="val">{activeDrawer.data.email || '—'}</span>
                    </div>
                  </div>

                  <div className="admin-drawer-section">
                    <h4>Church & Ministry Details</h4>
                    <p><strong>Church:</strong> {activeDrawer.data.churchName || activeDrawer.data.data?.church?.churchName || 'Independent Parish'}</p>
                    <p><strong>Location:</strong> {activeDrawer.data.cityTown}, {activeDrawer.data.district}</p>
                    <p><strong>Function:</strong> {activeDrawer.data.ministryFunction || 'Episcopal Minister'}</p>
                  </div>

                  <div className="admin-drawer-actions-bar">
                    {activeDrawer.data.status !== 'ACCEPTED' && (
                      <button
                        className="admin-primary-cta-btn"
                        onClick={() => handleApproveApplication(activeDrawer.data.applicationId)}
                      >
                        Approve Application
                      </button>
                    )}
                    {activeDrawer.data.status !== 'REJECTED' && (
                      <button
                        className="admin-danger-btn"
                        onClick={() => handleOpenRejectModal(activeDrawer.data)}
                      >
                        Reject Application
                      </button>
                    )}
                    <Link
                      to={`/admin/application/${activeDrawer.data.applicationId}`}
                      className="admin-ghost-btn"
                    >
                      Open Full Dossier
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="admin-member-detail-flow">
                  <div className="admin-member-bio-card">
                    <img src={activeDrawer.data.photo} alt="" className="admin-member-bio-avatar" />
                    <div>
                      <h3>{activeDrawer.data.name}</h3>
                      <p>{activeDrawer.data.role} · {activeDrawer.data.church}</p>
                    </div>
                  </div>

                  <div className="admin-detail-meta-grid">
                    <div className="admin-meta-item">
                      <span className="label">Membership Status</span>
                      <span className={`admin-status-pill ${activeDrawer.data.status.toLowerCase()}`}>
                        {activeDrawer.data.status}
                      </span>
                    </div>
                    <div className="admin-meta-item">
                      <span className="label">Expiry Date</span>
                      <span className="val font-bold">{new Date(activeDrawer.data.expiryDate).toLocaleDateString()}</span>
                    </div>
                    <div className="admin-meta-item">
                      <span className="label">Phone</span>
                      <span className="val">{activeDrawer.data.phone}</span>
                    </div>
                    <div className="admin-meta-item">
                      <span className="label">District</span>
                      <span className="val">{activeDrawer.data.district}</span>
                    </div>
                  </div>

                  <div className="admin-drawer-actions-bar">
                    <button
                      className="admin-primary-cta-btn"
                      onClick={() => handleRenewSubscription(activeDrawer.data.memberId, 1)}
                    >
                      Renew +1 Year
                    </button>
                    <button
                      className="admin-ghost-btn"
                      onClick={() => handleWhatsAppReminder(activeDrawer.data)}
                    >
                      WhatsApp Reminder
                    </button>
                    <button
                      className={`admin-table-btn ${activeDrawer.data.status === 'SUSPENDED' ? 'active-restore' : 'danger'}`}
                      onClick={() => handleToggleMemberStatus(activeDrawer.data)}
                    >
                      {activeDrawer.data.status === 'SUSPENDED' ? 'Restore Active' : 'Suspend Member'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* REJECTION REASON MODAL */}
      {/* ==================================================== */}
      {rejectionModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>Reject Application</h3>
              <button onClick={() => setRejectionModal(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <p>Please enter the administrative reason for rejecting application <strong>{rejectionModal.applicationId}</strong> ({rejectionModal.applicantName}).</p>
              <textarea
                rows="4"
                placeholder="e.g. Insufficient ministerial service duration, documentation incomplete, etc."
                value={rejectionModal.reason}
                onChange={(e) => setRejectionModal({ ...rejectionModal, reason: e.target.value })}
                className="admin-modal-textarea"
              />
            </div>
            <div className="admin-modal-footer">
              <button className="admin-ghost-btn" onClick={() => setRejectionModal(null)}>
                Cancel
              </button>
              <button className="admin-danger-btn" onClick={handleConfirmRejection}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* CONFIRMATION DIALOG MODAL */}
      {/* ==================================================== */}
      {confirmModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>{confirmModal.title}</h3>
              <button onClick={() => setConfirmModal(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <p>{confirmModal.message}</p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-ghost-btn" onClick={() => setConfirmModal(null)}>
                Cancel
              </button>
              <button className="admin-danger-btn" onClick={confirmModal.onConfirm}>
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ADD/EDIT ITEM MODAL */}
      {/* ==================================================== */}
      {activeModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card wide">
            <div className="admin-modal-header">
              <h3>
                {activeModal.type.startsWith('add_') ? 'Add New Record' : 'Edit Record'}
              </h3>
              <button onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <div className="admin-modal-body">
              {activeModal.type === 'add_church' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const fd = new FormData(e.target)
                    handleSaveChurch({
                      id: activeModal.data?.id,
                      name: fd.get('name'),
                      location: fd.get('location'),
                      district: fd.get('district'),
                      taluk: fd.get('taluk'),
                      pastor: fd.get('pastor'),
                      phone: fd.get('phone'),
                      memberCount: Number(fd.get('memberCount') || 0)
                    })
                  }}
                >
                  <div className="admin-form-group">
                    <label>Church Name</label>
                    <input name="name" defaultValue={activeModal.data?.name || ''} required />
                  </div>
                  <div className="admin-form-group">
                    <label>Location / Street Address</label>
                    <input name="location" defaultValue={activeModal.data?.location || ''} required />
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>District</label>
                      <input name="district" defaultValue={activeModal.data?.district || 'Virudhunagar Diocese'} required />
                    </div>
                    <div className="admin-form-group">
                      <label>Taluk</label>
                      <input name="taluk" defaultValue={activeModal.data?.taluk || ''} required />
                    </div>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Pastor-in-Charge</label>
                      <input name="pastor" defaultValue={activeModal.data?.pastor || ''} required />
                    </div>
                    <div className="admin-form-group">
                      <label>Contact Phone</label>
                      <input name="phone" defaultValue={activeModal.data?.phone || ''} required />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Approx Member Count</label>
                    <input type="number" name="memberCount" defaultValue={activeModal.data?.memberCount || 100} />
                  </div>
                  <div className="admin-modal-footer">
                    <button type="button" className="admin-ghost-btn" onClick={() => setActiveModal(null)}>Cancel</button>
                    <button type="submit" className="admin-primary-cta-btn">Save Church</button>
                  </div>
                </form>
              )}

              {activeModal.type === 'add_coordinator' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const fd = new FormData(e.target)
                    handleSaveCoordinator({
                      id: activeModal.data?.id,
                      name: fd.get('name'),
                      regNo: fd.get('regNo'),
                      role: fd.get('role'),
                      district: fd.get('district'),
                      taluk: fd.get('taluk'),
                      church: fd.get('church'),
                      phone: fd.get('phone'),
                      email: fd.get('email')
                    })
                  }}
                >
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Coordinator Name</label>
                      <input name="name" defaultValue={activeModal.data?.name || ''} required />
                    </div>
                    <div className="admin-form-group">
                      <label>Registration ID (e.g. TN 0630)</label>
                      <input name="regNo" defaultValue={activeModal.data?.regNo || ''} required />
                    </div>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Coordinator Role Title</label>
                      <input name="role" defaultValue={activeModal.data?.role || 'Taluk Coordinator'} required />
                    </div>
                    <div className="admin-form-group">
                      <label>District / Jurisdiction</label>
                      <input name="district" defaultValue={activeModal.data?.district || 'Virudhunagar Diocese'} required />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Church Base</label>
                    <input name="church" defaultValue={activeModal.data?.church || ''} required />
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Phone Number</label>
                      <input name="phone" defaultValue={activeModal.data?.phone || ''} required />
                    </div>
                    <div className="admin-form-group">
                      <label>Email Address</label>
                      <input name="email" defaultValue={activeModal.data?.email || ''} />
                    </div>
                  </div>
                  <div className="admin-modal-footer">
                    <button type="button" className="admin-ghost-btn" onClick={() => setActiveModal(null)}>Cancel</button>
                    <button type="submit" className="admin-primary-cta-btn">Save Coordinator</button>
                  </div>
                </form>
              )}

              {activeModal.type === 'add_event' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const fd = new FormData(e.target)
                    handleSaveEvent({
                      id: activeModal.data?.id,
                      name: fd.get('name'),
                      description: fd.get('description'),
                      date: fd.get('date'),
                      startTime: fd.get('startTime'),
                      endTime: fd.get('endTime'),
                      location: fd.get('location'),
                      organizer: fd.get('organizer'),
                      registrationLimit: Number(fd.get('registrationLimit') || 0),
                      status: 'PUBLISHED'
                    })
                  }}
                >
                  <div className="admin-form-group">
                    <label>Event Name</label>
                    <input name="name" defaultValue={activeModal.data?.name || ''} required />
                  </div>
                  <div className="admin-form-group">
                    <label>Description</label>
                    <textarea name="description" rows="2" defaultValue={activeModal.data?.description || ''} />
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Date (YYYY-MM-DD)</label>
                      <input type="date" name="date" defaultValue={activeModal.data?.date || ''} required />
                    </div>
                    <div className="admin-form-group">
                      <label>Start Time</label>
                      <input name="startTime" defaultValue={activeModal.data?.startTime || '09:30 AM'} />
                    </div>
                    <div className="admin-form-group">
                      <label>End Time</label>
                      <input name="endTime" defaultValue={activeModal.data?.endTime || '04:30 PM'} />
                    </div>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Location / Venue</label>
                      <input name="location" defaultValue={activeModal.data?.location || ''} required />
                    </div>
                    <div className="admin-form-group">
                      <label>Organizer</label>
                      <input name="organizer" defaultValue={activeModal.data?.organizer || 'Synod Secretariat'} />
                    </div>
                  </div>
                  <div className="admin-modal-footer">
                    <button type="button" className="admin-ghost-btn" onClick={() => setActiveModal(null)}>Cancel</button>
                    <button type="submit" className="admin-primary-cta-btn">Save Event</button>
                  </div>
                </form>
              )}

              {activeModal.type === 'add_announcement' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const fd = new FormData(e.target)
                    handleSaveAnnouncement({
                      id: activeModal.data?.id,
                      title: fd.get('title'),
                      content: fd.get('content'),
                      author: fd.get('author') || 'Synod Secretariat'
                    })
                  }}
                >
                  <div className="admin-form-group">
                    <label>Announcement Title</label>
                    <input name="title" defaultValue={activeModal.data?.title || ''} required />
                  </div>
                  <div className="admin-form-group">
                    <label>Content / Notice Text</label>
                    <textarea name="content" rows="4" defaultValue={activeModal.data?.content || ''} required />
                  </div>
                  <div className="admin-form-group">
                    <label>Author</label>
                    <input name="author" defaultValue={activeModal.data?.author || 'Synod Secretariat'} />
                  </div>
                  <div className="admin-modal-footer">
                    <button type="button" className="admin-ghost-btn" onClick={() => setActiveModal(null)}>Cancel</button>
                    <button type="submit" className="admin-primary-cta-btn">Publish Notice</button>
                  </div>
                </form>
              )}

              {activeModal.type === 'add_activity' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const fd = new FormData(e.target)
                    handleSaveActivity({
                      id: activeModal.data?.id,
                      title: fd.get('title'),
                      category: fd.get('category'),
                      description: fd.get('description'),
                      date: fd.get('date'),
                      location: fd.get('location'),
                      organizer: fd.get('organizer')
                    })
                  }}
                >
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Activity Title</label>
                      <input name="title" defaultValue={activeModal.data?.title || ''} required />
                    </div>
                    <div className="admin-form-group">
                      <label>Category</label>
                      <input name="category" defaultValue={activeModal.data?.category || 'Ministry'} required />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Description</label>
                    <textarea name="description" rows="3" defaultValue={activeModal.data?.description || ''} required />
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Location</label>
                      <input name="location" defaultValue={activeModal.data?.location || ''} />
                    </div>
                    <div className="admin-form-group">
                      <label>Frequency / Schedule</label>
                      <input name="date" defaultValue={activeModal.data?.date || 'Monthly'} />
                    </div>
                  </div>
                  <div className="admin-modal-footer">
                    <button type="button" className="admin-ghost-btn" onClick={() => setActiveModal(null)}>Cancel</button>
                    <button type="submit" className="admin-primary-cta-btn">Save Activity</button>
                  </div>
                </form>
              )}

              {activeModal.type === 'add_gallery' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const fd = new FormData(e.target)
                    handleSaveGallery({
                      id: activeModal.data?.id,
                      title: fd.get('title'),
                      category: fd.get('category'),
                      description: fd.get('description'),
                      imageUrl: fd.get('imageUrl') || '/archbishop_new.jpg',
                      date: fd.get('date') || new Date().toISOString().split('T')[0]
                    })
                  }}
                >
                  <div className="admin-form-group">
                    <label>Image Title</label>
                    <input name="title" defaultValue={activeModal.data?.title || ''} required />
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Category</label>
                      <select name="category" defaultValue={activeModal.data?.category || 'Worship'}>
                        <option value="Worship">Worship</option>
                        <option value="Pastors">Pastors</option>
                        <option value="Youth">Youth</option>
                        <option value="Events">Events</option>
                        <option value="Church">Church</option>
                        <option value="Community">Community</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Image Path / URL</label>
                      <input name="imageUrl" defaultValue={activeModal.data?.imageUrl || '/archbishop_new.jpg'} />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Description</label>
                    <textarea name="description" rows="2" defaultValue={activeModal.data?.description || ''} />
                  </div>
                  <div className="admin-modal-footer">
                    <button type="button" className="admin-ghost-btn" onClick={() => setActiveModal(null)}>Cancel</button>
                    <button type="submit" className="admin-primary-cta-btn">Save Image</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
