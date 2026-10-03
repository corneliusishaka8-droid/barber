import { useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import API__url from '../api.js'
import { availableBarbers, bookingHaircuts, formatNaira, haircutCategories } from '../data/bookingCatalog.js'
import './BookingPage.css'

function getInitialHaircut(location, searchParams) {
  const requestedStyle = searchParams.get('style') || location.state?.selectedStyle
  return bookingHaircuts.find(({ id, name }) => id === requestedStyle || name === requestedStyle)?.id || ''
}

export default function BookingPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [selectedHaircutId, setSelectedHaircutId] = useState(() => getInitialHaircut(location, searchParams))
  const [selectedBarberId, setSelectedBarberId] = useState('')
  const [homeService, setHomeService] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('online')
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const selectedHaircut = bookingHaircuts.find(({ id }) => id === selectedHaircutId)
  const selectedBarber = availableBarbers.find(({ id }) => id === selectedBarberId)
  const homeServiceFee = homeService && selectedHaircut ? selectedHaircut.priceNGN / 2 : 0
  const total = (selectedHaircut?.priceNGN || 0) + homeServiceFee
  const filteredHaircuts = useMemo(() => bookingHaircuts.filter((haircut) => {
    const matchesCategory = category === 'All' || haircut.category === category
    const matchesSearch = haircut.name.toLowerCase().includes(search.trim().toLowerCase())
    return matchesCategory && matchesSearch
  }), [category, search])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedHaircut || !selectedBarber) {
      setFeedback('Choose a haircut and a barber to continue.')
      return
    }

    const formData = new FormData(event.currentTarget)
    const paymentLabel = paymentMethod === 'online' ? 'Pay online (payment link requested)' : 'Pay after service'
    const subject = `Booking request: ${selectedHaircut.name}`
    const message = [
      `Customer: ${formData.get('name')}`,
      `Email: ${formData.get('email')}`,
      `Haircut: ${selectedHaircut.name} (${formatNaira(selectedHaircut.priceNGN)})`,
      `Barber: ${selectedBarber.name}`,
      `Service: ${homeService ? 'Home service' : 'In studio'}`,
      ...(homeService ? [`Home service fee (50%): ${formatNaira(homeServiceFee)}`] : []),
      `Total: ${formatNaira(total)}`,
      `Payment preference: ${paymentLabel}`,
      ...(paymentMethod === 'online' ? ['Please contact the customer with secure online payment instructions. No payment has been collected through this request.'] : []),
    ].join('\n')

    setSubmitting(true)
    setFeedback('Sending your booking request…')
    try {
      const response = await fetch(`${API__url}/contact`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionType: 'booking', name: formData.get('name'), email: formData.get('email'), subject, message, selectedStyle: selectedHaircut.name, inquiryTitle: homeService ? 'Home service' : 'Studio service' }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'The studio could not receive this request.')
      setFeedback(paymentMethod === 'online'
        ? 'Your booking request was sent. The studio will contact you with secure payment instructions.'
        : 'Your booking request was sent. You selected payment after the service.')
    } catch (error) {
      setFeedback(error.message || 'Could not reach the studio. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return <div className="book-now-page">
    <header className="book-now-nav">
      <Link to="/" className="book-now-brand">SARUM CUT<span>®</span></Link>
      <Link to="/profile" className="book-now-back"><span aria-hidden="true">←</span> MY ACCOUNT</Link>
    </header>
    <main className="book-now-main">
      <div className="book-now-grid" aria-hidden="true" />
      <div className="book-now-content">
        <div className="book-now-heading">
          <p className="book-now-eyebrow"><i /> YOUR NEXT VISIT / LAGOS</p>
          <span className="book-now-index">SARUM CUT · APPOINTMENT REQUEST</span>
          <h1 id="book-now-title">Make it<br /><em>your chair.</em></h1>
          <p className="book-now-copy">Choose your cut and barber. Review your service and total before sending your request.</p>
        </div>

        <form className="booking-flow" onSubmit={handleSubmit}>
          <section className="booking-section" aria-labelledby="haircut-heading">
            <div className="booking-section-head"><div><span>01 / THE CUT</span><h2 id="haircut-heading">Choose your haircut</h2></div><span className="booking-count">{bookingHaircuts.length} STYLES</span></div>
            <label className="booking-search"><span className="sr-only">Search haircuts</span><span aria-hidden="true">⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the style menu" /></label>
            <div className="booking-categories" aria-label="Filter haircuts by category">
              {haircutCategories.map((item) => <button key={item} type="button" className={category === item ? 'is-active' : ''} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
            <div className="booking-haircut-grid">
              {filteredHaircuts.map((haircut) => <label key={haircut.id} className={`booking-haircut${selectedHaircutId === haircut.id ? ' is-selected' : ''}`}>
                <input type="radio" name="haircut" value={haircut.id} checked={selectedHaircutId === haircut.id} onChange={() => setSelectedHaircutId(haircut.id)} />
                <img src={haircut.image} alt="" loading="lazy" />
                <span className="booking-haircut-copy"><small>{haircut.category.toUpperCase()} · {haircut.duration}</small><strong>{haircut.name}</strong><b>{formatNaira(haircut.priceNGN)}</b></span>
                <span className="booking-haircut-check" aria-hidden="true">✓</span>
              </label>)}
              {filteredHaircuts.length === 0 && <p className="booking-no-results">No styles match that search. Try another name or category.</p>}
            </div>
          </section>

          <section className="booking-section" aria-labelledby="barber-heading">
            <div className="booking-section-head"><div><span>02 / YOUR BARBER</span><h2 id="barber-heading">Choose a barber</h2></div><span className="booking-count">4 AVAILABLE</span></div>
            <div className="booking-barber-grid">
              {availableBarbers.map((barber, index) => <label key={barber.id} className={`booking-barber${selectedBarberId === barber.id ? ' is-selected' : ''}`}>
                <input type="radio" name="barber" value={barber.id} checked={selectedBarberId === barber.id} onChange={() => setSelectedBarberId(barber.id)} />
                <span className="booking-barber-avatar" aria-hidden="true">0{index + 1}</span><span><strong>{barber.name}</strong><small>{barber.detail}</small></span><i aria-hidden="true">✓</i>
              </label>)}
            </div>
          </section>

          <section className="booking-section" aria-labelledby="service-heading">
            <div className="booking-section-head"><div><span>03 / WHERE WE MEET</span><h2 id="service-heading">Choose your service</h2></div></div>
            <label className={`booking-home-service${homeService ? ' is-selected' : ''}`}>
              <input type="checkbox" checked={homeService} onChange={(event) => setHomeService(event.target.checked)} />
              <span className="booking-checkbox" aria-hidden="true">✓</span>
              <span><strong>Home service</strong><small>Have your barber come to you. Adds 50% of the haircut price.</small></span>
              <b>{selectedHaircut ? `+${formatNaira(homeServiceFee || selectedHaircut.priceNGN / 2)}` : '+50%'}</b>
            </label>
            <p className="booking-studio-note">Leave this unchecked for service at the Sarum Cut studio.</p>
          </section>

          <section className="booking-section" aria-labelledby="payment-heading">
            <div className="booking-section-head"><div><span>04 / PAYMENT</span><h2 id="payment-heading">How would you like to pay?</h2></div></div>
            <div className="booking-payment-grid">
              <label className={`booking-payment${paymentMethod === 'online' ? ' is-selected' : ''}`}><input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} /><span className="booking-radio-mark" /><span><strong>Pay online</strong><small>The studio will send secure payment instructions after confirming your request.</small></span></label>
              <label className={`booking-payment${paymentMethod === 'after-service' ? ' is-selected' : ''}`}><input type="radio" name="payment" value="after-service" checked={paymentMethod === 'after-service'} onChange={() => setPaymentMethod('after-service')} /><span className="booking-radio-mark" /><span><strong>Pay after service</strong><small>Pay in person when your appointment is complete.</small></span></label>
            </div>
          </section>

          <section className="booking-section booking-customer" aria-labelledby="customer-heading">
            <div className="booking-section-head"><div><span>05 / YOUR DETAILS</span><h2 id="customer-heading">Where can we reach you?</h2></div></div>
            <div className="booking-customer-fields">
              <label><span>YOUR NAME</span><input name="name" autoComplete="name" placeholder="Full name" required /></label>
              <label><span>EMAIL ADDRESS</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
            </div>
          </section>

          <aside className="booking-receipt" aria-labelledby="receipt-heading">
            <div className="booking-receipt-head"><div><span>YOUR SELECTION</span><h2 id="receipt-heading">Booking summary</h2></div><span className="booking-receipt-mark">SC<sup>®</sup></span></div>
            <div className="booking-receipt-lines">
              <div><span>Haircut</span><strong>{selectedHaircut?.name || 'Choose a haircut'}</strong><b>{selectedHaircut ? formatNaira(selectedHaircut.priceNGN) : '—'}</b></div>
              <div><span>Barber</span><strong>{selectedBarber?.name || 'Choose a barber'}</strong><b>—</b></div>
              <div><span>Service</span><strong>{homeService ? 'Home service' : 'In studio'}</strong><b>{homeService && selectedHaircut ? formatNaira(homeServiceFee) : 'Included'}</b></div>
            </div>
            {homeService && <p className="booking-fee-caption">Home service fee · 50% of haircut price</p>}
            <div className="booking-receipt-total"><span>TOTAL</span><strong>{formatNaira(total)}</strong></div>
            <p className="booking-payment-summary">Payment preference: <strong>{paymentMethod === 'online' ? 'Pay online' : 'Pay after service'}</strong></p>
            {paymentMethod === 'online' && <p className="booking-payment-disclaimer">No payment is taken here. The studio will contact you with secure payment instructions.</p>}
            <button className="booking-submit" type="submit" disabled={submitting || !selectedHaircut || !selectedBarber}><span>{submitting ? 'SENDING REQUEST…' : 'SEND BOOKING REQUEST'}</span><b aria-hidden="true">↗</b></button>
            <p className="booking-feedback" aria-live="polite" role="status">{feedback}</p>
          </aside>
        </form>
      </div>
      <span className="book-now-coordinates">06°27′N / 03°23′E</span>
    </main>
    <footer className="book-now-footer"><Link to="/" className="book-now-brand">SARUM CUT<span>®</span></Link><span>THE CRAFT OF PRECISION · THE COMFORT OF YOUR OWN CHAIR</span><Link to="/profile">BACK TO YOUR ACCOUNT ↗</Link></footer>
  </div>
}
