import { dbGetPlayerByUserId } from '../db-queries/queries.js'
import { Markup } from 'telegraf'
import type { eventCTX } from '../types'

export async function startGame(ctx: eventCTX) {
	console.log('source: ', 'startGame')
	if (ctx.from) {
		const player = await dbGetPlayerByUserId(ctx.from.id)

		await ctx.editMessageText('сделайте расстановку:')
		await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${player.playerField
			.map((item) => item
				.map((i) => '-')
				.join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
			.join('\n')}</pre>`, Markup.keyboard(
				player.playerField.map((item, index) => item.map((subItem, n) => `${String.fromCharCode((65 + index))}${n}`))
			))
	}
}
