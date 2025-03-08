import { useState, useRef } from "react";
import { PostCard } from "@/components/posts/PostCard";
import { PostModal } from "@/components/posts/PostModal";
import { Post } from "../index";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  ImageIcon, 
  VideoIcon, 
  X, 
  FileText, 
  Link2, 
  Calendar, 
  Smile 
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

// Mock data for posts
const mockPosts: Post[] = [
  {
    id: "post-1",
    authorId: "farmer-123",
    authorName: "Rajesh Kumar",
    authorProfilePhoto: "https://images.unsplash.com/photo-1628102491629-778571d893a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    authorType: "Farmer",
    content: "Just welcomed a new calf to our indigenous Gir cow herd! This breed is known for its high milk yield and disease resistance. #IndianCows #GirBreed #SustainableFarming",
    mediaUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    mediaType: "image",
    likes: 42,
    comments: [
      {
        id: "comment-1",
        authorId: "doctor-123",
        authorName: "Dr. Priya Sharma",
        authorProfilePhoto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        content: "Beautiful calf! Make sure to monitor its health closely in the first few weeks. I'd be happy to provide a free check-up.",
        createdAt: "2025-05-15T10:30:00Z"
      },
      {
        id: "comment-2",
        authorId: "ngo-123",
        authorName: "Cow Protection Foundation",
        authorProfilePhoto: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        content: "This is exactly the kind of indigenous breeding we're promoting! Would you be interested in joining our farmer network?",
        createdAt: "2025-05-15T11:45:00Z"
      }
    ],
    createdAt: "2025-05-15T09:00:00Z"
  },
  {
    id: "post-2",
    authorId: "doctor-123",
    authorName: "Dr. Priya Sharma",
    authorProfilePhoto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    authorType: "Doctor",
    content: "Today I conducted a workshop on preventive healthcare for indigenous cow breeds. The A2 milk from these cows has numerous health benefits compared to A1 milk from foreign breeds. #CowHealth #A2Milk #IndigenousBreeds",
    mediaUrl: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80",
    mediaType: "image",
    likes: 38,
    comments: [
      {
        id: "comment-3",
        authorId: "volunteer-123",
        authorName: "Amit Patel",
        authorProfilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        content: "Great initiative! Can you share some resources about A2 milk benefits?",
        createdAt: "2025-05-14T15:20:00Z"
      }
    ],
    createdAt: "2025-05-14T14:30:00Z"
  },
  {
    id: "post-3",
    authorId: "institute-123",
    authorName: "National Dairy Research Institute",
    authorProfilePhoto: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    authorType: "ResearchInstitute",
    content: "Our latest research paper on genetic preservation of indigenous cow breeds is now available. We've identified key markers that can help in selective breeding programs to maintain the purity of these valuable genetic resources.",
    likes: 56,
    comments: [],
    createdAt: "2025-05-13T09:15:00Z"
  },
  {
    id: "post-4",
    authorId: "ngo-123",
    authorName: "Cow Protection Foundation",
    authorProfilePhoto: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    authorType: "NGO",
    content: "We're excited to announce our new 'Adopt a Cow' program! Help support indigenous cow conservation by sponsoring a cow at our sanctuary. Your contribution helps provide food, shelter, and medical care.",
    mediaUrl: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    mediaType: "image",
    likes: 87,
    comments: [
      {
        id: "comment-4",
        authorId: "farmer-123",
        authorName: "Rajesh Kumar",
        authorProfilePhoto: "https://images.unsplash.com/photo-1628102491629-778571d893a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        content: "This is a wonderful initiative! I'll definitely share this with my community.",
        createdAt: "2025-05-12T14:10:00Z"
      }
    ],
    createdAt: "2025-05-12T11:45:00Z"
  },
  {
    id: "post-5",
    authorId: "volunteer-123",
    authorName: "Amit Patel",
    authorProfilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    authorType: "Volunteer",
    content: "Just finished a training session on sustainable cow farming practices. Here's a short video showing the proper way to set up a cow shelter that maximizes comfort and health for indigenous breeds.",
    mediaUrl: "/src/assets/video1.mp4",
    mediaType: "video",
    likes: 29,
    comments: [],
    createdAt: "2025-05-11T16:20:00Z"
  },
  {
    id: "post-6",
    authorId: "farmer-456",
    authorName: "Meera Devi",
    authorProfilePhoto: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    authorType: "Farmer",
    content: "Sharing a video from our recent workshop on traditional cow care methods. These practices have been passed down through generations and are crucial for maintaining the health of our indigenous breeds.",
    mediaUrl: "/src/assets/video2.mp4",
    mediaType: "video",
    likes: 45,
    comments: [
      {
        id: "comment-5",
        authorId: "doctor-456",
        authorName: "Dr. Ramesh Verma",
        authorProfilePhoto: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        content: "Excellent demonstration! These traditional methods combined with modern veterinary practices can work wonders.",
        createdAt: "2025-05-10T13:20:00Z"
      }
    ],
    createdAt: "2025-05-10T11:30:00Z"
  }
];

export function PostsPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostMedia, setNewPostMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleLike = (postId: string) => {
    // In a real app, this would call an API
    console.log(`Liked post ${postId}`);
  };

  const handleComment = (postId: string, comment: string) => {
    // In a real app, this would call an API
    console.log(`Commented on post ${postId}: ${comment}`);
    
    // For demo purposes, we'll update the local state
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `comment-${Date.now()}`,
              authorId: "volunteer-123", // Assuming the current user is a volunteer
              authorName: "Amit Patel",
              authorProfilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
              content: comment,
              createdAt: new Date().toISOString()
            }
          ]
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
    if (post.mediaUrl) {
      setSelectedPost(post);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim() && !newPostMedia) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: "volunteer-123", // Assuming the current user is a volunteer
      authorName: "Amit Patel",
      authorProfilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      authorType: "Volunteer",
      content: newPostContent,
      mediaUrl: newPostMedia?.url,
      mediaType: newPostMedia?.type,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setNewPostMedia(null);
  };

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      // Fallback for demo
      setNewPostMedia({
        url: "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        type: "image"
      });
    }
  };

  const handleAddVideo = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    } else {
      // Fallback for demo
      setNewPostMedia({
        url: "/src/pages/posts/video1.mp4",
        type: "video"
      });
    }
  };

  const handleRemoveMedia = () => {
    setNewPostMedia(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would upload the file to a server
      // For demo, we'll use a local URL
      const url = URL.createObjectURL(file);
      setNewPostMedia({
        url,
        type: "image"
      });
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would upload the file to a server
      // For demo, we'll use a local URL
      const url = URL.createObjectURL(file);
      setNewPostMedia({
        url,
        type: "video"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Community Posts</h1>
        
        {/* Create Post Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start space-x-3 mb-4">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" alt="Your profile" />
                <AvatarFallback>YP</AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="Share your thoughts about Indian cow conservation..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="flex-1 resize-none"
              />
            </div>
            
            {newPostMedia && (
              <div className="relative mb-4 rounded-md overflow-hidden">
                {newPostMedia.type === 'image' ? (
                  <img 
                    src={newPostMedia.url} 
                    alt="Post preview" 
                    className="w-full h-auto rounded-md"
                  />
                ) : (
                  <video 
                    src={newPostMedia.url} 
                    controls 
                    className="w-full h-auto rounded-md"
                  />
                )}
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={handleRemoveMedia}
                >
                  <X size={16} />
                </Button>
              </div>
            )}
            
            <Tabs defaultValue="post">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="post" className="flex-1">Post</TabsTrigger>
                <TabsTrigger value="media" className="flex-1">Media</TabsTrigger>
                <TabsTrigger value="document" className="flex-1">Document</TabsTrigger>
                <TabsTrigger value="event" className="flex-1">Event</TabsTrigger>
              </TabsList>
              
              <TabsContent value="post" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleAddImage} className="flex items-center">
                      <ImageIcon size={16} className="mr-1" />
                      <span>Image</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleAddVideo} className="flex items-center">
                      <VideoIcon size={16} className="mr-1" />
                      <span>Video</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Smile size={16} className="mr-1" />
                      <span>Feeling</span>
                    </Button>
                  </div>
                  <Button 
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() && !newPostMedia}
                  >
                    Post
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="media">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleAddImage} className="flex items-center">
                      <ImageIcon size={16} className="mr-1" />
                      <span>Photo</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleAddVideo} className="flex items-center">
                      <VideoIcon size={16} className="mr-1" />
                      <span>Video</span>
                    </Button>
                  </div>
                  <Button 
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() && !newPostMedia}
                  >
                    Post
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="document">
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <FileText size={16} className="mr-1" />
                    <span>Upload Document</span>
                  </Button>
                  <Button 
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() && !newPostMedia}
                  >
                    Post
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="event">
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>Create Event</span>
                  </Button>
                  <Button 
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() && !newPostMedia}
                  >
                    Post
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Hidden file inputs */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
            <input 
              type="file" 
              ref={videoInputRef} 
              className="hidden" 
              accept="video/*" 
              onChange={handleVideoChange}
            />
          </div>
        </Card>
        
        {/* Filter Options */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Posts</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              All Posts
            </Button>
            <Button variant="ghost" size="sm">
              Popular
            </Button>
            <Button variant="ghost" size="sm">
              Following
            </Button>
          </div>
        </div>
        
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