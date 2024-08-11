"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverVal = void 0;
const http_1 = __importDefault(require("http"));
exports.serverVal = http_1.default.createServer();
const IoManager_1 = require("./managers/IoManager");
const UserManager_1 = require("./managers/UserManager");
const io = IoManager_1.IoManager.getIo();
const userManager = new UserManager_1.UserManager();
io.on('connection', (client) => {
    // console.log('hello server');
    userManager.addUser(client);
});
exports.serverVal.listen(8000, () => {
    console.log('listening on port 8000');
});
