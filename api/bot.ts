import { Telegraf } from 'telegraf'
import { callbackQuery } from 'telegraf/filters'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { start } from './bot-commands/start'
import { invite } from './bot-commands/invite'
import { end } from './bot-commands/end'
import { fieldTemplate } from './constants'
import { inviteHandler } from './bot-events/inviteHandler'
import { inviteResolve } from './bot-events/inviteResolve'
import { inviteReject } from './bot-events/inviteReject'
import { startGame } from './bot-events/startGame'
import { playerReady } from './bot-events/playerReady'
import { hearsHandler } from './bot-hears/hearsHandler'

const bot = new Telegraf(process.env.TEL_TOKEN as string)

bot.command('start', start)
bot.command('invite', invite)
bot.command('end', end)
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
