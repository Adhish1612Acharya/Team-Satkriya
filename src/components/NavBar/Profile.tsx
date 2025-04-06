import {
  Building,
  CalendarCheck,
  CheckCircle,
  FileText,
  Handshake,
  Heart,
  Leaf,
  LogOut,
  PawPrint,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Profile = () => {
  const { currentUser, setCurrentUser, setUserType, username, userType, role } =
    useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const profileItem = [
    ...(currentUser
      ? [
          {
            title: "Your Posts",
            href: "/user/posts",
            icon: <FileText className="w-5 h-5 text-blue-600" />,
          },
          {
            title: "Your Registrations",
            href: "/user/registrations",
            icon: <CalendarCheck className="w-5 h-5 text-green-600" />,
          },
        ]
      : []),

    ...(currentUser && userType === "experts"
      ? [
          {
            title: "Your workshops",
            href: "/user/workshops",
            icon: <CheckCircle />,
            color: "text-green-500",
          },
        ]
      : []),
  ];
  const logOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null); // Clear the current user in the context
      setUserType(null); // Clear the user type in the context
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <DropdownMenu>
      <div>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="relative z-50 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 mr-2 cursor-pointer"
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
      </div>

      <DropdownMenuContent
        side="bottom"
        align="end"
        className="w-56 dark:bg-gray-900 mr-4"
      >
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={currentUser?.photoURL || "/placeholder.svg"}
              alt="User"
            />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              {role === "doctor" && "Dr. "}
              {username?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 leading-none">
            <div className="flex items-center gap-1">
              <p className="font-medium">
                {role === "doctor" && "Dr. "}
                {username || "User"}
              </p>
              {role && (
                <span
                  className={`inline-flex items-center text-[10px] font-medium px-1 rounded-full ml-1 ${
                    role === "doctor"
                      ? "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
                      : role === "ngo"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      : role === "volunteer"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : role === "researchInstitution"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                  }`}
                >
                  {role === "doctor" && (
                    <PawPrint size={10} className="mr-0.5" />
                  )}
                  {role === "ngo" && <Handshake size={10} className="mr-0.5" />}
                  {role === "volunteer" && (
                    <Heart size={10} className="mr-0.5" />
                  )}
                  {role === "researchInstitution" && (
                    <Building size={10} className="mr-0.5" />
                  )}
                  {role === "farmer" && <Leaf size={10} className="mr-0.5" />}
                  {role === "doctor"
                    ? "Dr"
                    : role === "ngo"
                    ? "NGO"
                    : role === "volunteer"
                    ? "Vol"
                    : role === "researchInstitution"
                    ? "Research"
                    : "Farmer"}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {role === "farmer"
                ? currentUser?.email?.split("@")[0]
                : currentUser?.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        {profileItem.map((eachItem,index) => {
          return (
            <DropdownMenuItem
              onClick={() => navigate(eachItem.href)}
              key={index}
              className={cn(
                "cursor-pointer flex items-center gap-2",
                location.pathname === eachItem.href
                  ? "text-primary font-medium bg-primary/10 dark:bg-primary/20 border-l-2 border-primary shadow-sm"
                  : "text-muted-foreground hover:bg-accent/50 dark:hover:bg-accent/10 hover:text-primary transition-colors"
              )}
            >
              {eachItem.icon}
              <span>{eachItem.title}</span>
            </DropdownMenuItem>
          );
        })}
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
