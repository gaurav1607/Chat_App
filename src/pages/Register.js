import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { SelectBox } from "../components/SelectBox";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";

export const Register = () => {
  const navigate = useNavigate()
  const { dispatch} = useAuthContext()
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [profilePic, setProfilePic] = useState();

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add form submission logic here (e.g., send data to a server)
    const response = await axios.post(
      "https://social-network-backend-fn7k.onrender.com/api/user/register",
      {
        name : formData.firstName +" "+formData.lastName,
        email: formData.email,
        password: formData.password,
        profilePic,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.status === 200) {
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch({ type: "LOGIN", payload: response.data });
      navigate("/");
    } else {
      // show alert dialog
    }
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent={"center"}
        p={4}
        my={"50px"}
        mx={"auto"}
        maxWidth={"35rem"}
        bgcolor="#f0f0f0"
        borderRadius={8}
        boxShadow={3}
      >
        <Typography variant="h5" gutterBottom>
          Create an Account
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <div onClick={handleOpenDialog} style={{ cursor: "pointer" }}>
            <Avatar
              src={profilePic ? profilePic : "/static/images/avatar/1.jpg"}
              sx={{ width: 60, height: 60 }}
            ></Avatar>
            <Typography>Select Avatar</Typography>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "1rem" }}
          >
            Sign Up
          </Button>
        </form>
      </Box>
      <div>
        <SelectBox
          open={dialogOpen}
          handleClose={handleCloseDialog}
          setProfilePic={(pic)=>{setProfilePic(pic)}}
        />
      </div>
    </>
  );
};
