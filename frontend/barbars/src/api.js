// Relative URLs use Vite's local proxy during development and the Express host in production.
const API__url = import.meta.env.VITE_API_BASE_URL || "/api"

export default API__url
