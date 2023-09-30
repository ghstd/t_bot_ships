import { Markup } from 'telegraf'
import type { CTX } from '../types'

export async function webapp(ctx: CTX) {
	console.log('source: ', 'webapp')
	await ctx.reply('open webapp', Markup.inlineKeyboard([
		[Markup.button.webApp('webapp', 'https://tebot-web.netlify.app')]
	]))
}