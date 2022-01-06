require("dotenv").config({ path: "variables.env" });

const db_name = process.env.db_name || 'Default';
const port = process.env.PORT || 5000;
const URI = process.env.URI;

module.exports = {
    URI,
    port,
    db_name
};