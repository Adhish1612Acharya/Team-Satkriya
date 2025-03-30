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
import usePost from "@/hooks/usePost/usePost";
import { FC, useRef, useState } from "react";
import { CreatePostFormProps } from "./CreatePostForm.types";
import { PostArgu } from "@/hooks/usePost/usePost.types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, VideoIcon, X, FileText, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { validateAndVerifyPost } from "@/utils/geminiApiCalls";
import convertToBase64 from "@/utils/covertToBase64";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreatePostForm: FC<CreatePostFormProps> = ({ firebaseDocuemntType }) => {
  const navigate = useNavigate();
  const { createPost } = usePost();

  const [newPostImage, setNewPostImage] = useState<File[]>([]);
  const [newPostVideo, setNewPostVideo] = useState<File[]>([]);
  const [newPostDocument, setNewPostDocument] = useState<File[]>([]);

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

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    mediaType: "image" | "video" | "document"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (mediaType === "image") {
        setNewPostImage([file]);
        setNewPostVideo([]);
        setNewPostDocument([]);
      } else if (mediaType === "video") {
        setNewPostVideo([file]);
        setNewPostImage([]);
        setNewPostDocument([]);
      } else {
        setNewPostDocument([file]);
        setNewPostImage([]);
        setNewPostVideo([]);
      }
      const url = URL.createObjectURL(file);
      form.setValue("media", { url, type: mediaType });

      event.target.value = "";
    }
  };

  const handleRemoveMedia = () => {
    form.setValue("media", null);
    setNewPostImage([]);
    setNewPostVideo([]);
    setNewPostDocument([]);

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (documentInputRef.current) documentInputRef.current.value = "";
  };

  const onSubmit = async (data: z.infer<typeof postSchema>) => {
    const file =
      newPostImage.length === 1
        ? newPostImage[0]
        : newPostDocument.length === 1
        ? newPostDocument[0]
        : newPostVideo.length === 1
        ? newPostVideo[0]
        : "";

    let base64File = "";

    if (file !== "") {
      base64File = await convertToBase64(file);
    }

    const aiVarification = await validateAndVerifyPost(
      {
        content: data.content,
      },
      base64File
    );
    const cleanResponse = aiVarification?.replace(/```json|```/g, "");

    let jsonData;

    if (cleanResponse) {
      jsonData = JSON.parse(cleanResponse);
    } else if (!cleanResponse) {
      toast.error("Post verification error");
      return;
    }

    if (jsonData?.valid === "true") {
      const postFilters = await categorizePost(data.content, newPostImage[0]);

      let newPost: PostArgu;

      if (jsonData?.verify) {
        newPost = {
          content: data.content.replace(/\n/g, "\\n"),
          images: newPostImage,
          videos: newPostVideo,
          documents: newPostDocument,
          filters: postFilters,
          verified: [],
        };
      } else {
        newPost = {
          content: data.content.replace(/\n/g, "\\n"),
          images: newPostImage,
          videos: newPostVideo,
          documents: newPostDocument,
          filters: postFilters,
          verified: null,
        };
      }

      const newPostId = await createPost(newPost, firebaseDocuemntType);
      if (newPostId) {
        navigate(`/posts/${newPostId}`);
      }
    } else {
      toast.error("Irrelavant posts");
      return;
    }
    // form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-4">
          <div className="flex items-start space-x-3 mb-4">
            <Avatar className="w-10 h-10">
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
                      className="resize-none min-h-[100px] sm:min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {media && (
            <div className="relative mb-4 rounded-md overflow-hidden h-48 sm:h-64 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              {media.type === "image" ? (
                <img
                  src={media.url}
                  alt="Post preview"
                  className="h-full w-auto object-contain rounded-md"
                />
              ) : media.type === "video" ? (
                <video
                  src={media.url}
                  controls
                  className="h-full w-auto object-contain rounded-md"
                />
              ) : (
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-center"
                >
                  View Document
                </a>
              )}

              <Button
                variant="destructive"
                size="icon"
                type="button"
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white"
                onClick={handleRemoveMedia}
              >
                <X size={16} />
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddImage}
                className="flex items-center text-xs sm:text-sm"
              >
                <ImageIcon size={16} className="mr-1" />
                <span>Image</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddVideo}
                className="flex items-center text-xs sm:text-sm"
              >
                <VideoIcon size={16} className="mr-1" />
                <span>Video</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddDocument}
                className="flex items-center text-xs sm:text-sm"
              >
                <FileText size={16} className="mr-1" />
                <span>Document</span>
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto"
                  disabled={
               (!form.watch("content") && !media) ||
               form.formState.isSubmitting
             }
           >
             {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Submit"}
            </Button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(file) => handleFileChange(file, "image")}
          />
          <input
            type="file"
            ref={videoInputRef}
            className="hidden"
            accept="video/*"
            onChange={(file) => handleFileChange(file, "video")}
          />
          <input
            type="file"
            ref={documentInputRef}
            className="hidden"
            accept=".pdf"
            onChange={(file) => handleFileChange(file, "document")}
          />
        </div>
      </form>
    </Form>
  );
};

export default CreatePostForm;
