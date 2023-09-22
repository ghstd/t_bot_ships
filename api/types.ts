import Context, { NarrowedContext } from 'telegraf/typings/context'
import { CallbackQuery, Message, Update } from 'telegraf/typings/core/types/typegram'
import { Telegraf } from 'telegraf/typings/telegraf'

export interface User {
	id: number
	name: string
	sessions?: number[]
	activeSession?: number | null
}

export interface Session {
	id: number
	movesCount: number
	players: Player[]
}

export interface Player {
	id: number
	userId: number
	userName: string
	ready: boolean
	playerField: number[][]
	targetField: number[][]
}

export type CTX = NarrowedContext<Context<Update>, {
	message: Update.New & Update.NonChannel & Message.TextMessage;
	update_id: number;
}>

export type eventCTX = NarrowedContext<Context<Update>, Update.CallbackQueryUpdate<Record<"data", {}> & CallbackQuery.DataQuery>>

export type hearsCTX = NarrowedContext<Context<Update> & {
	match: RegExpExecArray;
}, {
	message: Update.New & Update.NonChannel & Message.TextMessage;
	update_id: number;
}>

export type Bot = Telegraf<Context<Update>>




