"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoManager = void 0;
const socket_io_1 = require("socket.io");
const index_1 = require("../index");
class IoManager {
    // singleton pattern
    static getIo() {
        if (!this.io) {
            const io = new socket_io_1.Server(index_1.serverVal, {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"]
                }
            });
            this.io = io;
        }
        return this.io;
    }
}
exports.IoManager = IoManager;
