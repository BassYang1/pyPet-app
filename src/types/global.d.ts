// 扩展 Vue 模块：全局实例属性
import 'vue'

declare module 'vue' {
	/**
	 * 扩展 Vue 全局属性接口
	 * 对应 main.ts 中 app.config.globalProperties 挂载的内容
	 */
	interface ComponentCustomProperties {
		/** 全局工具方法 */
		$utils : {
			/** 延时函数 */
			sleep : (delay : number) => Promise<void>
			/** 全局吐司提示 */
			toast : (title : string, duration ?: number) => void
		}
		// 可继续扩展：$http / $store / $eventBus 等
	}
}

declare global {

	const __PY_DEV__ : boolean
	const __PY_PROD__ : boolean
	const __PY_DEBUG__ : boolean

	const __PY_APP_TITLE__ : string
	const __PY_APP_VERSION__ : string
	const __PY_APP_VESRSION_CODE__ : number
	const __PY_APP_DESC__ : string
}