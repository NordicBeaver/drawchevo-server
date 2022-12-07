import { Server, Socket } from 'socket.io';
import { createPlayer, Player } from './game/player';
import { createPrompt } from './game/prompt';
import { createRoom, Room } from './game/room';

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

interface StartGamePayload {
  playerId: string;
}

interface PromptDoneByPlayerPayload {
  promptText: string;
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

  socket.on('startGame', ({ playerId }: StartGamePayload) => {
    const room = rooms.find((room) => room.hostId === playerId);
    if (!room) {
      return;
    }

    room.state = 'enteringPrompts';
    room.players.forEach((player) => {
      const socket = connectedPlayers.find((p) => p.playerId === player.id)?.socket;
      if (socket) {
        socket.emit('gameUpdate', { room });
      }
    });
  });

  socket.on('promptDoneByPlayer', ({ promptText }: PromptDoneByPlayerPayload) => {
    const playerId = connectedPlayers.find((p) => p.socket.id === socket.id)?.playerId;
    if (!playerId) {
      return;
    }

    const room = rooms.find((room) => room.players.some((p) => p.id === playerId));
    if (!room) {
      return;
    }

    const prompt = createPrompt(promptText, playerId);
    room.prompts.push(prompt);

    // All player done with prompts.
    if (room.players.every((player) => room.prompts.map((p) => p.playerId).includes(player.id))) {
      room.state = 'finished';
    }

    room.players.forEach((player) => {
      const socket = connectedPlayers.find((p) => p.playerId === player.id)?.socket;
      if (socket) {
        socket.emit('gameUpdate', { room });
      }
    });
  });
});
