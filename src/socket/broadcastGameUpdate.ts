import { Game } from '../game/game';
import { ConnectedPlayers } from './connectedPlayers';

export function broadcastGameUpdate(game: Game) {
  game.players.forEach((player) => {
    const socket = ConnectedPlayers.findSocketByPlayer(player.id);
    if (socket) {
      socket.emit('gameUpdate', { game });
    }
  });
}
