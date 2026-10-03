import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import './ProfilePage.css'

function AccountIcon({ name }) {
  const paths = {
    profile: <><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
    lists: <><path d="M8 6h12M8 12h12M8 18h12" /><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></>,
    booking: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4m8-4v4M4 10h16M8 14h3" /></>,
  }
  return <svg className="account-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function AccountRow({ icon, title, description, to }) {
  return <Link className="account-option" to={to}>
    <span className="account-option-symbol"><AccountIcon name={icon} /></span>
    <span className="account-option-copy"><strong>{title}</strong><span>{description}</span></span>
    <span className="account-option-arrow" aria-hidden="true">↗</span>
  </Link>
}

export default function ProfilePage() {
  const [logoutMessage, setLogoutMessage] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const displayName = user?.fullName || user?.username || 'Member'
  const activeTab = 'account'

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (error) {
      setLogoutMessage(error.message)
    }
  }

  return <div className="profile-page">
    <main className="account-main">
      <Link to="/" className="account-home-link"><span aria-hidden="true">←</span> HOME</Link>
      <section className="account-shell" aria-labelledby="account-welcome">
        <div className="account-identity">
          <div className="account-avatar-wrap">
            <div className="account-avatar" aria-label={`${displayName} profile avatar`}><AccountIcon name="profile" /></div>
            <button className="account-avatar-add" type="button" aria-label="Profile photo upload is not available yet">+</button>
          </div>
          <p className="account-eyebrow"><i /> SARUM CUT / YOUR ACCOUNT</p>
          <h1 id="account-welcome">Welcome, <em>{displayName}.</em></h1>
          <p className="account-intro">A little space for everything that makes your time in the chair yours.</p>
        </div>

        <div className="account-tabs" role="tablist" aria-label="Account sections">
          <button type="button" role="tab" id="account-tab" aria-selected={activeTab === 'account'} aria-controls="account-panel">MY ACCOUNT</button>
        </div>

        <div className="account-panel" id="account-panel" role="tabpanel" aria-labelledby="account-tab">
          <div className="account-options">
            <AccountRow icon="profile" title="My Profile" description="Edit your profile and account details" to="/profile" />
            <AccountRow icon="booking" title="Book Now" description="Book a service or schedule an appointment" to="/book-now" />
          </div>

          <div className="account-profile-story">
            <div className="account-story-panel">
              <p className="account-story-kicker">YOUR STYLE PROFILE</p>
              <h2>Tailored for the way you like to show up.</h2>
              <p>Every visit is built around your routine, your comfort, and the details that make you feel your best. We keep your preferences close so each appointment feels personal, polished, and easy.</p>
            </div>

            <div className="account-mini-grid">
              <div className="account-mini-item">
                <span className="account-mini-label">Preferred cut</span>
                <strong>Skin fade with a clean finish</strong>
              </div>
              <div className="account-mini-item">
                <span className="account-mini-label">Routine</span>
                <strong>Every 2–3 weeks</strong>
              </div>
              <div className="account-mini-item">
                <span className="account-mini-label">Barber notes</span>
                <strong>Keep it close around the edges and trim the beard neatly.</strong>
              </div>
            </div>
          </div>
        </div>
        <p className="account-footnote"><span>LAGOS / NIGERIA</span><span>PERSONAL SERVICE, ALWAYS</span></p>
      </section>
    </main>
    <footer className="profile-footer">
      <Link to="/" className="profile-brand">SARUM CUT<span>®</span></Link>
      <span>THE CRAFT OF PRECISION · THE COMFORT OF YOUR OWN CHAIR</span>
      <div className="account-logout-wrap"><button className="account-logout" type="button" onClick={handleLogout}>LOG OUT ↗</button>{logoutMessage && <span role="status">{logoutMessage}</span>}</div>
      <div className="profile-legal"><Link to="/privacy">PRIVACY</Link><Link to="/terms">TERMS &amp; CONDITIONS</Link></div>
    </footer>
  </div>
}
