// YOUR CODE HERE:
var app = {};

app.server = 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages';

app.init = function() {

};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: message sent, ' + data);
    },
    error: function(data) {
      console.log(data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    success: function(data) {
      console.log(data);
    },
    error: function(data) {
      console.log(data);
    }
  });
};

app.clearMessages = function() {

};