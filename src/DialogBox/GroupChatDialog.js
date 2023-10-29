import {
  Button,
  Chip,
  Dialog,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useChatContext } from "../Context/ChatContext";
import CloseIcon from "@mui/icons-material/Close";
import ShowUsers from "./ShowUsers";
import { useAuthContext } from "../Context/AuthContext";
import GroupIcon from "@mui/icons-material/Group";
import axios from "axios";

const GroupChatDialog = () => {
  const { users, groupDialog, dispatch } = useChatContext();
  const { user } = useAuthContext();
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetch(
        "http://localhost:2000/api/user?search=" + name,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await data.json();
      dispatch({ type: "FETCH_USERS_SUCCESS", payload: result });
    }
    fetchData();
  }, [name]);

  const handleGroupMembers = (user) => {
    const findMember = groupMembers.some((member) => member._id === user._id);
    if (findMember) {
      return alert("user alrady added to group members");
    }
    setGroupMembers((prev) => [...prev, user]);
  };

  const removeGroupMember = (user) => {
    setGroupMembers((prev) => prev.filter((member) => member._id != user._id));
  };

  const createGroup = async () => {
    try {
      const requestBody = {
        name: groupName,
        users: JSON.stringify(groupMembers.map((u) => u._id)),
      };

      const response = await fetch("http://localhost:2000/api/chat/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      dispatch({type:'GROUP_DIALOG', payload: false});
      console.log(data);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <Dialog open={groupDialog}>
      <div style={{ margin: "0 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <DialogTitle>Creata Group Chat</DialogTitle>
          <Button
            variant="contained"
            endIcon={<GroupIcon />}
            onClick={createGroup}
            sx={{ height: "40px", margin: "auto 0" }}
          >
            Create
          </Button>
          <IconButton
            onClick={() => {
              dispatch({ type: "GROUP_DIALOG", payload: false });
            }}
            sx={{
              backgroundColor: "#2196f3", // Blue color
              borderRadius: "50%", // Circular shape
              width: "30px", // Adjust as needed
              height: "30px", // Adjust as needed
              color: "white",
              marginY: "auto",
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div style={{ margin: "0 6vw" }}>
          <TextField
            label="Group Name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
          />
          <TextField
            label="Search name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div style={{ margin: "0 6vw", display: "flex", flexWrap: "wrap" }}>
          {groupMembers.map((user) => (
            <Chip
              label={user.name}
              color="primary"
              sx={{ margin: "5px" }}
              onDelete={() => {
                removeGroupMember(user);
              }}
            />
          ))}
        </div>
        <div
          style={{ margin: "10px 6vw", maxHeight: "30vh", overflow: "auto" }}
        >
          {users && users.map((user) => (
            <ShowUsers
              key={user._id}
              userInfo={user}
              handleGroupMembers={handleGroupMembers}
            />
          ))}
        </div>
      </div>
    </Dialog>
  );
};

export default GroupChatDialog;
