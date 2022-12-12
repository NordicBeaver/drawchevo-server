import { Game } from './game/game';

const games: Game[] = [];

function add(game: Game) {
  games.push(game);
}

function find(gameId: string) {
  const game = games.find((g) => g.id === gameId);
  return game || null;
}

function findByCode(gameCode: string) {
  const game = games.find((r) => r.code.toLowerCase() === gameCode.toLowerCase());
  return game || null;
}

function findByHostId(hostId: string) {
  const game = games.find((g) => g.hostId === hostId);
  return game || null;
}

function findByPlayerId(playerId: string) {
  const game = games.find((g) => g.players.some((p) => p.id === playerId));
  return game || null;
}

export const Games = {
  add,
  find,
  findByCode,
  findByHostId,
  findByPlayerId,
};
