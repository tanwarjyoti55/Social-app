import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postData } from "../src/slice/postSlice";

const useDeletePost = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const user = useSelector((state) => state.userSlice.value);
  const posts = useSelector((state) => state.postSlice.value);
  const handleDeletePost = async (postId) => {
    try {
      if (!window.confirm("Are you sure want to delete this post")) return;
      const res = await axios.delete(`/api/posts/${postId}`);
      const data = res.data;
      if (data.error) {
        toast.error(data.error);
      }
      dispatch(postData(posts.filter((pid) => pid !== postId)));
      navigate(`/${user.username}`);
    } catch (error) {
      toast.error(error);
    }
  };
  return { handleDeletePost };
};

export default useDeletePost;
