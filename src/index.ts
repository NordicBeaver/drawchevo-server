import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createPlayer } from './player';
import { createRoom, Room } from './room';

const rooms: Room[] = [];
const connectedPlayers: { playerId: string; socket: Socket }[] = [];

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

// TODO: Limit origins?
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hi! This is drawchevo.');
});

interface CreateRoomRequest {
  username: string;
}

app.post('/room/create', (req, res) => {
  const body = req.body as CreateRoomRequest;

  const player = createPlayer(body.username);
  const room = createRoom(player);
  rooms.push(room);

  return res.send({ room, player });
});

interface JoinRoomRequest {
  roomCode: string;
  username: string;
}

app.post('/room/join', (req, res) => {
  // TODO: Add validation
  const body = req.body as JoinRoomRequest;

  const room = rooms.find((r) => r.code.toLowerCase() === body.roomCode.toLowerCase());
  if (!room) {
    return res.status(404).send('Room not found.');
  }

  const newPlayer = createPlayer(body.username);
  room.players.push(newPlayer);

  room.players.forEach((player) => {
    const socket = connectedPlayers.find((p) => p.playerId === player.id)?.socket;
    if (socket) {
      socket.emit('gameUpdate', { room });
    }
  });

  return res.send({ room, player: newPlayer });
});

app.get('/room/:code', (req, res) => {
  const roomCode = req.params.code;

  const room = rooms.find((r) => r.code.toLowerCase() === roomCode.toLowerCase());
  if (!room) {
    return res.status(404).send('Room not found.');
  }

  return res.send({ room });
});

io.on('connection', (socket) => {
  socket.on('playerConnect', ({ playerId }: { playerId: string }) => {=
    connectedPlayers.push({ socket: socket, playerId: playerId });
  });
});

const port = 3001;
httpServer.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
