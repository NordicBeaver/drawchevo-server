import { Server } from 'socket.io';
import { createGameHandler } from './socket/handlers/createGameHandler';
import { drawingDoneHandler } from './socket/handlers/DrawingDoneHandler';
import { joinGameHandler } from './socket/handlers/joinGameHandler';
import { promptDoneHandler } from './socket/handlers/promptDoneHandler';
import { startGameHandler } from './socket/handlers/startGameHandler';

const port = 3001;
// TODO: Limit origins?
const io = new Server(port, { cors: { origin: '*' } });

// TODO: Add validation
io.on('connection', (socket) => {
  socket.on('createGame', (payload) => createGameHandler(socket, payload));
  socket.on('joinRoom', (payload) => joinGameHandler(socket, payload));
  socket.on('startGame', (payload) => startGameHandler(socket, payload));
  socket.on('promptDoneByPlayer', (payload) => promptDoneHandler(socket, payload));
  socket.on('drawingDoneByPlayer', (payload) => drawingDoneHandler(socket, payload));
});
