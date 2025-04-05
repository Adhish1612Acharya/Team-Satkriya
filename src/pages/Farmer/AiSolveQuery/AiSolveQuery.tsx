import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Calendar,
  FileSearch,
  Loader2,
  MessageSquare,
  Plane as Plant,
} from "lucide-react";
import AiQueryForm from "@/components/Forms/AiQueryForm/AiQueryForm";
import PostCard from "@/components/Post/PostCard/PostCard";
import { PostModal } from "@/components/Post/PostModal";
import Post from "@/types/posts.types";
import WorkShop from "@/types/workShop.types";
import { auth } from "@/firebase";
import getUserInfo from "@/utils/getUserInfo";
import WorkshopCard from "@/components/WorkshopCard/WorkshopCard";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

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

  const [queryAsked, setQueryAsked] = useState<boolean>(false);

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
    () => {
      setQueryAsked(false);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background  p-4 sm:p-6">
      <div className="w-full mx-auto space-y-6">
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
            setQueryAsked={setQueryAsked}
          />
        </Card>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center mt-4">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
          </div>
        )}

        {queryAsked && (
          <>
            {results.posts.length > 0 && !loading ? (
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
            ) : (
              <Card className="p-6 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <FileSearch className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    No discussions found yet
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                    Be the first to start a conversation! Share your questions
                    or experiences with our community.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => (window.location.href = "/posts/create")}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start a Discussion
                  </Button>
                </div>
              </Card>
            )}

            {results.workShops.length > 0 && !loading ? (
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
            ) : (
              <Card className="p-6 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Calendar className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    No upcoming workshops scheduled
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                    Check back later for new learning opportunities. We're
                    preparing valuable sessions.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => (window.location.href = "/workshops")}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Explor Other Workshops
                  </Button>
                </div>
              </Card>
            )}
          </>
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
