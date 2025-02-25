require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { authenticateSocket, authenticateToken, authorizeAdmin } = require('./middleware/authMiddleware');
const Message = require('./models/Message');
const messageRoutes = require('./routes/messageRoutes');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

// Middleware
app.use(express.json());
app.use(cors());

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/admin',authenticateToken , authorizeAdmin , (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api', messageRoutes);

// Socket.io setup
io.use(authenticateSocket);
io.on('connection', (socket) => {
  console.log('New user connected:', socket.user.username);

  Message.find().sort({ timestamp: 1 }).then((messages) => {
    socket.emit('previousMessages', messages);
});

socket.on('sendMessage', async (messageData) => {
  
    try {
        if (!messageData.sender || !messageData.content) {
            console.error("Invalid message data");
            return;
        }

        const newMessage = new Message({
            sender: messageData.sender,
            content: messageData.content,
            timestamp: new Date(),
        });

        await newMessage.save();
        io.emit('receiveMessage', newMessage);
        console.log("Message saved:", newMessage);
    } catch (error) {
        console.error("Error saving message:", error);
    }
});


  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));