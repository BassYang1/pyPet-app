import { defineConfig } from '@uni-helper/unh'

export default defineConfig({
	// 自动生成配置
	autoGenerate: {
		outDir: 'src',
		pages: true,         // 简单启用 pages.json 生成
		// pages: ['dev', 'build'],
		manifest: true,      // 简单启用 manifest.json 生成
		// manifest: {
		// 	minify: true,          
		// 	insertFinalNewline: true,
		// 	commands: ['build'], 
		// }
	},

	platform: {
		default: 'h5',
		alias: {
			'h5': ['h'],  
			'mp-weixin': ['wx'],  
		}
	},

	// 自定义钩子系统
	hooks: {
		// prepare: 执行 `unh prepare` 时调用，常用于项目初始化
		async prepare() {
			console.log('🤖 正在准备环境...')
			// 可以在此进行依赖检查、环境变量初始化等任务
		},
		// dev: 执行 `unh dev` 时，在启动开发服务器前调用
		async dev({ platform, options, envData }) {
			console.log(`正在启动 ${platform} 开发服务器...`)
		},
		// build: 执行 `unh build` 时，在构建前调用
		async build({ platform }) {
			console.log(`正在构建 ${platform} 生产包...`)
		},
		// onBuildAfter: `build` 钩子完成后调用，常用于构建后的清理或通知
		async onBuildAfter({ platform }) {
			console.log(`${platform} 构建完成！`)
		}
	}
})