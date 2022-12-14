import * as uuid from 'uuid';
import { Player } from './player';
import { Prompt } from './prompt';

type GameState = 'NotStarted' | 'EnteringPrompts' | 'Drawing' | 'Finished';

// A chain of IDs of drawings and their names.
type Chain = string[];

export interface Game {
  id: string;
  code: string;
  hostId: string;
  state: GameState;
  /**
   * A number of a current drawing/description. For example, if all players did 2 descritpions and 1 drawing,
   * and at the moment are making their second drawing, the stage number should be 4.
   */
  stage: number;
  players: Player[];
  prompts: Prompt[];
  chains: Chain[];
  /**
   * The order of players used for assigning tasks for them. For exmplae, when drawing stage starts,
   * the player with index playersOrder[i] will draw a description written by the player with id of playersOrder[i-1]
   */
  playersOrder: string[];
}

export function createGame(host: Player) {
  const room: Game = {
    id: uuid.v4(),
    code: generateGameCode(),
    hostId: host.id,
    state: 'NotStarted',
    stage: 0,
    players: [host],
    prompts: [],
    chains: [],
    playersOrder: [],
  };
  return room;
}

function generateGameCode() {
  const code = uuid.v4().slice(0, 6).toUpperCase();
  return code;
}
