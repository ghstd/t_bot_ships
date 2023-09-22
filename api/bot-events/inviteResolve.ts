import { dbAddSession, dbGetUser, dbUpdateUser } from '../db-queries/queries'
import { Markup } from 'telegraf'
import { Bot, Player, eventCTX } from '../types'
import { fieldTemplate } from '../constants'

export async function inviteResolve(bot: Bot, ctx: eventCTX, eventId: number) {
	if (ctx.from) {
		const inviter = await dbGetUser(eventId)
		const guest = await dbGetUser(ctx.from.id)

		if (!inviter || !guest) {
			ctx.reply('пользователь отсутствует')
			return
		}

		const inviterPlayer = {
			userId: inviter.id,
			userName: inviter.name,
			ready: false,
			playerField: JSON.stringify(fieldTemplate),
			targetField: JSON.stringify(fieldTemplate)
		}

		const guestPlayer = {
			userId: guest.id,
			userName: guest.name,
			ready: false,
			playerField: JSON.stringify(fieldTemplate),
			targetField: JSON.stringify(fieldTemplate)
		}

		const session = await dbAddSession([inviterPlayer, guestPlayer])
		await dbUpdateUser(inviter.id, session.id)
		await dbUpdateUser(guest.id, session.id)

		ctx.editMessageText(`вы приняли приглашение от ${inviter.name}`, Markup.inlineKeyboard([
			[Markup.button.callback('начать', 'startGame')]
		]))
		bot.telegram.sendMessage(inviter.id, `${guest.name} принял ваше приглашение`, Markup.inlineKeyboard([
			[Markup.button.callback('начать', 'startGame')]
		]))
	}









}