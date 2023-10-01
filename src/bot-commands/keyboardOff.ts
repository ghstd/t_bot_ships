import { Markup } from 'telegraf'
import type { CTX } from '../types'

export async function keyboardOff(ctx: CTX) {
	console.log('source: ', 'keyboardOff')

	await ctx.reply('standart buttons on', Markup.removeKeyboard())
}