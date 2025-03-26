import { FC } from "react";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BreedCardProps from "./BreedCard.types";
import { useNavigate } from "react-router-dom";

const BreedCard: FC<BreedCardProps> = ({
  name,
  image,
  description,
  traits,
  navigateLink,
}) => {
  const navigate = useNavigate();
  return (
    <Card className="overflow-hidden transition-transform hover:scale-105">
      <div className="w-full h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <img
          src={image}
          alt={name}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      <CardContent className="p-6">
        <h3 className="text-2xl font-bold text-primary mb-2">{name}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="space-y-2">
          {traits.map((trait, index) => (
            <div key={index} className="flex items-center text-sm">
              <Info className="h-4 w-4 text-primary mr-2" />
              <span className="text-muted-foreground">{trait}</span>
            </div>
          ))}
        </div>
        <Button className="mt-4 w-full" onClick={() => navigate(navigateLink)}>
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
};

export default BreedCard;
