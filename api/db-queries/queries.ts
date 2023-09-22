import { Prisma, PrismaClient } from '@prisma/client'
import { User } from '../types'

const prisma = new PrismaClient()

// Add ==================================

export async function dbAddUser(user: User) {
	return await prisma.user.create({
		data: {
			id: user.id,
			name: user.name
		}
	})
}

export async function dbAddSession(players: Prisma.PlayerCreateManySessionInput[]) {
	return await prisma.session.create({
		data: {
			players: {
				createMany: {
					data: players
				}
			}
		}
	})
}

// Get ==================================

export async function dbGetAllUsers() {
	const users = await prisma.user.findMany()
	if (users) {
		return users
	} else {
		throw new Error('db failed')
	}
}

export async function dbGetUser(id: number) {
	const user = await prisma.user.findUnique({
		where: {
			id
		}
	})
	if (user) {
		return user
	} else {
		throw new Error('db failed')
	}
}

export async function dbGetPlayerByUserId(id: number) {
	const user = await dbGetUser(id)

	if (user.activeSession) {
		const session = await dbGetSession(user.activeSession)
		const sessionPlayer = session.players.find((player) => player.userId === id)

		if (sessionPlayer) {
			const player = await dbGetPlayer(sessionPlayer.id)
			return player
		} else {
			throw new Error('db failed')
		}
	} else {
		throw new Error('db failed')
	}
}

export async function dbGetPlayer(id: number) {
	const player = await prisma.player.findFirst({
		where: {
			id
		},
		include: {
			session: true
		}
	})
	if (player) {
		if ((typeof player.playerField === 'string') && (typeof player.targetField === 'string')) {
			const result = {
				...player,
				playerField: JSON.parse(player.playerField) as number[][],
				targetField: JSON.parse(player.targetField) as number[][]
			}
			return result
		} else {
			throw new Error('db failed')
		}
	} else {
		throw new Error('db failed')
	}
}

export async function dbGetSession(id: number) {
	const session = await prisma.session.findUnique({
		where: {
			id
		},
		include: {
			players: true
		}
	})
	if (session) {
		return session
	} else {
		throw new Error('db failed')
	}
}

// Update

export async function dbUpdateSessionMovesCount(id: number, movesCount: number) {
	return await prisma.session.update({
		where: {
			id
		},
		data: {
			movesCount
		},
		include: {
			players: true
		}
	})
}

export async function dbUpdatePlayerField(id: number, playerField: string) {
	const player = await prisma.player.update({
		where: {
			id
		},
		data: {
			playerField
		},
		include: {
			session: true
		}
	})

	if ((typeof player.playerField === 'string') && (typeof player.targetField === 'string')) {
		const result = {
			...player,
			playerField: JSON.parse(player.playerField) as number[][],
			targetField: JSON.parse(player.targetField) as number[][]
		}
		return result
	} else {
		throw new Error('db failed')
	}
}

export async function dbUpdatePlayerTargetField(id: number, targetField: string) {
	const player = await prisma.player.update({
		where: {
			id
		},
		data: {
			targetField
		},
		include: {
			session: true
		}
	})

	if ((typeof player.playerField === 'string') && (typeof player.targetField === 'string')) {
		const result = {
			...player,
			playerField: JSON.parse(player.playerField) as number[][],
			targetField: JSON.parse(player.targetField) as number[][]
		}
		return result
	} else {
		throw new Error('db failed')
	}
}

export async function dbUpdatePlayerReady(id: number, ready: boolean) {
	return await prisma.player.update({
		where: {
			id
		},
		data: {
			ready
		},
		include: {
			session: true
		}
	})
}

export async function dbUpdateUser(id: number, sessionId: number) {
	return await prisma.user.update({
		where: {
			id
		},
		data: {
			activeSession: sessionId,
			sessions: {
				push: sessionId
			}
		}
	})
}

// Delete

export async function dbDeleteSessionFromUser(id: number, sessionId: number) {
	const user = await dbGetUser(id)
	const newSessionsList = user.sessions.filter((id) => id !== sessionId)
	await prisma.user.update({
		where: {
			id
		},
		data: {
			activeSession: newSessionsList[0] ? newSessionsList[0] : null,
			sessions: newSessionsList
		}
	})
}

export async function dbDeletePlayer(id: number) {
	await prisma.player.delete({
		where: {
			id
		}
	})
}

export async function dbDeleteSession(id: number) {
	await prisma.session.delete({
		where: {
			id
		}
	})
}

















