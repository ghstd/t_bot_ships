import { dbGetUser } from '../db-queries/queries.js'
import { Markup } from 'telegraf'
import { Bot, eventCTX } from '../types'

export async function inviteHandler(bot: Bot, ctx: eventCTX, eventId: number) {
	if (ctx.from) {
		const inviter = await dbGetUser(ctx.from.id)
		const guest = await dbGetUser(eventId)

		if (!inviter || !guest) {
			await ctx.reply('пользователь отсутствует')
			return
		}

		await ctx.editMessageText(`вы отправили приглашение ${guest.name}`)
		await bot.telegram.sendMessage(guest.id, `${inviter.name} приглашает вас`, Markup.inlineKeyboard([
			[Markup.button.callback('принять', `inviteResolve-${inviter.id}`), Markup.button.callback('отклонить', `inviteReject-${inviter.id}`)]
		]))
	}
}