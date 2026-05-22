import vue from '@vitejs/plugin-vue';
import { resolve, dirname } from 'path';
import { defineConfig, loadEnv, ConfigEnv, Plugin } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { fileURLToPath } from 'node:url';
import { stat, access } from 'fs/promises';
import { constants } from 'fs';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 自定义插件来处理 /@/ 别名
function customAliasPlugin(): Plugin {
	const srcPath = resolve(__dirname, 'src');
	
	return {
		name: 'custom-alias-plugin',
		enforce: 'pre',
		async resolveId(source, importer) {
			if (source.startsWith('/@/')) {
				let resolvedPath = resolve(srcPath, source.slice(3));
				
				// 检查是否存在该路径
				try {
					const stats = await stat(resolvedPath);
					if (stats.isDirectory()) {
						// 如果是目录，尝试查找 index 文件
						const extensions = ['.ts', '.tsx', '.js', '.jsx', '.vue'];
						for (const ext of extensions) {
							const indexPath = resolve(resolvedPath, `index${ext}`);
							try {
								await access(indexPath, constants.F_OK);
								return indexPath;
							} catch {
								continue;
							}
						}
					}
				} catch {
					// 如果路径不存在，尝试添加扩展名
					const extensions = ['.ts', '.tsx', '.js', '.jsx', '.vue'];
					for (const ext of extensions) {
						try {
							await access(resolvedPath + ext, constants.F_OK);
							return resolvedPath + ext;
						} catch {
							continue;
						}
					}
				}
				
				return resolvedPath;
			}
			return null;
		}
	};
}

export default defineConfig((configEnv: ConfigEnv) => {
	const env = loadEnv(configEnv.mode, process.cwd());
	
	return {
		plugins: [
			customAliasPlugin(),
			vue(), 
			vueJsx(), 
			vueSetupExtend()
		],
		root: process.cwd(),
		resolve: {
			alias: {
				'@': resolve(__dirname, 'src'),
				'@great-dream': resolve(__dirname, 'node_modules/@great-dream'),
				'@views': resolve(__dirname, 'src/views'),
				'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
				'@dvaformflow': resolve(__dirname, 'src/views/plugins/dvaadmin_form_flow/src')
			}
		},
		base: configEnv.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		optimizeDeps: {
			include: [
				'element-plus/es/locale/lang/zh-cn',
				'element-plus/es/locale/lang/en',
				'element-plus/es/locale/lang/zh-tw'
			],
		},
		server: {
			host: '0.0.0.0',
			port: Number(env.VITE_PORT) || 8080,
			open: String(env.VITE_OPEN).toLowerCase() === 'true',
			hmr: true,
			proxy: {
				'/api': {
					target: env.VITE_API_URL || 'http://10.10.0.18:8000/',
					changeOrigin: true,
				},
			},
		},
		build: {
			outDir: env.VITE_DIST_PATH || 'dist',
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				output: {
					entryFileNames: `assets/[name].[hash].js`,
					chunkFileNames: `assets/[name].[hash].js`,
					assetFileNames: `assets/[name].[hash].[ext]`,
					compact: true,
					manualChunks: {
						vue: ['vue', 'vue-router', 'pinia'],
						echarts: ['echarts'],
					},
				},
			},
		},
		css: { preprocessorOptions: { css: { charset: false } } },
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
			__VERSION__: JSON.stringify(process.env.npm_package_version),
		},
	};
});
