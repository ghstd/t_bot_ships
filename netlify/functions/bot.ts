import { Telegraf } from 'telegraf'
import { callbackQuery } from 'telegraf/filters'
import { test } from '../../src/bot-commands/test.js'
import { start } from '../../src/bot-commands/start.js'
import { invite } from '../../src/bot-commands/invite.js'
import { session } from '../../src/bot-commands/session.js'
import { end } from '../../src/bot-commands/end.js'
import { webappButton } from '../../src/bot-commands/webappButton.js'
import { standartButtons } from '../../src/bot-commands/standartButtons.js'
import { fieldTemplate } from '../../src/constants.js'
import { inviteHandler } from '../../src/bot-events/inviteHandler.js'
import { inviteResolve } from '../../src/bot-events/inviteResolve.js'
import { inviteReject } from '../../src/bot-events/inviteReject.js'
import { startGame } from '../../src/bot-events/startGame.js'
import { playerReady } from '../../src/bot-events/playerReady.js'
import { hearsHandler } from '../../src/bot-hears/hearsHandler.js'
import { sessionHandler } from '../../src/bot-events/sessionHandler.js'
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions"

const bot = new Telegraf(process.env.TEL_TOKEN as string)
// const bot = new Telegraf('5993619286:AAFFffIULroz5RdV27rNFucmTBmNsTo8VDY')

bot.catch((err: Error, ctx) => {
	console.log(err.message)
})
bot.command('test', test)
bot.command('start', start)
bot.command('invite', invite)
bot.command('session', session)
bot.command('end', end)
bot.command('webappButton', webappButton)
bot.command('standartButtons', standartButtons)
bot.on(callbackQuery('data'), async (ctx) => {
	const [eventType, eventId] = ctx.callbackQuery.data.split('-')

	switch (eventType) {
		case 'invite':
			await inviteHandler(bot, ctx, parseInt(eventId))
			break;
		case 'inviteResolve':
			await inviteResolve(bot, ctx, parseInt(eventId))
			break;
		case 'inviteReject':
			await inviteReject(bot, ctx, parseInt(eventId))
			break;
		case 'startGame':
			await startGame(ctx)
			break;
		case 'playerReady':
			await playerReady(ctx)
			break;
		case 'session':
			await sessionHandler(ctx, eventId)
			break;
		default:
			break;
	}
})
bot.hears(fieldTemplate.map((item, index) => item.map((itm, n) => `${String.fromCharCode((65 + index))}${n}`)).flat(), async (ctx) => {
	const coords = ctx.message.text.split('')
	const coord_1 = coords[0].charCodeAt(0) - 65
	const coord_2 = parseInt(coords[1])

	await hearsHandler(ctx, coord_1, coord_2)
})

// =========================
// bot.launch()

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
	if (event.httpMethod == 'OPTIONS') {
		console.log('OPTIONS request')
		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "Content-Type",
				"Access-Control-Allow-Methods": "GET, POST, OPTION",
			}
		}
	}

	try {

		const body = JSON.parse(event.body)
		console.log('body: ', body)
		if (body.myMark === 'webapp') {
			const { id, result } = body
			await bot.telegram.answerWebAppQuery(id, {
				type: 'article',
				id,
				title: 'webapp response',
				input_message_content: result
			})
			return {
				statusCode: 200,
				body: '',
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "Content-Type",
					"Access-Control-Allow-Methods": "GET, POST, OPTION",
				}
			}
		}

		await bot.handleUpdate(body)
		return {
			statusCode: 200,
			body: '',
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "Content-Type",
				"Access-Control-Allow-Methods": "GET, POST, OPTION",
			}
		}
	} catch (error) {
		console.error('error handler: ', error)
		return { statusCode: 400, body: 'Error was here' }
	}
}

export { handler }



