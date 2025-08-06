"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

const menuItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Transaksi", href: "/dashboard/transactions" },
  { name: "Kategori", href: "/dashboard/categories" },
  { name: "Budget", href: "/dashboard/budget" },
  { name: "Laporan", href: "/dashboard/reports" },
  { name: "Pengaturan", href: "/dashboard/settings" },
];

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const currentPageName =
    menuItems.find((item) => item.href === pathname)?.name || "Dashboard";

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "Budget Limit Reached",
      message: "Your monthly budget for Food has been exceeded",
      time: "5 min ago",
      unread: true,
      type: "warning",
    },
    {
      id: 2,
      title: "New Transaction Added",
      message: "Coffee purchase recorded successfully",
      time: "1 hour ago",
      unread: true,
      type: "success",
    },
    {
      id: 3,
      title: "Weekly Report Ready",
      message: "Your spending report for this week is available",
      time: "2 hours ago",
      unread: false,
      type: "info",
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-3">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Mobile menu button and title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                {currentPageName}
              </h2>
              <p className="text-xs text-green-600 hidden sm:block">
                Welcome back,{" "}
                {user?.user_metadata?.full_name?.split(" ")[0] || "User"}!
              </p>
            </div>
          </div>

          {/* Right side - Notifications and User dropdown */}

          
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-7 px-3 py-2 rounded-xl bg-gradient-to-r from-green-50 to-white hover:from-green-100 hover:to-green-50 transition-all duration-200 border border-green-100"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-semibold">
                    {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() ||
                      user?.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm hidden sm:block text-left">
                  <p className="font-bold text-gray-800">
                    {user?.user_metadata?.full_name || "User"}
                  </p>
                  {/* <p className="text-green-600 text-xs truncate max-w-32">
                    {user?.email}
                  </p> */}
                </div>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-green-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-green-50">
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs text-green-600">{user?.email}</p>
                  </div>

                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-1xl text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center space-x-3">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>Profile</span>
                    </button>

                    <button className="w-full px-4 py-2 text-left text-1xl text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center space-x-3">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>Settings</span>
                    </button>

                    <button className="w-full px-4 py-2 text-left text-1xl text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center space-x-3">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Help & Support</span>
                    </button>
                  </div>

                  <div className="border-t border-blue-50 pt-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center space-x-3"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
