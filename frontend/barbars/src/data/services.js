export const serviceCatalog = [
  { id: 'fades', number: '01', title: 'Fades & tapers', category: 'Fade', description: 'Low tapers, skin fades, and clean transitions shaped to suit you.' },
  { id: 'classic', number: '02', title: 'Classic & textured cuts', category: 'Classic', description: 'Structured crops and considered cuts with a natural, wearable finish.' },
  { id: 'curls', number: '03', title: 'Curl shaping', category: 'Curls', description: 'A defined shape that keeps your curl pattern and texture in focus.' },
  { id: 'protective', number: '04', title: 'Protective styles', category: 'Braids', description: 'Twists and starter locs, sectioned with care for natural hair.' },
  { id: 'locs', number: '05', title: 'Starter locs', category: 'Locs', description: 'A considered foundation for your loc journey, sectioned and started with care.' },
  { id: 'natural', number: '06', title: 'Natural shape-ups', category: 'Natural', description: 'A clean silhouette that works with your natural volume and growth.' },
]

export const serviceModes = {
  studio: {
    available: true,
    title: 'In studio',
    label: '01 / IN STUDIO',
    description: 'Settle into our Lagos studio for a focused, professional grooming session.',
    action: 'BOOK A STUDIO SESSION',
  },
  home: {
    available: true,
    title: 'At home',
    label: '02 / HOME SERVICE',
    description: 'Prefer to stay in? Request a stylist to come to you at a time that works.',
    action: 'REQUEST HOME SERVICE',
    feeNGN: null,
    feeUSD: null,
  },
}

export const homeServiceSteps = [
  'Choose your service',
  'Share your location',
  'Pick a date and time',
  'Your stylist comes to you',
]

export const serviceBenefits = [
  { number: '01', title: 'Precision', description: 'Every line is shaped with intention and care.' },
  { number: '02', title: 'Convenience', description: 'Choose the studio or request a home visit.' },
  { number: '03', title: 'Personal', description: 'Your features, texture, and preferences lead the process.' },
  { number: '04', title: 'Craft', description: 'Attention to detail from consultation to final finish.' },
]
