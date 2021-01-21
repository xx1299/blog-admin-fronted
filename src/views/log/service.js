import request from '@/utils/request'

export function getLogList(params) {
  return request({
    url: `/logs`,
    method: 'get',
    params
  })
}

export function delLog(id) {
  return request({
    url: `/logs/${id}`,
    method: 'delete'
  })
}
