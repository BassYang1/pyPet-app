import { createSSRApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

// 全局样式
import '@/styles/global.scss'

// 全局单例 pinia（在函数内创建，保证每次调用独立但不影响多实例）
let pinia

export function createApp() {
	// 1. 创建 SSR 应用实例（兼容 H5/小程序/App）
	const app = createSSRApp(App)

	// 2. 安装 Pinia
	pinia = createPinia()
	app.use(pinia)

	// 3. 挂载全局工具方法
	app.config.globalProperties.$utils = {
		sleep: (delay) => new Promise(resolve => setTimeout(resolve, delay)),
		toast: (title, duration = 1500) => {
			uni.showToast({ title, icon: 'none', duration })
		}
	}

	// 4. 全局错误捕获
	app.config.errorHandler = (err, instance, info) => {
		const errorMsg = err instanceof Error ? err.message : String(err)
		console.error('[全局异常]', errorMsg, instance, info)
		// 可对接错误上报
	}

	console.log(__PY_APP_TITLE__)
	// 5. 全局运行环境标识，环境信息（平台判断可在组件/页面内做）
	app.config.globalProperties.$platform = uni.getSystemInfoSync().platform
	console.log('当前运行平台：', app.config.globalProperties.$platform)

	// 6. 返回 app 实例（uni-app 框架会自动调用 .mount()）
	return {
		app,
		pinia   // 如果需要在非 Vue 文件中使用 pinia，可以暴露出来
	}
}