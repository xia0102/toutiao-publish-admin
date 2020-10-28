/**
 * 基于 axios 封装的请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'

// 创建一个 axios 实例
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 请求的基础路径
  // 定义后端返回的原始数据的处理
  // data：后端返回的原始数据（未经处理的 JSON 格式）
  transformResponse: [function (data) {
    // 后端返回的数据可能不是 JSON 格式字符串
    // 如果不是，那么 JSONbig.parse 调用会报错
    // 所以使用 try-catch 来捕获异常
    try {
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }

    // axios 默认在内部使用 JSON.parse() 来转换处理原始数据
    // return JSON.parse(data)
  }]
})

// 请求拦截器
request.interceptors.request.use(
  // 任何所有请求会经过这里
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // 如果有登录用户
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    return config
  },
  // 请求失败会经过这里
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器

// 导出请求方法
export default request

// 谁要使用谁就加载 request 模块
// import request from 'request.js'
// request.xxx
// request({
//   method: '',
//   url: ''
// })
