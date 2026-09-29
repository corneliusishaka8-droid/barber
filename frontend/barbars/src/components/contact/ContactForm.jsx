import { useState } from 'react'
import { contactConfig } from './contactConfig.js'

export default function ContactForm({ selectedStyleName = '', inquiryType = '', inquiryTitle = '' }) {
  const [status, setStatus] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!contactConfig.email) {
      setStatus('Add your Gmail address in contactConfig.js to enable this form.')
      return
    }
    const data = new FormData(event.currentTarget)
    const subject = encodeURIComponent(data.get('subject') || 'A note for Sarum Cut')
    const message = encodeURIComponent(`From: ${data.get('name')} (${data.get('email')})\n\n${data.get('message')}`)
    window.location.href = `mailto:${contactConfig.email}?subject=${subject}&body=${message}`
    setStatus('Your email app is opening with your message ready to send.')
  }

  return <form className="contact-form" onSubmit={handleSubmit}>
    <div className="contact-form-heading"><div><span className="contact-eyebrow">01 / SEND A NOTE</span><h2>Send a message</h2></div><span className="contact-form-status"><i /> {contactConfig.email ? 'EMAIL CHANNEL' : 'GMAIL LINK NEEDED'}</span></div>
    <label className="contact-field"><span>YOUR NAME</span><input autoComplete="name" name="name" placeholder="How should we address you?" required /></label>
    <label className="contact-field"><span>EMAIL ADDRESS</span><input autoComplete="email" name="email" type="email" placeholder="you@example.com" required /></label>
    <label className="contact-field"><span>SUBJECT <small>OPTIONAL</small></span><input name="subject" defaultValue={selectedStyleName ? `Booking enquiry: ${selectedStyleName}` : inquiryTitle ? `Enquiry: ${inquiryTitle}` : inquiryType === 'home-service' ? 'Home service request' : ''} placeholder="What would you like to discuss?" /></label>
    <label className="contact-field"><span>MESSAGE</span><textarea name="message" rows="4" defaultValue={selectedStyleName ? `I’d like to book the ${selectedStyleName} style.` : inquiryTitle ? `I’d like to ask about ${inquiryTitle}.` : inquiryType === 'home-service' ? 'I’d like to ask about arranging a home service.' : ''} placeholder="How can we help?" required /></label>
    <div className="contact-form-footer"><span className="contact-privacy">Opens a message in your email app.</span><button className="contact-submit" type="submit"><span>PREPARE MESSAGE</span><b aria-hidden="true">↗</b></button></div>
    <p className="contact-form-feedback" aria-live="polite">{status}</p>
  </form>
}
