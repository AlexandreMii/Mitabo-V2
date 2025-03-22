export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentRoom, setCurrentRoom] = useState('General');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  useEffect(() => {
    socket.emit('joinRoom', currentRoom);

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, [currentRoom]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('message', { room: currentRoom, text: input, username });
      setInput('');
    }
  };

  const switchRoom = (room) => {
    setCurrentRoom(room);
    setMessages([]);
  };

  return (
    <div className="chat-container">
      {isUsernameSet ? (
        <>
          <div className="sidebar">
            <h2>Salons</h2>
            <ul>
              <li onClick={() => switchRoom('General')}>Général</li>
              <li onClick={() => switchRoom('Gaming')}>Gaming</li>
              <li onClick={() => switchRoom('Vocal')}>Vocal</li>
            </ul>
          </div>
          <div className="chat-main">
            <div className="chat-header">{currentRoom}</div>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className="message">
                  <strong>{msg.username}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tape ton message..."
              />
              <button onClick={sendMessage}>Envoyer</button>
            </div>
          </div>
        </>
      ) : (
        <div className="username-container">
          <h2>Choisis un pseudo</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ton pseudo..."
          />
          <button onClick={() => setIsUsernameSet(true)}>Valider</button>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Connexion au serveur Socket.io
const socket = io('http://localhost:3000');

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentRoom, setCurrentRoom] = useState('General');

  // Effet pour rejoindre la room et écouter les messages entrants
  useEffect(() => {
    socket.emit('joinRoom', currentRoom);

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup : on retire l'écouteur lorsqu'on quitte la room
    return () => {
      socket.off('message');
    };
  }, [currentRoom]);

  // Fonction pour envoyer un message
  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('message', { room: currentRoom, text: input });
      setInput('');
    }
  };

  // Fonction pour changer de room
  const switchRoom = (room) => {
    setCurrentRoom(room);
    setMessages([]); // Vider les messages quand on change de room
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar des salons */}
      <div className="w-1/4 bg-gray-800 p-4">
        <h2 className="text-xl font-bold mb-4">Salons</h2>
        <ul>
          <li
            onClick={() => switchRoom('General')}
            className="mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded"
          >
            Général
          </li>
          <li
            onClick={() => switchRoom('Gaming')}
            className="mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded"
          >
            Gaming
          </li>
          <li
            onClick={() => switchRoom('Vocal')}
            className="mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded"
          >
            Vocal
          </li>
        </ul>
      </div>

      {/* Chat principal */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto p-4 bg-gray-800">
          <h2 className="text-2xl font-bold mb-4">{currentRoom}</h2>
          {/* Affichage des messages */}
          {messages.map((msg, index) => (
            <div key={index} className="mb-2 p-2 bg-gray-700 rounded-md">
              <strong className="text-blue-400">{msg.username}</strong>: {msg.text}
            </div>
          ))}
        </div>

        {/* Zone d'envoi de message */}
        <div className="flex p-4 bg-gray-700">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 rounded-l-lg bg-gray-600 text-white"
            placeholder="Tape ton message..."
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 rounded-r-lg hover:bg-blue-600"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
