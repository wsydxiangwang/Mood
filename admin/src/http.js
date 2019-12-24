import axios from 'axios'

const http = axios.create({
    baseURL: process.env.VUE_API_URL || '/admin/api',
    // baseURL: 'http://localhost:3000/admin/api'
})

export default http