import { Markup } from 'telegraf'
import { CTX, User } from '../types'
import { dbGetAllUsers } from '../db-queries/queries.js'

export async function invite(ctx: CTX) {
	const users = await dbGetAllUsers()
	if (users) {
		const otherUsers: User[] = users.filter((user) => user.id !== ctx.from.id)
		await ctx.reply('попробуйте выберите кого пригласить', Markup.inlineKeyboard(
			otherUsers.map((user) => [Markup.button.callback(user.name, `invite-${user.id}`)])
		))
	}
}