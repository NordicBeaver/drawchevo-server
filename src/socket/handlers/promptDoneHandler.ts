import { Socket } from 'socket.io';
import { createPrompt } from '../../game/prompt';
import { Games } from '../../games';
import { broadcastGameUpdate } from '../broadcastGameUpdate';
import { ConnectedPlayers } from '../connectedPlayers';

interface PromptDonePayload {
  promptText: string;
}

export function promptDoneHandler(socket: Socket, { promptText }: PromptDonePayload) {
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
    game.state = 'drawing';
  }

  broadcastGameUpdate(game);
}
