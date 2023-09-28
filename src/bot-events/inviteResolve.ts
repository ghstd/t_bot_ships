import { dbAddSession, dbGetUser, dbUpdateUser } from '../db-queries/queries.js'
import { Markup } from 'telegraf'
import type { Bot, eventCTX } from '../types'
import { fieldTemplate } from '../constants.js'

export async function inviteResolve(bot: Bot, ctx: eventCTX, eventId: number) {
	if (ctx.from) {
		const inviter = await dbGetUser(eventId)
		const guest = await dbGetUser(ctx.from.id)

		if (!('id' in inviter)) {
			console.log('inviteResolve', inviter)
			return
		}

		if (!('id' in guest)) {
			console.log('inviteResolve', guest)
			return
		}

		const inviterPlayer = {
			id: '',
			userId: inviter.id,
			userName: inviter.name,
			ready: false,
			playerField: JSON.stringify(fieldTemplate),
			targetField: JSON.stringify(fieldTemplate)
		}

		const guestPlayer = {
			id: '',
			userId: guest.id,
			userName: guest.name,
			ready: false,
			playerField: JSON.stringify(fieldTemplate),
			targetField: JSON.stringify(fieldTemplate)
		}

		const session = await dbAddSession([inviterPlayer, guestPlayer])
		await dbUpdateUser(inviter.id, session.id)
		await dbUpdateUser(guest.id, session.id)
		console.log('inviteResolve')
		await ctx.editMessageText(`вы приняли приглашение от ${inviter.name}`, Markup.inlineKeyboard([
			[Markup.button.callback('начать', 'startGame')]
		]))
		await bot.telegram.sendMessage(inviter.id, `${guest.name} принял ваше приглашение`, Markup.inlineKeyboard([
			[Markup.button.callback('начать', 'startGame')]
		]))
	}









}