import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Drawer from "@mui/material/Drawer";
import { Button, IconButton } from "@mui/material";
import Users from "./Users";
import { useChatContext } from "../Context/ChatContext";
import { useAuthContext } from "../Context/AuthContext";
import GroupIcon from '@mui/icons-material/Group';

export const SideDrawer = () => {
  const { users, drawer,  dispatch } = useChatContext();
  const { user } = useAuthContext();
  const [name, setName] = useState("");

  useEffect(() => {
    async function fetchData() {
      const data = await fetch(
        `https://social-network-backend-fn7k.onrender.com/api/user?search=${name}&id=${user.id}`,
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

  const handelDrawerClose = () => {
    dispatch({type:"DRAWER", payload:false})
  };

  return (
    <Drawer open={Boolean(drawer)} onClose={handelDrawerClose}>
      <div style={{ display: "flex", width: "auto", margin: "5px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: "25px",
            width: "90%",
          }}
        >
          <InputBase
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Search..."
            fullWidth
            inputProps={{ "aria-label": "search" }}
            style={{ paddingLeft: 10 }}
          />
          <IconButton aria-label="search" sx={{ p: "10px" }}>
            <SearchIcon />
          </IconButton>
        </div>

        <IconButton
          onClick={() => dispatch({ type: "DRAWER", payload: false })}
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
      <div style={{marginLeft:"auto", marginRight:"5px"}}>
      <Button variant="contained" endIcon={<GroupIcon />} onClick={()=>{
        dispatch({type:"GROUP_DIALOG", payload:true})
        dispatch({type:"DRAWER", payload:false})
        }} >
        Create Group
      </Button>
      </div>
      <div style={{ margin: "5px" }}>
        { users && users.map((user) => (
          <Users key={user._id} userInfo={user} />
        ))}
      </div>
    </Drawer>
  );
};
