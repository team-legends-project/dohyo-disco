import { Schema, ArraySchema } from '@colyseus/schema'

export enum Cell
{
	Empty,
	X,
	O
}

export enum GameState
{
	WaitingForPlayers,
	Playing,
	Finished
}

export interface IFightState extends Schema
{
	gameState: GameState
	
	board: ArraySchema<Cell>

	activePlayer: number

	winningPlayer: number
}

export default IFightState