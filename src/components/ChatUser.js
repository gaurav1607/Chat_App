import React from 'react'
import { Avatar, Card, Typography } from "@mui/material";
import { useChatContext } from '../Context/ChatContext';
import { useAuthContext } from '../Context/AuthContext';


export const ChatUser = ({ user, mediaQuery}) => {
  const {dispatch, selectedChat} = useChatContext()
  const {user: admin} = useAuthContext()


  return (
    <Card
    onClick={()=>{dispatch({type:"SELECT_CHAT_USER", payload : user})}}
    key={user._id}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 1,
        padding: "7px",
        backgroundColor: selectedChat ? selectedChat._id === user._id ? "#4197f5" : "" : ""
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar sx={{ marginRight: 1 }}  src={user.isGroupChat ? "" : user.users[0]?._id === admin._id ? user.users[1]?.pic : user.users[1]?.pic  }  />
        <div>
          <Typography sx={{fontSize:"1.1rem", fontWeight:"500"}} >
            {
              user.isGroupChat ? user.chatName : user.users[0]?._id != admin.id ? user.users[0]?.name : user.users[1]?.name
            }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.latestMessage?.content}
          </Typography>
        </div>
      </div>
      {/* <Typography variant="body2" color="text.secondary">
        Last seen: 2 Am
      </Typography> */}
    </Card>
  )
}

