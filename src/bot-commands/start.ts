import { Markup } from 'telegraf'
import type { CTX, User } from '../types'
import { dbAddUser, dbGetUser } from '../db-queries/queries.js'

export async function start(ctx: CTX) {
	console.log('source: ', 'start')
	const user = await dbGetUser(ctx.from.id)
	if ( !user || !('id' in user) ) {
		const newUser: User = {
			id: ctx.from.id,
			name: ctx.from.first_name + ' ' + (ctx.from.last_name ? ctx.from.last_name : '')
		}
		await dbAddUser(newUser)
		await ctx.reply('теперь вы добавлены в список бота', Markup.removeKeyboard())
	} else {
		await ctx.reply('вы уже есть в списке бота', Markup.removeKeyboard())
	}
}