export interface IUserData {
	name: string;
	id: number;
};
export interface IPlayerData {
	player: IUserData;
	ready: boolean;
	playerField: number[][];
	targetField: number[][];
};
export interface IDBUser {
	id: number;
	telegramID: number
	name: string;
}