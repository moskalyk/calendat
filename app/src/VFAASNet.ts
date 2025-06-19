class SocketIO {}

class VFAASNetSocket extends SocketIO {
    constructor(url: any){console.log(url);super()}
    // TODO
    send() {
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

  }

  // TODO: add a listener
  aPath(func: (message: any) => void) {
    console.log(func)
    return this
  }

  // TODO: create a message when a connected peer leaves
  aLeave(){

  }
}

export { VFAASNet }