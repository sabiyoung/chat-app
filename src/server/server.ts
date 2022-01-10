import express from "express";
import cors from "cors";
import path from 'path';
import { Server } from "socket.io";
import { createServer } from "http";
import mongoose from "mongoose";
import { ChatModel } from "./schemas/chat.schama.js";
import bodyParser from "body-parser";
import { UserModel } from "./schemas/user.schema.js";

const __dirname = path.resolve();
console.log(__dirname);
const port = 3000;

const app = express();
const server = createServer(app);
mongoose
  .connect("mongodb://localhost:27017/chatApp")
  .then(() => {
    console.log("Connected to DB Successfully");
  })
  .catch((err) => console.log("Failed to Connect to DB", err));
app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200', 'http://localhost:3000', 'http://localhost:8080']
}));
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', function(req, res) {
  res.json({test: 'test'})
});

app.get('/users', function(req, res) {
  res.sendFile(path.join(__dirname, 'users.json'));
});

let io = new Server(server, {
  cors: {
    origin: ['http://localhost:4200']
  }
})

app.post("/create-chat", function (req, res) {
  const { sender,to, text } = req.body;
  const chat = new ChatModel({
sender,
to,
text,
  });
chat
    .save()
    .then((data) => {
      res.json({ data });
    })

    .catch((err) => {
      console.log(err);
      res.status(501);
      res.json({ errors: err });
    });
});
app.post("/create-user", function (req, res) {
  const { name, email, username, password } = req.body;
      const user = new UserModel({
        name,
        username,
        email,
        password,
      });
      user
      .save()
      .then((data) => {
        res.json({ data });
      })
  
      .catch((err) => {
        console.log(err);
        res.status(501);
        res.json({ errors: err });
      });
  });


app.get("/users", function (req, res) {
UserModel.find()
    .then((data) => res.json({ data }))
    .catch((err) => {
      res.status(501);
      res.json({ errors: err });
    });
});
app.get("/chats", function (req, res) {
  UserModel.find()
      .then((data) => res.json({ data }))
      .catch((err) => {
        res.status(501);
        res.json({ errors: err });
      });
  });
  
io.on('connection', socket => {
  console.log('a user connected');
socket.on('join', function(data) {
  socket.join(data.room);
  io.emit('new user joined', {user:data.user, message:'joined.'})
})
socket.on('leave', function(data) {
  io.emit('left room', {user:data.user, message:'left room.'});
  socket.leave(data.room)
})
  socket.on('message', function(data) {
    io.in(data.room).emit('new message', {user:data.user, message:data.message})
}); 

// //socket.broadcast.emit()//
// socket.broadcast.emit("message", "A user has joined the chat")
//   socket.on('disconnect', () => {
//     console.log('user disconnected')
//   })
});


server.listen(port, function() {
  console.log(`running on http://localhost:${port}`)
}) 


