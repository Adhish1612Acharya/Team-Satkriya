import WorkshopForm from "@/components/Forms/WorkShopForm/WorkShopForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateWorkShop = () => {
  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-center">Create New Workshop</CardTitle>
      </CardHeader>
      <CardContent>
        <WorkshopForm />
      </CardContent>
    </Card>
  );
};

export default CreateWorkShop;
