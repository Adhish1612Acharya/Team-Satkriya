import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { NavigationMenu, NavigationMenuList } from "../ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Menu,
  Calendar,
  FileText,
  PenTool,
  Home,
  LogIn,
  HomeIcon,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import Profile from "./Profile";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/logo.svg";
import { Avatar } from "@mui/material";

const NavBar = () => {
  const { currentUser, userType } = useAuthContext();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    // Common items for logged-in users
    ...(currentUser
      ? [
          {
            title: "Home",
            href: "/",
            icon: <HomeIcon />,
            color: "text-sky-500",
          },
          {
            title: "Posts",
            href: "/posts",
            icon: <FileText className="h-4 w-4" />,
            color: "text-blue-500",
          },
          {
            title: "Workshops and Training",
            href: "/workshops",
            icon: <Calendar className="h-4 w-4" />,
            color: "text-amber-500",
          },
        ]
      : []),

    // Role-specific items for farmers
    ...(currentUser && userType === "farmers"
      ? [
          {
            title: "Solve Query",
            href: "/solve-query",
            icon: <CheckCircle />,
            color: "text-green-500",
          },
        ]
      : []),

    // Role-specific items for experts
    ...(currentUser && userType === "experts"
      ? [
          {
            title: "Host workshops",
            href: "/workshops/create",
            icon: <PenTool className="h-4 w-4" />,
            color: "text-indigo-500",
          },
        ]
      : []),

    // Items for logged-out users
    ...(!currentUser
      ? [
          {
            title: "Home",
            href: "/",
            icon: <Home className="h-4 w-4" />,
            color: "text-gray-500",
          },
          {
            title: "Login",
            href: "/auth",
            icon: <LogIn className="h-4 w-4" />,
            color: "text-blue-500",
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-gray-900/95 dark:border-gray-800">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 via-indigo-50/5 to-purple-50/10 dark:from-blue-900/10 dark:via-indigo-900/5 dark:to-purple-900/10"></div>
      <div className="container flex h-16 items-center justify-between px-6 lg:px-8 relative z-10">
        {/* <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        > */}
        <Link to="/" className="flex items-center gap-2">
          <Avatar
            sx={{
              width: 60,
              height: 60,
              padding: 0.2, // Adds space around the logo
            }}
            src={logo}
            alt="GoPushti Logo"
          >
            {/* Fallback if image fails to load */}
            <span className="text-white font-bold text-sm">GP</span>
          </Avatar>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            GoPushti
          </span>
        </Link>
        {/* </motion.div> */}

        {/* Mobile Navigation */}
        <div className="flex items-center gap-4 lg:hidden">
          {/* Hamburger Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-l border-gray-300 dark:border-gray-700 dark:bg-gray-900 p-4"
            >
              {/* Navigation Links */}
              <div className="flex flex-col gap-4 mt-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                  >
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 rounded-lg text-lg font-medium transition-all",
                        location.pathname === item.href
                          ? "text-primary bg-blue-100 dark:bg-blue-900/30 shadow-sm"
                          : "text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-md"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <span
                        className={cn(
                          "w-6 h-6 flex items-center justify-center",
                          item.color
                        )}
                      >
                        {item.icon}
                      </span>
                      {item.title}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Profile Icon (Visible on Mobile) */}
          {currentUser && (
            <div className="cursor-pointer">
              <Profile />
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      location.pathname === item.href
                        ? "text-primary bg-blue-100 dark:bg-blue-900/30 shadow-sm"
                        : "text-muted-foreground hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300 dark:focus:bg-gray-800 hover:shadow-md"
                    )}
                    aria-label={item.title}
                  >
                    <span
                      className={cn(
                        "w-6 h-6 flex items-center justify-center",
                        item.color
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.title}</span>
                  </Link>
                </motion.div>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Profile Dropdown */}
          {currentUser && (
            <div className="border-blue-200 dark:border-blue-800 cursor-pointer">
              <Profile />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
