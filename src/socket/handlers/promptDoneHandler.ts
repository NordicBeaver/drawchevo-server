import { Socket } from 'socket.io';
import { createPrompt } from '../../game/prompt';
import { Games } from '../../games';
import { broadcastGameUpdate } from '../broadcastGameUpdate';
import { ConnectedPlayers } from '../connectedPlayers';
import { promptDonePayloadSchema } from '../schemas';

export function promptDoneHandler(socket: Socket, payloadRaw: any) {
  const { promptText, drawingId } = promptDonePayloadSchema.parse(payloadRaw);

  const playerId = ConnectedPlayers.findPlayerBySocket(socket.id);
  if (!playerId) {
    return;
  }

  const game = Games.findByPlayerId(playerId);
  if (!game) {
    return;
  }

  const prompt = createPrompt(promptText, playerId);
  game.prompts.push(prompt);

  // The first prompt in a chain doesn't have a drawingId
  const chain =
    drawingId != null
      ? game.chains.find((chain) => chain.entries[chain.entries.length - 1] == drawingId)
      : game.chains.find((chain) => chain.initialPlayerId === playerId && chain.entries.length === 0);
  if (!chain) {
    return;
  }

  chain.entries.push(prompt.id);

  const allPlayersDone = game.chains.every((chain) => chain.entries.length === game.stage + 1);
  if (allPlayersDone) {
    game.stage += 1;
    game.state = 'Drawing';

    const allStagesCompleted = game.chains[0].entries.length === game.playersOrder.length;
    if (allStagesCompleted) {
      game.state = 'Results';
    }
  }

  broadcastGameUpdate(game);
}
