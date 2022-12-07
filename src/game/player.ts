import * as uuid from 'uuid';

export interface Player {
  id: string;
  name: string;
}

export function createPlayer(name: string) {
  const player: Player = {
    id: uuid.v4(),
    name: name,
  };
  return player;
}
