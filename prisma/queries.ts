import { PrismaClient } from '@prisma/client'
import { IUserData, IPlayerData, IDBUser } from './types'

const prisma = new PrismaClient()

// Add

export async function dbAddUser(userData: IUserData) {
	const user = await prisma.user.create({
		data: {
			name: userData.name,
			telegramID: userData.id
		}
	})
	console.log(user)
}

export async function dbAddSession(id: number) {
	await prisma.session.create({
		data: {
			id,
			movesCount: 1
		}
	})
}

export async function dbAddPlayer(data: IPlayerData, userId: number, sessionId: number) {
	await prisma.player.create({
		data: {
			ready: data.ready,
			playerField: JSON.stringify(data.playerField),
			targetField: JSON.stringify(data.targetField),
			sessionId,
			userId
		}
	})
}

// Get

export async function dbGetUsers() {
	let users: IDBUser[];
	try {
		users = await prisma.user.findMany()
		await prisma.$disconnect()
	} catch (e) {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	}
	return users
}

export async function dbGetUser(id: number) {
	let user: IDBUser | null;
	try {
		user = await prisma.user.findUnique({
			where: {
				telegramID: id
			}
		})
		await prisma.$disconnect()
	} catch (e) {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	}
	return user
}

export async function dbGetSession(id: number) {
	let session;
	try {
		session = await prisma.session.findUnique({
			where: {
				id: id
			},
			include: {
				players: true
			}
		})
		await prisma.$disconnect()
	} catch (e) {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	}
	return session
}

// Delete

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

// Update

export async function dbUpdateSession(id: number, movesCount: number) {
	await prisma.session.update({
		where: {
			id
		},
		data: {
			movesCount
		}
	})
}

export async function dbUpdatePlayer(id: number, data: any) {
	await prisma.player.update({
		where: {
			id
		},
		data
	})
}

















