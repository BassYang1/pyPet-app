// utils/request/core.ts
import type { ReqOptions, RespResult, ReqInterceptor, RespInterceptor, ErrorInterceptor } from './types'

/** 存储待取消的请求 */
const pendingRequests = new Map<string, UniApp.RequestTask>()

/**
 * 深度排序函数
 */
const sortObj = (obj : any) : any => {
	// 处理基本类型（string, number, boolean, null, undefined）
	if (obj === null || typeof obj !== 'object') return obj;

	// 处理数组（递归遍历数组中的每一项）
	if (Array.isArray(obj)) return obj.map(sortObj);

	// 处理普通对象 (Plain Object)
	const sorted : any = {};

	// 获取所有键名，按字母顺序排序
	Object.keys(obj).sort().forEach(key => {
		sorted[key] = sortObj(obj[key]);
	});

	return sorted;
};

/**
 * 生成请求唯一标识
 */
const generateRequestKey = (options : ReqOptions) : string => {
	const { url, method = 'GET', data, header } = options
	const params = method === 'GET' ? data : undefined

	return `${method}_${url}_${JSON.stringify(sortObj(params))}_${JSON.stringify(sortObj(header))}`
}

/**
 * 添加待取消请求
 */
const addPendingRequest = (key : string, task : UniApp.RequestTask) : void => {
	if (pendingRequests.has(key)) {
		cancelRequest(key)
	}

	pendingRequests.set(key, task)
}

/**
 * 取消指定请求
 */
const cancelRequest = (key : string) : void => {
	const task = pendingRequests.get(key)

	if (task) {
		task.abort()
		pendingRequests.delete(key)
	}
}

/**
 * 延迟函数
 */
const delay = (ms : number) : Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 请求类（工厂模式）
 */
class Http {
	private baseURL : string
	private timeout : number
	private ReqInterceptors : ReqInterceptor[] = []
	private RespInterceptors : RespInterceptor[] = []
	private errorInterceptors : ErrorInterceptor[] = []

	constructor(baseURL : string, timeout : number = 30000) {
		this.baseURL = baseURL
		this.timeout = timeout
	}

	/** 注册请求拦截器 */
	useReqInterceptor(interceptor : ReqInterceptor) : void {
		this.ReqInterceptors.push(interceptor)
	}

	/** 注册响应拦截器 */
	useRespInterceptor(interceptor : RespInterceptor) : void {
		this.RespInterceptors.push(interceptor)
	}

	/** 注册错误拦截器 */
	useErrorInterceptor(interceptor : ErrorInterceptor) : void {
		this.errorInterceptors.push(interceptor)
	}

	/** 执行请求拦截器链 */
	private async runReqInterceptors(options : ReqOptions) : Promise<ReqOptions> {
		let result = options

		for (const interceptor of this.ReqInterceptors) {
			result = await interceptor(result)
		}

		return result
	}

	/** 执行响应拦截器链 */
	private async runRespInterceptors(response : RespResult) : Promise<RespResult> {
		let result = response

		for (const interceptor of this.RespInterceptors) {
			result = await interceptor(result)
		}

		return result
	}

	/** 执行错误拦截器链 */
	private async runErrorInterceptors(error : any, options ?: ReqOptions) : Promise<void> {
		for (const interceptor of this.errorInterceptors) {
			await interceptor(error, options)
		}
	}

	/** 核心请求方法 */
	async request<T = any>(options : ReqOptions) : Promise<T> {
		// 合并默认配置
		const opts : ReqOptions = {
			method: 'GET',
			timeout: this.timeout,
			showLoading: true,
			showError: true,
			withToken: true,
			cancelDuplicate: false,
			retryCount: 0,
			retryDelay: 1000,
			cache: false,
			...options,
			url: options.url?.startsWith('http') ? options.url : `${this.baseURL}${options.url}`,
			header: {
				'Content-Type': 'application/json',
				...options.header,
			},
		}

		// 处理重复请求取消
		let requestKey : string | undefined
		
		if (opts.cancelDuplicate) {
			requestKey = opts.requestKey || generateRequestKey(opts)
			
			// 如果存在相同请求，先取消之前的
			if (requestKey && pendingRequests.has(requestKey)) {
				cancelRequest(requestKey)
			}
		}

		// 执行请求拦截器
		let interceptedOptions : ReqOptions
		
		try {
			interceptedOptions = await this.runReqInterceptors(opts)
		} catch (error) {
			await this.runErrorInterceptors(error, opts)
			
			throw error
		}

		// 显示加载提示
		if (interceptedOptions.showLoading) {
			uni.showLoading({ title: interceptedOptions.loadingText || '加载中...', mask: true })
		}

		// 请求重试逻辑
		const maxRetries = interceptedOptions.retryCount || 0
		let lastError : any

		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				const response = await this.sendRequest(interceptedOptions, requestKey)
				
				return response
			} catch (error) {
				lastError = error
				
				// 如果不是最后一次重试，等待后继续
				if (attempt < maxRetries) {
					await delay(interceptedOptions.retryDelay || 1000)
					
					// 重试前可以恢复 loading 状态
					if (interceptedOptions.showLoading && !uni.hideLoading) {
						uni.showLoading({ title: interceptedOptions.loadingText || '加载中...' })
					}
				}
			}
		}

		throw lastError
	}

	/** 实际发送请求 */
	private sendRequest(options : ReqOptions, requestKey ?: string) : Promise<any> {
		return new Promise((resolve, reject) => {
			let requestTask : UniApp.RequestTask | null = null

			const complete = () => {
				if (options.showLoading) {
					uni.hideLoading()
				}
				
				if (requestKey && pendingRequests.has(requestKey)) {
					pendingRequests.delete(requestKey)
				}
			}

			requestTask = uni.request({
				...options,
				success: async (res) => {
					// 处理 HTTP 状态码
					if (res.statusCode === 200) {
						const response = res.data as RespResult
						let interceptedResponse : RespResult
						
						try {
							interceptedResponse = await this.runRespInterceptors(response)
						} catch (error) {
							await this.runErrorInterceptors(error, options)
							reject(error)
							complete()
							return
						}

						// 判断业务状态码
						if (interceptedResponse.code === 10200) {
							resolve(interceptedResponse.data)
						} else {
							const error = new Error(interceptedResponse.message || '请求失败')
								; (error as any).code = interceptedResponse.code
								; (error as any).options = options
								
							if (options.showError) {
								this.handleError(interceptedResponse.message, interceptedResponse.code)
							}
							
							await this.runErrorInterceptors(error, options)
							reject(error)
						}
					} else {
						const httpError = new Error(`HTTP ${res.statusCode}`)
							; (httpError as any).statusCode = res.statusCode
							; (httpError as any).options = options
							
						if (options.showError) {
							this.handleError(`网络异常 ${res.statusCode}`)
						}
						await this.runErrorInterceptors(httpError, options)
						reject(httpError)
					}
				},
				fail: async (err) => {
					const error = new Error(err.errMsg || '网络请求失败')
						; (error as any).options = options
					if (options.showError) {
						uni.showToast({ title: '网络连接失败，请检查网络', icon: 'none' })
					}
					await this.runErrorInterceptors(error, options)
					reject(error)
				},
				complete: () => {
					complete()
				},
			})

			// 记录待取消请求
			if (requestKey && requestTask) {
				addPendingRequest(requestKey, requestTask)
			}
		})
	}

	/** 统一错误提示 */
	private handleError(message : string, code ?: number) : void {
		// 401 未授权特殊处理
		if (code === 10401) {
			// 触发退出登录逻辑
			uni.reLaunch({ url: '/pages/login/index' })
			return
		}
		
		uni.showToast({ title: message || '请求失败', icon: 'none', duration: 2000 })
	}

	/** HTTP 方法快捷调用 */
	get<T = any>(url : string, params ?: any, options ?: Omit<ReqOptions, 'url' | 'method' | 'data'>) : Promise<T> {
		return this.request<T>({ url, method: 'GET', data: params, ...options })
	}

	post<T = any>(url : string, data ?: any, options ?: Omit<ReqOptions, 'url' | 'method' | 'data'>) : Promise<T> {
		return this.request<T>({ url, method: 'POST', data, ...options })
	}

	put<T = any>(url : string, data ?: any, options ?: Omit<ReqOptions, 'url' | 'method' | 'data'>) : Promise<T> {
		return this.request<T>({ url, method: 'PUT', data, ...options })
	}

	delete<T = any>(url : string, data ?: any, options ?: Omit<ReqOptions, 'url' | 'method' | 'data'>) : Promise<T> {
		return this.request<T>({ url, method: 'DELETE', data, ...options })
	}

	upload<T = any>(url : string, filePath : string, name : string = 'file', formData ?: any) : Promise<T> {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: url.startsWith('http') ? url : `${this.baseURL}${url}`,
				filePath,
				name,
				formData,
				header: {
					'Content-Type': 'multipart/form-data',
				},
				success: (res) => {
					if (res.statusCode === 200) {
						try {
							const data = JSON.parse(res.data) as RespResult<T>
							if (data.code === 10200) {
								resolve(data.data)
							} else {
								uni.showToast({ title: data.message || '上传失败', icon: 'none' })
								reject(new Error(data.message))
							}
						} catch (e) {
							reject(e)
						}
					} else {
						reject(new Error(`上传失败 ${res.statusCode}`))
					}
				},
				fail: (err) => {
					uni.showToast({ title: '上传失败', icon: 'none' })
					reject(err)
				},
			})
		})
	}
}

export { Http, pendingRequests, cancelRequest }