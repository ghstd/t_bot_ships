import { dbGetSession, dbGetUser, dbUpdateSessionMovesCount } from '../db-queries/queries'
import { Markup } from 'telegraf'
import { eventCTX } from '../types'
import { whoseMove } from '../../helpers/whoseMove'

export async function playerReady(ctx: eventCTX) {
	if (ctx.from) {
		const user = await dbGetUser(ctx.from.id)

		if (user.activeSession) {
			const session = await dbGetSession(user.activeSession)
			const allPlayersReady = session.players.every((player) => player.ready)

			if (allPlayersReady) {
				const i = whoseMove(session.movesCount)
				await dbUpdateSessionMovesCount(session.id, session.movesCount + 1)

				const movingPlayer = session.players[i];
				const waitingPlayer = session.players.find((player) => player.userId !== movingPlayer.userId)!

				if (typeof movingPlayer.playerField === 'string') {
					const playerField = JSON.parse(movingPlayer.playerField) as number[][]

					ctx.telegram.sendMessage(waitingPlayer.userId, 'ход второго игрока')
					ctx.telegram.sendMessage(movingPlayer.userId, 'ваш ход', Markup.keyboard(
						playerField.map((item, index) => item.map((subItem, n) => `${String.fromCharCode((65 + index))}${n}`))
					))
				}
			}
		} else {
			ctx.editMessageText('ожидайте')
		}
	}
}