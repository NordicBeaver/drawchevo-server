import { z } from 'zod';
import { Game } from '../game/game';
import { ConnectedPlayers } from './connectedPlayers';
import { gameUpdatePayloadSchema } from './schemas';

export function broadcastGameUpdate(game: Game) {
  game.players.forEach((player) => {
    const socket = ConnectedPlayers.findSocketByPlayer(player.id);
    if (socket) {
      const payload: z.infer<typeof gameUpdatePayloadSchema> = {
        game: game,
      };
      socket.emit('gameUpdate', payload);
    }
  });
}
