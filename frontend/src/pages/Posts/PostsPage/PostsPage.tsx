import { useEffect, useState} from "react";
import { PostCard } from "@/components/posts/PostCard/PostCard";
import { PostModal } from "@/components/posts/PostModal";
import { Card } from "@/components/ui/card";
import Post from "@/types/posts.types";
import CreatePostForm from "@/components/Forms/Posts/CreatePostForm/CreatePostForm";
import usePost from "@/hooks/expert/usePost/usePost";

// Mock data for posts
const mockPosts: Post[] = [
  {
    id: "post-1",
    authorId: "farmer-123",
    authorName: "Rajesh Kumar",
    authorProfilePhoto:
      "https://images.unsplash.com/photo-1628102491629-778571d893a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    authorType: "Farmer",
    content:
      "Just welcomed a new calf to our indigenous Gir cow herd! This breed is known for its high milk yield and disease resistance. #IndianCows #GirBreed #SustainableFarming",
    mediaUrl:
      "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    mediaType: "image",
    likes: 42,
    comments: [
      {
        id: "comment-1",
        authorId: "doctor-123",
        authorName: "Dr. Priya Sharma",
        authorProfilePhoto:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        content:
          "Beautiful calf! Make sure to monitor its health closely in the first few weeks. I'd be happy to provide a free check-up.",
        createdAt: "2025-05-15T10:30:00Z",
      },
      {
        id: "comment-2",
        authorId: "ngo-123",
        authorName: "Cow Protection Foundation",
        authorProfilePhoto:
          "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        content:
          "This is exactly the kind of indigenous breeding we're promoting! Would you be interested in joining our farmer network?",
        createdAt: "2025-05-15T11:45:00Z",
      },
    ],
    createdAt: "2025-05-15T09:00:00Z",
  },
  {
    id: "post-2",
    authorId: "doctor-123",
    authorName: "Dr. Priya Sharma",
    authorProfilePhoto:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    authorType: "Doctor",
    content:
      "Today I conducted a workshop on preventive healthcare for indigenous cow breeds. The A2 milk from these cows has numerous health benefits compared to A1 milk from foreign breeds. #CowHealth #A2Milk #IndigenousBreeds",
    mediaUrl:
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80",
    mediaType: "image",
    likes: 38,
    comments: [
      {
        id: "comment-3",
        authorId: "volunteer-123",
        authorName: "Amit Patel",
        authorProfilePhoto:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        content:
          "Great initiative! Can you share some resources about A2 milk benefits?",
        createdAt: "2025-05-14T15:20:00Z",
      },
    ],
    createdAt: "2025-05-14T14:30:00Z",
  },
  {
    id: "post-3",
    authorId: "institute-123",
    authorName: "National Dairy Research Institute",
    authorProfilePhoto:
      "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    authorType: "ResearchInstitute",
    content:
      "Our latest research paper on genetic preservation of indigenous cow breeds is now available. We've identified key markers that can help in selective breeding programs to maintain the purity of these valuable genetic resources.",
    likes: 56,
    comments: [],
    createdAt: "2025-05-13T09:15:00Z",
  },
  {
    id: "post-4",
    authorId: "ngo-123",
    authorName: "Cow Protection Foundation",
    authorProfilePhoto:
      "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    authorType: "NGO",
    content:
      "We're excited to announce our new 'Adopt a Cow' program! Help support indigenous cow conservation by sponsoring a cow at our sanctuary. Your contribution helps provide food, shelter, and medical care.",
    mediaUrl:
      "https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    mediaType: "image",
    likes: 87,
    comments: [
      {
        id: "comment-4",
        authorId: "farmer-123",
        authorName: "Rajesh Kumar",
        authorProfilePhoto:
          "https://images.unsplash.com/photo-1628102491629-778571d893a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        content:
          "This is a wonderful initiative! I'll definitely share this with my community.",
        createdAt: "2025-05-12T14:10:00Z",
      },
    ],
    createdAt: "2025-05-12T11:45:00Z",
  },
  {
    id: "post-5",
    authorId: "volunteer-123",
    authorName: "Amit Patel",
    authorProfilePhoto:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    authorType: "Volunteer",
    content:
      "Just finished a training session on sustainable cow farming practices. Here's a short video showing the proper way to set up a cow shelter that maximizes comfort and health for indigenous breeds.",
    mediaUrl: "/src/assets/video1.mp4",
    mediaType: "video",
    likes: 29,
    comments: [],
    createdAt: "2025-05-11T16:20:00Z",
  },
  {
    id: "post-6",
    authorId: "farmer-456",
    authorName: "Meera Devi",
    authorProfilePhoto:
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    authorType: "Farmer",
    content:
      "Sharing a video from our recent workshop on traditional cow care methods. These practices have been passed down through generations and are crucial for maintaining the health of our indigenous breeds.",
    mediaUrl: "/src/assets/video2.mp4",
    mediaType: "video",
    likes: 45,
    comments: [
      {
        id: "comment-5",
        authorId: "doctor-456",
        authorName: "Dr. Ramesh Verma",
        authorProfilePhoto:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        content:
          "Excellent demonstration! These traditional methods combined with modern veterinary practices can work wonders.",
        createdAt: "2025-05-10T13:20:00Z",
      },
    ],
    createdAt: "2025-05-10T11:30:00Z",
  },
];

export function PostsPage() {

  const {getAllPosts,getPostLoading}=usePost();

  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(()=>{
    async function getPosts(){
     const postData= await getAllPosts();
     setPosts(postData);
    }

    getPosts();
  },[]);

  const handleLike = (postId: string) => {
    // In a real app, this would call an API
    console.log(`Liked post ${postId}`);
  };

  const handleComment = (postId: string, comment: string) => {
    // In a real app, this would call an API
    console.log(`Commented on post ${postId}: ${comment}`);

    // For demo purposes, we'll update the local state
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            // ...post,
            {
              id: `comment-${Date.now()}`,
              authorId: "volunteer-123", // Assuming the current user is a volunteer
              authorName: "Amit Patel",
              authorProfilePhoto:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
              content: comment,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
      return post;
    });

    setPosts(updatedPosts);
  };

  const handleShare = (postId: string) => {
    // In a real app, this would open a share dialog
    console.log(`Shared post ${postId}`);
    alert("Share functionality would be implemented here!");
  };

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

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Community Posts</h1>

        <Card className="mb-8 overflow-hidden">
          <CreatePostForm firebaseDocuemntType={"experts"} />
        </Card>

        {/* Posts Feed */}
        <div>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onPostClick={handlePostClick}
            />
          ))}
        </div>

        {/* Post Modal */}
        <PostModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
        />
      </div>
    </div>
  );
}
