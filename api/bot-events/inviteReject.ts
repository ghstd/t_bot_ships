import { dbGetUser } from '../db-queries/queries'
import { Bot, eventCTX } from '../types'

export async function inviteReject(bot: Bot, ctx: eventCTX, eventId: number) {
	if (ctx.from) {
		const inviter = await dbGetUser(eventId)
		const guest = await dbGetUser(ctx.from.id)

		if (!inviter || !guest) {
			ctx.reply('пользователь отсутствует')
			return
		}

		ctx.editMessageText(`вы отклонили приглашение от ${inviter.name}`)
		bot.telegram.sendMessage(inviter.id, `${guest.name} отклонил ваше приглашение`)
	}
}