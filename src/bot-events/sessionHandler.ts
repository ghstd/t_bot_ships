import { dbGetSession, dbUpdateUserActiveSession } from '../db-queries/queries.js'
import type { eventCTX } from '../types'

export async function sessionHandler(ctx: eventCTX, eventId: string) {
	console.log('source: ', 'sessionHandler')
	if (ctx.from) {
		const user = await dbUpdateUserActiveSession(ctx.from.id, eventId)
		const activeSession = await dbGetSession(user.activeSession)

		await ctx.reply(`текущая сессия: ${activeSession.players[0].userName} vs ${activeSession.players[1].userName}`)
	}
}