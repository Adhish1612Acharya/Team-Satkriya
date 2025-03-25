import WorkshopForm from "@/components/Forms/WorkShopForm/WorkShopForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";

const CreateWorkShop = () => {
  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
    <Card className="w-full max-w-4xl shadow-xl rounded-xl overflow-hidden">
      {/* Header with gradient */}
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8" />
          <div>
            <CardTitle className="text-2xl font-bold">Create New Workshop</CardTitle>
            <CardDescription className="text-blue-100">
              Fill out the details to publish your workshop
            </CardDescription>
          </div>
        </div>
      </CardHeader>
  
      <CardContent className="p-6 md:p-8">
          <WorkshopForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateWorkShop;