export interface ReqOptions extends Omit<UniApp.RequestOptions, 'success' | 'fail' | 'complete'> {
	/** 是否显示加载提示，默认 true */
	showLoading ?: boolean
	/** 加载提示文案 */
	loadingText ?: string
	/** 是否统一处理错误提示，默认 true */
	showError ?: boolean
	/** 是否携带 token，默认 true */
	withToken ?: boolean
	/** 是否取消重复请求，默认 false */
	cancelDuplicate ?: boolean
	/** 请求唯一标识（用于取消重复请求） */
	requestKey ?: string
	/** 请求重试次数，默认 0 */
	retryCount ?: number
	/** 重试延迟（ms），默认 1000 */
	retryDelay ?: number
	/**开启缓存，默认 false */
	cache ?: boolean
}

/**
 * API 统一响应格式（根据后端实际格式调整）
 */
export interface RespResult<T = any> {
	code : number
	data : T
	message : string
	traceId ?: string
	timestamp ?: number
}

/**
 * 请求拦截器函数
 */
export type ReqInterceptor = (options : ReqOptions) => ReqOptions | Promise<ReqOptions>

/**
 * 响应拦截器函数
 */
export type RespInterceptor<T = any> = (response : RespResult<T>) => RespResult<T> | Promise<RespResult<T>>

/**
 * 错误拦截器函数
 */
export type ErrorInterceptor = (error : any, options ?: ReqOptions) => void | Promise<void>