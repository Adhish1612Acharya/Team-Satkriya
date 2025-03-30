interface CreatePostDialogProps {
    open:boolean;
    setOpen:(value:boolean)=>void;
    userType:"farmers" | "experts"
}

export default CreatePostDialogProps;