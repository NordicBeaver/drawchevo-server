import { Socket } from 'socket.io';
import { createPrompt } from '../../game/prompt';
import { Games } from '../../games';
import { broadcastGameUpdate } from '../broadcastGameUpdate';
import { ConnectedPlayers } from '../connectedPlayers';
import { z } from 'zod';

const promptDonePayloadSchema = z.object({
  promptText: z.string(),
});

export function promptDoneHandler(socket: Socket, payloadRaw: any) {
  const { promptText } = promptDonePayloadSchema.parse(payloadRaw);

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

  // All player done with prompts.
  const allDone = game.players.every((player) => game.prompts.map((p) => p.playerId).includes(player.id));
  if (allDone) {
    game.chains = game.prompts.map((prompt) => [prompt.id]);
    game.stage += 1;
    game.state = 'Drawing';
  }

  broadcastGameUpdate(game);
}
