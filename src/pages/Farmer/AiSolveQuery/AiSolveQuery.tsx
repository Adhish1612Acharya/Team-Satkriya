import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plane as Plant } from "lucide-react";
import AiQueryForm from "@/components/Forms/AiQueryForm/AiQueryForm";
import PostCard from "@/components/Post/PostCard/PostCard";
import { PostModal } from "@/components/Post/PostModal";
import Post from "@/types/posts.types";
import { auth } from "@/firebase";
import getUserInfo from "@/utils/getUserInfo";

const AiSolveQuery = () => {
  const [results, setResults] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<
    "farmer" | "doctor" | "ngo" | "volunteer" | "researchInstitution" | null
  >(null);
  const [loading, setLoading] = useState(false);

  const handlePostClick = (post: Post) => {
    if (post) {
      setSelectedPost(post);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  useEffect(() => {
    async function fetchUserData() {
      if (!auth.currentUser) return;

      try {
        const userInfo = await getUserInfo(
          auth.currentUser.uid,
          localStorage.getItem("userType") as "farmers" | "experts"
        );

        console.log("UserInfo: ", userInfo);
        setUserRole(userInfo?.role || null);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Plant className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold">Farmer's AI Assistant</h1>
        </div>
        <p className="text-muted-foreground">
          Get instant answers to your farming queries using AI technology
        </p>
      </div>

      {/* Query Form */}
      <Card className="p-6 w-full">
        <AiQueryForm setResults={setResults} setPostFetchLoading={setLoading} />
      </Card>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center mt-4">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        </div>
      )}

      {/* AI Response Section */}
      {results.length > 0 ? (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">AI Response</h2>
          {/* <ScrollArea className="h-[300px] rounded-md border p-4"> */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {results.map((result, index) => (
                <PostCard
                  key={index}
                  post={result}
                  userRole={userRole}
                  handleMediaClick={handlePostClick}
                />
              ))}
            </div>
            <div className="mt-6 pt-6 border-t flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-4">
                Not satisfied with the AI response?
              </p>
              <Button variant="outline" className="flex items-center gap-2">
                <Plant className="w-5 h-5" />
                Ask a Farming Specialist
              </Button>
            </div>
          {/* </ScrollArea> */}
        </Card>
      ) : (
        !loading && (
          <div className="flex flex-col items-center justify-center mt-6">
            <img
              src="/images/no-results.png"
              alt="No Results"
              className="w-64 h-64"
            />
            <p className="text-lg font-medium text-gray-500 mt-4">
              No relevant posts found.
            </p>
            <Button className="mt-4" variant="default">
              Ask a Farming Specialist
            </Button>
          </div>
        )
      )}
    </div>

    {/* Post Modal */}
    <PostModal
      post={selectedPost}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
    />
  </div>
  );
};

export default AiSolveQuery;
