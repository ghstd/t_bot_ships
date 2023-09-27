import Context, { type NarrowedContext } from 'telegraf/typings/context'
import type { CallbackQuery, Message, Update } from 'telegraf/typings/core/types/typegram'
import { Telegraf } from 'telegraf/typings/telegraf'

export interface User {
	id: number
	name: string
	sessions?: string[]
	activeSession?: string | null
}

export interface Session {
	id: string
	movesCount: number
	players: number[]
}

export interface Player {
	id: string
	userId: number
	userName: string
	ready: boolean
	playerField: string
	targetField: string
	session?: string
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




