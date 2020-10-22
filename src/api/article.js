/**
 * 文章相关请求模块
 */
import request from '@/utils/request.js'

export const getArticles = params => {
  return request({
    methods: 'GET',
    url: '/mp/v1_0/articles',
    // Body 参数使用 data 设置
    // Query 参数使用 params 设置
    // Headers 参数使用 headers 设置
    params
  })
}

export const getArticleChannels = params => {
  return request({
    methods: 'GET',
    url: '/mp/v1_0/channels'
  })
}
