import { Socket } from 'socket.io';
import { z } from 'zod';
import { createPlayer } from '../../game/player';
import { Games } from '../../games';
import { broadcastGameUpdate } from '../broadcastGameUpdate';
import { ConnectedPlayers } from '../connectedPlayers';
import { gameJoinedPayloadSchema, joinGamePayloadSchema } from '../schemas';

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

  const payload: z.infer<typeof gameJoinedPayloadSchema> = {
    game: game,
    player: newPlayer,
  };

  socket.emit('gameJoined', payload);
}
