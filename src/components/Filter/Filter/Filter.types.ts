import Post from "@/types/posts.types";

interface FilterProps {
  setPosts: (posts: Post[]) => void;
}

export default FilterProps;
