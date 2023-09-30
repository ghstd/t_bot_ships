import { Markup } from 'telegraf'
import type { CTX } from '../types'
import { fieldTemplate } from '../constants.js'

export async function standartButtons(ctx: CTX) {
	console.log('source: ', 'webapp')

	await ctx.reply('standart buttons on', Markup.keyboard(
		fieldTemplate.map((item, index) => item.map((subItem, n) => `${String.fromCharCode((65 + index))}${n}`))
	))
}