import { Markup } from 'telegraf'
import type { CTX } from '../types'
import { dbGetSession, dbGetUser } from '../db-queries/queries.js'

export async function session(ctx: CTX) {
	const user = await dbGetUser(ctx.from.id)

	if (!('id' in user)) {
		console.log('session', user)
		return
	}

	if (user.sessions.length > 1) {
		const sessions = await Promise.all(user.sessions.map(async (session) => {
			return await dbGetSession(session)
		}))

		const activeSession = sessions.find((session) => session.id === user.activeSession)
		const keyboard = sessions.map((session) => {
			const otherPlayer = session.players.find((player) => player.userId !== user.id)
			return [Markup.button.callback(otherPlayer.userName, `session-${session.id}`)]
		})

		await ctx.reply(`текущая сессия: ${activeSession.players[0].userName} vs ${activeSession.players[1].userName}`)
		await ctx.reply('выберите другую сессию:', Markup.inlineKeyboard(keyboard))
	} else {
		await ctx.reply('та пока нет других сессий, пригласите ещё кого-то')
	}
}