
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.encryptPassword = password => bcrypt.hashSync(password, saltRounds);
exports.checkPassword = (password, hash) => bcrypt.compareSync(password, hash);