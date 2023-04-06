import { Telegraf } from 'telegraf';
import { checkField, whoseMove } from './helpers/helpers';
import type { VercelRequest, VercelResponse } from '@vercel/node';


// const bot = new Telegraf(process.env.TEL_TOKEN_2 as string);

export default function handler(
	request: VercelRequest,
	response: VercelResponse,
) {
	response.status(200).json({
		body: request.body,
		query: request.query,
		cookies: request.cookies,
	});
}
















