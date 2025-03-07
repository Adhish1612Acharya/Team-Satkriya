export interface PostArgu{
    title:string;
    content:string;
    images:File[];
    videos:File[];
}

export type CreatePostType=(postData:PostArgu)=>Promise<void>;