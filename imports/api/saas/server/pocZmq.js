import zmq from 'zmq';


export class ZmqHelper {
  ZmqHelper(){
    this.zmq = zmq
  }

  pubSock(){
    const sock = zmq.socket('pub');

    sock.bindSync('tcp://127.0.0.1:4000');
    console.log('Publisher bound to port 4000');

    setInterval(function(){
      //console.log('sending a multipart message envelope');
      sock.send(['kitty cats', 'meow!']);
    }, 500);
  }

  subSock(){
    const sock = zmq.socket('sub');

    sock.connect('tcp://127.0.0.1:4000');
    sock.subscribe('kitty cats');
    console.log('Subscriber connected to port 4000');

    sock.on('message', function(topic, message) {
      console.log('received a message related to:', topic.toString(), 'containing message:', message.toString());
    });
  }
}

let helper = new ZmqHelper();

helper.pubSock();
helper.subSock();
