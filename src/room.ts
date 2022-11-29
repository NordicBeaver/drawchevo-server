import * as uuid from 'uuid';
import { Player } from './player';

export interface Room {
  id: string;
  code: string;
  players: Player[];
}

export function createRoom() {
  const room: Room = {
    id: uuid.v4(),
    code: generateRoomCode(),
    players: [],
  };
  return room;
}

function generateRoomCode() {
  const code = uuid.v4().slice(0, 6).toUpperCase();
  return code;
}
