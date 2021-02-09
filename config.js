require("dotenv").config({ path: "variables.env" });

const db_user = process.env.db_user;
const db_pwd = process.env.db_pwd;
const db_name = process.env.db_name;
const port = process.env.PORT || 5000;

module.exports = {
    db_user,
    db_pwd,
    db_name,
    port
};