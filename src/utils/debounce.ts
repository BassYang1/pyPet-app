// utils/debounce.ts
/**
 * 防抖函数（适用于输入搜索、提交按钮等场景）
 * @param fn 要执行的函数
 * @param delay 延迟时间(ms)
 * @returns 防抖包装后的函数
 */
export function debounce<T extends (...args : any[]) => any>(fn : T, delay : number = 300) : T {
	let timer : ReturnType<typeof setTimeout> | null = null
	return ((...args : Parameters<T>) => {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			fn(...args)
			timer = null
		}, delay)
	}) as T
}

/**
 * 节流函数（适用于滚动加载、拖拽等高频场景）
 * @param fn 要执行的函数
 * @param delay 间隔时间(ms)
 * @returns 节流包装后的函数
 */
export function throttle<T extends (...args : any[]) => any>(fn : T, delay : number = 300) : T {
	let lastTime = 0
	return ((...args : Parameters<T>) => {
		const now = Date.now()
		if (now - lastTime >= delay) {
			fn(...args)
			lastTime = now
		}
	}) as T
}

/**
 * 防抖钩子（Composition API 风格，适用于 Vue 组件）
 */
export function useDebounce<T extends (...args : any[]) => any>(fn : T, delay : number = 300) : { run : T; cancel : () => void } {
	let timer : ReturnType<typeof setTimeout> | null = null
	const run = ((...args : Parameters<T>) => {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			fn(...args)
			timer = null
		}, delay)
	}) as T
	const cancel = () => {
		if (timer) {
			clearTimeout(timer)
			timer = null
		}
	}
	return { run, cancel }
}