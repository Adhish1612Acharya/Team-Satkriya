import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC } from "react";
import CreatePostDialogProps from "./CreatePostDialog.types";
import CreatePostForm from "../Forms/Posts/CreatePostForm/CreatePostForm";

const CreatePostDialog: FC<CreatePostDialogProps> = ({
  open,
  setOpen,
  userType,
  editForm,
  editPost,
  setEditForm,
  setEditPost,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (editForm) {
          setEditForm(false);
          setEditPost(null);
        }
        setOpen(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editForm?"Edit Post" : "Create Post"}</DialogTitle>
          <DialogDescription>Share your knowledge here</DialogDescription>
        </DialogHeader>
        <CreatePostForm
          editForm={editForm}
          post={editPost}
          firebaseDocuemntType={userType as "farmers" | "experts"}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
