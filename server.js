const Express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = Express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const rand = require('./choixAleatoire');
const baseRouter = require('./routes');
const uuidv1 = require('uuid/v1');

app.use('/src_static', Express.static(__dirname + '/src' ));

var URL = 'mongodb://admin:admin@ds111066.mlab.com:11066/mastermind';
var myDb;

app.use(session({
    secret:'123456789SECRET',
    saveUninitialized : false,
    resave: false
}));

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/', baseRouter);

var room = [];
var jeu = {};
var joueurs = {};

io.on('connection', function(socket) {
  if(room.length === 0) {
    let newRoom = 'room' + room.length;
    room.push(newRoom);
    socket.join(newRoom);
    jeu[newRoom] = {};
    jeu[newRoom][socket.id] = {};
    joueurs[socket.id] = newRoom;
    jeu[joueurs[socket.id]]['joueur1'] = socket.id;
    socket.emit('attente', true);
    socket.on('disconnect', function() {
      socket.leave(newRoom);
    });
  } else {
    for (var i = 0; i < room.length; i++) {
      var verifRoomDisponible = io.sockets.adapter.rooms[room[i]].length;
      if(verifRoomDisponible === 2) {
        let newRoom = 'room' + room.length;
        room.push(newRoom);
        socket.join(newRoom);
        joueurs[socket.id] = newRoom;
        jeu[newRoom] = {};
        jeu[newRoom][socket.id] = {};
        jeu[newRoom]['joueur1'] = socket.id;
        socket.on('disconnect', function() {
          socket.leave(newRoom);
        });
        break;
      } else {
        socket.join(room[i]);
        jeu[room[i]][socket.id] = {};
        jeu[room[i]].couleurRandom = rand.rand();
        joueurs[socket.id] = room[i];
        jeu[room[i]]['joueur2'] = socket.id;
        socket.emit('attente', false);
        socket.on('disconnect', function() {
          socket.leave(room[i]);
        });
        break;
      }
    }
  }
console.log(jeu[joueurs[socket.id]].couleurRandom);
// console.log(joueurs[socket.id]);
// console.log(jeu[joueurs[socket.id]]['joueur2']);

var nbrCoupAdverse = 0;
var coup = 0;
socket.on('coup',function(data) {
  console.log('coup ' + data);
  coup = data;
});
socket.on('coupAdverse',function(data) {
  console.log('coupadverse ' +data);
  nbrCoupAdverse = data;
});

  //***************** Comparaison des tableaux *************//
  socket.on('verif', function(verif) {
    verif = verif;
    function compareArray(a1, a2) {
      var combienYaDeBoulesBonnesLorsDeLaComparaison = 0;
      var hintNoir = 0;
      if (a1.length != a2.length) {
        return false;
      } else {
        for (var i = 0; i < a1.length; ++i) {
          if (a1.includes(a2[i]) && a1[i] === a2[i]) {
            hintNoir++;
            socket.emit('noir', combienYaDeBoulesBonnesLorsDeLaComparaison);
            combienYaDeBoulesBonnesLorsDeLaComparaison++;
          }else if(a1.includes(a2[i])){
            socket.emit('gris', combienYaDeBoulesBonnesLorsDeLaComparaison);
            combienYaDeBoulesBonnesLorsDeLaComparaison++;
          }
        }
      }
      if (hintNoir === 4) {
        socket.emit('victoire', true);
      }else {
        socket.emit('essaiEncore', true);
      }
      return true;
    }
    compareArray(jeu[joueurs[socket.id]].couleurRandom, verif)
  })
  //***************** fin Comparaison des tableaux *************//


  socket.on('choixAdverse', function(data) {
    socket.broadcast.to(joueurs[socket.id]).emit('reChoixAdverse', data)
  })
  socket.on('finChoix', function(data) {
    socket.broadcast.to(joueurs[socket.id]).emit('reFinChoix', data)
  })
});

MongoClient.connect(URL, function(err, db) {
  if (err) {
    console.log('error');
  }
  myDb = db;
  http.listen(8888, function(socket) {
    console.log('ecoute sur le port 8888');
  });
});
