"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Ensure we are in the browser before accessing localStorage
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername);
    }
  }, []); // Runs once after the component mounts

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null); // Reset username state after logout
    router.push("/login");
  };

  return (
    <div className="bg-gray-500 shadow-sm p-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-white">
        Task Management App
      </Link>
      <div className="flex items-center gap-4">
        {username ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatar-placeholder.png" alt="User Avatar" />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem className="cursor-pointer">
                <span className="text-sm font-medium">Hi, {username}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:bg-red-50"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
