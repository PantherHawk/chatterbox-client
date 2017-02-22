var app = {};

app.server = 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages';

app.messages = null;

app.friends = [];

app.init = () => {
  app.toggleSpinner();
  //populate rooms
  app.populateRooms();
};

app.send = (message) => {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: (data) => {
      console.log(`chatterbox: message sent, ${JSON.stringify(data)}`);

      app.clearMessages();

      app.fetch();
    },
    error: (data) => {
      console.log(data);
    }
  });
};

app.fetch = () => {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: { limit: 2000, order: '-createdAt' },
    success: (data) => {
      app.messages = data.results;
      app.init();
      console.log(`fetch done`);
    },
    error: (data) => {
      console.log(data);
    }
  });
};

app.clearMessages = () => {
  $('#chats').children().remove();
};

app.renderMessage = (message) => {
  var chatsDiv = $('#chats');

  var date = new Date(message.createdAt);

  if (app.friends.indexOf(message.username) > -1) {
    chatsDiv.append(`<div class=\'chat\'><span class=\'username friends\'> ${message.username} :</span><span class=\'date\'> ${date} </span><br> ${message.text} </div>`);
  } else {
    chatsDiv.append(`<div class=\'chat\'><span class=\'username\'> ${_.escape(message.username)} :</span><span class=\'date\'> ${date} </span><br> ${_.escape(message.text)} </div>`);
  }
};

app.renderRoom = (room) => {
  $('#roomSelect').append($(`<option> ${_.escape(room)} </option>`).attr('value', _.escape(room)));
};

app.populateRooms = () => {
  var uniqueRoomNames = {};
  if (app.messages !== null) {

    //clear options
    var node = Array.prototype.slice.call($('#roomSelect').children()).shift();
    $('#roomSelect').children().remove();
    $('#roomSelect').append(node);

    for (var i = 0; i < app.messages.length; i++) {
      if (!uniqueRoomNames.hasOwnProperty(app.messages[i].roomname)) {
        uniqueRoomNames[app.messages[i].roomname] = app.messages[i].roomname;
      }
    }

    for (key in uniqueRoomNames) {
      app.renderRoom(key);
    }
  }
};

app.handleUsernameClick = (e) => {
  var username = (e.currentTarget.innerText).split(':').splice(0, 1).join("");

  if (app.friends.indexOf(username) === -1) {
    app.friends.push(username);

    $("#chats").find(".username").each((index, item) => {
      if (item.innerText.slice(0, -1) === username) {
        $(item).addClass("friends");
      }
    });
  }
};

app.handleSubmit = (e) => {
  e.preventDefault();

  var message = $('#message').val();
  var roomname = $('#roomSelect').val();
  var username = window.location.search.split('=').pop();

  if (roomname !== '') {

    var toSend = {
      roomname: _.escape(roomname),
      text: _.escape(message),
      username: _.escape(username)
    };

    app.send(toSend);

    $('#message').val('');
  }

};

app.toggleSpinner = () => {
  $('#spinner').toggle();
};


$(document).ready(() => {

  $('#roomSelect').on('change', (e) => {
    var roomname = e.currentTarget.value;

    if (roomname === '') {
      app.clearMessages();
    } else {
      app.clearMessages();

      //for (var i = app.messages.length -1; i >= 0; i--) {
      for (var i = 0; i < app.messages.length; i++) {
        if (roomname === app.messages[i].roomname) {
          app.renderMessage(app.messages[i]);
        }
      }
    }
  });


  $('#chats').on('click', '.username', (e) => {
    app.handleUsernameClick(e);
  });

  $('#send').on('submit', (e) => {
    app.handleSubmit(e);
  });

  $('#createNewRoomBtn').on('click', (e) => {
    e.preventDefault();

    var newRoomName = prompt(`Please enter a new room name to create.`);
    var username = window.location.search.split('=').pop();

    if (newRoomName !== null) {
      var toSend = {
        roomname: _.escape(newRoomName),
        username: _.escape(username),
        text: _.escape('init message')
      };

      app.send(toSend);
    }
  });

});

app.fetch();