import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { NavigationMenu, NavigationMenuList } from "../ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Menu,
  Heart,
  Calendar,
  FileText,
  ClipboardList,
  LogOut,
  BookOpen,
  PenTool,
  Home,
  LogIn,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import Profile from "./Profile";

const NavBar = () => {
  const { currentUser, userType } = useAuthContext();
  const location = useLocation();

  const navItems = [
    // Common items for logged-in users
    ...(currentUser
      ? [
          {
            title: "Posts",
            href: "/posts",
            icon: <FileText className="h-4 w-4" />,
            color: "text-blue-500",
          },
          {
            title: "Your Posts",
            href: "/your-posts",
            icon: <FileText className="h-4 w-4" />,
            color: "text-teal-500",
          },
          {
            title: "Farmer Queries",
            href: "/farmer-queries",
            icon: <ClipboardList className="h-4 w-4" />,
            color: "text-green-500",
          },
          {
            title: "Success Stories",
            href: "/success-stories",
            icon: <BookOpen className="h-4 w-4" />,
            color: "text-purple-500",
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
    ...(currentUser && localStorage.getItem("userType") === "farmers"
      ? [
          // {
          //   title: "Doctors Post",
          //   href: "/doctors-post",
          //   icon: <FileText className="h-4 w-4" />,
          //   color: "text-blue-500",
          // },
          // {
          //   title: "NGO Post",
          //   href: "/ngo-post",
          //   icon: <Users className="h-4 w-4" />,
          //   color: "text-purple-500",
          // },
          // {
          //   title: "Farmers Post",
          //   href: "/farmers-post",
          //   icon: <ClipboardList className="h-4 w-4" />,
          //   color: "text-green-500",
          // },
          // {
          //   title: "Research Institution",
          //   href: "/research-institution",
          //   icon: <Microscope className="h-4 w-4" />,
          //   color: "text-amber-500",
          // },
          {
            title: "Events",
            href: "/events",
            icon: <Calendar className="h-4 w-4" />,
            color: "text-red-500",
          },
        ]
      : []),

    // Role-specific items for experts
    ...(currentUser && localStorage.getItem("userType") === "experts"
      ? [
          {
            title: "Create & Educate",
            href: "/create-educate",
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
      <div className="container flex h-16 items-center justify-between px-4 lg:px-6 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              HealthConnect
            </span>
          </Link>
        </motion.div>

        {/* Mobile Navigation */}
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="border-l-blue-200 dark:border-l-blue-800 dark:bg-gray-900 pr-0"
          >
            {/* Navigation Links */}
            <div className="flex flex-col gap-4 mt-6 pr-4">
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
                      "text-lg font-medium flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                      location.pathname === item.href
                        ? "text-primary bg-blue-100 dark:bg-blue-900/30"
                        : "text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center",
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

            {/* Profile Dropdown */}
            {currentUser && (
              <div className="mt-8 border-t border-blue-200 dark:border-blue-800 pt-6">
                <Profile />
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-5">
          <NavigationMenu>
            <NavigationMenuList>
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
                      "text-lg font-medium flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                      location.pathname === item.href
                        ? "text-primary bg-blue-100 dark:bg-blue-900/30 shadow-sm"
                        : "text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-md"
                    )}
                    aria-label={item.title} // Improve accessibility
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full",
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
            <div className="mt-8 border-t border-blue-200 dark:border-blue-800 pt-6">
              <Profile />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
