import Post from "@/types/posts.types";
import WorkShop from "@/types/workShop.types";

interface FilterProps {
  setData: (data: Post[] | WorkShop[]) => void;
  filters: any;
  isPost: boolean;
  setLoading: (value: boolean) => void;
}

export default FilterProps;
