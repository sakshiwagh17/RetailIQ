import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RegisterShop from "./pages/RegisterShop";
import ShopDashboard from "./pages/shopDashboard";
import AdminDashboard from "./pages/AdminDashboard";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registerShops" element={<RegisterShop />} />
        <Route path="/shopDashboard" element={<ShopDashboard/>} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
};

export default App;
