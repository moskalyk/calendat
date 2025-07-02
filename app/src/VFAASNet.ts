import { io } from "socket.io-client";

class VFAASNetSocket {
    socket: any;
    notConnected: any = false;

    constructor(url: any){
      try{
        this.socket = io(url)
      }catch(err){
        this.notConnected = true;
      }
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

  aBoot(cb: any) {
    const msg = 'connection created'
    this.webSocket.on('connect', () => {
      cb({boot: this, msg: msg})
      // console.log()
    })
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