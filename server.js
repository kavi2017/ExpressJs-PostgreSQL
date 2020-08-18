const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Client } = require('pg');
const connectionString = 'postgres://postgres:sanmina@localhost:5432/sanmina';
const client = new Client({
    connectionString: connectionString
});
client.connect();

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//database
const db = require("./app/models");
db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
  client.query('SELECT * FROM users', function (err, result) {
    if (err) {
        console.log(err);
        res.status(400).send(err);
    }
   // res.status(200).send(result.rows);
   let test = result.rows;
   console.log(result.rows);
    res.json({ message: `Welcome to Sanmina application.${test}` });
});

  //res.json({ message: "Welcome to Sanmina application." });
});
// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});