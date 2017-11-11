const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const session = require('express-session');
const debugIo = require('debug')('io');
const users = require('../data/users');

const PORT = 8080;
const SESSION_MAX_AGE = 60000 * 60 * 4; // 4 hours

const relations = [];

function createRelation(relation) {
  const item = getRelationByUsername(relation.username);
  if (item) {
    item.socket = relation.socket;
    item.to = relation.to;
  } else {
    relations.push(relation);
  }
}

function updateRelationByUsername(username, updates) {
  _.forEach(relations, (relation, index) => {
    if (relation.username === username) {
      relations[index] = { ...relation, ...updates };
    }
  });
}

function getRelationByUsername(username) {
  return _.find(relations, relation => relation.username === username);
}

function getRelationBySocket(socket) {
  return _.find(relations, relation => relation.socket === socket);
}

function deleteRelationByUsername(username) {
  const index = _.findIndex(relations, relation => relation.username === username);
  if (index > -1) {
    relations.splice(index, 1);
  }
}

function deleteRelationBySocket(socket) {
  const index = _.findIndex(relations, relation => relation.socket === socket);
  if (index > -1) {
    relations.splice(index, 1);
  }
}

app.use(session({
  secret: 'oh haha',
  name: 'sid',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: SESSION_MAX_AGE,
  },
}));
app.use(bodyParser.json());

app.post('/api/account/login', (req, res) => {
  const { username, password } = req.body;
  const user = _.find(users, user => {
    return user.username === username;
  });
  if (user && user.password === password) {
    res.cookie('username', user.username, {
      maxAge: SESSION_MAX_AGE,
    });
    res.send();
  } else {
    res.status(400).send({
      message: 'Username or password is wrong',
    });
  }
});

app.post('/api/account/logout', (req, res) => {
  const { username } = req.body;
  if (req.session) {
    req.session.destroy((err) => {
      res.cookie('username', '', {
        maxAge: -1,
      });
      res.cookie('sid', '', {
        maxAge: -1,
      });
      res.end();
    });
  }
});

io.on('connection', (socket) => {
  const { username } = socket.handshake.query;

  createRelation({ username, socket });

  socket.emit('connected', 'hello');

  socket.on('create_relation', (data) => {
    const receiverRelation = getRelationByUsername(data.username);

    if (receiverRelation) {
      const relation = getRelationBySocket(socket);

      relation.to = receiverRelation.username;
      receiverRelation.to = relation.username;

      socket.emit('created_relation', {
        success: true,
        to: receiverRelation.username,
      });

      receiverRelation.socket.emit('created_relation', {
        success: true,
        to: relation.username,
      });
    } else {
      socket.emit('created_relation', { success: false, message: '对方不在线' });
    }
  });

  socket.on('delete_relation', () => {
    const relation = getRelationBySocket(socket);
    if (relation.to) {
      const receiverRelation = getRelationByUsername(relation.to);
      relation.to = undefined;

      if (receiverRelation) {
        receiverRelation.to = undefined;
        receiverRelation.socket.emit('deleted_relation');
      }
    }
  });

  socket.on('disconnect', () => {
    const relation = getRelationBySocket(socket);
    if (relation && relation.to) {
      const receiverRelation = getRelationByUsername(relation.to);
      relation.to = undefined;

      if (receiverRelation) {
        receiverRelation.to = undefined;
        receiverRelation.socket.emit('deleted_relation');
      }
    }
  });

  socket.on('command', (data) => {
    const relation = getRelationBySocket(socket);
    const receiverRelation = getRelationByUsername(relation.to);

    if (receiverRelation) {
      receiverRelation.socket.emit('command', data);
    }
  });
});

server.listen(PORT, () => {
  console.log('Listening on 127.0.0.1:%s', PORT);
});
