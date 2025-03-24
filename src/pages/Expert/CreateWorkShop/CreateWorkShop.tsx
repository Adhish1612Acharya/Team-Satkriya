import WorkshopForm from "@/components/Forms/WorkShopForm/WorkShopForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const CreateWorkShop = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg rounded-lg">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create a New Workshop
          </CardTitle>
          <CardDescription className="text-gray-600">
            Fill out the form to publish your workshop.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <WorkshopForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateWorkShop;