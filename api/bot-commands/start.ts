import { Markup } from 'telegraf'
import { CTX, User } from '../types'
import { dbAddUser, dbGetUser } from '../db-queries/queries.js'

export async function start(ctx: CTX) {
	const user = await dbGetUser(ctx.from.id)
	if (user) {
		ctx.reply('нифига, вы уже есть в списке бота', Markup.removeKeyboard())
	} else {
		const newUser: User = {
			id: ctx.from.id,
			name: ctx.from.first_name + ' ' + (ctx.from.last_name ? ctx.from.last_name : '')
		}
		await dbAddUser(newUser)
		ctx.reply('теперь вы добавлены в список бота', Markup.removeKeyboard())
	}
}