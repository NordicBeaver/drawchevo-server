import { Socket } from 'socket.io';
import { Game } from '../../game/game';
import { createPlayer, Player } from '../../game/player';
import { Games } from '../../games';
import { broadcastGameUpdate } from '../broadcastGameUpdate';
import { ConnectedPlayers } from '../connectedPlayers';

interface JoinGamePayload {
  gameCode: string;
  username: string;
}

interface GameJoinedPayload {
  game: Game;
  player: Player;
}

export function joinGameHandler(socket: Socket, { gameCode, username }: JoinGamePayload) {
  const game = Games.findByCode(gameCode);
  if (!game) {
    socket.emit('error', { message: 'Game not found' });
    return;
  }

  const newPlayer = createPlayer(username);
  ConnectedPlayers.add(socket, newPlayer.id);

  game.players.push(newPlayer);

  broadcastGameUpdate(game);

  const payload: GameJoinedPayload = {
    game: game,
    player: newPlayer,
  };

  socket.emit('gameJoined', payload);
}
