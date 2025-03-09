interface Post{
    id:string;
    title:string;
    content:string;
    images:string[];
    videos:string[];
    filters:string[];
    createdAt: Date,
    updatedAt: Date,
    ownerId:string,
    role:string,
    profileData:{
        name:string,
        profilePic:string,
    }
}

export default Post;