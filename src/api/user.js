import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/adminLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/adminInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/adminLogout',
    method: 'post'
  })
}
