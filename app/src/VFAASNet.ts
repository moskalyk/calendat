// class SocketIO {}

import { io } from "socket.io-client";

class VFAASNetSocket {
    socket: any;

    constructor(url: any){
      // super()
      this.socket = io(url)
    }
    
    // TODO
    send(channel: any, message: any) {
      this.socket.emit(channel, message)
    }

    on(channel: any, func: any) {
      this.socket.on(channel, func)
    }
}

class VFAASNet {
  webSocket: any;

  // TODO: create a connection to a signalling server
  constructor({ host, port }: any) {
    this.webSocket = new VFAASNetSocket(`http://${host}:${port}` )
  }

  // TODO: on connection creation
  aBoot() {
      this.webSocket.on('connection', (socket: any) => {
      console.log(socket)
    })
    return this
  }

  // TODO: add a listener
  aPath(func: (message: any) => void) {
    let val = func.name
    // return (channel:any) => {
      this.webSocket.on(val, (message: any) => {
        func(message)
      })
      return this
    // }
  }

  // TODO: create a message when a connected peer leaves
  aLeave(){
    this.webSocket.on('disconnection', () => {
      console.log('a user disconnected')
    })
  }
}

export { VFAASNet }