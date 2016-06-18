export class ZmqHelper {
  ZmqHelper(){
    console.log("new ZmqHelper");
    this.pubRuning = false;
  }

  pubSock(){
    const sock = ZMQ.socket('pub');
    try{
      sock.bindSync('tcp://127.0.0.1:4000');
      console.info('Publisher bound to port 4000');
    } catch(e){
      console.log("pubSock error", e);
    }
    setInterval(function(){
      console.info('sending a multipart message envelope');
      sock.send(['kitty cats', 'meow!']);
    }, 1500);
  }

}
