import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import {
  NavigationMenu,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Menu,
  Heart,
  Sun,
  Moon,
  Calendar,
  Users,
  FileText,
  Microscope,
  ClipboardList,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navItems = [
  {
    title: "Doctors Post",
    href: "/doctors-post",
    icon: <FileText className="h-4 w-4" />,
    color: "text-blue-500",
  },
  {
    title: "NGO Post",
    href: "/ngo-post",
    icon: <Users className="h-4 w-4" />,
    color: "text-purple-500",
  },
  {
    title: "Farmers Post",
    href: "/farmers-post",
    icon: <ClipboardList className="h-4 w-4" />,
    color: "text-green-500",
  },
  {
    title: "Research Institution",
    href: "/research-institution",
    icon: <Microscope className="h-4 w-4" />,
    color: "text-amber-500",
  },
  {
    title: "Events",
    href: "/events",
    icon: <Calendar className="h-4 w-4" />,
    color: "text-red-500",
  },
  {
    title: "Your Posts",
    href: "/your-posts",
    icon: <FileText className="h-4 w-4" />,
    color: "text-teal-500",
  },
];

const NavBar = () => {
  const location = useLocation();

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
            <div className="mt-8 border-t border-blue-200 dark:border-blue-800 pt-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-lg px-3 py-2 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 ring-2 ring-blue-500 ring-offset-2 transition-all hover:ring-indigo-500">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                          HC
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <p className="font-medium">Dr. Jane Smith</p>
                        <p className="text-xs text-muted-foreground">
                          doctor@example.com
                        </p>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 dark:bg-gray-900"
                >
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                    <span>My Publications</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive cursor-pointer flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                <Avatar className="h-8 w-8 ring-2 ring-blue-500 ring-offset-2 transition-all hover:ring-indigo-500">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    HC
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 dark:bg-gray-900">
              <div className="flex items-center gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">Dr. Jane Smith</p>
                  <p className="text-xs text-muted-foreground">
                    doctor@example.com
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                <span>My Publications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
