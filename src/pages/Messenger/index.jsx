import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const apiUrl = "http://localhost:4040";
const socket = io(`${apiUrl}`);
socket.connect();
console.log(socket.on("connect",()=>{
  console.log("connect io")
}))
 
const Messenger = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  let currentUserId = currentUser?._id;
  let selectedUserId = selectedUser?._id;

  // Getting users from the database
  const getUsers = async () => {
    try {
      let local_userInfo = localStorage.getItem('userInfo');
      let parsedLocal_userInfo = local_userInfo ? JSON.parse(local_userInfo) : null;
      setCurrentUser(parsedLocal_userInfo?.user);

      let resp = await fetch(`${apiUrl}/api/v1/users/get`);
      resp = await resp.json();
      const updatedUsers = await resp.filter(user => user?._id !== parsedLocal_userInfo?.user?._id);
      setUsers(updatedUsers);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getUsers();

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedUser?._id) {
      // Join a room based on the sender and receiver
      socket.emit('join', { sender: currentUserId, receiver: selectedUserId });
    }

    socket.on('message', (message) => {
      setMessages([...messages, message]);
    });

    // Clean up when the user selection changes or component unmounts
    return () => {
      socket.emit('leave', { sender: currentUserId, receiver: selectedUserId });
    };
  }, [messages, selectedUser, currentUser]);

  const sendMessage = () => {
    if (newMessage.trim() !== '' && selectedUserId) { 
      console.log("newMessage",newMessage)
      // Send a message to the specific room
      socket.emit('message', { sender: currentUserId, receiver: selectedUserId, text: newMessage });
      setNewMessage('');
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user); 
    console.log("selectedUser",selectedUserId)
    setMessages([]); // Clear messages when changing the selected user
  };

  return (
    <div>
      <div>
        <div>
          <h2>Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user?._id} onClick={() => handleUserClick(user)}>
                {`${user?.firstName} ${user?.lastName}`}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Chat with {selectedUser?.firstName}</h2>
          {messages.map((message, index) => (
            <div key={index}>{`${message.sender}: ${message.text}`}</div>
          ))}
          <div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger; 
