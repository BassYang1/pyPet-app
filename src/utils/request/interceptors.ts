import type { ReqOptions, RespResult, ReqInterceptor, RespInterceptor, ErrorInterceptor } from './types'
import { useUserStore } from '@/stores/user'

/**
 * Token 注入拦截器
 */
export const tokenInterceptor : ReqInterceptor = (options : ReqOptions) => {
	if (!options.withToken) {
		return options
	}

	const userStore = useUserStore()
	const token = userStore.token

	if (!token) {
		return options
	}

	options.header = {
		...options.header,
		Authorization: `Bearer ${token}`,
	}

	return options
}

/**
 * 时间戳防缓存拦截器（GET 请求）
 */
export const noCacheInterceptor: ReqInterceptor = (options: ReqOptions) => {
  // 只针对 GET 且未开启 cache 的请求
  if (options.method === 'GET' && !options.cache) {
    const timestamp = Date.now();
    const separator = options.url.includes('?') ? '&' : '?';
    options.url = `${options.url}${separator}_t=${timestamp}`;
  }
  
  return options;
}

/**
 * 日志拦截器（仅开发环境）
 */
export const logInterceptor : ReqInterceptor = (options: ReqOptions) => {
	if (import.meta.env.VITE_APP_DEBUG) {
		console.log(`[Request] ${options.method} ${options.url}`, options.data)
	}
	
	return options
}

/**
 * 响应日志拦截器
 */
export const responseLogInterceptor : RespInterceptor = (response: RespResult) => {
	if (import.meta.env.VITE_APP_DEBUG) {
		console.log('[Response]', response)
	}
	
	return response
}

/**
 * 全局错误拦截器（可扩展错误上报）
 */
export const globalErrorInterceptor : ErrorInterceptor = async (error : any, options ?: ReqOptions) => {
	if (import.meta.env.VITE_APP_DEBUG) {
		console.error('[Request Error]', error, options)
	}

	// 可在此接入错误上报服务（如 Sentry）
	// if (!import.meta.env.VITE_APP_DEBUG) {
	//   await reportError(error, options)
	// }
}