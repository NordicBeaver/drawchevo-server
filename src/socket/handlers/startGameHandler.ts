import { shuffle } from 'lodash';
import { Socket } from 'socket.io';
import { Games } from '../../games';
import { broadcastGameUpdate } from '../broadcastGameUpdate';
import { startGamePayloadSchema } from '../schemas';

export function startGameHandler(socket: Socket, payloadRaw: any) {
  const { playerId } = startGamePayloadSchema.parse(payloadRaw);

  const game = Games.findByHostId(playerId);
  if (!game) {
    return;
  }

  game.chains = game.players.map((player) => ({ initialPlayerId: player.id, entries: [] }));

  // Generate players order
  game.playersOrder = shuffle(game.players.map((p) => p.id));

  game.state = 'EnteringPrompts';
  game.stage = 1;

  broadcastGameUpdate(game);
}
