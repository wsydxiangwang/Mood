import axios from 'axios'

const http = axios.create({
    baseURL: process.env.VUE_APP_URL || '/admin/api'
})

console.log(process.env)

export default http