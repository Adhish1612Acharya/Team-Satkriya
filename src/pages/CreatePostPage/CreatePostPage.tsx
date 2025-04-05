import CreatePostForm from "@/components/Forms/Posts/CreatePostForm/CreatePostForm";
import { useAuthContext } from "@/context/AuthContext";

const CreatePostPage = () => {
  const { userType } = useAuthContext();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-xl">
          <div className="p-6 sm:p-8">
            {userType && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {userType === "farmers"
                    ? "Share Your Dairy Journey & Get Expert Advice"
                    : "Share Your Expertise & Help Farmers"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {userType === "farmers"
                    ? "Post about your experiences with indigenous breeds, ask questions about milk production, feeding practices, or get solutions to your challenges"
                    : "Share your knowledge and provide solutions to help indigenous dairy farmers overcome their challenges"}
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <CreatePostForm
                firebaseDocuemntType={userType as "farmers" | "experts"}
                post={null}
                editForm={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
