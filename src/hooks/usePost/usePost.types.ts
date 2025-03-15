import Post from "@/types/posts.types";

export interface PostArgu{
    content:string;
    images:File[];
    videos:File[];
    documents:File[];
    filters:string[];
}

export type CreatePostType=(postData:PostArgu,firebaseDocument:"experts" | "farmers")=>Promise<void>;

export type GetAllPostType=()=>Promise<Post[] >;

export type GetFilteredPostType=(filters:string[],userType:string | null)=>Promise<Post[] >;

export type GetYourPostType=()=>Promise<Post[]>