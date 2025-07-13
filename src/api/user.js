import request from './../utils/request.js'

// 登录接口
export function login(data) {
  return request({
    url: '/auth/login', // 登录接口
    method: 'post',
    data: data // 自动转换为 JSON
  })
}

// 注册接口
export function register(data) {
  return request({
    url: '/auth/register', // 注册接口
    method: 'post',
    data: data
  })
}