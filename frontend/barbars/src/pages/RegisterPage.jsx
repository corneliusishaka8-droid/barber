import { useState } from 'react'
import { Link } from 'react-router-dom'
import API__url from '../api.js'
import './LoginPage.css'

export default function RegisterPage() {
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setMessage('Sending your details…')

    try {
      // Send the three registration fields to Express; the backend redacts passwords in its logs.
      const response = await fetch(`${API__url}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.get('fullName'),
          password: formData.get('password'),
          username: formData.get('username'),
        }),
      })
      const result = await response.json()
      setMessage(result.message || 'The server did not return a response message.')
    } catch {
      setMessage('Could not reach the backend. Start the backend server and try again.')
    }
  }

  return <div className="login-page register-page">
    <header className="login-nav">
      <Link to="/" className="login-brand">SARUM CUT<span>®</span></Link>
      <nav aria-label="Main navigation"><Link to="/">HOME</Link><Link to="/services">SERVICES</Link><Link to="/about">ABOUT</Link><Link to="/contact">CONTACT</Link></nav>
      <span className="login-nav-current">CREATE YOUR PROFILE <i /></span>
    </header>

    <main className="login-main">
      <div className="login-grid" aria-hidden="true" />
      <div className="login-orbit" aria-hidden="true"><span /><i /></div>
      <div className="login-layout">
        <section className="login-intro">
          <span className="login-eyebrow"><i /> SARUM CUT / YOUR NEXT VISIT</span>
          <p className="login-index">MEMBER PORTAL &nbsp; / &nbsp; 02—02</p>
          <h1>MAKE IT<br /><em>YOURS.</em></h1>
          <p className="login-description">Create your profile and make every visit to the chair feel a little more personal.</p>
          <div className="login-intro-foot"><span>PERSONAL SERVICE, FROM THE START</span><span>EST. MMXIV / LAGOS</span></div>
        </section>

        <section className="login-panel" aria-labelledby="register-title">
          <div className="login-panel-head"><div><span className="login-eyebrow">02 / CREATE ACCOUNT</span><h2 id="register-title">Join Sarum Cut</h2></div><span className="login-secure-mark">SC<span>®</span></span></div>
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-field"><span>FULL NAME</span><input type="text" name="fullName" autoComplete="name" placeholder="Enter your full name" required /></label>
            <label className="login-field"><span>PASSWORD</span><input type="password" name="password" autoComplete="new-password" placeholder="Create a password" minLength="8" required /></label>
            <label className="login-field"><span>USERNAME</span><input type="text" name="username" autoComplete="username" placeholder="Choose a username" minLength="3" required /></label>
            <button className="login-submit" type="submit"><span>CREATE ACCOUNT</span><b aria-hidden="true">↗</b></button>
            <p className="login-feedback" role="status" aria-live="polite">{message}</p>
          </form>
          <p className="login-register">ALREADY A MEMBER? <Link to="/login">SIGN IN <span>↗</span></Link></p>
        </section>
      </div>
      <span className="login-coordinate login-coordinate--left" aria-hidden="true">06°27′N / 03°23′E</span>
      <span className="login-coordinate login-coordinate--right" aria-hidden="true">YOUR PLACE IN THE CHAIR</span>
    </main>

    <footer className="login-footer"><Link to="/" className="login-brand">SARUM CUT<span>®</span></Link><span>THE CRAFT OF PRECISION · THE COMFORT OF YOUR OWN CHAIR</span><Link to="/contact">NEED HELP? CONTACT US ↗</Link></footer>
  </div>
}
