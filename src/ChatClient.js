import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styles from './Chat.module.css'; // Assuming you've set up CSS Modules

const socket = io.connect(process.env.REACT_APP_SERVER_URL);

function Chat() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Load the username from localStorage when the component mounts
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    socket.on('message', (msg) => {
      setChat([...chat, msg]);
    });
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    const messageData = {
      username: username,
      message: message,
    };
    socket.emit('sendMessage', messageData);
    setMessage('');
  };

  // Update localStorage whenever the username changes
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    localStorage.setItem('username', newUsername);
  };

  return (
    <div className={styles.chatContainer}>
      <input
        type="text"
        className={styles.input}
        value={username}
        onChange={handleUsernameChange}
        placeholder="Enter your name"
      />
      <form onSubmit={sendMessage} className={styles.form}>
        <input
          type="text"
          className={styles.input}
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit" className={styles.button}>Send</button>
      </form>
      <ul className={styles.messageList}>
        {chat.map((msg, index) => (
          <li key={index} className={styles.messageItem}>
            <strong>{msg.username}: </strong>{msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Chat;