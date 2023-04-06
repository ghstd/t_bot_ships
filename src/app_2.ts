import { config, DotenvParseOutput } from 'dotenv';
import { Composer, Context, Markup, Scenes, Telegraf } from 'telegraf';
import { callbackQuery } from 'telegraf/filters';
import { checkField, whoseMove } from './helpers';
import http from 'http';
import express from 'express';

// const envParsed: DotenvParseOutput = config().parsed as DotenvParseOutput;
// const token: string = envParsed.TEL_TOKEN_2;
const bot = new Telegraf(process.env.TEL_TOKEN_2 as string);
const app = express();





async function init() {

	const res = await bot.createWebhook({ domain: 'https://in-ships.onrender.com/' });

	console.log(res)

	app.use(res)

	bot.on("text", ctx => ctx.reply("Hello"))

	app.listen(8443, () => console.log("Listening on port"))

}

try {
	init()
} catch (error) {
	console.log(error)
}












