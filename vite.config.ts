import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'
import { resolve } from 'path'

// 统一根目录
const root = process.cwd()

export default defineConfig(({ mode }) => {
	// 1. 指定 env 文件所在目录
	const envDir = resolve(root, 'env')
	// 标准写法：通过 mode 加载环境变量
	const env = loadEnv(mode, envDir, 'VITE_')
	const isProd = mode === 'production'
	const UNI_PLATFORM = process.env.UNI_PLATFORM || ''

	// 接口代理目标地址，从环境变量读取
	const proxyTarget = env.VITE_PROXY_TARGET || 'https://xxx-api.com'

	return {
		root,
		// 环境变量规则
		envDir,
		envPrefix: 'VITE_',

		// 路径别名
		resolve: {
			alias: {
				'@': resolve(root, './src'),
				'@/pages': resolve(root, './src/pages'),
				'@/utils': resolve(root, './src/utils'),
				'@/static': resolve(root, './src/static'),
				'@/styles': resolve(root, './src/styles')
			},
			extensions: ['.vue', '.js', '.ts', '.jsx', '.tsx']
		},

		// H5 开发服务
		server: {
			port: 8084,
			host: '0.0.0.0',
			open: false,
			cors: true,
			strictPort: true,
			proxy: {
				'/api': {
					target: proxyTarget,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '')
				}
			}
		},

		// 构建配置：分平台差异化
		build: (() => {
			if (UNI_PLATFORM === 'h5') {
				return {
					outDir: 'dist',
					emptyOutDir: true,
					assetsDir: 'static',
					minify: isProd ? 'terser' : false,
					assetsInlineLimit: 4096,
					terserOptions: {
						compress: {
							drop_console: isProd,
							drop_debugger: isProd
						}
					},
					rollupOptions: {
						output: {
							chunkFileNames: 'static/js/[name]-[hash].js',
							entryFileNames: 'static/js/[name]-[hash].js',
							assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
						}
					}
				}
			}
			// 小程序 / App 采用 uni 默认打包
			return {
				outDir: 'unpackage/dist',
				emptyOutDir: true,
				rollupOptions: {}
			}
		})(),

		// SCSS 预处理器（修复 Sass 废弃警告）
		css: {
			preprocessorOptions: {
				scss: {
					// 全部改用 @use + 全局暴露，彻底消除 @import 警告
					additionalData: `
            @use "@/styles/variables.scss" as *;
            @use "@/styles/mixins.scss" as *;
          `,
					// 使用新版 Sass API，关闭两类弃用警告
					api: 'modern-compiler',
					silenceDeprecations: ['legacy-js-api', 'import']
				}
			}
		},

		// 插件（顺序严格固定）
		plugins: [
			// 全局 API 自动导入
			AutoImport({
				imports: ['vue', 'uni-app', 'pinia'],
				dts: 'src/auto-imports.d.ts',
				eslintrc: { enabled: false },
				ignore: [],
				vueTemplate: true
			}),

			// 全局组件自动导入
			Components({
				dirs: [
					'src/components',
					'src/components-mp',
					'src/components-app'
				],
				dts: 'src/components.d.ts',
				extensions: ['vue'],
				deep: true,
				exclude: [/node_modules/, /dist/, /unpackage/]
			}),
			UniManifest(),
			UniPages({
				// 允许在 <route> 中使用 JSON5 语法（注释、尾逗号等）
				routeBlockLang: 'json5',
				homePage: 'pages/home/index'
			}),
			uni()
		]
	}
})
