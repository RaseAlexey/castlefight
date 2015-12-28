
var socket = (function() {
  var socket = new WebSocket(location.origin.replace(/^http/, 'ws'), 'echo-protocol');
  var callbacks = {};

  socket.onmessage = function(event) {
    var msg = JSON.parse(event.data)
    console.log('Message: ', msg);
    this.trigger(msg.event, msg.data);
  };

  socket._send = socket.send;
  socket.send = function(event, data) {
    this._send(JSON.stringify({event: event, data: data}));
  };

  socket.onopen = function() {
    $('.start-form').submit(function(e) {
      e.preventDefault();
      var name = $('.name').val();
      if (!name) return;
        socket.send('ready', {name: name});
      $('.name').val('');
    });
  };

  socket.bind = function(event, callback) {
    callbacks[event] = callbacks[event] || [];
    callbacks[event].push(callback);
    return this;// chainable
  };

  socket.trigger = function(event, message) {
    var chain = callbacks[event];
    if(typeof chain == 'undefined') return; // no callbacks for this event
    for(var i = 0; i < chain.length; i++){
      chain[i]( message )
    }
  };
  return socket;
})();