import { useState } from 'react'
import API__url from '../../api.js'

export default function ContactForm({ selectedStyleName = '', inquiryType = '', inquiryTitle = '' }) {
  const [status, setStatus] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setStatus('Sending your message…')

    try {
      // Send booking and contact details to Express so the studio can read them in its terminal.
      const response = await fetch(`${API__url}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionType: inquiryType || (selectedStyleName ? 'booking' : 'contact'),
          name: data.get('name'),
          email: data.get('email'),
          subject: data.get('subject'),
          message: data.get('message'),
          selectedStyle: selectedStyleName,
          inquiryTitle,
        }),
      })
      const result = await response.json()
      setStatus(result.message || 'The server did not return a response message.')
    } catch {
      setStatus('Could not reach the backend. Start the backend server and try again.')
    }
  }

  return <form className="contact-form" onSubmit={handleSubmit}>
    <div className="contact-form-heading"><div><span className="contact-eyebrow">01 / SEND A NOTE</span><h2>Send a message</h2></div><span className="contact-form-status"><i /> STUDIO API</span></div>
    <label className="contact-field"><span>YOUR NAME</span><input autoComplete="name" name="name" placeholder="How should we address you?" required /></label>
    <label className="contact-field"><span>EMAIL ADDRESS</span><input autoComplete="email" name="email" type="email" placeholder="you@example.com" required /></label>
    <label className="contact-field"><span>SUBJECT <small>OPTIONAL</small></span><input name="subject" defaultValue={selectedStyleName ? `Booking enquiry: ${selectedStyleName}` : inquiryTitle ? `Enquiry: ${inquiryTitle}` : inquiryType === 'home-service' ? 'Home service request' : inquiryType === 'booking' ? 'Appointment booking request' : ''} placeholder="What would you like to discuss?" /></label>
    <label className="contact-field"><span>MESSAGE</span><textarea name="message" rows="4" defaultValue={selectedStyleName ? `I’d like to book the ${selectedStyleName} style.` : inquiryTitle ? `I’d like to ask about ${inquiryTitle}.` : inquiryType === 'home-service' ? 'I’d like to ask about arranging a home service.' : inquiryType === 'booking' ? 'I’d like to book an appointment. Please let me know what times are available.' : ''} placeholder="How can we help?" required /></label>
    <div className="contact-form-footer"><span className="contact-privacy">Delivered to the studio backend.</span><button className="contact-submit" type="submit"><span>SEND TO STUDIO</span><b aria-hidden="true">↗</b></button></div>
    <p className="contact-form-feedback" aria-live="polite">{status}</p>
  </form>
}
