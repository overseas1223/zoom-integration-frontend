export class Message {

    name: string = ""
    text: string = ""
    type: number = Message.Type.TEXT
    id: number = Date.now()

    constructor(name: string) {
      this.name = name
    }

    sendStart(){
      this.type = Message.Type.START
      this.text = Message.Type[Message.Type.START]
      return this
    }

    sendText(text: string){
      this.type = Message.Type.TEXT
      this.text = text
      return this
    }

    sendFinish(){
      this.type = Message.Type.FINISH
      this.text = Message.Type[Message.Type.FINISH]
      return this
    }

}

export namespace Message {

  export enum Type {
    START,
    TEXT,
    FINISH
  }

}
