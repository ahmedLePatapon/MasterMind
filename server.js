const Express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = Express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const rand = require('./choixAleatoire');
const uuidv1 = require('uuid/v1');
const cool = require('cool-ascii-faces');

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



// views is directory for all template files

app.set('view engine', 'ejs');


app.get('/cool', function(request, response) {
  response.send(cool());
});





app.get('/', function(req,res) {
  res.render('accueil');
});

app.get('/accueil',function(req,res){
  res.redirect('/');
});

app.get('/inscription', function(req, res) {
  res.render('inscription');
});

app.get('/connexion', function(req,res) {
  res.render('connexion');
});
app.get('/deconnexion', function(req,res) {
  req.session.connected = false;
  res.render('connexion')
})

app.post('/connexion', function(req,res) {
  myDb.collection('users').findOne({pseudo: req.body.pseudo, password : req.body.password} || req.session.connected, function(err,data) {
    if(err || !data) {
      req.session.connected = false;
      console.log('pas bon!');
      var msg = 'Pseudo inéxistant ou mot de passe incorrect. Merci de reéssayer ou bien de vous inscrire pour pouvoir jouer.'
      res.render('connexion', {msg:msg});
    } else{
      req.session.connected = true;
      console.log(data);
      var pseudo = data.pseudo || '';
      var password = data.password || '';
      var avatar = data.avatar;
      var bjr = 'Bonjour ' + data.pseudo;
      res.render('jeu', {
        pseudo: req.body.pseudo,
        password: req.body.password,
        connected: req.session.connected

      })
    }
  });
});
app.post('/inscription', function(req, res) {
  myDb.collection('users').findOne({email : req.body.email, pseudo: req.body.pseudo}, function(err,data) {
    if (data) {
      console.log(data);
      var habon ='pseudo ou mail deja existant';
      res.render('inscription', {habon:habon});
    } else {
      myDb.collection('users').insertOne({
        // nom: req.body.nom,
        // prenom: req.body.prenom,
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: req.body.password,
        status: 1,
        date: new Date()
      }, function(err, result){
        var rand = Math.round(Math.random() * 9);
        req.session.email = req.body.email;
        req.session.avatar = 'avatar'+ rand+'';
        console.log(req.session.avatar);
        req.session.connected = true;
        if(!err && result.insertedCount === 1){
          var title = 'connecté';
          var msg = 'Vous êtes inscrit et connecté';
        }else{
          var title = 'inscription';
          var msg = 'L\'inscription n\'a pas pu se faire';
        };
        res.render('jeu', {
          pseudo: req.body.pseudo,
          password: req.body.password,
          connected: req.session.connected,
          avatar: req.session.avatar
        })
        console.log(password);
      });
    };
  });
});

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
      if (io.sockets.adapter.rooms[room[i]] === 'undifined') {


      }else {

        var verifRoomDisponible = io.sockets.adapter.rooms[room[i]].length;
      }
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
