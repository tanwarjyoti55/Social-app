import {
  Box,
  Button,
  // CloseButton,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { postData } from "../slice/postSlice";
// import { useParams } from "react-router-dom";
// import { postData } from "../slice/postSlice";

const CommentActions = ({ post, index: replyIndex }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector((state) => state.userSlice.value);
  const [liked, setLiked] = useState(
    post?.replies[replyIndex].commentLikes &&
      user &&
      post?.replies[replyIndex].commentLikes.includes(user._id)
  );
  const dispatch = useDispatch();
  const [reply, setReply] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isReply, setIsReply] = useState(false);

  const handleLikedAndUnliked = async (replyIndex) => {
    if (!user) toast.error("You must logged in to like post");
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await axios.post(`/api/posts/comment/likes/${post._id}`, {
        replyIndex: replyIndex,
      });
      const data = res.data;
      if (data.error) {
        toast.error(data.error);
      }

      if (!liked) {
        dispatch(
          postData({
            ...post,
            commentLikes: [...post.replies[replyIndex].commentLikes, user._id],
          })
        );
      } else {
        dispatch(
          postData({
            ...post,
            commentLikes: post.replies[replyIndex].commentLikes.filter(
              (id) => id !== user._id
            ),
          })
        );
      }
      setLiked(!liked);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (replyIndex) => {
    if (!user) toast.error("You must logged in to like post");
    if (isReply) return;
    setIsReply(true);

    try {
      const res = await axios.post(`/api/posts/comment/reply/${post._id}`, {
        text: reply,
        replyIndex: replyIndex,
      });
      const data = res.data;
      if (data.error) {
        toast.error(data.error);
      }
      const updatedReplies = [...post.replies];
      updatedReplies[replyIndex].commentReplies.push(data.reply);
      dispatch(postData({ ...post, replies: updatedReplies }));
      setReply("");
    } catch (error) {
      toast.error(error);
    } finally {
      setIsReply(false);
      onClose();
    }
  };

  return (
    <Flex flexDirection="column">
      <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
        <svg
          aria-label="Like"
          color={liked ? "rgb(237, 73, 86)" : ""}
          fill={liked ? "rgb(237, 73, 86)" : "transparent"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          onClick={() => handleLikedAndUnliked(replyIndex)}
        >
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>

        <svg
          aria-label="Comment"
          color=""
          fill=""
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
          onClick={onOpen}
        >
          <title>Comment</title>
          <path
            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Comment on post</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <Input
                  placeholder="Comment goes here.."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                size={"sm"}
                onClick={() => handleComment(replyIndex)}
              >
                Reply
              </Button>
              <Button variant="ghost" mr={3} size={"sm"} onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize="sm">
          {post?.replies[replyIndex]?.commentReplies.length} replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize="sm">
          {post?.replies[replyIndex]?.commentLikes.length} likes
        </Text>
      </Flex>
    </Flex>
  );
};

export default CommentActions;
