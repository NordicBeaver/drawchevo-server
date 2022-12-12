import { shuffle } from 'lodash';
import { Socket } from 'socket.io';
import { Games } from '../../games';
import { broadcastGameUpdate } from '../broadcastGameUpdate';

interface StartGamePayload {
  playerId: string;
}

export function startGameHandler(socket: Socket, { playerId }: StartGamePayload) {
  const game = Games.findByHostId(playerId);
  if (!game) {
    return;
  }

  // Generate players order
  game.playersOrder = shuffle(game.players.map((p) => p.id));

  game.state = 'enteringPrompts';
  game.stage = 1;

  broadcastGameUpdate(game);
}
