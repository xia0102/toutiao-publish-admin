/**
 * 用户相关请求模块
 */

import request from '@/utils/request.js'
//  用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    // data 用来设置 POST 请求体
    data
  })
}

// 获取用户资料
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
    // 请求头
    // headers: {
    //   // 属性名：接口要求的
    //   // 属性值：Bearer空格token数据
    //   Authorization: `Bearer ${user.token}`
    // }
  })
}

// 修改用户头像
// data 必须传递 FormData 对象
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/photo',
    data
  })
}

// 修改用户基本信息
// data 必须传递 FormData 对象
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/profile',
    data
  })
}
