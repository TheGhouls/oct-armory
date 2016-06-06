export class ZmqHelper {
  ZmqHelper(){
    console.log("new ZmqHelper");
  }

  pubSock(){
    const sock = ZMQ.socket('pub');

    sock.bindSync('tcp://127.0.0.1:4000');
    console.info('Publisher bound to port 4000');

    setInterval(function(){
      console.info('sending a multipart message envelope');
      sock.send(['kitty cats', 'meow!']);
    }, 1500);
  }

}
