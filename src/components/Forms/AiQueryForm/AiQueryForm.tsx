import { useState, useRef, FC } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Send, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import AiQueryFormProps from "./AiQueryForm.types";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import Post from "@/types/posts.types";
import { findRelevantContent } from "@/utils/geminiApiCalls";
import convertToBase64 from "@/utils/covertToBase64";
import useWorkShop from "@/hooks/useWorkShop/useWorkShop";
import WorkShop from "@/types/workShop.types";

const AiQueryForm: FC<AiQueryFormProps> = ({
  setResults,
  setPostFetchLoading,
  setQueryAsked,
}) => {
  const { fetchAllWorkshops, fetchWorkshopById } = useWorkShop();

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<{ url: string; file: File }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [savedQuery, setSavedQuery] = useState<{
  //   query: string;
  //   images: { url: string; file: File }[];
  // }>({ query: "", images: [] });  //future implementation

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);

    // Reset input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].url); // Clean up the object URL
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const fetchPostsByIds = async (postIds: string[]): Promise<Post[]> => {
    if (postIds.length === 0) return []; // If no IDs, return empty array

    try {
      // Fetch each post individually using getDoc for optimal performance
      const postFetchPromises = postIds.map(async (id) => {
        const postRef = doc(db, "posts", id);
        const postSnap = await getDoc(postRef);
        return postSnap.exists()
          ? ({ id: postSnap.id, ...postSnap.data() } as Post)
          : null;
      });

      // Wait for all post fetch operations to complete
      const posts = (await Promise.all(postFetchPromises)).filter(
        (post) => post !== null
      ) as Post[];

      return posts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const fetchWebinarsByIds = async (
    webinarIds: string[]
  ): Promise<WorkShop[]> => {
    if (webinarIds.length === 0) return []; // If no IDs, return empty array

    try {
      // Fetch each post individually using getDoc for optimal performance
      const webinarFetchPromises = webinarIds.map(async (id) => {
        const webinarSnap = await fetchWorkshopById(id);
        return webinarSnap;
      });

      // Wait for all webinar fetch operations to complete
      const workShopsAndWebinars = (
        await Promise.all(webinarFetchPromises)
      ).filter((webinar) => webinar !== null) as WorkShop[];

      return workShopsAndWebinars;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.warn("Please enter your question before submitting.");
      return;
    }

    setIsLoading(true);

    const base64Images = await Promise.all(
      images.map((image) => convertToBase64(image.file))
    );

    // setSavedQuery({ query, images }); //future implementation

    const postsSnapshot = await getDocs(collection(db, "posts"));
    const posts: Post[] = postsSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Post)
    );

    const workShops = await fetchAllWorkshops();

    const aiRelevantPosts = await findRelevantContent(
      query,
      base64Images,
      posts,
      workShops || []
    );

    const cleanResponse = aiRelevantPosts.replace(/```json|```/g, "");
    const jsonData = JSON.parse(cleanResponse);

    setPostFetchLoading(true);

    const relevantPostIds: string[] = jsonData.relevantPosts || [];
    const relevantWebinarIds: string[] = jsonData.relevantWebinars || [];

    // Fetch only relevant posts using their IDs
    const relevantPosts = await fetchPostsByIds(relevantPostIds);
    const relevantWorkShopsAndWebinars = await fetchWebinarsByIds(
      relevantWebinarIds
    );

    setResults({
      posts: relevantPosts || [],
      workShops: relevantWorkShopsAndWebinars || [],
    });

    setPostFetchLoading(false);

    setIsLoading(false);
    setQuery("");
    setImages([]);
    setQueryAsked(true);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Describe your farming query here... (e.g., 'I noticed reduced milk yield in my Gir cow. What could be the cause?')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="min-h-[120px]"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <div className="relative w-full h-full">
                <img
                  src={image.url}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-full h-full object-contain bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black/90 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          multiple
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          className="flex-1 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length === 3}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload (Max 3 images)
        </Button>
        <Button
          type="submit"
          className="flex-1 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Submit Query
        </Button>
      </div>
    </form>
  );
};

export default AiQueryForm;
