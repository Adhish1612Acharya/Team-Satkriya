import { ChevronDown, ChevronUp, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import AccordionItemProps from "./AccordionItem.types";
import { useNavigate } from "react-router-dom";

// Accordion Item Component
const AccordionItem: FC<AccordionItemProps> = ({ registrantDetail }) => {
  const navigate = useNavigate();

  const [openItem, setOpenItem] = useState<string>("");

  const handleToggle = (id: string) => {
    setOpenItem(openItem === id ? "" : id);
  };
  return (
    <div className="border rounded-md mb-2 overflow-hidden">
      {/* Accordion Header - Always visible */}
      <button
        className="w-full flex items-center justify-between p-4 text-left bg-background hover:bg-muted/50 transition-colors"
        onClick={() => handleToggle(registrantDetail?.id || "")}
        aria-expanded={openItem === registrantDetail?.id}
        aria-controls={`content-${registrantDetail?.id}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
            {registrantDetail?.id}
          </div>
          <div>
            <h3 className="font-medium">{registrantDetail?.name}</h3>
            <Badge variant="outline" className="mt-1">
              {registrantDetail?.role}
            </Badge>
          </div>
        </div>
        <div className="text-muted-foreground">
          {openItem === registrantDetail?.id ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </button>

      {/* Accordion Content - Visible when expanded */}
      <div
        id={`content-${registrantDetail?.id}`}
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          openItem === registrantDetail?.id
            ? "grid-rows-[1fr] opacity-100 p-4 pt-0"
            : "grid-rows-[0fr] opacity-0"
        )}
        aria-hidden={!(openItem === registrantDetail?.id)}
      >
        <div className="overflow-hidden">
          <div className="pt-4 border-t space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{registrantDetail?.contactNo}</span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>
                ID: WS-2025-{registrantDetail?.id.toString().padStart(4, "0")}
              </span>
            </div>

            <Button
              onClick={() => {
                navigate(`/profile/${registrantDetail?.id}`);
              }}
              className="w-full"
            >
              View Full Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
