import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Users from "../components/Users";
import { ChatPage } from "../components/ChatPage";
import { IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";

import { SideDrawer } from "../components/SideDrawer";
import { useChatContext } from "../Context/ChatContext";
import { ChatUser } from "../components/ChatUser";
import { useAuthContext } from "../Context/AuthContext";
import GroupChatDialog from "../DialogBox/GroupChatDialog";

const Home = () => {
  const { user } = useAuthContext();
  const { chatUsers, groupDialog, selectedChat, drawer, dispatch } =
    useChatContext();
  const [mediaQuery, setMediaQuery] = useState(false);

  useEffect(() => {
    setMediaQuery(window.innerWidth <= 600);
  });

  console.log(mediaQuery);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:2000/api/chat", {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + user.token,
        },
      });
      const data = await response.json();
      dispatch({ type: "FETCH_CHATS_USERS", payload: data });
    }
    fetchData();
  }, [drawer, groupDialog]);

  return (
    <Box display="flex" height="91.4vh" gap={0.5} sx={{ position: "relative" }}>
      {chatUsers ? (
        <Box
          marginTop={1}
          marginX={1}
          sx={{ position: "relative", overflow: "auto", flex: 3 }}
        >
          <div
            style={{
              width: mediaQuery && !selectedChat ? "100vw" : "100%",
              display: selectedChat && mediaQuery ? "none" : "block",
            }}
          >
            {chatUsers.error ? (
              <Box sx={{ flex: 3, textAlign: "center" }}>
                {" "}
                <Typography variant="body2" color="text.secondary">
                  No chats found !
                </Typography>
              </Box>
            ) : (
              chatUsers.map((user) => (
                <ChatUser key={user._id} mediaQuery={mediaQuery} user={user} />
              ))
            )}
          </div>
        </Box>
      ) : (
        <Box sx={{ flex: 3, textAlign: "center" }}>
          {" "}
          <Typography variant="body2" color="text.secondary">
            No chats found !
          </Typography>
        </Box>
      )}

      <Box
        flex="13"
        bgcolor="#ffcc99"
        display={mediaQuery && !selectedChat ? "none" : "block"}
        width={mediaQuery && !selectedChat ? "100vw" : "100vw"}
        sx={{ position: "static" }}
      >
        <ChatPage />
      </Box>
      <SideDrawer />
      <GroupChatDialog />
    </Box>
  );
};

export default Home;
