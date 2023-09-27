import { Markup } from 'telegraf'
import { CTX } from '../types'

export async function test(ctx: CTX) {
	await ctx.reply('test answer', Markup.removeKeyboard())
}