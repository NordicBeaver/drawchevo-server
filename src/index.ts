import { Server, Socket } from 'socket.io';
import { createGameHandler } from './socket/handlers/createGameHandler';
import { drawingDoneHandler } from './socket/handlers/drawingDoneHandler';
import { joinGameHandler } from './socket/handlers/joinGameHandler';
import { promptDoneHandler } from './socket/handlers/promptDoneHandler';
import { startGameHandler } from './socket/handlers/startGameHandler';

const port = 3001;
// TODO: Limit origins?
const io = new Server(port, { cors: { origin: '*' } });

function addListener(socket: Socket, event: string, listener: (socket: Socket, payload: any) => void) {
  socket.on(event, (payload) => {
    try {
      listener(socket, payload);
    } catch (error) {
      console.log(`[Error] Socket listener failed on ${event}:`, error);
    }
  });
}

// TODO: Add validation
io.on('connection', (socket) => {
  addListener(socket, 'createGame', createGameHandler);
  addListener(socket, 'joinGame', joinGameHandler);
  addListener(socket, 'startGame', startGameHandler);
  addListener(socket, 'promptDoneByPlayer', promptDoneHandler);
  addListener(socket, 'drawingDoneByPlayer', drawingDoneHandler);
});
