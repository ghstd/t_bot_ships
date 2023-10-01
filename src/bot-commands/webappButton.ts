import { Markup } from 'telegraf'
import type { CTX } from '../types'

export async function webappButton(ctx: CTX) {
	console.log('source: ', 'webapp')

	await ctx.reply('web-app', Markup.inlineKeyboard([
		[Markup.button.webApp('web-app', 'https://tebot-web.netlify.app')]
	]))
}