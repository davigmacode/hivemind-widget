import axios from 'axios'

const isProduction = process.env.NODE_ENV === 'production'
const api = axios.create({
  baseURL: isProduction ? 'https://api.hivemind.id' : 'http://localhost:3030',
  headers: {
    Accept: 'application/json'
  }
})

export default api