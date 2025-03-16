import { FC } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RoleCardProps } from "./RoleCard.types";

const RoleCard: FC<RoleCardProps> = ({
  title,
  description,
  icon,
  selected,
  onClick,
}) => {
  return (
    <Card
      className={cn(
        "w-full cursor-pointer transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-2",
        selected
          ? "border-indigo-500 ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/20"
          : "border-transparent hover:border-indigo-300 dark:hover:border-indigo-700"
      )}
      onClick={onClick}
    >
      <CardHeader className="space-y-2 xs:space-y-3 sm:space-y-4 text-center p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8">
        <div className="mx-auto text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
        <CardTitle className="text-lg xs:text-xl sm:text-2xl md:text-3xl text-indigo-900 dark:text-indigo-100">
          {title}
        </CardTitle>
        <CardDescription className="text-xs xs:text-sm sm:text-base md:text-lg text-indigo-600/80 dark:text-indigo-300/80">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default RoleCard;