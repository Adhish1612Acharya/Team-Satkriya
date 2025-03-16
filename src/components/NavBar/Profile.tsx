import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const Profile = () => {
  const { currentUser, setCurrentUser, setUserType, username } =
    useAuthContext();

  const logOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null); // Clear the current user in the context
      setUserType(null); // Clear the user type in the context
      localStorage.removeItem("userType");
      toast.success("Logged out successfully!");
      window.location.href = "/"; // Redirect to home page
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 mr-2"
        >
          <Avatar className="h-8 w-8 ring-2 ring-blue-500 ring-offset-2 transition-all hover:ring-indigo-500">
            <AvatarImage
              src={currentUser?.photoURL || "/placeholder.svg"}
              alt="User"
            />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              {username?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 dark:bg-gray-900 mr-4">
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={currentUser?.photoURL || "/placeholder.svg"}
              alt="User"
            />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              {username?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{username || "User"}</p>
            <p className="text-xs text-muted-foreground">
              {currentUser?.email?.split("@")[0]}
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
        <DropdownMenuItem
          onClick={logOut}
          className="text-destructive cursor-pointer flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
