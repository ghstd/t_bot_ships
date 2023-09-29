import { dbGetUser } from '../db-queries/queries.js'
import type { Bot, eventCTX } from '../types'

export async function inviteReject(bot: Bot, ctx: eventCTX, eventId: number) {
	console.log('source: ', 'inviteReject')
	if (ctx.from) {
		const inviter = await dbGetUser(eventId)
		const guest = await dbGetUser(ctx.from.id)

		if (!('id' in inviter)) {
			console.log('inviteReject', inviter)
			return
		}

		if (!('id' in guest)) {
			console.log('inviteReject', guest)
			return
		}

		console.log('inviteReject')

		await ctx.editMessageText(`вы отклонили приглашение от ${inviter.name}`)
		await bot.telegram.sendMessage(inviter.id, `${guest.name} отклонил ваше приглашение`)
	}
}