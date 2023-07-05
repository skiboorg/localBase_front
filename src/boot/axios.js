import { boot } from 'quasar/wrappers'
import axios from 'axios'
import {Cookies} from "quasar"

const api = axios.create({ baseURL: process.env.API_URL })

export default boot(({ app, ssrContext }) => {
const cookies = process.env.SERVER
    ? Cookies.parseSSR(ssrContext)
    : Cookies
  let token = cookies.get('auth_token')
  console.log('before',api.defaults.headers.common)
  if (token) {
    console.log('Token exists axios')
    api.defaults.headers.common['Authorization'] = 'Token ' + token
  }else {
    if(process.env.SERVER){
      api.defaults.headers.common['Authorization'] = null
      cookies.remove('auth_token')
    }else {
      api.defaults.headers.common['Authorization'] = null
      cookies.remove('auth_token')
    }
  }

  console.log('after',api.defaults.headers.common)
})

export { api }
