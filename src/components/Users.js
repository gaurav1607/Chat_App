import { Avatar, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { useAuthContext } from "../Context/AuthContext";
import { useChatContext } from "../Context/ChatContext";


const Users = ({userInfo}) => {
  const {user} = useAuthContext()
  const {dispatch,selectedChat, drawer} = useChatContext()
  console.log(userInfo);

  const handleSelectChat = async (info)=>{

    const response = await fetch("https://social-network-backend-fn7k.onrender.com/api/chat",{
      method: "POST",
      headers:{
        "Content-Type": "application/json",
        Authorization: "Bearer "+user.token,
      },
      body: JSON.stringify({userId : info._id})
    })
    const data = await  response.json()
    
      dispatch({type:"SELECT_CHAT_USER", payload : data})
      dispatch({type:'DRAWER', payload:false})
  }

  return (
    <Card
      onClick={()=>{handleSelectChat(userInfo)}}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 1,
        padding: "7px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar sx={{ marginRight: 2 }} src={ userInfo.pic ? userInfo.pic : ""}  />
        <div>
          <Typography variant="h6">{userInfo?.name }</Typography>
          <Typography variant="body2" color="text.secondary">
            email : {userInfo?.email}
          </Typography>
        </div>
      </div>
      {/* <Typography variant="body2" color="text.secondary">
        Last seen: 2 Am
      </Typography> */}
    </Card>
  );
};

export default Users;
