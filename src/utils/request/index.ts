import { Http } from './http'

import {
  tokenInterceptor,
  noCacheInterceptor,
  logInterceptor,
  responseLogInterceptor,
  globalErrorInterceptor,
} from './interceptors'

const baseURL = import.meta.env.VITE_API_BASE_URL
const timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 30000

// 创建默认请求实例
const http = new Http(baseURL, timeout)

// 注册请求拦截器
http.useReqInterceptor(tokenInterceptor)
http.useReqInterceptor(noCacheInterceptor)
http.useReqInterceptor(logInterceptor)

// 注册响应拦截器
http.useRespInterceptor(responseLogInterceptor)

// 注册错误拦截器
http.useErrorInterceptor(globalErrorInterceptor)

// 导出请求实例
export { http, Http }

// 便捷导出
export default http