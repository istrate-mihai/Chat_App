const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const http       = require('http').Server(app);
const io         = require('socket.io')(http);
const mongoose   = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

const dbUrl = "mongodb+srv://mihai:1234@cluster0.ag6ww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const Message = mongoose.model('Message', {
  name: String,
  message: String,
});

mongoose.connect(dbUrl).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Route to get all messages
app.get('/messages', async (req, res) => {
  try {
      const messages = await Message.find();
      res.status(200).json(messages);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching messages', error });
  }
});

app.post('/messages', async (req, res) => {
  try {
    const message = await new Message(req.body);
    message.save();
    io.emit('message', req.body);
    res.status(200);
  }
  catch (err) {
    res.status(500);
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

const server = http.listen(3000, () => {
  console.log('Server listening on port: ' + server.address().port);
});
