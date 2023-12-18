import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'

const apiUrl = 'http://localhost:4040'
const socket = io(`${apiUrl}`)

const Messenger = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const joinedRef = useRef(false)

  const currentUserId = currentUser?._id
  const selectedUserId = selectedUser?._id

  const getUsers = async () => {
    try {
      const localUserInfo = localStorage.getItem('userInfo')
      const parsedLocalUserInfo = localUserInfo
        ? JSON.parse(localUserInfo)
        : null
      setCurrentUser(parsedLocalUserInfo?.user)

      const response = await fetch(`${apiUrl}/api/v1/users/get`)
      const userList = await response.json()
      const updatedUsers = userList.filter(
        (user) => user?._id !== parsedLocalUserInfo?.user?._id
      )
      setUsers(updatedUsers)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    getUsers()
    // Clean up the socket connection when the component unmounts
    return () => {
      //socket.emit('disconnect');
      // socket.off() // Turn off all event listeners
    }
  }, [])

  useEffect(() => {
    if (!selectedUserId) {
      socket.emit('leave', currentUserId)
    } else {
      socket.emit('join', currentUserId, (data) => {
        setMessages(data)
        console.log({ data })
      })
    }

    if (joinedRef.current) return
    socket.on('message', handleIncomingMessage)
    joinedRef.current = true
  }, [currentUserId, selectedUserId])

  const handleIncomingMessage = (message) => {
    console.log('message', message)
    setMessages((prevMessages) => [...prevMessages, message])
  }

  const sendMessage = () => {
    if (newMessage.trim() !== '' && selectedUserId) {
      const message = {
        sender: currentUserId,
        receiver: selectedUserId,
        text: newMessage,
      }

      socket.emit('message', message)
      setMessages((prevMessages) => [...prevMessages, message])
      setNewMessage('')
    }
  }

  const handleUserClick = (user) => {
    setSelectedUser(user)
    console.log('selectedUserId', selectedUserId)
    setMessages([]) // Clear messages when changing the selected user
  }

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
  )
}

export default Messenger
