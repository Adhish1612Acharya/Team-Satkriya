import Post from "@/types/posts.types";

export interface PostArgu{
    content:string;
    images:File[];
    videos:File[];
    documents:File[];
    filters:string[];
}

export type CreatePostType=(postData:PostArgu,firebaseDocument:"experts" | "farmers")=>Promise<void>;

export type GetAllPostType=()=>Promise<Post[] | void>;

export type GetFilteredPostType=(filters:string[])=>Promise<Post[] | void>;

export type GetYourPostType=()=>Promise<Post[] | void>