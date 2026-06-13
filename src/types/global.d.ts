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
}

// --------------- 2. 声明 .vue 单文件组件（TS 识别 Vue 文件必备） ---------------
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// --------------- 强制转为模块，避免全局作用域冲突 ---------------
export {}