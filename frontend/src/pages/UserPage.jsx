import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from "react";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "../slice/postSlice";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [fetchingPost, setFetchingPost] = useState(true);

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/users/profile/${username}`);
        const data = res.data;
        if (data.error) {
          toast.error(data.error);
        }
        setUser(data);
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    // const getUserPosts = async () => {
    //   setFetchingPost(true);
    //   try {
    //     const res = await axios.get(`/api/posts/user/${username}`);
    //     const data = res.data;
    //     if (data.error) {
    //       toast.error(data.error);
    //     }
    //     setPosts(data);
    //   } catch (error) {
    //     toast.error(error);
    //   } finally {
    //     setFetchingPost(false);
    //   }
    // };
    getUser();
    // getUserPosts();
  }, [username]);

  // useEffect(() => {
  //   setFetchingPost(true);
  //   const getUserPosts = async () => {
  //     try {
  //       const res = await axios.get(`/api/posts/user/${username}`);
  //       const data = res.data;
  //       if (data.error) {
  //         toast.error(data.error);
  //       }
  //       dispatch(postData(data));
  //     } catch (error) {
  //       toast.error(error);
  //     } finally {
  //       setFetchingPost(false);
  //     }
  //   };
  //   getUserPosts();
  // }, [username]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <Text>User Not Found</Text>;

  // if (fetchingPost) {
  //   return (
  //     <Flex justifyContent={"center"}>
  //       <Spinner size={"xl"} />
  //     </Flex>
  //   );
  // }

  return (
    <>
      <UserHeader user={user} />
      {!fetchingPost && posts?.length === 0 && <h1>No post Yet</h1>}
      {posts.map((post) => (
        <UserPost key={post._id} postedBy={post?.postedBy} post={post} />
      ))}
      {/* <UserPost
        postImg={"/post1.png"}
        postTitle={"This is my first post"}
        likes={234}
        replies={123}
      />
      <UserPost
        postImg={"/post2.png"}
        postTitle={"Hello Sunshine"}
        likes={546}
        replies={23}
      />
      <UserPost
        postImg={"/post3.png"}
        postTitle={"Hey Everyone"}
        likes={100}
        replies={2}
      />
      <UserPost postTitle={"Hey Guys"} likes={100} replies={2} /> */}
    </>
  );
};

export default UserPage;
