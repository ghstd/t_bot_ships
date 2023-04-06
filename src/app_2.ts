import { config, DotenvParseOutput } from 'dotenv';
import { Composer, Context, Markup, Scenes, Telegraf } from 'telegraf';
import { callbackQuery } from 'telegraf/filters';
import { checkField, whoseMove } from './helpers';
import http from 'http';
import express from 'express';

// const envParsed: DotenvParseOutput = config().parsed as DotenvParseOutput;
// const token: string = envParsed.TEL_TOKEN_2;
const bot = new Telegraf(process.env.TEL_TOKEN_2 as string);
// const app = express();

bot
	.createWebhook({
		domain: 'https://in-ships.onrender.com'
	})
	.then(() => console.log('webhook created'))
	.catch((e) => console.log('error in webhook: ', e?.message))

const server = http.createServer((request, response) => {
	console.log(request.url)
	response.end()
});



server.listen(8000, () => console.log('test server started'))

// async function init() {

// 	app.use(await bot.createWebhook({ domain: '127.0.0.1' }));

// 	bot.on("text", ctx => ctx.reply("Hello"));

// 	app.listen(8000, () => console.log("Listening on port", 8000));

// }

// init()












