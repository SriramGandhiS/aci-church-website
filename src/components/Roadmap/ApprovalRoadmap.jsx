import React, { useEffect, useRef, useState } from 'react'
import { CheckIcon, UserCheckIcon, ShieldIcon, DocumentIcon } from '../Icons/SvgIcons'
import './ApprovalRoadmap.css'

export default function ApprovalRoadmap({ 
  status = 'SUBMITTED', 
  applicationId = 'ACI-2026-000001',
  applicantName = 'Pastor S. John Samuel',
  district = 'Dindigul',
  taluk = 'Batlagundu',
  dosName = 'Rev. R. Gnana Inbavanan',
  submittedAt = '',
  isTa = false 
}) {
  const canvasRef = useRef(null)
  const [activeStep, setActiveStep] = useState(1)

  // Map status to active numerical stage (1 to 4)
  const normalizedStatus = (status || '').toUpperCase()
  const currentStage = 
    normalizedStatus === 'ACCEPTED' ? 4 :
    normalizedStatus === 'RECOMMENDED_BY_DOS' || normalizedStatus === 'PENDING_BISHOP_APPROVAL' ? 3 :
    normalizedStatus === 'UNDER_REVIEW' || normalizedStatus === 'SUBMITTED' || normalizedStatus === 'UNDER_REVIEW_DOS' ? 2 : 1

  useEffect(() => {
    setActiveStep(currentStage)
  }, [currentStage])

  // Golden Particle Shower Animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const particles = []
    const particleCount = currentStage >= 3 ? 60 : 30

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        color: currentStage === 4 
          ? `rgba(212, 175, 55, ${Math.random() * 0.7 + 0.3})`
          : `rgba(59, 130, 246, ${Math.random() * 0.6 + 0.2})`,
        speedY: Math.random() * 1.5 + 0.6,
        speedX: (Math.random() - 0.5) * 0.8,
        glow: Math.random() * 8 + 4
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((p) => {
        p.y += p.speedY
        p.x += p.speedX

        if (p.y > height) {
          p.y = -10
          p.x = Math.random() * width
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowBlur = p.glow
        ctx.shadowColor = p.color
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [currentStage])

  const steps = [
    {
      num: 1,
      titleEn: 'Application Submitted',
      titleTa: 'விண்ணப்பம் பதிவு செய்யப்பட்டது',
      actorEn: 'Applicant & Digital Registry',
      actorTa: 'விண்ணப்பதாரர் & இணையப் பதிவேடு',
      descEn: 'Full 4-page profile & enclosures interlocked securely in central database.',
      descTa: 'அனைத்து விவரங்களும் மத்திய தரவுத்தளத்தில் பதிவு செய்யப்பட்டன.',
      date: submittedAt || 'Stage 1 Complete'
    },
    {
      num: 2,
      titleEn: 'Taluk Coordinator & DOS Verification',
      titleTa: 'தாலுகா ஒருங்கிணைப்பாளர் & DOS களப் பரிந்துரை',
      actorEn: `${dosName} & Taluk Coordinator`,
      actorTa: `${district} தாலுகா ஒருங்கிணைப்பாளர் & DOS`,
      descEn: `Field endorsement & background verification for ${district} Diocese (${taluk} Taluk).`,
      descTa: `${district} பேராயம் (${taluk} தாலுகா) கள ஆய்வு மற்றும் பரிந்துரை.`,
      date: currentStage >= 2 ? (currentStage > 2 ? 'Recommended ✓' : 'Under Review ⏳') : 'Pending'
    },
    {
      num: 3,
      titleEn: 'Episcopal Bishop Final Sign-Off',
      titleTa: 'பேராயர் இறுதி ஒப்புதல் & கையொப்பம்',
      actorEn: 'Rt. Rev. S. Johnson Durai',
      actorTa: 'பேராயர் முனைவர் S. ஜான்சன் துரை',
      descEn: 'Official Episcopal Council vetting & constitutional affiliation sanction.',
      descTa: 'அப்போஸ்தல பேராய ஆட்சிமன்றத்தின் இறுதி ஒப்புதல்.',
      date: currentStage >= 3 ? (currentStage > 3 ? 'Approved ✓' : 'Awaiting Sign-Off ⏳') : 'Pending'
    },
    {
      num: 4,
      titleEn: 'Synod Roll Active & Credentials',
      titleTa: 'பேராயப் பதிவேடு & சான்றிதழ் வழங்கல்',
      actorEn: 'Central Diocesan Secretariat',
      actorTa: 'மத்திய பேராய தலைமைச் செயலகம்',
      descEn: 'Official Membership ID, Digital Certificate & Synod voting roll active.',
      descTa: 'அங்கீகாரச் சான்றிதழ் மற்றும் அடையாளச் சான்று வழங்கப்பட்டது.',
      date: currentStage === 4 ? 'Synod Verified ✓' : 'Final Step'
    }
  ]

  return (
    <div className="roadmap-card-container">
      {/* Dynamic Particle Canvas */}
      <canvas ref={canvasRef} className="roadmap-particle-canvas" />

      {/* Ticket / ID Header */}
      <div className="roadmap-ticket-header">
        <div className="roadmap-ticket-brand">
          <div className="roadmap-crest-icon">✠</div>
          <div>
            <span className="roadmap-ticket-tag">{isTa ? 'அப்போஸ்தல பேராயம் • நேரலை கண்காணிப்பு' : 'APOSTOLIC COUNCIL OF INDIA • OFFICIAL TRACKER'}</span>
            <h3 className="roadmap-applicant-name">{applicantName}</h3>
          </div>
        </div>

        <div className="roadmap-ticket-pill">
          <span className="ticket-id-lbl">{isTa ? 'விண்ணப்ப எண்' : 'TICKET ID'}</span>
          <span className="ticket-id-val">{applicationId}</span>
        </div>
      </div>

      {/* Diocese Badge Strip */}
      <div className="roadmap-info-strip">
        <div className="info-strip-item">
          <span className="strip-label">{isTa ? 'ஆட்சி எல்லை' : 'JURISDICTION'}:</span>
          <span className="strip-value">{district} Diocese ({taluk})</span>
        </div>
        <div className="info-strip-item">
          <span className="strip-label">{isTa ? 'மாவட்ட கண்காணிப்பாளர்' : 'ASSIGNED DOS'}:</span>
          <span className="strip-value">{dosName}</span>
        </div>
        <div className="info-strip-item">
          <span className="strip-label">{isTa ? 'தற்போதைய நிலை' : 'CURRENT STAGE'}:</span>
          <span className={`strip-status-pill stage-${currentStage}`}>
            {currentStage === 4 ? (isTa ? 'முழுமை பெற்றது' : 'Stage 4: Affiliated & Active') :
             currentStage === 3 ? (isTa ? 'படி 3: பேராயர் பார்வைக்கு' : 'Stage 3: Bishop Sign-Off') :
             currentStage === 2 ? (isTa ? 'படி 2: DOS பரிந்துரை' : 'Stage 2: DOS Review') : (isTa ? 'படி 1: சமர்ப்பிக்கப்பட்டது' : 'Stage 1: Submitted')}
          </span>
        </div>
      </div>

      {/* Interactive Glowing Road Progress Line */}
      <div className="roadmap-pipeline-wrap">
        <div className="roadmap-track-line">
          <div 
            className="roadmap-track-fill" 
            style={{ width: `${((currentStage - 1) / 3) * 100}%` }}
          />
        </div>

        {/* 4 Interactive Milestones */}
        <div className="roadmap-milestones-grid">
          {steps.map((step) => {
            const isCompleted = currentStage > step.num
            const isCurrent = currentStage === step.num
            const isPending = currentStage < step.num

            return (
              <div 
                key={step.num}
                className={`roadmap-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''} ${isPending ? 'pending' : ''}`}
                onClick={() => setActiveStep(step.num)}
              >
                {/* Node Orb */}
                <div className="roadmap-orb">
                  {isCompleted ? (
                    <CheckIcon size={16} />
                  ) : isCurrent ? (
                    <div className="orb-pulse-ring" />
                  ) : (
                    <span>{step.num}</span>
                  )}
                </div>

                {/* Milestone Details Card */}
                <div className="roadmap-node-body">
                  <div className="node-stage-badge">
                    <span>STEP {step.num}</span>
                    <span className="node-date">{step.date}</span>
                  </div>

                  <h4 className="node-title">
                    {isTa ? step.titleTa : step.titleEn}
                  </h4>

                  <div className="node-actor">
                    <UserCheckIcon size={12} />
                    <span>{isTa ? step.actorTa : step.actorEn}</span>
                  </div>

                  <p className="node-desc">
                    {isTa ? step.descTa : step.descEn}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Success Celebration Banner if Stage 4 */}
      {currentStage === 4 && (
        <div className="roadmap-celebrate-box">
          <div className="celebrate-icon">👑</div>
          <div>
            <h4 className="celebrate-title">
              {isTa ? 'வாழ்த்துகள்! பேராய அங்கீகாரம் முழுமை பெற்றது' : 'Official Diocesan Affiliation Confirmed!'}
            </h4>
            <p className="celebrate-desc">
              {isTa 
                ? 'உங்கள் விண்ணப்பம் பேராயரால் அங்கீகரிக்கப்பட்டு பேராயப் பதிவேட்டில் பதிவு செய்யப்பட்டுள்ளது. டிஜிட்டல் சான்றிதழ் வழங்கப்பட்டுள்ளது.'
                : 'Your ministerial affiliation has received official sign-off by Episcopal Bishop Rt. Rev. S. Johnson Durai. Your parish is now actively enrolled on the Diocesan Synod Roll.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
