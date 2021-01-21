import request from '@/utils/request'

export function getArticleList(params) {
  return request({
    url: `/articles`,
    method: 'get',
    params
  })
}
