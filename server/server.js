const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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
  'http://localhost:5173', // Development URL
  process.env.CLIENT_URL,  // Production URL injected by Render
].filter(Boolean); // Filter out any falsy values (e.g., if CLIENT_URL is not set)

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

// Health check route for Render to verify service is up
app.get('/api/health', (req, res) => {
  // You could add more complex checks here, like DB connection status
  res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

// Serve static files from outputs/forms directory if it exists
const formsOutputPath = path.join(__dirname, 'outputs/forms');
if (fs.existsSync(formsOutputPath)) {
  app.use('/outputs/forms', express.static(formsOutputPath));
} else {
  console.log('outputs/forms directory does not exist, skipping static file serving');
}
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
