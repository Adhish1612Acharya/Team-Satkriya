import Post from "@/types/posts.types";

export interface PostArgu{
    content:string;
    images:File[];
    videos:File[];
    documents:File[];
}

export type CreatePostType=(postData:PostArgu)=>Promise<void>;

export type GetAllPostType=()=>Promise<Post[] | void>;

export type GetFilteredPostType=(filters:string[])=>Promise<Post[] | void>;

export type GetYourPostType=()=>Promise<Post[] | void>