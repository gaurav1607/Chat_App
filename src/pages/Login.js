// LoginForm.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Container ,Box} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../Context/AuthContext';

export const Login = () => {
  const navigate = useNavigate()
  const { dispatch} = useAuthContext()
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async(e) => {
    e.preventDefault();
    // TODO: Implement login logic
    const response = await axios.post(
        "https://social-network-backend-fn7k.onrender.com/api/user/login",
        {
        email,password
        },
        { headers: { "Content-Type": "application/json" } }
      );
  
      if(response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data))
        dispatch({type:"LOGIN" , payload: response.data})
        navigate("/")
      }else{
        // show alert here
        alert(response.data)
      }
  };

  return (
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
    <Container maxWidth="sm"  >
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{marginY:"1.5rem"}}
        >
          Login
        </Button>
      </form>
    </Container>
    </Box>
  );
};

