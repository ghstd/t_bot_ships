import { config, DotenvParseOutput } from 'dotenv';
import { Context, Markup, Telegraf } from 'telegraf';
import { User } from 'typegram';

const envParsed: DotenvParseOutput = config().parsed as DotenvParseOutput;
const bot = new Telegraf(envParsed.TEL_TOKEN);
interface IUserData {
	name: string;
	id: number;
};
const usersDb: IUserData[] = [];
const playersDb: IUserData[] = [];

let whoseMove = 0;

bot.command('start', (ctx) => {
	const newUser: IUserData = {
		name: ctx.from.first_name,
		id: ctx.from.id
	};

	if (usersDb.find((user) => user.id === newUser.id)) {
		ctx.reply('вы уже есть в списке бота', Markup.removeKeyboard())
	} else {
		usersDb.push(newUser)
		ctx.reply('вы добавлены в список бота', Markup.removeKeyboard())
	}
})

bot.command('invite', (ctx) => {

	// const otherUsers: IUserData[] = usersDb.filter((user) => user.id !== ctx.from.id);

	usersDb.forEach((user) => {
		bot.action(user.name, async (ctx) => {
			bot.action('inviteResolve', (ctx_2) => {
				ctx.reply(`${user.name} принял приглашение`)
				ctx_2.deleteMessage()
			})
			bot.action('inviteReject', (ctx_2) => {
				ctx.reply(`${user.name} отклонил приглашение`)
				ctx_2.deleteMessage()
			})
			ctx.editMessageText(`вы отправили приглашение ${user.name}`)
			bot.telegram.sendMessage(user.id, `${user.name} приглашает вас`, Markup.inlineKeyboard([
				[Markup.button.callback('принять', 'inviteResolve'), Markup.button.callback('отклонить', 'inviteReject')]
			]))
		})
	})

	ctx.reply('выберите кого пригласить', Markup.inlineKeyboard(
		usersDb.map((user) => [Markup.button.callback(user.name, user.name)])
	))
})

































//=========================================================

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));