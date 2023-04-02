import { config, DotenvParseOutput } from 'dotenv';
import { Context, Markup, Telegraf } from 'telegraf';
import { callbackQuery } from 'telegraf/filters';
import { User } from 'typegram';
import { checkField, whoseMove } from './helpers';

const envParsed: DotenvParseOutput = config().parsed as DotenvParseOutput;
const bot = new Telegraf(envParsed.TEL_TOKEN);
interface IUserData {
	name: string;
	id: number;
};
interface IPlayerData {
	player: IUserData;
	ready: boolean;
	playerField: number[][];
	targetField: number[][];
};
const usersDb: IUserData[] = [];
let playersDb: IPlayerData[] = [];

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

let movesCount = 1;

bot.command('start', (ctx) => {
	const newUser: IUserData = {
		name: ctx.from.first_name,
		id: ctx.from.id
	};

	if (usersDb.find((user) => user.id === newUser.id)) {
		ctx.reply('вы уже есть в списке бота', Markup.removeKeyboard())
	} else {
		usersDb.push(newUser)
		ctx.reply('вы добавлены в список бота', Markup.removeKeyboard())
	}
})



bot.command('invite', (ctx) => {
	playersDb = []
	const otherUsers: IUserData[] = usersDb.filter((user) => user.id !== ctx.from.id);

	ctx.reply('выберите кого пригласить', Markup.inlineKeyboard(
		otherUsers.map((user) => [Markup.button.callback(user.name, `invite-${user.id}`)])
	))
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

		playersDb = []
		const users = [invitingUser, invitedUser];
		users.forEach((user) => {
			playersDb.push({
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
			})
		})

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
			const playerIndex = whoseMove(movesCount);
			movesCount++
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
			player.ready = true

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

			switch (movingPlayer.playerField[coord_1][coord_2]) {
				case 0:
					movingPlayer.playerField[coord_1][coord_2] = 2
					waitingPlayer.targetField[coord_1][coord_2] = 2
					break;
				case 1:
					movingPlayer.playerField[coord_1][coord_2] = 3
					waitingPlayer.targetField[coord_1][coord_2] = 3
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

			ctx.telegram.sendMessage(waitingPlayer.player.id, 'ход второго игрока', Markup.removeKeyboard())

			ctx.chat.id = movingPlayer.player.id

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
								return 'o'
							case 3:
								return 'x'
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
								return 'o'
							case 3:
								return 'x'
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






//=========================================================

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));