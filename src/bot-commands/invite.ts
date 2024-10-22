import { Markup } from 'telegraf'
import type { CTX, User } from '../types'
import { dbGetAllUsers } from '../db-queries/queries.js'

export async function invite(ctx: CTX) {
	console.log('source: ', 'invite')
	const users = await dbGetAllUsers()
	if (users) {
		const otherUsers: User[] = users.filter((user) => user.id !== ctx.from.id)
		await ctx.reply('выберите кого пригласить', Markup.inlineKeyboard(
			otherUsers.map((user) => [Markup.button.callback(user.name, `invite-${user.id}`)])
		))
	}
}