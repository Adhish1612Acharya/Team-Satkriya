import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC } from "react";
import CreatePostDialogProps from "./CreatePostDialog.types";
import CreatePostForm from "../Forms/Posts/CreatePostForm/CreatePostForm";

const CreatePostDialog: FC<CreatePostDialogProps> = ({ open, setOpen,userType }) => {
  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Share your knowledge here
          </DialogDescription>
        </DialogHeader>
       <CreatePostForm  firebaseDocuemntType={userType as "farmers" | "experts"} />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
