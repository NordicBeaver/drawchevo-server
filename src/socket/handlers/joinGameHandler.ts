import { Socket } from 'socket.io';
import { z } from 'zod';
import { Game } from '../../game/game';
import { createPlayer, Player } from '../../game/player';
import { Games } from '../../games';
import { broadcastGameUpdate } from '../broadcastGameUpdate';
import { ConnectedPlayers } from '../connectedPlayers';

const joinGamePayloadSchema = z.object({
  roomCode: z.string(),
  username: z.string(),
});

interface GameJoinedPayload {
  game: Game;
  player: Player;
}

export function joinGameHandler(socket: Socket, payloadRaw: any) {
  const { roomCode, username } = joinGamePayloadSchema.parse(payloadRaw);

  const game = Games.findByCode(roomCode);
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
