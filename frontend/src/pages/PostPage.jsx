import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "../slice/postSlice";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import useDeletePost from "../../hooks/useDeletePost";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const dispatch = useDispatch();
  const { pid } = useParams();
  const post = useSelector((state) => state.postSlice.value);
  const [loadingPost, setLoadingPost] = useState(true);
  const currentUser = useSelector((state) => state.userSlice.value);
  // const { handleDeletePost } = useDeletePost();

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoadingPost(true);
        const res = await axios.get(`/api/posts/${pid}`);
        const data = res.data;
        if (data.error) {
          toast.error(data.error);
        }
        dispatch(postData(data));
        console.log(data, "data");
      } catch (error) {
        toast.error(error);
      } finally {
        setLoadingPost(false);
      }
    };
    getPost();
  }, [pid]);

  if (loading || loadingPost) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!post) {
    return;
  }

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            src={
              `http://localhost:5000/uploads/${user?.profilePic}` ||
              user?.profilePic
            }
            size={"md"}
            name={user?.username}
          />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user?.username}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={"100px"}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>
          {currentUser?._id === user?._id && (
            <DeleteIcon
              cursor={"pointer"}
              // onClick={handleDeletePost(post._id)}
            />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{post.text}</Text>

      {post.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={`http://localhost:5000/uploads/${post.img}`} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={post} />
      </Flex>

      {/* <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          238 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {200 + (liked ? 1 : 0)} likes
        </Text>
      </Flex> */}

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />
      <Comment
        comment="Looks Good"
        createdAt="1d"
        likes={200}
        username={"Mark Zukerberge"}
        profilePic={"/post1.png"}
      />
      <Comment
        comment="Amazing"
        createdAt="3d"
        likes={100}
        username={"Johndeo"}
        profilePic={"/post2.png"}
      />
      <Comment
        comment="Ohh looks very pretty"
        createdAt="6d"
        likes={800}
        username={"Mark Zukerberge"}
        profilePic={"/post3.png"}
      />
    </>
  );
};

export default PostPage;
