const defaultApiUrl = import.meta.env.PROD
  ? "https://backend-eight-orcin-13.vercel.app/api"
  : "/api"
const API__url = (import.meta.env.VITE_API_BASE_URL || defaultApiUrl).replace(/\/$/, "")

export default API__url
