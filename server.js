const express = require('express');
const socket = require("./socket/config");
const app = express();
const Port = 3001;

app.use(express.static('public'))

const server = app.listen(Port);

socket(server);

