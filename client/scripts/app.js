// YOUR CODE HERE:
var app = {};

app.server = 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages';

app.messages = null;

app.fetchRequestStatus = null;

app.init = function() {
  //populate rooms
  app.fetch();

  app.populateRooms();
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
  //app.fetchRequestStatus =
    $.ajax({
      url: app.server,
      type: 'GET',
      success: function(data) {
        console.log(data);
        app.messages = data.results;
      },
      error: function(data) {
        console.log(data);
      }
    });
};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.renderMessage = function(message) {
  var chatsDiv = $("#chats");
  chatsDiv.append("<div class=\"chat\"><span class=\"username\">" + message.username + ":</span><br> " + message.text + " </div>");
};

app.renderRoom = function(room) {
  $("#roomSelect").append($("<option>" + room + "</option>").attr('value', room));
};

app.populateRooms = function() {
  // app.fetchRequestStatus.done(function() {
  //   var uniqueRoomNames = {};

  //   for (var i = 0; i < app.messages.length; i++) {
  //     if (!uniqueRoomNames.hasOwnProperty(app.messages[i].roomname)) {
  //       uniqueRoomNames[app.messages[i].roomname] = app.messages[i].roomname;
  //     }
  //   }

  //   for (key in uniqueRoomNames) {
  //     app.renderRoom(key);
  //   }
  // });
};

app.init();


// var messagesArr = data.results;

//       for (var i = 0; i < messagesArr.length; i++) {
//         app.renderMessage(messagesArr[i]);
//       }