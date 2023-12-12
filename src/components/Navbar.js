import React, { useEffect, useRef, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Badge, ClickAwayListener, MenuList, Popover } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useChatContext } from "../Context/ChatContext";
import { useAuthContext } from "../Context/AuthContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { chatUsers, drawer, notifications, selectedChat, dispatch } =
    useChatContext();
  const { user, dispatch: authDispatch } = useAuthContext();
  const [profileMenu, setProfileMenu] = useState(null);
  const [notificatinMenu, setNotificatinMenu] = useState(null);
  const iconButtonRef = useRef(null);

  const handleProfileMenuOpen = (event) => {
    setProfileMenu(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificatinMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setProfileMenu(null);
    setNotificatinMenu(null);
  };

  useEffect(() => {
    // Set the initial profileMenu state to null to prevent auto-opening
    setProfileMenu(null);
    setNotificatinMenu(null);
  }, []);

  const fetchNotification = async () => {
    const data = await fetch(
      "https://social-network-backend-fn7k.onrender.com/api/notification/" + user.id,
      {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      }
    );
    const notif = await data.json();
    // dispatch({type:"SET_NOTIFICATION", payload: [  ...notifications,newMessageRecieved]})
    dispatch({ type: "SET_NOTIFICATION", payload: notif });
  };

  const handleNotiClick = async (id, chatId) => {
    const data = await fetch(
      "https://social-network-backend-fn7k.onrender.com/api/notification/" + chatId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
      }
    );
    if (!data.ok) {
      throw new Error(`HTTP error! Status: ${data.status}`);
    }
    const userRes = await data.json();
    dispatch({ type: "SELECT_CHAT_USER", payload: userRes[0]?.message.chat });

    const response = await fetch(
      "https://social-network-backend-fn7k.onrender.com/api/notification/" + id,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + user.token,
        },
      }
    );
    const delRes = await response.json();

    handleMenuClose();
    fetchNotification();
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => {
                dispatch({ type: "DRAWER", payload: true });
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Chat App
            </Typography>
            {user ? (
              <Box>
                <IconButton size="small" color="inherit">
                  <Badge>{user ? user.name : <></>}</Badge>
                </IconButton>

                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleNotificationMenuOpen}
                >
                  <Badge badgeContent={notifications?.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={handleProfileMenuOpen}
                  ref={iconButtonRef}
                >
                  <AccountCircle />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: "flex" }}>
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <Typography variant="h6" sx={{ flexGrow: 1, margin: "1rem" }}>
                    Login
                  </Typography>
                </Link>
                <Link
                  to="/register"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <Typography variant="h6" sx={{ flexGrow: 1, margin: "1rem" }}>
                    Sign Up
                  </Typography>
                </Link>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        {/* Popovers for notification */}
        <Popover
          anchorEl={profileMenu}
          open={Boolean(profileMenu)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Paper>
            <MenuList
              autoFocusItem={profileMenu}
              id="composition-menu"
              aria-labelledby="composition-button"
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem
                onClick={() => {
                  authDispatch({ type: "LOGOUT", payload: null });
                  setProfileMenu(null);
                  localStorage.removeItem("user");
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Paper>
        </Popover>
        {/* for notifications  */}
        <Popover
          anchorEl={notificatinMenu}
          open={Boolean(notificatinMenu)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{ position: "absolute", right: "20px", top: "40px" }}
        >
          <Paper>
            <MenuList
              autoFocusItem={profileMenu}
              id="composition-menu"
              aria-labelledby="composition-button"
            >
              {(Array.isArray(notifications) && notifications.length > 0) ? (
                <>
                  {
                    notifications.map((not) => {
                      return (
                        <MenuItem
                        key={not?.notificationId}
                          onClick={() => {
                            handleNotiClick(
                              not?.notificationId,
                              not.message?._id
                            );
                          }}
                        >
                          {not.message?.chat?.isGroupChat
                            ? not.message?.chat?.chatName
                            : not.message?.sender?.name}{" "}
                          : {not.message?.content}{" "}
                        </MenuItem>
                      );
                    })}
                </>
              ) : (
                <MenuItem>Notification are empty</MenuItem>
              )}
            </MenuList>
          </Paper>
        </Popover>
      </Box>
    </>
  );
}
