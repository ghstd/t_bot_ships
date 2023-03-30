import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { Context, Markup, NarrowedContext, Telegraf, Telegram } from 'telegraf';
import { message } from 'telegraf/filters'
import { Update, CallbackQuery, Message } from 'telegraf/typings/core/types/typegram';
import { User } from 'typegram';


const envParsed: DotenvParseOutput = config().parsed as DotenvParseOutput;
const bot = new Telegraf(envParsed.TEL_TOKEN);
const users: User[] = [];
let owner: User | undefined;
let contact: User | undefined;
const usersInGame: { owner: User | undefined, contact: User | undefined } = {
	owner: undefined,
	contact: undefined
};

const userStateOwner: { id: number, status: boolean, ownField: any[][], contactField: any[][] } = {
	id: 0,
	status: false,
	ownField: [],
	contactField: []
};

const userStateContact: { id: number, status: boolean, ownField: any[][], contactField: any[][] } = {
	id: 0,
	status: false,
	ownField: [],
	contactField: []
};

const coordsTemplate = [
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

let step = 0;



bot.start((ctx) => {
	if (!users.find((user) => user.id === ctx.update.message.from.id)) {
		users.push(ctx.update.message.from)
		ctx.reply(`user ${ctx.update.message.from.first_name} has been добавлен`)
		return
	}
	ctx.reply(`user ${ctx.update.message.from.first_name} уже exist`)
})

bot.command('invite', (ctx) => {
	let innerCtx: any = ctx
	ctx.reply('select a contact to invite', Markup.keyboard(
		// users.filter((user) => user.id !== ctx.chat.id).map((user) => [user.first_name]
		users.map((user) => [user.first_name]
		)))

	bot.hears(users.map((user) => user.first_name), (ctx) => {
		ctx.reply('connect...', Markup.removeKeyboard())
		owner = ctx.from
		contact = users.find((user) => user.first_name === ctx.message.text);

		if (contact) {
			ctx.telegram.sendMessage(contact.id, 'start ships?', Markup.inlineKeyboard([
				[Markup.button.callback('start', 'startGame')]
			]))
		}
	})

	bot.action('startGame', (ctx) => {
		ctx.reply('ships started')
		ctx.telegram.sendMessage(owner?.id!, 'ships started')
		if (owner && contact) {
			usersInGame.owner = owner
			usersInGame.contact = contact
			const coords_1 = [
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
			const coords_2 = [
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
			prepeare(coords_1, ctx)
			prepeare(coords_2, innerCtx)
		}
	})
});




async function prepeare(data: any[][], ctx: NarrowedContext<Context<Update> & {
	match: RegExpExecArray;
}, Update.CallbackQueryUpdate<CallbackQuery>>) {

	await ctx.reply('сделайте расстановку', Markup.keyboard(
		data.map((item, i) => item.map((subItem, n) => `${i}-${n}`))
	))

	await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${data.map((item) => item.map((i) => i === 1 ? 'o' : '-').join(' ')).map((item, index) => index + ' ' + item).join('\n')}</pre>`)

	bot.hears(data.map((item, i) => item.map((subItem, n) => `${i}-${n}`)).flat(), (ctx) => {
		firstHear(data, ctx)
	})
}

let firstHear = async (data: any[][], ctx: NarrowedContext<Context<Update> & {
	match: RegExpExecArray;
}, {
	message: Update.New & Update.NonChannel & Message.TextMessage;
	update_id: number;
}>) => {
	const value = ctx.message.text.split('-');

	// setTimeout(async () => {
	// 	await ctx.deleteMessage(ctx.message.message_id)
	// 	await ctx.deleteMessage(ctx.message.message_id - 1)
	// 	await ctx.deleteMessage(ctx.message.message_id - 2)
	// }, 1000);


	if (data[Number(value[0])][Number(value[1])] === 0) {
		data[Number(value[0])][Number(value[1])] = 1
	} else {
		data[Number(value[0])][Number(value[1])] = 0
	}

	const result = checkField(data);

	await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${data.map((item) => item.map((i) => i === 1 ? 'o' : '-').join(' ')).map((item, index) => index + ' ' + item).join('\n')}</pre>`)

	await ctx.reply(result.message)

	if (result.status) {
		if (ctx.chat.id === usersInGame.owner?.id) {
			userStateOwner.id = ctx.chat.id
			userStateOwner.status = true
			userStateOwner.ownField = data
			userStateOwner.contactField = [
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

			await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${userStateOwner.ownField.map((item) => item.map((i) => {
				if (i === 0) return '-'
				if (i === 1) return 'o'
				if (i === 2) return 'x'
				if (i === 3) return '*'
			}).join(' ')).map((item, index) => index + ' ' + item).join('\n')}</pre>`)

			await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${userStateOwner.contactField.map((item) => item.map((i) => {
				if (i === 0) return '-'
				if (i === 1) return 'o'
				if (i === 2) return 'x'
				if (i === 3) return '*'
			}).join(' ')).map((item, index) => index + ' ' + item).join('\n')}</pre>`)
		}

		if (ctx.chat.id === usersInGame.contact?.id) {
			userStateContact.id = ctx.chat.id
			userStateContact.status = true
			userStateContact.ownField = data
			userStateContact.contactField = [
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

			await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${userStateContact.ownField.map((item) => item.map((i) => {
				if (i === 0) return '-'
				if (i === 1) return 'o'
				if (i === 2) return 'x'
				if (i === 3) return '*'
			}).join(' ')).map((item, index) => index + ' ' + item).join('\n')}</pre>`)

			await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${userStateContact.contactField.map((item) => item.map((i) => {
				if (i === 0) return '-'
				if (i === 1) return 'o'
				if (i === 2) return 'x'
				if (i === 3) return '*'
			}).join(' ')).map((item, index) => index + ' ' + item).join('\n')}</pre>`)
		}
	}

	if (userStateOwner.status && userStateContact.status) {
		// if (usersInGame.owner && usersInGame.contact) {
		// 	bot.telegram.sendMessage(usersInGame.owner?.id, 'ваш ход', Markup.keyboard(
		// 		coordsTemplate.map((item, i) => item.map((subItem, n) => `${i}-${n}`))
		// 	))
		// 	bot.telegram.sendMessage(usersInGame.contact?.id, 'ожидайте ваш ход')
		// }
		runGm(ctx)
	}
}

function checkField(data: any[][]) {

	const success = {
		status: true,
		message: 'успешная расстановка',
		data: data
	};

	const error = {
		status: false,
		message: 'неправильная расстановка',
		data: {}
	};

	let one = 0;
	let two = 0;
	let three = 0;
	let four = 0;

	for (let i = 0; i < data.length; i++) {
		for (let n = 0; n < data[i].length; n++) {
			if (data[i][n] === 1 && i < data.length - 1) {
				if (data[i][n + 1] === 1) {
					let k = 1;
					if (data[i + 1][n] === 1) {
						return error
					}
					while (data[i][n + k] === 1) {
						if (data[i + 1][n + k] === 1 || data[i + 1][n + k + 1] === 1) {
							return error
						}
						if (k > 3) {
							return error
						}
						k++
					}
					if ((data[i][n + k] === 1) && (data[i + 1][n + k] === 1)) {
						return error
					}
					switch (k) {
						case 2:
							two = two + 1
							break;
						case 3:
							three = three + 1
							break;
						case 4:
							four = four + 1
							break;

						default:
							break;
					}
					n = n + k
				} else if (data[i + 1][n] === 1) {
					let k = 1;
					if (data[i][n + 1] === 1) {
						return error
					}
					while (data[i + k][n] === 1 && i + 1 < data.length) {
						if (data[i + k][n + 1] === 1 || data[i + k + 1][n + 1] === 1) {
							return error
						}
						if (k > 3) {
							return error
						}
						k++
					}
					if ((data[i + k][n] === 1 && i + 1 < data.length) && (data[i + k][n + 1] === 1 && i + 1 < data.length)) {
						return error
					}
					switch (k) {
						case 2:
							two = two + 1
							break;
						case 3:
							three = three + 1
							break;
						case 4:
							four = four + 1
							break;

						default:
							break;
					}
					n = n + 1
				} else {
					if ((data[i][n + 1] === 1) &&
						(data[i + 1][n] === 1 && i + 1 < data.length) &&
						data[i + 1][n + 1] === 1 && i + 1 < data.length) {
						return error
					}
					one = one + 1
					n = n + 1
				}
			}
		}
	}

	if (one + two + three + four > 3) {
		error.message = 'слишком много юнитов'
		return error
	} else if (one + two + three + four < 3) {
		error.message = 'слишком мало юнитов'
		return error
	} else {
		return success
	}
	//  else if (one !== 4) {
	// 	error.message = 'неверное количество 1-пал'
	// 	return error
	// } else if (two !== 3) {
	// 	error.message = 'неверное количество 2-пал'
	// 	return error
	// } else if (three !== 2) {
	// 	error.message = 'неверное количество 3-пал'
	// 	return error
	// } else if (four !== 1) {
	// 	error.message = 'неверное количество 4-пал'
	// 	return error
	// }else {
	// 	return success
	// }
}

async function runGm(ctx: NarrowedContext<Context<Update> & {
	match: RegExpExecArray;
}, {
	message: Update.New & Update.NonChannel & Message.TextMessage;
	update_id: number;
}>) {

	firstHear = async (data: any[][], ctx: NarrowedContext<Context<Update> & {
		match: RegExpExecArray;
	}, {
		message: Update.New & Update.NonChannel & Message.TextMessage;
		update_id: number;
	}>) => { }

	await ctx.reply('выберите координату', Markup.keyboard(
		coordsTemplate.map((item, i) => item.map((subItem, n) => `${i}=${n}`))
	))

	bot.hears(coordsTemplate.map((item, i) => item.map((subItem, n) => `${i}=${n}`)).flat(), async (ctx) => {

		if (step === 0) {
			if (ctx.chat.id === userStateOwner.id) {
				console.log('user', 0)
				await bot.telegram.sendMessage(userStateOwner.id, 'ваш ход')
				const value = ctx.message.text.split('=');
				// await ctx.deleteMessage(ctx.message.message_id)
				// await ctx.deleteMessage(ctx.message.message_id - 1)
				// await ctx.deleteMessage(ctx.message.message_id - 2)

				if (userStateContact.ownField[Number(value[0])][Number(value[1])] === 1) {
					userStateContact.ownField[Number(value[0])][Number(value[1])] = 2
					userStateOwner.contactField[Number(value[0])][Number(value[1])] = 2
				} else if (userStateContact.ownField[Number(value[0])][Number(value[1])] === 0) {
					userStateContact.ownField[Number(value[0])][Number(value[1])] = 3
					userStateOwner.contactField[Number(value[0])][Number(value[1])] = 3
				}

				await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${userStateOwner.ownField.map((item) => item.map((i) => {
					if (i === 0) return '-'
					if (i === 1) return 'o'
					if (i === 2) return 'x'
					if (i === 3) return '*'
				}).join(' ')).map((item, index) => index + ' ' + item).join('\n')}</pre>`)

				await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${userStateOwner.contactField.map((item) => item.map((i) => {
					if (i === 0) return '-'
					if (i === 1) return 'o'
					if (i === 2) return 'x'
					if (i === 3) return '*'
				}).join(' ')).map((item, index) => index + ' ' + item).join('\n')}</pre>`)

				step = 1
			}
		}



		if (step === 1) {
			if (ctx.chat.id === userStateContact.id) {
				console.log('user', 1)
				await bot.telegram.sendMessage(userStateContact.id, 'ваш ход')
				const value = ctx.message.text.split('=');
				// await ctx.deleteMessage(ctx.message.message_id)
				// await ctx.deleteMessage(ctx.message.message_id - 1)
				// await ctx.deleteMessage(ctx.message.message_id - 2)

				if (userStateOwner.ownField[Number(value[0])][Number(value[1])] === 1) {
					userStateOwner.ownField[Number(value[0])][Number(value[1])] = 2
					userStateContact.contactField[Number(value[0])][Number(value[1])] = 2
				} else if (userStateOwner.ownField[Number(value[0])][Number(value[1])] === 0) {
					userStateOwner.ownField[Number(value[0])][Number(value[1])] = 3
					userStateContact.contactField[Number(value[0])][Number(value[1])] = 3
				}

				await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${userStateContact.ownField.map((item) => item.map((i) => {
					if (i === 0) return '-'
					if (i === 1) return 'o'
					if (i === 2) return 'x'
					if (i === 3) return '*'
				}).join(' ')).map((item, index) => index + ' ' + item).join('\n')}</pre>`)

				await ctx.replyWithHTML(`<pre>  0 1 2 3 4 5 6 7 8 9\n${userStateContact.contactField.map((item) => item.map((i) => {
					if (i === 0) return '-'
					if (i === 1) return 'o'
					if (i === 2) return 'x'
					if (i === 3) return '*'
				}).join(' ')).map((item, index) => index + ' ' + item).join('\n')}</pre>`)

				step = 0
			}
		}

	})
}













//=========================================================

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
