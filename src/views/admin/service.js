import request from '@/utils/request'

export function getAdminList(params) {
  return request({
    url: `/admins`,
    method: 'get',
    params
  })
}

export function changeStatus({ status, id }) {
  const params = { status }
  return request({
    url: `/admins/${id}/status`,
    method: 'put',
    params
  })
}

export function getRoleList() {
  return request({
    url: `/roles`,
    method: 'get'
  })
}

export function assginRole({ id, roleIds }) {
  return request({
    url: `/admins/${id}/roles`,
    method: 'put',
    data: roleIds
  })
}
