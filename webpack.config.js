import path from 'path'
import { fileURLToPath } from 'url'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default () => {
	const config = {
		mode: 'production',
		entry: path.join(__dirname, 'dist', 'src', 'bot.js'),
		output: {
			path: path.join(__dirname, 'build'),
			filename: 'worker.js',
			clean: true
		},
		plugins: [new NodePolyfillPlugin()],
		target: 'node',
		target: 'webworker',
		resolve: {
			fallback: {
				fs: false
			}
		},
		performance: {
			hints: false
		}
	}

	return config
}