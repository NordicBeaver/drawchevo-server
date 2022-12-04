import { Server, Socket } from 'socket.io';
import { createPlayer, Player } from './player';
import { createRoom, Room } from './room';

const rooms: Room[] = [];
const connectedPlayers: { playerId: string; socket: Socket }[] = [];

const port = 3001;
// TODO: Limit origins?
const io = new Server(port, { cors: { origin: '*' } });

interface CreateRoomPayload {
  username: string;
}

interface RoomCreatedPayload {
  room: Room;
  player: Player;
}

interface JoinRoomPayload {
  roomCode: string;
  username: string;
}

interface RoomJoinedPayload {
  room: Room;
  player: Player;
}

// TODO: Add validation
io.on('connection', (socket) => {
  socket.on('createRoom', ({ username }: CreateRoomPayload) => {
    const player = createPlayer(username);
    connectedPlayers.push({ socket: socket, playerId: player.id });
    const room = createRoom(player);
    rooms.push(room);
    const payload: RoomCreatedPayload = {
      room: room,
      player: player,
    };
    socket.emit('roomCreated', payload);
  });

  socket.on('joinRoom', ({ roomCode, username }: JoinRoomPayload) => {
    const room = rooms.find((r) => r.code.toLowerCase() === roomCode.toLowerCase());
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const newPlayer = createPlayer(username);
    connectedPlayers.push({ socket: socket, playerId: newPlayer.id });
    room.players.push(newPlayer);

    room.players.forEach((player) => {
      const socket = connectedPlayers.find((p) => p.playerId === player.id)?.socket;
      if (socket) {
        socket.emit('gameUpdate', { room });
      }
    });

    const payload: RoomJoinedPayload = {
      room: room,
      player: newPlayer,
    };

    socket.emit('roomJoined', payload);
  });

  socket.on('playerConnect', ({ playerId }: { playerId: string }) => {
    connectedPlayers.push({ socket: socket, playerId: playerId });
  });
});
