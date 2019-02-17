import axios from 'axios'
import { store } from './store/index'

export default function interceptors () {
  axios.interceptors.request.use(function (config) {
    let token = localStorage.getItem('token') || ''
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })

  axios.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    // if (error.response.status === 400) {}
    if (error.response.status === 401) {
      console.log(error.response.status)
      alert('Вы не авторизованы')
      localStorage.clear()
      store.dispatch('LOGOUT')
    }
    // if (error.response.status === 501 || error.response.status === 500) {
    //   alert('Сервер в данный момент не доступен')
    // }
    // if (error.response.status === 502) {}
    return Promise.reject(error)
  })
}