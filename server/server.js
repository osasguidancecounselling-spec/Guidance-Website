const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");
const connectDB = require('./config/db');
const routes = require('./routes');
const config = require('./config/config');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

connectDB();

const app = express();
const server = http.createServer(app);

// Define allowed origins for CORS. This should be managed via environment variables.
const allowedOrigins = [
  process.env.CLIENT_DEV_URL || 'http://localhost:5173',
  process.env.CLIENT_PROD_URL // e.g., https://your-app-name.onrender.com
];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests) or from whitelisted domains
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"]
  }
});

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/outputs/forms', express.static(path.join(__dirname, 'outputs/forms')));
app.use('/api', routes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on('sendMessage', async ({ conversationId, senderId, text }) => {
    try {
      const message = new Message({
        conversation: conversationId,
        sender: senderId,
        text,
      });
      await message.save();

      const populatedMessage = await Message.findById(message._id).populate('sender', 'name role');

      io.to(conversationId).emit('receiveMessage', populatedMessage);

      await Conversation.findByIdAndUpdate(conversationId, { lastMessage: populatedMessage._id });

    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('messageError', { message: 'Could not send message.' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
