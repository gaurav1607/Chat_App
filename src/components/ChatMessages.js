import React, { useEffect, useRef } from 'react';
import { Grid, Avatar, Typography } from '@mui/material';
import { useAuthContext } from '../Context/AuthContext';

const getTimeStampDisplay = (timestamp) => {
  const messageDate = new Date(timestamp);
  const currentDate = new Date();
  const isSameDay = messageDate.toDateString() === currentDate.toDateString();
  
  if (isSameDay) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return messageDate.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
  }
};



export const ChatMessages = ({ messages }) => {
  const { user } = useAuthContext();

  const messagesEndRef = useRef(null);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};

useEffect(() => {
  scrollToBottom();
}, [messages]);


  return (
    <div
      style={{
        overflowY: 'auto',
        height: '70vh',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column-reverse',
        margin: '0 20px',
      }}
    >
      <div ref={messagesEndRef} />
      { (messages )&& messages.slice().reverse().map((message, index) => (
        <Grid
          key={index}
          container
          direction={message.sender?.name === 'sender' ? 'row-reverse' : 'row'}
          alignItems="center"
          justify="flex-start"
          style={{
            width: 'fit-content',
            borderRadius: '10px',
            padding: '8px',
            marginBottom: '8px',
            backgroundColor: message.sender._id === user.id ? '#DCF8C6' : '#E0E0E0',
            alignSelf: message.sender._id === user.id ? 'flex-end' : 'flex-start',
          }}
        >
          <Avatar
            sx={{
              width: 24,
              height: 24,
              margin: message.sender === 'sender' ? '0 0 0 10px' : '0 10px 0 0',
            }}
          />
          <div style={{ marginLeft: message.sender === 'sender' ? '10px' : '0' }}>
            <Typography variant="body1">{message.content}</Typography>
            <Typography variant="caption" color="textSecondary">
              {getTimeStampDisplay(message.createdAt)}
            </Typography>
          </div>
        </Grid>
      ))}
      
    </div>
  );
};
