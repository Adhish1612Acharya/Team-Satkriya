import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  profilePhoto: string;
  name: string;
  role: string;
  theme: "green" | "blue";
  children: React.ReactNode;
}

export function ProfileCard({ profilePhoto, name, role, theme, children }: ProfileCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-lg",
      theme === "green" 
        ? "border-green-200 hover:border-green-300" 
        : "border-blue-200 hover:border-blue-300"
    )}>
      <CardHeader className={cn(
        "pb-2",
        theme === "green" 
          ? "bg-green-50 dark:bg-green-900/20" 
          : "bg-blue-50 dark:bg-blue-900/20"
      )}>
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800">
            <AvatarImage src={profilePhoto} alt={name} />
            <AvatarFallback className={cn(
              "text-2xl font-bold",
              theme === "green" 
                ? "bg-green-100 text-green-700" 
                : "bg-blue-100 text-blue-700"
            )}>
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h3 className="mt-4 text-xl font-bold">{name}</h3>
          <p className={cn(
            "text-sm font-medium",
            theme === "green" 
              ? "text-green-600 dark:text-green-400" 
              : "text-blue-600 dark:text-blue-400"
          )}>
            {role}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
