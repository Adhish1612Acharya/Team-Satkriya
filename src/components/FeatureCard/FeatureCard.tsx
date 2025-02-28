import { FC } from "react";
import { Card, CardContent } from "../ui/card";
import FeatureCardProps from "./FeatureCard.types";

const FeatureCard: FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="text-center">
      <CardContent className="pt-6">
        <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
