import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from "react";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "../slice/postSlice";
import useGetUserProfile from "../../hooks/useGetUserProfile";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postSlice.value);
  const [fetchingPost, setFetchingPost] = useState(true);

  useEffect(() => {
    const getUserPosts = async () => {
      setFetchingPost(true);
      try {
        const res = await axios.get(`/api/posts/user/${username}`);
        const data = res.data;
        if (data.error) {
          toast.error(data.error);
        }
        dispatch(postData(data));
      } catch (error) {
        toast.error(error);
      } finally {
        setFetchingPost(false);
      }
    };
    getUserPosts();
  }, [dispatch, username]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <Text>User Not Found</Text>;

  if (fetchingPost) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!posts) return;
  return (
    <>
      <UserHeader user={user} />
      {!fetchingPost && posts?.length === 0 && (
        <h1 style={{ marginTop: "20px", fontSize: 18 }}>No post Yet</h1>
      )}
      {posts &&
        posts.length > 0 &&
        posts.map((post) => (
          <UserPost key={post._id} postedBy={post.postedBy} post={post} />
        ))}
    </>
  );
};

export default UserPage;
