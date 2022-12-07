import * as uuid from 'uuid';

export interface Prompt {
  id: string;
  text: string;
  playerId: string;
}

export function createPrompt(text: string, playerId: string) {
  const prompt: Prompt = {
    id: uuid.v4(),
    text: text,
    playerId: playerId,
  };
  return prompt;
}
