export interface PostArgu{
    title:string;
    content:string;
    images:File[];
    videos:File[];
    role:string;
}

export type CreatePostType=(postData:PostArgu)=>Promise<void>;