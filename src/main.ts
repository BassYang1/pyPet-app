import { createSSRApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

// 全局样式（全页面/组件生效）
import '@/styles/global.scss'

// ====================== 1. 初始化全局单例 ======================
// Pinia 全局唯一实例，保证全应用状态共享
const pinia = createPinia()
// 创建 uni-app 跨端标准应用实例（兼容 H5/小程序/App/SSR）
const app = createSSRApp(App)

// ====================== 2. 安装全局插件 ======================
app.use(pinia)

// ====================== 3. 环境区分 & 全局工具方法 ======================
/**
 * 全局工具对象，挂载到 Vue 实例
 * 模板内直接使用：{{ $utils.xxx() }}
 * 组合式API内：const { proxy } = getCurrentInstance()
 */
app.config.globalProperties.$utils = {
  /** 示例：简单延时 */
  sleep: (delay: number) => new Promise(resolve => setTimeout(resolve, delay)),
  /** 示例：统一吐司提示（封装 uni 原生 API） */
  toast: (title: string, duration = 1500) => {
    uni.showToast({ title, icon: 'none', duration })
  }
}

// 全局运行环境标识（方便业务区分平台）
const platform = uni.getSystemInfoSync().platform
console.log('当前运行平台：', platform)

// ====================== 4. 全局异常捕获 ======================
/**
 * 捕获组件渲染、生命周期、事件回调等全局错误
 * err: 错误对象
 * instance: 出错组件实例
 * info: 错误类型信息
 */
app.config.errorHandler = (err: unknown, instance, info) => {
  const errorMsg = err instanceof Error ? err.message : String(err)
  console.error('[全局异常捕获]', errorMsg, instance, info)

  // 线上可对接：错误上报接口、埋点、弹窗提示
  // reportError(errorMsg, info)
}

// ====================== 5. 应用挂载（uni-app 强制标准写法） ======================
// 禁止传入 #app 等 DOM 选择器，框架内部自动适配多端渲染容器
app.mount()