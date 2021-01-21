import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/roles',
    method: 'get'
  })
}

export function getAuthorities(params) {
  return request({
    url: `/authorities/tree`,
    method: 'get',
    params
  })
}

export function addRole(params) {
  return request({
    url: `/roles`,
    method: 'post',
    data: params
  })
}

export function editRole(params) {
  return request({
    url: `/roles`,
    method: 'put',
    data: params
  })
}

export function delRole(id) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}
