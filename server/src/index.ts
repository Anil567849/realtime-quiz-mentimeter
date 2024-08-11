import http from 'http';
export const serverVal = http.createServer();
import { IoManager } from "./managers/IoManager";
import { UserManager } from './managers/UserManager';
import { Socket } from 'socket.io';

const io = IoManager.getIo();

const userManager = new UserManager();

io.on('connection', (client: Socket) => {
  // console.log('hello server');
  userManager.addUser(client);
});


serverVal.listen(8000, () => {
    console.log('listening on port 8000')
});