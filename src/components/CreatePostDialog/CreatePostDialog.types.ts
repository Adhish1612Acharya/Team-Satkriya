import Post from "@/types/posts.types";

interface CreatePostDialogProps {
    open:boolean;
    setOpen:(value:boolean)=>void;
    userType:"farmers" | "experts"
    editForm:boolean;
    editPost:Post | null
    setEditForm:(value:boolean)=>void;
    setEditPost:(value:Post | null)=>void;
}

export default CreatePostDialogProps;