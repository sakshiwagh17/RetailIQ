import React, { useState } from 'react'
import { Search, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

export const Navbar = () => {
  const [loggedIn, setloggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [role, setRole] = useState('user')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const resp = await axios.get('/api/auth/me')
        if(resp.status === 200){
          setloggedIn(true)
          const name = resp.data.data.user.name;
          const firstName = name.split(' ')[0];
          setUserName(firstName)
          const userRole = resp.data.data.user.role;
          setRole(userRole);
          console.log(userRole)
        }
      } catch (error) {
        console.log('User not authenticated',error)
        setloggedIn(false)
        setUserName('')
      }
    }
    checkAuthStatus()
  }, [])

  const handleLogout = () => {
    try{
    axios.post('/user/logout')
    setloggedIn(false)
    setUserName('')
    setShowDropdown(false)
    } catch(error){
      console.log("can't Log out",error)
    }
  }

  return (
    <div className='bg-amber-400 flex text-xl font-semibold py-4 justify-between align-middle px-4'>
    <Link to="/" className="hover:text-amber-800 transition-colors">
        <p>RateDukaan</p>
    </Link>
    <div className='align-middle flex'>
        <input type="text" name="search" id="search" className='text-md  p-0.5 text-center border-2 border-black rounded-2xl' placeholder='Gupta Sweets' />
        <button type='submit' className='px-4 rounded-full hover:bg-amber-200'><Search/></button>
    </div>
    <ul className='flex gap-8'>
        <li><Link to="/" className="hover:text-amber-800 transition-colors">Home</Link></li>
        <li><Link to="/about" className="hover:text-amber-800 transition-colors">About</Link></li>
        {loggedIn ? (
          <li className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1 text-amber-800 font-bold hover:text-amber-900 transition-colors"
            >
              Welcome, {userName}
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                {role === "admin" && (
                  <Link 
                    to="/AdminDashboard" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}
                {role === "admin" && (
                  <Link 
                    to="/register" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="h-4 w-4" />
                    Register User
                  </Link>
                )}
                {role === "user" && (
                  <Link 
                    to="/RegisterShop" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="h-4 w-4" />
                    Register Shop
                  </Link>
                )}
                {role === "store_owner" && (
                  <Link 
                    to="/ShopDashboard" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="h-4 w-4" />
                    Shop Dashboard
                  </Link>
                )}
                  
                  <Link 
                    to="/settings" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </li>
        ) : (
          <li><Link to="/login" className="hover:text-amber-800 transition-colors">Login</Link></li>
        )}
    </ul>
    
    </div>
  )
}