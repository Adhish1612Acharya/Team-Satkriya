import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, Plane as Plant } from "lucide-react";
import AiQueryForm from "@/components/Forms/AiQueryForm/AiQueryForm";
import PostCard from "@/components/Post/PostCard/PostCard";
import { PostModal } from "@/components/Post/PostModal";
import Post from "@/types/posts.types";
import WorkShop from "@/types/workShop.types";
import { auth } from "@/firebase";
import getUserInfo from "@/utils/getUserInfo";
import WorkshopCard from "@/components/WorkshopCard/WorkshopCard";
import { useAuthContext } from "@/context/AuthContext";

const AiSolveQuery = () => {
  const { userType } = useAuthContext();
  const [results, setResults] = useState<{
    posts: Post[];
    workShops: WorkShop[];
  }>({
    posts: [],
    workShops: [],
  });
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
          userType as "farmers" | "experts"
        );
        setUserRole(userInfo?.role || null);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-xl sm:max-w-2xl md:max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Plant className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl sm:text-3xl font-bold">
              Farmer's AI Assistant
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Get instant answers to your farming queries using AI technology
          </p>
        </div>

        {/* Query Form */}
        <Card className="p-4 sm:p-6 w-full">
          <AiQueryForm
            setResults={setResults}
            setPostFetchLoading={setLoading}
          />
        </Card>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center mt-4">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
          </div>
        )}

        {/* AI Responses */}
        {results.posts.length > 0 && (
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              AI Response
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.posts.map((post, index) => (
                <PostCard
                  key={index}
                  post={post}
                  userRole={userRole}
                  handleMediaClick={handlePostClick}
                />
              ))}
            </div>
          </Card>
        )}

        {/* Workshops */}
        {results.workShops.length > 0 && (
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Upcoming Workshops
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.workShops.map((eachWorkShop, index) => (
                <WorkshopCard
                  userType={userType as "farmers" | "experts"}
                  key={index}
                  workshop={eachWorkShop}
                />
              ))}
            </div>
          </Card>
        )}

        {/* Post Modal */}
        <PostModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default AiSolveQuery;
