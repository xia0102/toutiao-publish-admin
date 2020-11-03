import request from '@/utils/request.js'

// 获取粉丝列表
export const getFans = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/followers',
    // Body 参数使用 data 设置
    // Query 参数使用 params 设置
    // Headers 参数使用 headers 设置
    params
  })
}
