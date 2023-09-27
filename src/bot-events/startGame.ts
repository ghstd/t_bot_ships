import { dbGetPlayer } from '../db-queries/queries.js'
import { Markup } from 'telegraf'
import { eventCTX } from '../types'

export async function startGame(ctx: eventCTX) {
	if (ctx.from) {
		const player = await dbGetPlayer(`${ctx.from.id}`)

		if (typeof player.playerField === 'string') {
			const playerField = JSON.parse(player.playerField) as number[][]

			await ctx.editMessageText('сделайте расстановку:')
			await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${playerField
				.map((item) => item
					.map((i) => '-')
					.join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
				.join('\n')}</pre>`, Markup.keyboard(
					playerField.map((item, index) => item.map((subItem, n) => `${String.fromCharCode((65 + index))}${n}`))
				))
		}
	}
}
