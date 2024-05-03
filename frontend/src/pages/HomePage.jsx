import { Flex, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import UserPost from "../components/UserPost";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "../slice/postSlice";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postSlice.value);
  useEffect(() => {
    const getFeed = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/posts/feed");
        const data = res.data;
        dispatch(postData(data));
        if (data.error) {
          toast.error(data.error);
          return;
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };
    getFeed();
  }, [dispatch]);

  return (
    <>
      {loading && (
        <Flex justifyContent={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {!loading && posts?.length === 0 && <h1>Follow some user to see feed</h1>}
      {posts.map((post) => (
        <UserPost key={post?._id} postedBy={post?.postedBy} post={post} />
      ))}
    </>
  );
};

export default HomePage;
