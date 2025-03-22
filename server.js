const io = require('socket.io')(3000, {
    cors: {
      origin: "http://localhost:5173", // Mets l'URL de ton frontend
      methods: ["GET", "POST"]
    }
  });
  
  io.on('connection', (socket) => {
    console.log('Nouvel utilisateur connecté');
  
    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`Utilisateur rejoint ${room}`);
    });
  
    socket.on('message', ({ room, text, username }) => {
      io.to(room).emit('message', { username, text });
    });
  
    socket.on('disconnect', () => {
      console.log('Utilisateur déconnecté');
    });
  });

