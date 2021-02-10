const mongoose = require('mongoose');
const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const socketCtrl = require('./controllers/socketio');
const { db_user, db_pwd, db_name, port } = require("./config");

// const serveur = http.Server(app);

var room = [];
var jeu = {};
var joueurs = {};

// let Myio = io(serveur);
socketCtrl.connection(io);
// Myio.on('connection', socketCtrl.connection);

mongoose.Promise = Promise;
mongoose
  .connect(`mongodb+srv://${db_user}:${db_pwd}@mastermind.tjryu.mongodb.net/${db_name}?retryWrites=true&w=majority`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('Connection to mongodb Atlas in db : ' + db_name))
  .catch(err => console.log(new Error(`Connection problem to mongodb : ${err}`)));

http.listen(port, function(socket) {
  console.log(`Server start at http://localhost:${port}`);
});
