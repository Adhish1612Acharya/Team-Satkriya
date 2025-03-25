import Post from "@/types/posts.types";

export  interface CreatePostFormProps{
    firebaseDocuemntType:"experts" | "farmers",
    setPosts:(data:Post[])=>void;
}