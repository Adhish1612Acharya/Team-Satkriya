import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import categorizePost from "@/pages/Posts/PostsPage/utils/categorisePost";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import postSchema from "./CreatePostFormSchema";
import usePost from "@/hooks/expert/usePost/usePost";
import { FC, useRef, useState } from "react";
import { CreatePostFormProps } from "./CreatePostForm.types";
import { PostArgu } from "@/hooks/expert/usePost/usePost.types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, VideoIcon, X, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CreatePostForm: FC<CreatePostFormProps> = ({
firebaseDocuemntType
}) => {

  const [newPostImage, setNewPostImage] = useState<File[]>([]);
  const [newPostVideo, setNewPostVideo] = useState<File[]>([]);
  const [newPostDocument, setNewPostDocument] = useState<File[]>([]);

  const { createPost } = usePost();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      media: null,
    },
  });

  const media = form.watch("media");

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddVideo = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
  };

  const handleAddDocument = () => {
    if (documentInputRef.current) {
      documentInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>,mediaType:"image" | "video" | "document") => {
    console.log("HanleFileChange : ");
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      if(mediaType==="image"){
        setNewPostImage((prev) => [...prev, file]);
      }else if(mediaType==="video"){
        setNewPostVideo((prev) => [...prev, file]);
      }else{
        setNewPostDocument((prev) => [...prev, file]);
      }
      const url = URL.createObjectURL(file);
      form.setValue("media", { url, type: mediaType });

      event.target.value = "";
    }
  };

  const handleRemoveMedia=()=>{
    form.setValue("media", null);
    setNewPostImage([]);
    setNewPostVideo([]);
    setNewPostDocument([]);

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (documentInputRef.current) documentInputRef.current.value = "";
  }

  const onSubmit = async (data: z.infer<typeof postSchema>) => {
    const postFilters = await categorizePost(data.content, newPostImage[0]);

    console.log("Post Filters : ", postFilters);

    const newPost: PostArgu = {
      content: data.content,
      images: newPostImage,
      videos: newPostVideo,
      documents: newPostDocument,
      filters: postFilters,
    };

    const categorizedPostData = await createPost(newPost, firebaseDocuemntType);

    console.log("CategorisedPostData : ", categorizedPostData);

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-4">
          <div className="flex items-start space-x-3 mb-4">
            <Avatar>
              <AvatarImage
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                alt="Your profile"
              />
              <AvatarFallback>YP</AvatarFallback>
            </Avatar>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share your thoughts about Indian cow conservation..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {media && (
            <div className="relative mb-4 rounded-md overflow-hidden">
              {media.type === "image" ? (
                <img
                  src={media.url}
                  alt="Post preview"
                  className="w-full h-auto rounded-md"
                />
              ) : media.type === "video" ? (
                <video
                  src={media.url}
                  controls
                  className="w-full h-auto rounded-md"
                />
              ) : (
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Document
                </a>
              )}
              <Button
                variant="destructive"
                size="icon"
                type="button"
                className="absolute top-2 right-2"
                onClick={handleRemoveMedia}
              >
                <X size={16} />
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddImage}
                className="flex items-center"
              >
                <ImageIcon size={16} className="mr-1" />
                <span>Image</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddVideo}
                className="flex items-center"
              >
                <VideoIcon size={16} className="mr-1" />
                <span>Video</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddDocument}
                className="flex items-center"
              >
                <FileText size={16} className="mr-1" />
                <span>Upload Document</span>
              </Button>
            </div>
            <Button type="submit" disabled={!form.watch("content") && !media}>
              Post
            </Button>
          </div>

          {/* Hidden file inputs */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(file)=>handleFileChange(file,"image")}
          />
          <input
            type="file"
            ref={videoInputRef}
            className="hidden"
            accept="video/*"
            onChange={(file)=>handleFileChange(file,"video")}
          />
          <input
            type="file"
            ref={documentInputRef}
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={(file)=>handleFileChange(file,"document")}
          />
        </div>
      </form>
    </Form>
  );
};

export default CreatePostForm;
