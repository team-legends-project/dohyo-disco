import { Schema, ArraySchema, type, MapSchema } from '@colyseus/schema'
import * as PLAYER from "../entities/Player"


import IFightState, { GameState } from '../../types/IFightState'

export default class FightState extends Schema implements IFightState
{
    @type({map: PLAYER.Player}) players = new MapSchema<PLAYER.Player>()
	@type('number')
	gameState = GameState.WaitingForPlayers

	@type(['number'])
	board: ArraySchema<number>

	@type('number')
	activePlayer = 0

	@type('number')
	winningPlayer = -1

	constructor()
	{
		super()

		
	}
}