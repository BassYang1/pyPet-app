// --------------- 1. 扩展 Vue 模块：全局实例属性 ---------------
import 'vue'

declare module 'vue' {
  /**
   * 扩展 Vue 全局属性接口
   * 对应 main.ts 中 app.config.globalProperties 挂载的内容
   */
  interface ComponentCustomProperties {
    /** 全局工具方法 */
    $utils: {
      /** 延时函数 */
      sleep: (delay: number) => Promise<void>
      /** 全局吐司提示 */
      toast: (title: string, duration?: number) => void
    }
    // 可继续扩展：$http / $store / $eventBus 等
  }
  
  // 重载 mount，允许不传参（解决：应有1-4个参数，但获得0个）
  interface App {
    mount(): ComponentPublicInstance
  }
}

// --------------- 2. 声明 .vue 单文件组件（TS 识别 Vue 文件必备） ---------------
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// --------------- 3. uni-app 全局 API 完整类型声明（修复 Uni 标红） ---------------
// 优先引用 uni-app 官方全局类型
////////// <reference types="@dcloudio/uni-app" />

// 声明全局 uni 对象，兼容多端环境
declare const uni: Uni

// --------------- 强制转为模块，避免全局作用域冲突 ---------------
export {}