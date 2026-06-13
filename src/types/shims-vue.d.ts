// src/shims-vue.d.ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // 泛型参数可以留空，使用 any 或者更精确的组件类型
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 如果需要支持其他静态资源，也可以一并声明
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.css'
declare module '*.scss'