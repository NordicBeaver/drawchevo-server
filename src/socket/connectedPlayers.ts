import { Socket } from 'socket.io';

const connectedPlayers: { playerId: string; socket: Socket }[] = [];

function addConnectedPlayer(socket: Socket, playerId: string) {
  connectedPlayers.push({ socket: socket, playerId: playerId });
}

export function findSocketByPlayer(playerId: string) {
  const socket = connectedPlayers.find((p) => p.playerId === playerId)?.socket;
  return socket || null;
}

export function findPlayerBySocket(socketId: string) {
  const playerId = connectedPlayers.find((p) => p.socket.id === socketId)?.playerId;
  return playerId || null;
}

export const ConnectedPlayers = {
  add: addConnectedPlayer,
  findSocketByPlayer,
  findPlayerBySocket,
};
