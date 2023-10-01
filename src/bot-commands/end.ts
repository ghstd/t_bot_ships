import { Markup } from 'telegraf'
import { dbDeletePlayer, dbDeleteSession, dbDeleteSessionFromUser, dbGetSession, dbGetUser } from '../db-queries/queries.js'
import type { CTX } from '../types'

export async function end(ctx: CTX) {
	console.log('source: ', 'end')
	const user = await dbGetUser(ctx.from.id)

	//@ts-ignore
	if (user.noData) {
		//@ts-ignore
		console.log('end - user.noData: ', user.noData)
		return
	}

	if (user.activeSession) {
		const session = await dbGetSession(user.activeSession)

		//@ts-ignore
		if (session.noData) {
			//@ts-ignore
			console.log('end - user.noData: ', session.noData)
			return
		}

		session.players.forEach(async (player) => {
			await dbDeleteSessionFromUser(player.userId, session.id)
			await dbDeletePlayer(player.id)
		})

		await dbDeleteSession(session.id)

		const [p1, p2] = session.players
		await ctx.telegram.sendMessage(p1.userId, `партия ${p1.userName} vs ${p2.userName} завершена`, Markup.removeKeyboard())
		await ctx.telegram.sendMessage(p2.userId, `партия ${p1.userName} vs ${p2.userName} завершена`, Markup.removeKeyboard())
	}
}
