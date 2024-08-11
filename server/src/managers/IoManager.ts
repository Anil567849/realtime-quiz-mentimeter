import { Server } from "socket.io";
import { serverVal } from "../index";

export class IoManager {
    private static io: Server;

    // singleton pattern
    public static getIo() {
        if (!this.io) {
            const io = new Server(serverVal, {
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