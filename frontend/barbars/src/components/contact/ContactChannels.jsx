import { useState } from 'react'
import { contactChannels, contactConfig } from './contactConfig.js'

function getChannelUrl(channel) {
  if (channel.key === 'booking') return '/book-now'
  if (channel.key === 'email') return contactConfig.email ? `mailto:${contactConfig.email}` : ''
  const value = contactConfig[channel.key]?.trim()
  return value && /^https:\/\//i.test(value) ? value : ''
}

function ContactChannelCard({ channel }) {
  const href = getChannelUrl(channel)
  const content = <>
    <span className="channel-icon" aria-hidden="true">{channel.icon}</span>
    <span className="channel-copy"><strong>{channel.name}</strong><small>{channel.description}</small><code>{channel.key === 'email' && contactConfig.email ? contactConfig.email : channel.detail}</code></span>
    {href && <span className="channel-arrow" aria-hidden="true">&#8599;</span>}
    {!href && <span className="channel-config-note">ADD LINK IN CONFIG</span>}
  </>

  if (!href) return <div className="channel-card channel-card--unconfigured" aria-label={`${channel.name} link not configured yet`}>{content}</div>
  return <a className="channel-card" href={href} target={channel.key === 'booking' || channel.key === 'email' ? undefined : '_blank'} rel={channel.key === 'booking' || channel.key === 'email' ? undefined : 'noreferrer'} aria-label={`${channel.name}: ${channel.description}`}>{content}</a>
}

export default function ContactChannels() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactConfig.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return <section className="contact-channels" aria-labelledby="contact-channels-title">
    <div className="contact-section-heading"><div><span className="contact-eyebrow">02 / GET IN TOUCH</span><h2 id="contact-channels-title">Choose your next step.</h2></div><p>Book your next visit or reach out<br />through your preferred channel.</p></div>
    <div className="contact-channel-grid">{contactChannels.map((channel) => <ContactChannelCard key={channel.key} channel={channel} />)}</div>
    {contactConfig.email && <div className="contact-email-copy"><div><span className="contact-eyebrow">PREFER EMAIL?</span><a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a></div><button type="button" onClick={copyEmail} aria-label={copied ? 'Email address copied' : 'Copy email address'}>{copied ? 'COPIED' : 'COPY EMAIL +'}</button></div>}
    <p className="contact-copy-feedback" aria-live="polite">{copied ? 'Email address copied to clipboard.' : ''}</p>
  </section>
}
