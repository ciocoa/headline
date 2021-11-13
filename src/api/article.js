import request from '@/utils/request'

/**
 * 获取频道的文章列表
 */
export const getArticles = params =>
  request({
    method: 'GET',
    url: '/v1_1/articles',
    params,
  })
