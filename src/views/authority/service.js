import request from '@/utils/request'

export function getAuthorities(params) {
  return request({
    url: `/authorities/tree`,
    method: 'get',
    params
  })
}

export function addAuthority(params) {
  return request({
    url: `/authorities`,
    method: 'post',
    data: params
  })
}

export function delAuthority(id) {
  return request({
    url: `/authorities/${id}`,
    method: 'delete'
  })
}

