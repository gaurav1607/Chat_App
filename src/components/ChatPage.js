import React, { useEffect, useRef, useState } from "react";
import { Card } from "@mui/material";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import { Avatar } from "@mui/material";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChatMessages } from "./ChatMessages";
import { useChatContext } from "../Context/ChatContext";
import { useAuthContext } from "../Context/AuthContext";
import { io } from "socket.io-client";
import { EmojiPickerDialog } from "../DialogBox/EmojiPickerDialog";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json"

const ENDPOINT = "https://social-network-backend-fn7k.onrender.com/";
var socket, selectedChatCompare;

export const ChatPage = () => {
  const inputRef = useRef(null);
  const { selectedChat,notifications, chat: messages, emoji, dispatch } = useChatContext();
  const { user } = useAuthContext();
  const [text, setText] = useState("");
  const [flag, setFlag] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [socketConnection, setSocketConnection] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  function onClick(emojiData, event) {
    setText((prev) => prev + emojiData.emoji);
  }

  useEffect(() => {
    fetchChats();
    selectedChatCompare = selectedChat;
    setText("");
  }, [flag, selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("Connected", () => setSocketConnection(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    fetchNotification()
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // get notification heare

        fetchNotification();
        setFlag(!flag)
      } else {
        fetchChats();
        dispatch((prev) => ({
          type: "FETCH_CHAT",
          payload: [...prev.messages, newMessageRecieved],
        }));
      }
    });
  });

  const fetchNotification = async ()=>{
    const data = await fetch("https://social-network-backend-fn7k.onrender.com/api/notification/"+ user.id,{
      headers: {
        Authorization: "Bearer " + user.token,
      },
    })
    const notif = await data.json()
    // dispatch({type:"SET_NOTIFICATION", payload: [  ...notifications,newMessageRecieved]})
    if(notif){

      dispatch({type:"SET_NOTIFICATION", payload: notif})
    }
  }


  const fetchChats = async () => {
    if (!selectedChat) return;
    const response = await fetch(
      "https://social-network-backend-fn7k.onrender.com/api/message/" + selectedChat._id,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.token,
        },
        // body: JSON.stringify({ chatId: selectedChat?._id, content: mess }),
      }
    );
    const data = await response.json();
    socket.emit("join chat", selectedChat._id);
    dispatch({ type: "FETCH_CHAT", payload: data });
  };

  const sendChatMessage = async () => {
    socket.emit("stop typing", selectedChat._id);
    if(text === "") return ;

    const response = await fetch("https://social-network-backend-fn7k.onrender.com/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({ chatId: selectedChat?._id, content: text }),
    });
    const data = await response.json();

    // sending notification
    if(selectedChat._id !== user.id) {
      const notData = await fetch("https://social-network-backend-fn7k.onrender.com/api/notification",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
        body: JSON.stringify({chatId:data.chat._id,messageId:data._id, senderId: user.id})
      })
      const note = await notData.json()
    }
    setText("");
    setFlag(!flag);
    setShowEmojiPicker(false);
    socket.emit("new message", data);
  };

  const typingHandler = (e) => {
    setText(e.target.value);
    if (!socketConnection) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timeLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timeLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timeLength);
  };

  return selectedChat  && !selectedChat.error ? (
    <Card sx={{  width:"100%", paddingBottom:"0", height:"100%"  }}>
      <Box sx={{}} >
      <Card
      border="2px solid cyan"
        sx={{
          display: "flex",
          minWidth:"100%",  // what to do with this
          alignItems: "center",
          justifyContent: "space-between",
          padding: "5px 20px",
          // zIndex:20
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ marginRight: 2 }} src={selectedChat.isGroupChat ? "" : selectedChat.users[0]._id === user._id ? selectedChat.users[1].pic : selectedChat.users[1].pic } />
          <div>
            <Typography variant="h6">
              { selectedChat.isGroupChat
                ? selectedChat.chatName
                : selectedChat?.users[1]?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" visibility={"hidden"}>
              2 Am
            </Typography>
          </div>
        </div>
        <IconButton
          onClick={() => {
            dispatch({ type: "SELECT_CHAT", payload: null });
          }}
        >
          <CloseIcon />
        </IconButton>
      </Card>
      </Box>

      <Box sx={{height:"70vh" , overflow:"hidden"}}>
        {messages && messages.error ? <></> : <ChatMessages messages={messages} /> }
      </Box>

      {/* emoji picker */}
      <Box sx={{ position: "relative",zIndex:10}}>
        {/* Add a container for the EmojiPickerDialog */}
        <div style={{ position: "absolute", right: "10px", bottom: "10px" }}>
          {showEmojiPicker && (
            <EmojiPicker
              onEmojiClick={onClick}
              // autoFocusSearch={false}
              emojiStyle={EmojiStyle.NATIVE}
              searchDisabled={true}
              previewConfig={{
                showPreview: false,
              }}
            />
          )}
        </div>
        {isTyping ? (
          <div>
            <Lottie
              options={defaultOptions}
              width={70}
              // style={{ marginBottom: 15, marginLeft: 0 }}
            />
          </div>
        ) : (
          <></>
        )}
      </Box>

            <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        border="1px solid #ccc"
        width="100%"
        padding="10px"
        overflow="auto"
        sx={{ position: "relative", bottom: "0",  }}
      >
        
        <Box
          sx={{ display: "flex", width: "100%", alignItems: "center" ,}}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={text}
            // ref={inputRef}
            focused
            onChange={(e) => {
              typingHandler(e);
            }}
          />
          <InputAdornment position="end">
            <IconButton
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
              }}
            >
              <InsertEmoticonIcon />
            </IconButton>
            <IconButton onClick={sendChatMessage}>
              <SendIcon />
            </IconButton>
          </InputAdornment>
        </Box>
      </Box>
      </Card>   
     
  ) : (
    <Card sx={{ height: "100%" }}></Card>
  );
};
