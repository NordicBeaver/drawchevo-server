import * as uuid from 'uuid';

export interface Drawing {
  id: string;
  playerId: string;
}

export function createDrawing(playerId: string) {
  const drawing: Drawing = {
    id: uuid.v4(),
    playerId: playerId,
  };
  return drawing;
}
