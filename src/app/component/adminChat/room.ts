import { Message } from "./message";

export class Room {
    constructor(public roomId: string, public messages: Message[] = []) { }
}
