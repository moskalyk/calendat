import { io } from "socket.io-client";

class VFAASNetSocket {
    socket: any;

    constructor(url: any){
      this.socket = io(url)
    }
    
    send(channel: any, message: any) {
      this.socket.emit(channel, message)
    }

    on(channel: any, func: any) {
      this.socket.on(channel, func)
    }
}

class VFAASNet {
  webSocket: any;

  constructor({ host, port }: any) {
    this.webSocket = new VFAASNetSocket(`http://${host}:${port}` )
  }

  aBoot() {
    this.webSocket.on('connection', () => console.log('connection created'))
    return this
  }

  aPath(func: (message: any) => void) {
    let val = func.name
    this.webSocket.on(val, (message: any) => func(message))
    return this
  }

  aLeave(){
    this.webSocket.on('disconnection', () => console.log('user disconnected')) // convert to 'a' user
  }
}

export { VFAASNet }