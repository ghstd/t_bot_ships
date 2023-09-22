import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default () => {
	const config = {
		mode: 'production',
		entry: path.join(__dirname, 'dist', 'api', 'bot.js'),
		output: {
			path: path.join(__dirname, 'public'),
			filename: 'bot.js',
			clean: true
		},
		target: 'node'
	}

	return config
}






