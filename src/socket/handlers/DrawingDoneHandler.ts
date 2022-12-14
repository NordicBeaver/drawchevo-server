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

  const chain = game.chains.find((chain) => chain.entries[chain.entries.length - 1] == promptId);
  if (!chain) {
    return;
  }

  const drawing = createDrawing(playerId);
  chain.entries.push(drawing.id);

  Drawings.saveDrawingData(drawing.id, drawingData);

  // All player done drawings.
  const allDone = game.chains.every((chain) => chain.entries.length == game.stage);
  if (allDone) {
    game.stage += 1;
    game.state = 'Finished';
  }

  broadcastGameUpdate(game);
}
