import { Socket } from 'socket.io';
import { Drawings } from '../../drawings';
import { createDrawing } from '../../game/drawing';
import { Games } from '../../games';
import { broadcastGameUpdate } from '../broadcastGameUpdate';
import { ConnectedPlayers } from '../connectedPlayers';
import { drawingDonePayloadSchema } from '../schemas';

export function drawingDoneHandler(socket: Socket, payloadRaw: any) {
  const { promptId, drawingData } = drawingDonePayloadSchema.parse(payloadRaw);

  const playerId = ConnectedPlayers.findPlayerBySocket(socket.id);
  if (!playerId) {
    return;
  }

  const game = Games.findByPlayerId(playerId);
  if (!game) {
    return;
  }

  const drawing = createDrawing(playerId);
  Drawings.saveDrawingData(drawing.id, drawingData);

  game.drawings.push(drawing);

  const chain = game.chains.find((chain) => chain.entries[chain.entries.length - 1] == promptId);
  if (!chain) {
    return;
  }
  chain.entries.push(drawing.id);

  const allPlayersDone = game.chains.every((chain) => chain.entries.length === game.stage + 1);
  if (allPlayersDone) {
    game.stage += 1;
    game.state = 'EnteringPrompts';

    const allStagesCompleted = game.chains[0].entries.length === game.playersOrder.length;
    if (allStagesCompleted) {
      game.state = 'Results';
    }
  }

  broadcastGameUpdate(game);
}
