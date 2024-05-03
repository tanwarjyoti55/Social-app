import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import CommentActions from "./CommentActions";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import ReplyComment from "./ReplyComment";

const Comment = ({ reply, index }) => {
  const post = useSelector((state) => state.postSlice.value);
  const createdAtDate = post?.createdAt ? new Date(post.createdAt) : null;

  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar
          src={`http://localhost:5000/uploads/${reply?.userProfilePic}`}
          size={"sm"}
        />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize="sm" fontWeight="bold">
              {reply?.username}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                {createdAtDate ? (
                  <>{formatDistanceToNow(createdAtDate)} ago</>
                ) : (
                  "Unknown"
                )}
              </Text>
            </Flex>
          </Flex>
          <Text>{reply?.text}</Text>
          <CommentActions post={post} index={index} />
        </Flex>
      </Flex>
      {reply?.commentReplies && reply?.commentReplies.length > 0 && (
        <ReplyComment reply={reply?.commentReplies} />
      )}
      <Divider />
    </>
  );
};

export default Comment;
