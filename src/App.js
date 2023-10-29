import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Home from "./pages/Home";
import { Box } from "@mui/material";
import { useState } from "react";
import { useAuthContext } from "./Context/AuthContext";

function App() {

  const {user} = useAuthContext();

  return (
    <BrowserRouter>
      <div className="App">
        <Box sx={{ minHeight: "100vh" }}>
          <Navbar  />
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/register" element={user ? <Navigate to="/" /> :<Register />} />
            <Route path="/login" element={user ? <Navigate to="/" /> :<Login />} />
          </Routes>
        </Box>
      </div>
    </BrowserRouter>
  );
}

export default App;
