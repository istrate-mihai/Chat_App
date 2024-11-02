const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const http       = require('http').Server(app);
const io         = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const messageList = [
  {name: 'Tim', message: 'Hi',},
  {name: 'Jane', message: 'Hello',},
];

app.get('/messages', (req, res) => {
  res.send(messageList);
});

app.post('/messages', (req, res) => {
  messageList.push(req.body);
  io.emit('message', req.body);
  res.sendStatus(200);
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

const server = http.listen(3000, () => {
  console.log('Server listening on port: ' + server.address().port);
});
