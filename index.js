require('dotenv/config')
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const mongodb=require('mongodb').MongoClient
const url = "mongodb://159.223.169.216:27017/"

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('./routes'));


app.listen(process.env.PORT || 3333, (req, res) => {
  console.log('servidor funcionando node online');
});