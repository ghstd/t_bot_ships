import { Markup } from 'telegraf'
import { checkField } from '../../helpers/checkField.js'
import { dbDeletePlayer, dbDeleteSession, dbDeleteSessionFromUser, dbGetPlayer, dbGetPlayerByUserId, dbGetSession, dbUpdatePlayerField, dbUpdatePlayerTargetField, dbUpdateSessionMovesCount } from '../db-queries/queries.js'
import type { hearsCTX } from '../types'
import { whoseMove } from '../../helpers/whoseMove.js'

const ship = String.fromCharCode(9608)
const hit = String.fromCharCode(88)
const miss = String.fromCharCode(10042)

export async function hearsHandler(ctx: hearsCTX, coord_1: number, coord_2: number) {
	const player = await dbGetPlayerByUserId(ctx.from.id)
	//@ts-ignore
	if (player.noData) {
		//@ts-ignore
		console.log('hearsHandler - player.noData: ', player.noData)
		return
	}
	const session = await dbGetSession(player.session.id)
	//@ts-ignore
	if (session.noData) {
		//@ts-ignore
		console.log('hearsHandler - session.noData: ', session.noData)
		return
	}
	const movesCount = session.movesCount

	if (movesCount === 1) {
		console.log('source: ', 'hearsHandler: movesCount === 1')

		if (player.ready) {
			await ctx.reply('вы уже выполнили расстановку')
			return
		}

		// =======
		if (coord_1 === -1 && coord_2 === -1) {
			await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${player.playerField
				.map((item) => item
					.map((i) => i === 1 ? ship : '-')
					.join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
				.join('\n')}</pre>`, Markup.removeKeyboard())

			await ctx.reply('продолжить', Markup.inlineKeyboard([
				[Markup.button.callback('продолжить', 'playerReady')]
			]))

			return
		}
		// =======

		const playerFieldOld = player.playerField

		if (playerFieldOld[coord_1][coord_2] === 1) {
			playerFieldOld[coord_1][coord_2] = 0
		} else {
			playerFieldOld[coord_1][coord_2] = 1
		}
		const updetedPlayer = await dbUpdatePlayerField(player.id, JSON.stringify(playerFieldOld))

		const playerFieldCurrent = updetedPlayer.playerField
		const playerFieldStatus = checkField(playerFieldCurrent)

		if (!playerFieldStatus.correct) {
			await ctx.reply(playerFieldStatus.message)
			await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${playerFieldCurrent
				.map((item) => item
					.map((i) => i === 1 ? ship : '-')
					.join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
				.join('\n')}</pre>`, Markup.keyboard(
					playerFieldCurrent.map((item, index) => item.map((subItem, n) => `${String.fromCharCode((65 + index))}${n}`))
				))

		} else {

			await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${playerFieldCurrent
				.map((item) => item
					.map((i) => i === 1 ? ship : '-')
					.join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
				.join('\n')}</pre>`, Markup.removeKeyboard())

			await ctx.reply(playerFieldStatus.message, Markup.inlineKeyboard([
				[Markup.button.callback('сохранить', 'playerReady')]
			]))
		}
	} else {
		console.log('source: ', 'hearsHandler: movesCount > 1')

		const i = whoseMove(movesCount)

		const movingPlayerId = session.players[i].id
		const waitingPlayerId = session.players.find((player) => player.id !== movingPlayerId).id

		const movingPlayer = await dbGetPlayer(movingPlayerId)
		const waitingPlayer = await dbGetPlayer(waitingPlayerId)

		if (ctx.from.id === movingPlayer.userId) {
			await ctx.reply('сейчас не ваш ход')
			return
		}

		await dbUpdateSessionMovesCount(session.id, session.movesCount + 1)

		switch (movingPlayer.playerField[coord_1][coord_2]) {
			case 0:

				movingPlayer.playerField[coord_1][coord_2] = 2
				await dbUpdatePlayerField(movingPlayer.id, JSON.stringify(movingPlayer.playerField))
				waitingPlayer.targetField[coord_1][coord_2] = 2
				await dbUpdatePlayerTargetField(waitingPlayer.id, JSON.stringify(waitingPlayer.targetField))

				break;
			case 1:

				movingPlayer.playerField[coord_1][coord_2] = 3
				await dbUpdatePlayerField(movingPlayer.id, JSON.stringify(movingPlayer.playerField))
				waitingPlayer.targetField[coord_1][coord_2] = 3
				await dbUpdatePlayerTargetField(waitingPlayer.id, JSON.stringify(waitingPlayer.targetField))

				break;
			default:
				break;
		}

		const shipsQuantity = movingPlayer.playerField.reduce((result, item) =>
			item.reduce((subResult, subItem) => subItem === 1 ? subResult + subItem : subResult, 0) + result, 0);

		if (shipsQuantity === 0) {
			await ctx.telegram.sendMessage(movingPlayer.userId, `
					игра завершена,
					победил ${waitingPlayer.userName}
					количество ходов ${movesCount}
				`, Markup.removeKeyboard())

			await ctx.telegram.sendMessage(waitingPlayer.userId, `
					игра завершена,
					победил ${waitingPlayer.userName}
					количество ходов ${movesCount}
				`, Markup.removeKeyboard())

			const players = [movingPlayer, waitingPlayer]
			players.forEach(async (player) => {
				await dbDeleteSessionFromUser(player.userId, session.id)
				await dbDeletePlayer(player.id)
			})

			await dbDeleteSession(session.id)
			return
		}

		const previousPlayerMove = ctx.message.text

		await ctx.telegram.sendMessage(waitingPlayer.userId, 'ход второго игрока', Markup.removeKeyboard())

		ctx.chat.id = movingPlayer.userId

		await ctx.reply(`второй игрок походил: ${previousPlayerMove}`)
		await ctx.reply('ваше поле')
		await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${movingPlayer.playerField
			.map((item) => item
				.map((i) => {
					switch (i) {
						case 0:
							return '-'
						case 1:
							return ship
						case 2:
							return miss
						case 3:
							return hit
						default:
							return '?'
					}
				})
				.join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
			.join('\n')}</pre>`, Markup.keyboard(
				movingPlayer.playerField.map((item, index) => item.map((subItem, n) => `${String.fromCharCode((65 + index))}${n}`))
			))

		await ctx.reply('поле второго игрока')
		await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${movingPlayer.targetField
			.map((item) => item
				.map((i) => {
					switch (i) {
						case 0:
							return '-'
						case 1:
							return ship
						case 2:
							return miss
						case 3:
							return hit
						default:
							return '?'
					}
				})
				.join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
			.join('\n')}</pre>`
		)
	}
}


