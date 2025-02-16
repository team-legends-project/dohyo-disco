import { Client, Room } from 'colyseus'
// import { Message } from '../types/messages'
import FightState from './GameState'
// import PlayerSelectionCommand from './commands/PlayerSelectionCommand'
import { GameState } from '../../types/IFightState'
import * as PLAYER from "../entities/Player"

export default class GameRoom extends Room<FightState>
{
	maxClients = 2;

	onCreate()
	{
		this.setState(new FightState())
		this.setSimulationInterval(() => this.onUpdate());
		this.onMessage("key", (client, message) => {
            this.state.players.get(client.sessionId).pressedKeys = message;
        });
	}

	onJoin(client: Client)
	{
		const player = new PLAYER.Player();
		player.name = `Player ${ this.clients.length}`
		player.id = this.clients.length;
		player.position.x = player.id == 1 ? -1: 1;
		player.position.y = 0;
		player.position.z = 0;
		
		this.state.players.set(client.sessionId, player)
	}

	onUpdate(){
		this.state.players.forEach((player, sessionId) => {
			player.position.x += player.pressedKeys.w * 0.1;

			// depending on what the player is doing - conditional logic here. Should reference the CharState in player

		})
	}

	onLeave(client: Client) {
		this.state.players.delete(client.sessionId);
	}

	//onDispose of room?

}