import { Telegraf, Markup } from 'telegraf';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { callbackQuery } from 'telegraf/filters';
import { checkField, whoseMove } from '../helpers/helpers';

import { IUserData, IPlayerData } from '../prisma/types'
import { dbGetUsers, dbGetSession, dbAddUser, dbDeleteSession, dbDeletePlayer, dbAddSession, dbAddPlayer, dbUpdateSession, dbGetUser, dbUpdatePlayer } from '../prisma/queries'

const bot = new Telegraf(process.env.TEL_TOKEN as string);

const fieldTemplate = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const SESSION_ID = 1
let usersDb: IUserData[] = [];
let playersDb: IPlayerData[] = [];
let movesCount: number;

async function init() {
	const allUsers = await dbGetUsers() // dbGetUsers
	console.log('allUsers: ', allUsers)
	if (allUsers) {
		usersDb = allUsers.map((user) => ({
			name: user.name,
			id: user.telegramID
		}))
	}

	const session = await dbGetSession(SESSION_ID) // dbGetSession
	if (session) {
		movesCount = session.movesCount
		playersDb = session.players.map((player) => {
			const user = allUsers.find((user) => user.id === player.userId)
			if (user) {
				return {
					player: {
						name: user.name,
						id: user.telegramID
					},
					ready: player.ready,
					playerField: JSON.parse(player.playerField) as number[][],
					targetField: JSON.parse(player.targetField) as number[][]
				}
			}
		})
	}
}




bot.command('start', async (ctx) => {
	await init()
	const newUser: IUserData = {
		name: ctx.from.first_name,
		id: ctx.from.id
	};
	console.log('finding in usersDb: ', usersDb.find((user) => user.id === newUser.id))
	if (usersDb.find((user) => user.id === newUser.id)) {
		ctx.reply('вы уже есть в списке бота', Markup.removeKeyboard())
	} else {
		await dbAddUser(newUser) // dbAddUser
		usersDb.push(newUser)
		ctx.reply('вы добавлены в список бота', Markup.removeKeyboard())
	}
})

bot.command('invite', async (ctx) => {
	if (playersDb.length > 0) {
		await dbDeleteSession(SESSION_ID) // dbDeleteSession
		playersDb.forEach(async (player, index) => {
			await dbDeletePlayer(index + 1) // dbDeletePlayer
			ctx.telegram.sendMessage(player.player.id, 'предыдущая партия завершена', Markup.removeKeyboard())
		})
	}
	playersDb = []
	movesCount = 1
	const otherUsers: IUserData[] = usersDb.filter((user) => user.id !== ctx.from.id);

	ctx.reply('выберите кого пригласить', Markup.inlineKeyboard(
		otherUsers.map((user) => [Markup.button.callback(user.name, `invite-${user.id}`)])
	))
})

bot.command('end', async (ctx) => {
	if (playersDb.length > 0) {
		await dbDeleteSession(SESSION_ID) // dbDeleteSession
		playersDb.forEach(async (player, index) => {
			await dbDeletePlayer(index + 1) // dbDeletePlayer
			ctx.telegram.sendMessage(player.player.id, 'предыдущая партия завершена', Markup.removeKeyboard())
		})
	}
	playersDb = []
	movesCount = 1
})

bot.on(callbackQuery('data'), async (ctx) => {
	const [eventType, eventId] = ctx.callbackQuery.data.split('-');

	if (eventType === 'invite') {
		const invitingUser = usersDb.find((user) => user.id === ctx.from?.id);
		const invitedUser = usersDb.find((user) => user.id === parseInt(eventId));

		if (!invitedUser || !invitingUser) {
			ctx.reply('пользователь отсутствует')
			return
		}

		ctx.editMessageText(`вы отправили приглашение ${invitedUser.name}`)

		bot.telegram.sendMessage(invitedUser.id, `${invitingUser.name} приглашает вас`, Markup.inlineKeyboard([
			[Markup.button.callback('принять', `inviteResolve-${invitingUser.id}`), Markup.button.callback('отклонить', `inviteReject-${invitingUser.id}`)]
		]))
	}

	if (eventType === 'inviteResolve') {
		const invitedUser = usersDb.find((user) => user.id === ctx.from?.id);
		const invitingUser = usersDb.find((user) => user.id === parseInt(eventId));

		if (!invitedUser || !invitingUser) {
			ctx.reply('пользователь отсутствует')
			return
		}

		await dbAddSession(SESSION_ID) // dbAddSession
		const usersInDB = await dbGetUsers()
		const users = [invitingUser, invitedUser]

		users.forEach(async (user, index) => {
			const userId = usersInDB.find((userInDb) => userInDb.telegramID === user.id)?.id

			const playerData: IPlayerData = {
				player: user,
				ready: false,
				playerField: [
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				],
				targetField: [
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				]
			}

			await dbAddPlayer(playerData, userId || index, SESSION_ID) // dbAddPlayer
		})

		const allUsers = await dbGetUsers() // dbGetUsers
		const session = await dbGetSession(SESSION_ID) // dbGetSession
		if (session) {
			movesCount = session.movesCount
			playersDb = session.players.map((player) => {
				const user = allUsers.find((user) => user.id === player.userId)
				if (user) {
					return {
						player: {
							name: user.name,
							id: user.telegramID
						},
						ready: player.ready,
						playerField: JSON.parse(player.playerField) as number[][],
						targetField: JSON.parse(player.targetField) as number[][]
					}
				}
			})
		}

		ctx.editMessageText(`вы приняли приглашение от ${invitingUser.name}`, Markup.inlineKeyboard([
			[Markup.button.callback('начать', 'startGame')]
		]))
		bot.telegram.sendMessage(invitingUser.id, `${invitedUser.name} принял ваше приглашение`, Markup.inlineKeyboard([
			[Markup.button.callback('начать', 'startGame')]
		]))
	}

	if (eventType === 'inviteReject') {
		const invitedUser = usersDb.find((user) => user.id === ctx.from?.id);
		const invitingUser = usersDb.find((user) => user.id === parseInt(eventId));

		if (!invitedUser || !invitingUser) {
			ctx.reply('пользователь отсутствует')
			return
		}

		ctx.editMessageText(`вы отклонили приглашение от ${invitingUser.name}`)
		bot.telegram.sendMessage(invitingUser.id, `${invitedUser.name} отклонил ваше приглашение`)
	}

	if (eventType === 'startGame') {
		await ctx.editMessageText('сделайте расстановку:')
		const playerField = playersDb.find((player) => player.player.id === ctx.from?.id)?.playerField;
		if (!playerField) {
			ctx.reply('контекст неизвестен')
			return
		}

		ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${playerField
			.map((item) => item
				.map((i) => '-')
				.join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
			.join('\n')}</pre>`, Markup.keyboard(
				playerField.map((item, index) => item.map((subItem, n) => `${String.fromCharCode((65 + index))}${n}`))
			))
	}

	if (eventType === 'playerReady') {
		await ctx.editMessageText('ожидайте')
		if (playersDb.every((player) => player.ready)) {
			playersDb.forEach(async (player) => {
				const userDB = await dbGetUser(player.player.id) // dbGetUser
				if (userDB) {
					await dbUpdatePlayer(userDB.id, { playerField: JSON.stringify(player.playerField) }) // dbUpdatePlayer
				}
			})

			const playerIndex = whoseMove(movesCount);
			movesCount++
			await dbUpdateSession(SESSION_ID, movesCount) // dbUpdateSession
			if (!playerIndex) {
				return
			}
			const movingPlayer = playersDb[playerIndex];
			const waitingPlayer = playersDb.find((player) => player.player.id !== playersDb[playerIndex].player.id);

			if (movingPlayer && waitingPlayer) {
				ctx.telegram.sendMessage(waitingPlayer.player.id, 'ход второго игрока')
				ctx.telegram.sendMessage(movingPlayer.player.id, 'ваш ход', Markup.keyboard(
					movingPlayer.playerField.map((item, index) => item.map((subItem, n) => `${String.fromCharCode((65 + index))}${n}`))
				))
			}
		}
	}

})

bot.hears(fieldTemplate.map((item, index) => item.map((subItem, n) => `${String.fromCharCode((65 + index))}${n}`)).flat(), async (ctx) => {
	const coords = ctx.message.text.split('');
	const coord_1 = coords[0].charCodeAt(0) - 65;
	const coord_2 = parseInt(coords[1]);

	const player = playersDb.find((player) => player.player.id === ctx.from.id);
	const playerField = player?.playerField;

	if (movesCount === 1) {

		if (player) {
			if (player.ready) {
				ctx.reply('вы уже выполнили расстановку')
				return
			}
		}
		if (!playerField) {
			ctx.reply('контекст неизвестен')
			return
		}

		if (playerField[coord_1][coord_2] === 1) {
			playerField[coord_1][coord_2] = 0
		} else {
			playerField[coord_1][coord_2] = 1
		}
		const checkResult = checkField(playerField);

		if (!checkResult.status) {
			await ctx.reply(checkResult.message)
			ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${playerField
				.map((item) => item
					.map((i) => i === 1 ? '&' : '-')
					.join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
				.join('\n')}</pre>`, Markup.keyboard(
					playerField.map((item, index) => item.map((subItem, n) => `${String.fromCharCode((65 + index))}${n}`))
				))
		} else {
			const userDB = await dbGetUser(player.player.id) // dbGetUser
			player.ready = true
			if (userDB) {
				await dbUpdatePlayer(userDB.id, { ready: player.ready }) // dbUpdatePlayer
			}

			await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${playerField
				.map((item) => item
					.map((i) => i === 1 ? '&' : '-')
					.join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
				.join('\n')}</pre>`, Markup.removeKeyboard())

			await ctx.reply(checkResult.message, Markup.inlineKeyboard([
				[Markup.button.callback('сохранить', 'playerReady')]
			]))
		}
	} else {

		const playerIndex = whoseMove(movesCount);
		if (playerIndex === undefined) {
			return
		}
		const movingPlayer = playersDb[playerIndex];
		const waitingPlayer = playersDb.find((player) => player.player.id !== playersDb[playerIndex].player.id);

		if (movingPlayer && waitingPlayer) {

			if (ctx.from.id === movingPlayer.player.id) {
				ctx.reply('сейчас не ваш ход')
				return
			}

			movesCount++
			await dbUpdateSession(SESSION_ID, movesCount) // dbUpdateSession
			const movingPlayerDB = await dbGetUser(movingPlayer.player.id) // dbGetUser
			const waitingPlayerDB = await dbGetUser(waitingPlayer.player.id) // dbGetUser

			switch (movingPlayer.playerField[coord_1][coord_2]) {
				case 0:

					movingPlayer.playerField[coord_1][coord_2] = 2
					if (movingPlayerDB) {
						await dbUpdatePlayer(movingPlayerDB.id, { playerField: JSON.stringify(movingPlayer.playerField) }) // dbUpdatePlayer
					}

					waitingPlayer.targetField[coord_1][coord_2] = 2
					if (waitingPlayerDB) {
						await dbUpdatePlayer(waitingPlayerDB.id, { targetField: JSON.stringify(waitingPlayer.targetField) }) // dbUpdatePlayer
					}

					break;
				case 1:
					movingPlayer.playerField[coord_1][coord_2] = 3
					if (movingPlayerDB) {
						await dbUpdatePlayer(movingPlayerDB.id, { playerField: JSON.stringify(movingPlayer.playerField) }) // dbUpdatePlayer
					}

					waitingPlayer.targetField[coord_1][coord_2] = 3
					if (waitingPlayerDB) {
						await dbUpdatePlayer(waitingPlayerDB.id, { targetField: JSON.stringify(waitingPlayer.targetField) }) // dbUpdatePlayer
					}

					break;
				default:
					break;
			}

			const shipsQuantity = movingPlayer.playerField
				.reduce((result, item) => item
					.reduce((subResult, subItem) => subItem === 1 ? subResult + subItem : subResult, 0) + result, 0);

			if (shipsQuantity === 0) {
				ctx.telegram.sendMessage(movingPlayer.player.id, `
					игра завершена,
					победил ${waitingPlayer.player.name}
					количество ходов ${movesCount}
				`, Markup.removeKeyboard())

				ctx.telegram.sendMessage(waitingPlayer.player.id, `
					игра завершена,
					победил ${waitingPlayer.player.name}
					количество ходов ${movesCount}
				`, Markup.removeKeyboard())

				playersDb = []
				movesCount = 1
				return
			}

			const previousPlayerMove = ctx.message.text;

			ctx.telegram.sendMessage(waitingPlayer.player.id, 'ход второго игрока', Markup.removeKeyboard())

			ctx.chat.id = movingPlayer.player.id

			await ctx.reply(`второй игрок походил: ${previousPlayerMove}`)
			await ctx.reply('ваше поле')
			await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${movingPlayer.playerField
				.map((item) => item
					.map((i) => {
						switch (i) {
							case 0:
								return '-'
							case 1:
								return '&'
							case 2:
								return 'O'
							case 3:
								return 'X'
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
								return '&'
							case 2:
								return 'O'
							case 3:
								return 'X'
							default:
								return '?'
						}
					})
					.join(' ')).map((item, index) => `${String.fromCharCode((65 + index))} ${item}`)
				.join('\n')}</pre>`
			)
		}

	}
})








//==================================================================

export default async (
	request: VercelRequest,
	response: VercelResponse,
) => {
	try {
		await bot.handleUpdate(request.body)
	} catch (e) {
		console.log(e)
	}
	response.status(200).send('ok')
}


// curl -X POST https://api.telegram.org/bot5993619286:AAFFffIULroz5RdV27rNFucmTBmNsTo8VDY/setWebhook -H "Content-type: application/json" -d '{"url": "tbwhook-ghstd.vercel.app/api/webhook"}'










