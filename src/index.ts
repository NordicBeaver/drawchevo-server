import { shuffle } from 'lodash';
import { Server, Socket } from 'socket.io';
import { createDrawing } from './game/drawing';
import { createPlayer, Player } from './game/player';
import { createPrompt } from './game/prompt';
import { createRoom, Room } from './game/room';

const rooms: Room[] = [];
const connectedPlayers: { playerId: string; socket: Socket }[] = [];
const drawingsData: { id: string; data: string }[] = [];

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

interface DrawingDoneByPlayerPayload {
  promptId: string;
  drawingData: string;
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

    // Generate players order
    room.playersOrder = shuffle(room.players.map((p) => p.id));

    room.state = 'enteringPrompts';
    room.stage = 1;
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
    const allDone = room.players.every((player) => room.prompts.map((p) => p.playerId).includes(player.id));
    if (allDone) {
      room.chains = room.prompts.map((prompt) => [prompt.id]);
      room.stage += 1;
      room.state = 'drawing';
    }

    room.players.forEach((player) => {
      const socket = connectedPlayers.find((p) => p.playerId === player.id)?.socket;
      if (socket) {
        socket.emit('gameUpdate', { room });
      }
    });
  });

  socket.on('drawingDoneByPlayer', ({ promptId, drawingData }: DrawingDoneByPlayerPayload) => {
    const playerId = connectedPlayers.find((p) => p.socket.id === socket.id)?.playerId;
    if (!playerId) {
      return;
    }

    const room = rooms.find((room) => room.players.some((p) => p.id === playerId));
    if (!room) {
      return;
    }

    const chain = room.chains.find((c) => c[c.length - 1] == promptId);
    if (!chain) {
      return;
    }

    const drawing = createDrawing(playerId);
    chain.push(drawing.id);
    drawingsData.push({ id: drawing.id, data: drawingData });

    // All player done drawings.
    const allDone = room.chains.every((chain) => chain.length == room.stage);
    if (allDone) {
      room.stage += 1;
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
