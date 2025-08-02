"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { HiUser, HiLogout, HiMenu, HiX, HiBell } from "react-icons/hi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              {showMobileMenu ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>

            <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">⚽</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Football Manager
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Professional Edition
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <HiBell size={20} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 text-sm rounded-lg focus:outline-none p-2 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <HiUser className="text-gray-600" size={16} />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-gray-500">Manager</p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-500">Team Manager</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <HiLogout className="mr-3" size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
