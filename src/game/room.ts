import * as uuid from 'uuid';
import { Player } from './player';
import { Prompt } from './prompt';

type GameState = 'notStarted' | 'enteringPrompts' | 'finished';

export interface Room {
  id: string;
  code: string;
  hostId: string;
  state: GameState;
  players: Player[];
  prompts: Prompt[];
}

export function createRoom(host: Player) {
  const room: Room = {
    id: uuid.v4(),
    code: generateRoomCode(),
    hostId: host.id,
    state: 'notStarted',
    players: [host],
    prompts: [],
  };
  return room;
}

function generateRoomCode() {
  const code = uuid.v4().slice(0, 6).toUpperCase();
  return code;
}
