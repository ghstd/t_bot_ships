import { Markup } from 'telegraf'
import type { CTX } from '../types'

export async function webappButton(ctx: CTX) {
	console.log('source: ', 'webapp')

	// await ctx.reply('webapp button on', Markup.keyboard([
	// 	[Markup.button.webApp('web-app', 'https://tebot-web.netlify.app')]
	// ]))

	await ctx.reply('webapp button on', Markup.inlineKeyboard([
		[Markup.button.webApp('web-app', 'https://tebot-web.netlify.app')]
	]))
}