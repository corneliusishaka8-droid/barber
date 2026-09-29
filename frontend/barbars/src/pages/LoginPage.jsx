import { useState } from 'react'
import { Link } from 'react-router-dom'
import './LoginPage.css'

export default function LoginPage() {
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setMessage('Sign-in is not connected yet. Please check back soon.')
  }

  return <div className="login-page">
    <header className="login-nav">
      <Link to="/" className="login-brand">SARUM CUT<span>®</span></Link>
      <nav aria-label="Main navigation"><Link to="/">HOME</Link><Link to="/services">SERVICES</Link><Link to="/about">ABOUT</Link><Link to="/contact">CONTACT</Link></nav>
      <span className="login-nav-current">MEMBER ACCESS <i /></span>
    </header>

    <main className="login-main">
      <div className="login-grid" aria-hidden="true" />
      <div className="login-orbit login-orbit--outer" aria-hidden="true"><span /><i /></div>
      <div className="login-layout">
        <section className="login-intro">
          <span className="login-eyebrow"><i /> SARUM CUT / PRIVATE ACCESS</span>
          <p className="login-index">MEMBER PORTAL &nbsp; / &nbsp; 01—02</p>
          <h1>WELCOME<br /><em>BACK.</em></h1>
          <p className="login-description">Your appointments, your preferences, and the details that make every visit yours.</p>
          <div className="login-intro-foot"><span>PERSONAL SERVICE, CONTINUED</span><span>EST. MMXIV / LAGOS</span></div>
        </section>

        <section className="login-panel" aria-labelledby="login-title">
          <div className="login-panel-head"><div><span className="login-eyebrow">01 / SIGN IN</span><h2 id="login-title">Member login</h2></div><span className="login-secure-mark">SC<span>®</span></span></div>
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-field"><span>USERNAME</span><input type="text" name="username" autoComplete="username" placeholder="Enter your username" required /></label>
            <label className="login-field"><span>PASSWORD</span><input type="password" name="password" autoComplete="current-password" placeholder="Enter your password" required /></label>
            <button className="login-submit" type="submit"><span>SIGN IN</span><b aria-hidden="true">↗</b></button>
            <div className="login-divider"><span />OR CONTINUE WITH<span /></div>
            <button className="login-google" type="button" onClick={() => setMessage('Google sign-in is not connected yet. Please check back soon.')}><span className="google-mark" aria-hidden="true">G</span> CONTINUE WITH GOOGLE <b aria-hidden="true">↗</b></button>
            <p className="login-feedback" role="status" aria-live="polite">{message}</p>
          </form>
          <p className="login-register">NEW TO SARUM CUT? <Link to="/register">CREATE AN ACCOUNT <span>↗</span></Link></p>
        </section>
      </div>
      <span className="login-coordinate login-coordinate--left" aria-hidden="true">06°27′N / 03°23′E</span>
      <span className="login-coordinate login-coordinate--right" aria-hidden="true">IDENTITY / VERIFIED LATER</span>
    </main>

    <footer className="login-footer"><Link to="/" className="login-brand">SARUM CUT<span>®</span></Link><span>THE CRAFT OF PRECISION · THE COMFORT OF YOUR OWN CHAIR</span><Link to="/contact">NEED HELP? CONTACT US ↗</Link></footer>
  </div>
}
