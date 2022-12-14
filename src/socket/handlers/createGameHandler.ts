import { Socket } from 'socket.io';
import { z } from 'zod';
import { createGame, Game } from '../../game/game';
import { createPlayer, Player } from '../../game/player';
import { Games } from '../../games';
import { ConnectedPlayers } from '../connectedPlayers';
import { createGamePayloadSchema, gameCreatedPayloadSchema } from '../schemas';

export function createGameHandler(socket: Socket, payloadRaw: any) {
  const { username } = createGamePayloadSchema.parse(payloadRaw);

  const player = createPlayer(username);
  ConnectedPlayers.add(socket, player.id);
  const game = createGame(player);
  Games.add(game);

  const payload: z.infer<typeof gameCreatedPayloadSchema> = {
    game: game,
    player: player,
  };

  socket.emit('gameCreated', payload);
}
