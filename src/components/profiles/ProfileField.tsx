import { cn } from "@/lib/utils";

interface ProfileFieldProps {
  label: string;
  value: string | number;
  theme: "green" | "blue";
  icon?: React.ReactNode;
}

export function ProfileField({ label, value, theme, icon }: ProfileFieldProps) {
  return (
    <div className="flex items-start mb-4 last:mb-0">
      {icon && (
        <div className={cn(
          "mr-3 mt-0.5",
          theme === "green" ? "text-green-600" : "text-blue-600"
        )}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-base font-medium text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );
}