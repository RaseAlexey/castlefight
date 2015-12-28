var WebSocketServer = require('websocket').server;
var WebSocketClient = require('websocket').client;
var WebSocketFrame  = require('websocket').frame;
var WebSocketRouter = require('websocket').router;
var util = require('util');
var player = require('./player');
var game = require('./game');

module.exports = function(server) {
  wsServer = new WebSocketServer({
      httpServer: server,
      // You should not use autoAcceptConnections for production
      // applications, as it defeats all standard cross-origin protection
      // facilities built into the protocol and the browser.  You should
      // *always* verify the connection's origin and decide whether or not
      // to accept it.
      autoAcceptConnections: false
  });

  wsServer.readyConnections = [];

  wsServer.on('request', function(request) {
      if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
      }

      var connection = request.accept('echo-protocol', request.origin);
      console.log((new Date()) + ' Connection accepted. Total: ' + wsServer.connections.length);

      connection.on('message', function(message) {
        if (message.type === 'utf8') {
          var msg = JSON.parse(message.utf8Data);
          console.log('Received Message: ' + util.inspect(msg));

          if (msg.event == 'search-opponent' && wsServer.readyConnections.indexOf(connection) < 0) {
            wsServer.readyConnections.push(connection);
            console.log('Added ready player. Total: ' + wsServer.readyConnections.length);

            while (wsServer.readyConnections.length >= 2) {
              startGame(preparePair());
            }
          }
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        }
      });

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected. Total: ' + wsServer.connections.length);
    });

    function preparePair() {
      // search 2 ready connections, remove them from readyConnections array and put them in game
      var conn1 = wsServer.readyConnections.splice(Math.floor(Math.random()*wsServer.readyConnections.length), 1)[0];
      var conn2 = wsServer.readyConnections.splice(Math.floor(Math.random()*wsServer.readyConnections.length), 1)[0];
      var pair = [conn1, conn2];
      if (!(conn1 && conn2)) {
        return;
      }

      pair.forEach(function(conn) {
        send(conn, 'opponent-found');
      });

      return pair;
    };

    function startGame(connections) {
      console.log('game start for ' + connections);
      connections.forEach(function(conn) {
        send(conn, 'game-start');
      });

    }

    function originIsAllowed(origin) {
      console.log(origin);
      // put logic here to detect whether the specified origin is allowed.
      return true;
    }

    function send(connection, event, data) {
      if(!event) {
        throw 'event must be specified'
      }
      connection.send(JSON.stringify({'event': event, 'data': data}));
    }
  });
};
