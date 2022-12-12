import { Socket } from 'socket.io';
import { createGame, Game } from '../../game/game';
import { createPlayer, Player } from '../../game/player';
import { Games } from '../../games';
import { ConnectedPlayers } from '../connectedPlayers';

export interface CreateGamePayload {
  username: string;
}

interface GameCreatedPayload {
  room: Game;
  player: Player;
}

export function createGameHandler(socket: Socket, { username }: CreateGamePayload) {
  const player = createPlayer(username);
  ConnectedPlayers.add(socket, player.id);
  const game = createGame(player);
  Games.add(game);

  const payload: GameCreatedPayload = {
    room: game,
    player: player,
  };
  socket.emit('gameCreated', payload);
}
