import axios from "axios";

// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前可以做一些处理
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做处理
    return response.data
  },
  error => {
    // 对响应错误做处理
    return Promise.reject(error)
  }
)

export default service