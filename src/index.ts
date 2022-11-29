import express from 'express';
import cors from 'cors';
import { createPlayer } from './player';
import { createRoom, Room } from './room';

const rooms: Room[] = [];

const app = express();

// TODO: Limit origins?
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hi! This is drawchevo.');
});

app.post('/room', (req, res) => {
  const room = createRoom();
  rooms.push(room);
  return res.send({ room });
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

  const player = createPlayer(body.username);
  room.players.push(player);

  return res.send({ player });
});

app.get('/room/:code', (req, res) => {
  const roomCode = req.params.code;

  const room = rooms.find((r) => r.code.toLowerCase() === roomCode.toLowerCase());
  if (!room) {
    return res.status(404).send('Room not found.');
  }

  return res.send({ room });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
