import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import useDeletePost from "../../hooks/useDeletePost";
import { userData } from "../slice/userSlice";

const UserPost = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.userSlice.value);
  const { handleDeletePost } = useDeletePost();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/profile/${postedBy}`);
        const data = res.data;
        if (data.error) {
          toast.error(data.error);
          return;
        }
        setUser(data);
      } catch (error) {
        toast.error(error);
        setUser(null);
      }
    };
    fetchUser();
  }, [postedBy]);

  if (!post) return;

  const createdAtDate = post?.createdAt ? new Date(post.createdAt) : null;

  return (
    <Flex gap={3} mb={4} py={5}>
      <Flex flexDirection={"column"} alignItems={"center"}>
        <Avatar
          size="md"
          name={user?.name}
          src={
            `http://localhost:5000/uploads/${user?.profilePic}` ||
            user?.profilePic
          }
          onClick={(e) => {
            e.preventDefault();
            navigate(`/${user?.username}`);
          }}
        />
        <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
        <Box position={"relative"} w={"full"}>
          {post.replies && post?.replies.length === 0 && (
            <Text textAlign={"center"}>😒</Text>
          )}
          {post.replies && post.replies[0] && (
            <Avatar
              size="xs"
              name="John doe"
              src={`http://localhost:5000/uploads/${post?.replies[0]?.userProfilePic}`}
              position={"absolute"}
              top={"0px"}
              left="15px"
              padding={"2px"}
            />
          )}

          {post.replies && post?.replies[1] && (
            <Avatar
              size="xs"
              name="John doe"
              src={`http://localhost:5000/uploads/${post?.replies[1]?.userProfilePic}`}
              position={"absolute"}
              bottom={"0px"}
              right="-5px"
              padding={"2px"}
            />
          )}

          {post.replies && post?.replies[2] && (
            <Avatar
              size="xs"
              name="John doe"
              src={`http://localhost:5000/uploads/${post?.replies[2]?.userProfilePic}`}
              position={"absolute"}
              bottom={"0px"}
              left="4px"
              padding={"2px"}
            />
          )}
        </Box>
      </Flex>
      <Flex flex={1} flexDirection={"column"} gap={2}>
        <Link to={`/${user?.username}/post/${post?._id}`}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user?.username}`);
                }}
              >
                {user?.username}
              </Text>
              {/* <Image
                src={user?.followers?.length >= 20 && "/verified.png"}
                w={4}
                h={4}
                ml={1}
              /> */}
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
                  onClick={() => handleDeletePost(post?._id)}
                />
              )}
            </Flex>
          </Flex>

          <Text fontSize={"sm"}>{post?.text}</Text>
          {post?.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image
                src={`http://localhost:5000/uploads/${post?.img}`}
                w={"full"}
              />
            </Box>
          )}
        </Link>
        <Flex gap={3} my={3}>
          <Actions post={post} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserPost;
