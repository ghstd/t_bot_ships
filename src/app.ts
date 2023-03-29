import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { Context, Markup, Telegraf, Telegram } from 'telegraf';
import { message } from 'telegraf/filters'
import { User } from 'typegram';


const envParsed: DotenvParseOutput = config().parsed as DotenvParseOutput;
const bot = new Telegraf(envParsed.TEL_TOKEN);
const users: User[] = [];
let owner: User | undefined;
let contact: User | undefined;
const usersInGame: { owner: User | undefined, contact: User | undefined } = {
	owner: undefined,
	contact: undefined
};



bot.start((ctx) => {
	if (!users.find((user) => user.id === ctx.update.message.from.id)) {
		users.push(ctx.update.message.from)
		ctx.reply(`user ${ctx.update.message.from.first_name} has been saved`)
		return
	}
	ctx.reply(`user ${ctx.update.message.from.first_name} already exist`)
})


bot.command('invite', (ctx) => {

	ctx.reply('select a contact to invite', Markup.keyboard(
		// users.filter((user) => user.id !== ctx.chat.id).map((user) => [user.first_name]
		users.map((user) => [user.first_name]
		)))

	bot.hears(users.map((user) => user.first_name), (ctx) => {
		ctx.reply('connect...', Markup.removeKeyboard())
		owner = ctx.from
		contact = users.find((user) => user.first_name === ctx.message.text);

		if (contact) {
			ctx.telegram.sendMessage(contact.id, 'start ships?', Markup.inlineKeyboard([
				[Markup.button.callback('start', 'startGame')]
			]))
		}
	})

	bot.action('startGame', (ctx) => {
		ctx.reply('ships started')
		ctx.telegram.sendMessage(owner?.id!, 'ships started')
		if (owner && contact) {
			usersInGame.owner = owner
			usersInGame.contact = contact
			TestFn()
		}
	})
});





function TestFn() {
	if (usersInGame.owner && usersInGame.contact) {

		bot.telegram.sendMessage(usersInGame.owner?.id, `
	____{1} {2} {3} {4} {5} {6} {7} {8} {9} {10}
	{a}_[__][__][__][__][__][__][__][__][__][__]
	{b}_[__][__][__][__][__][__][__][__][__][__]
	{c}_[__][__][__][__][__][__][__][__][__][__]
	{d}_[__][__][__][__][__][__][__][__][__][__]
	{e}_[__][__][__][__][__][__][__][__][__][__]
	{f} _[__][__][__][__][__][__][__][__][__][__]
	{g}_[__][__][__][__][__][__][__][__][__][__]
	{h}_[__][__][__][__][__][__][__][__][__][__]
	{j}  _[__][__][__][__][__][__][__][__][__][__]
	{k}_[__][__][__][__][__][__][__][__][__][__]
	`)

	}
}


























//=========================================================

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
