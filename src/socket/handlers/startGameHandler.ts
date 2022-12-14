import { shuffle } from 'lodash';
import { Socket } from 'socket.io';
import { z } from 'zod/lib';
import { Games } from '../../games';
import { broadcastGameUpdate } from '../broadcastGameUpdate';

const startGamePayloadSchema = z.object({
  playerId: z.string(),
});

export function startGameHandler(socket: Socket, payloadRaw: any) {
  const { playerId } = startGamePayloadSchema.parse(payloadRaw);

  const game = Games.findByHostId(playerId);
  if (!game) {
    return;
  }

  // Generate players order
  game.playersOrder = shuffle(game.players.map((p) => p.id));

  game.state = 'EnteringPrompts';
  game.stage = 1;

  broadcastGameUpdate(game);
}
