import { Telegraf } from 'telegraf';
import type { VercelRequest, VercelResponse } from '@vercel/node';



export default async (
	request: VercelRequest,
	response: VercelResponse,
) => {

	try {
		const bot = new Telegraf(process.env.TEL_TOKEN_2 as string);

		const id = request.body.message.chat.id;
		console.log(request.body)

		await bot.telegram.sendMessage(id, 'working')

	} catch (error) {
		console.log('check error: ', error)
	}
	response.send('ok')
}















