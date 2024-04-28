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
  const { handleDeletePost } = useDeletePost();

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
  }, [pid, dispatch]);

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

  const createdAtDate = post?.createdAt ? new Date(post.createdAt) : null;

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
            {createdAtDate ? (
              <>{formatDistanceToNow(createdAtDate)} ago</>
            ) : (
              "Unknown"
            )}
          </Text>
          {currentUser?._id === user?._id && (
            <DeleteIcon
              cursor={"pointer"}
              onClick={() => handleDeletePost(post._id)}
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

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />

      {post?.replies?.map((reply) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <Comment
            comment={reply?.text}
            createdAt={
              createdAtDate ? (
                <>{formatDistanceToNow(createdAtDate)} ago</>
              ) : (
                "Unknown"
              )
            }
            username={reply.username}
            profilePic={`http://localhost:5000/uploads/${reply.userProfilePic}`}
          />
        );
      })}
    </>
  );
};

export default PostPage;
