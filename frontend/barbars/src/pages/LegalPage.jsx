import { Link } from 'react-router-dom'
import './ProfilePage.css'

export default function LegalPage({ type }) {
  const isPrivacy = type === 'privacy'
  const title = isPrivacy ? 'Privacy' : 'Terms & conditions'

  return <div className="profile-page legal-page">
    <header className="profile-nav">
      <Link to="/" className="profile-brand">SARUM CUT<span>®</span></Link>
      <nav aria-label="Main navigation"><Link to="/">HOME</Link><Link to="/services">SERVICES</Link><Link to="/about">ABOUT</Link><Link to="/contact">CONTACT</Link></nav>
      <Link className="profile-nav-label" to="/profile">← PROFILE</Link>
    </header>
    <main className="legal-main">
      <p className="profile-eyebrow"><i /> SARUM CUT / YOUR ACCOUNT</p>
      <h1>{title}<span>.</span></h1>
      <p className="legal-intro">{isPrivacy
        ? 'We respect your privacy. This page will explain what information Sarum Cut collects, how it is used, and how you can contact us about your information.'
        : 'These terms will describe the conditions for using the Sarum Cut website and booking services.'}</p>
      <p className="legal-note">Policy details will be provided by Sarum Cut before account and booking features go live.</p>
      <Link className="legal-back" to="/profile">BACK TO PROFILE <span>↗</span></Link>
    </main>
    <footer className="profile-footer"><Link to="/" className="profile-brand">SARUM CUT<span>®</span></Link><span>THE CRAFT OF PRECISION · THE COMFORT OF YOUR OWN CHAIR</span><div className="profile-legal"><Link to="/privacy">PRIVACY</Link><Link to="/terms">TERMS &amp; CONDITIONS</Link></div></footer>
  </div>
}
