interface User {
	id: number
	name: string
	sessions?: string[]
	activeSession?: string | null
}

interface Session {
	id: string
	movesCount: number
	players: number[]
}

interface Player {
	id: string
	userId: number
	userName: string
	ready: boolean
	playerField: string
	targetField: string
	session?: string
}

const URL = 'https://tel-server-firebase.onrender.com'

async function requestToServer(point: string, payload?: any) {
	try {
		const response = await fetch(`${URL}/${point}`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: JSON.stringify(payload)
		})
		console.log('<//point//>: ', point)
		const result = await response.json()
		return result

	} catch (error) {
		console.log('my error:', error)
	}
}

// Add ==================================

export async function dbAddUser(user: User) {
	return await requestToServer('dbAddUser', user)
}

export async function dbAddSession(players: Player[]): Promise<{
	players: (Omit<Player, "playerField" | "targetField"> & {
		playerField: number[][];
		targetField: number[][];
	})[];
	id: string;
	movesCount: number;
}> {
	return await requestToServer('dbAddSession', players)
}
// Get ==================================

export async function dbGetSession(id: string): Promise<{
	players: (Omit<Player, "playerField" | "targetField"> & {
		playerField: number[][];
		targetField: number[][];
	})[];
	id: string;
	movesCount: number;
}> {
	return await requestToServer('dbGetSession', { id })
}

export async function dbGetAllUsers(): Promise<User[]> {
	return await requestToServer('dbGetAllUsers')
}

export async function dbGetUser(id: number): Promise<User> {
	return await requestToServer('dbGetUser', { id })
}

export async function dbGetPlayerByUserId(id: number): Promise<{
	session: Session;
	playerField: number[][];
	targetField: number[][];
	id: string;
	userId: number;
	userName: string;
	ready: boolean;
}> {
	return await requestToServer('dbGetPlayerByUserId', { id })
}

export async function dbGetPlayer(id: string): Promise<{
	session: Session;
	playerField: number[][];
	targetField: number[][];
	id: string;
	userId: number;
	userName: string;
	ready: boolean;
}> {
	return await requestToServer('dbGetPlayer', { id })
}

// Update ==================================

export async function dbUpdateSessionMovesCount(id: string, movesCount: number): Promise<{
	players: (Omit<Player, "playerField" | "targetField"> & {
		playerField: number[][];
		targetField: number[][];
	})[];
	id: string;
	movesCount: number;
}> {
	return await requestToServer('dbUpdateSessionMovesCount', { id, movesCount })
}

export async function dbUpdatePlayerField(id: string, playerField: string): Promise<{
	session: Session;
	playerField: number[][];
	targetField: number[][];
	id: string;
	userId: number;
	userName: string;
	ready: boolean;
}> {
	return await requestToServer('dbUpdatePlayerField', { id, playerField })
}

export async function dbUpdatePlayerTargetField(id: string, targetField: string): Promise<{
	session: Session;
	playerField: number[][];
	targetField: number[][];
	id: string;
	userId: number;
	userName: string;
	ready: boolean;
}> {
	return await requestToServer('dbUpdatePlayerTargetField', { id, targetField })
}

export async function dbUpdatePlayerReady(id: string, ready: boolean): Promise<{
	session: Session;
	playerField: number[][];
	targetField: number[][];
	id: string;
	userId: number;
	userName: string;
	ready: boolean;
}> {
	return await requestToServer('dbUpdatePlayerReady', { id, ready })
}

export async function dbUpdateUser(id: number, sessionId: string): Promise<User> {
	return await requestToServer('dbUpdateUser', { id, sessionId })
}

export async function dbUpdateUserActiveSession(id: number, sessionId: string): Promise<User> {
	return await requestToServer('dbUpdateUserActiveSession', { id, sessionId })
}

// Delete ==================================

export async function dbDeleteSessionFromUser(id: number, sessionId: string) {
	return await requestToServer('dbDeleteSessionFromUser', { id, sessionId })
}

export async function dbDeletePlayer(id: string) {
	return await requestToServer('dbDeletePlayer', { id })
}

export async function dbDeleteSession(id: string) {
	return await requestToServer('dbDeleteSession', { id })
}

















