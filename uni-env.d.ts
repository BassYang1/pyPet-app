/**
 * 全局类型声明文件
 * 适配：uni-app3.0 + Vite + Vue3 + TypeScript
 * 功能：uni类型引入、环境变量类型、Vue组件模块声明
 */

// 三斜线指令：加载 uni-app 官方全局类型
/// <reference types="@dcloudio/uni-app" />
/// <reference types="@dcloudio/types" />

// ====================== Vite 环境变量类型扩展 ======================
interface ImportMetaEnv {
  // -------- 项目自定义环境变量 --------
  /** 应用标题 */
  readonly VITE_APP_TITLE: string
  /** 接口基础地址 */
  readonly VITE_APP_BASE_API: string
  /** 运行环境标识 dev / test / prod */
  readonly VITE_APP_ENV: string

  // -------- Vite 内置标准环境变量（必补） --------
  /** 当前模式 development / production */
  readonly MODE: string
  /** 是否开发环境 */
  readonly DEV: boolean
  /** 是否生产环境 */
  readonly PROD: boolean
  /** 是否开启 SSR */
  readonly SSR: boolean

  // 可选环境变量（? 表示非必填）
  readonly VITE_APP_UPLOAD_URL?: string
}

// 合并原生 ImportMeta 接口
interface ImportMeta {
  readonly env: ImportMetaEnv
}
