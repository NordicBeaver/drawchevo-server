import { Socket } from 'socket.io';
import { Games } from '../../games';
import { ConnectedPlayers } from '../connectedPlayers';
import { z } from 'zod';
import { gameResultPayloadSchema, gameResultSchema } from '../schemas';
import { Drawings } from '../../drawings';

export function requestGameResultHandler(socket: Socket) {
  const playerId = ConnectedPlayers.findPlayerBySocket(socket.id);
  if (!playerId) {
    return;
  }

  const game = Games.findByPlayerId(playerId);
  if (!game) {
    return;
  }

  // TODO: Simplify this monster or maybe even generate it on the client.
  const result: z.infer<typeof gameResultSchema> = {
    chains: game.chains.map((chain) => ({
      initialPlayerName: game.players.find((p) => p.id === chain.initialPlayerId)!.name,
      entries: chain.entries.map((entry, index) => {
        if (index % 2 === 0) {
          const prompt = game.prompts.find((p) => p.id === entry)!;
          const player = game.players.find((p) => p.id === prompt.playerId)!;
          return {
            type: 'prompt',
            playerName: player.name,
            text: prompt.text,
          };
        } else {
          const drawing = game.drawings.find((d) => d.id === entry)!;
          const player = game.players.find((p) => p.id === drawing.playerId)!;
          const drawingData = Drawings.findDrawingData(drawing.id)!;
          return {
            type: 'drawing',
            playerName: player.name,
            drawingData: drawingData.data,
          };
        }
      }),
    })),
  };

  const payload: z.infer<typeof gameResultPayloadSchema> = {
    gameResult: result,
  };

  socket.emit('gameResult', payload);
}
