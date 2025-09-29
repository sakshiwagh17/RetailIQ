import React, { useState, useEffect } from "react";
import { ChevronDown, User, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";

export const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("user");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axiosInstance.get("/auth/me", { withCredentials: true });

        if (res.data.success) {
          const user = res.data.data.user;
          setLoggedIn(true);
          setUserName(user.name.split(" ")[0]); // First name only
          setRole(user.role);
        } else {
          setLoggedIn(false);
          setUserName("");
          navigate("/login"); // redirect if not logged in
        }
      } catch (err) {
        console.log("User not authenticated", err);
        setLoggedIn(false);
        setUserName("");
        navigate("/login"); // redirect to login
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      setLoggedIn(false);
      setUserName("");
      setShowDropdown(false);
      navigate("/login"); // redirect to login page
    } catch (err) {
      console.log("Can't log out", err);
    }
  };

  return (
    <div className="bg-green-50 flex text-xl font-semibold py-4 justify-between align-middle px-4">
      <Link to="/" className="hover:text-green-800 transition-colors">
        <p>RetailIQ</p>
      </Link>

      <ul className="flex gap-8">
        <li>
          <Link to="/" className="hover:text-green-800 transition-colors">
            Home
          </Link>
        </li>

        {loggedIn ? (
          <li className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1 text-green-800 font-bold hover:text-green-900 transition-colors"
            >
              Welcome, {userName}
              <ChevronDown className="h-4 w-4" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  {role === "admin" && (
                    <>
                      <Link
                        to="/AdminDashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User className="h-4 w-4" /> Admin Dashboard
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User className="h-4 w-4" /> Register User
                      </Link>
                    </>
                  )}
                  {role === "user" && (
                    <Link
                      to="/RegisterShop"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User className="h-4 w-4" /> Register Shop
                    </Link>
                  )}
                  {role === "store_owner" && (
                    <Link
                      to="/ShopDashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User className="h-4 w-4" /> Shop Dashboard
                    </Link>
                  )}
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </li>
        ) : (
          <li>
            <Link to="/login" className="hover:text-green-800 transition-colors">
              Login
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};
