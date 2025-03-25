import Post from "@/types/posts.types";
import WorkShop from "@/types/workShop.types";

interface AiQueryFormProps {
  setResults: (data: {
    posts: Post[];
    workShops: WorkShop[];
  }) => void;
  setPostFetchLoading:(laod:boolean)=>void
}

export default AiQueryFormProps;
