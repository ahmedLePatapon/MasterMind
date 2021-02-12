const mongoose = require('mongoose');
const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const socketCtrl = require('./controllers/socketio');
const { URI, db_name, port } = require("./config");

socketCtrl.connection(io);

mongoose.Promise = Promise;
console.log('URI', typeof URI);
mongoose
  .connect(URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('Connection to mongodb Atlas in db : ' + db_name))
  .catch(err => console.log(new Error(`Connection problem to mongodb : ${err}`)));

http.listen(port, function() {
  console.log(`Server start at http://localhost:${port}`);
});
