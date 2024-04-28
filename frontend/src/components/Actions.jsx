import {
  Box,
  Button,
  // CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import {  useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import usePreviewImage from "../../hooks/usePreviewImage";
import { useParams } from "react-router-dom";
import { postData } from "../slice/postSlice";
// import { useParams } from "react-router-dom";
// import { postData } from "../slice/postSlice";

const Actions = ({ post }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector((state) => state.userSlice.value);
  const [liked, setLiked] = useState(
    post?.likes && user && post.likes.includes(user._id)
  );
  const dispatch=useDispatch();
  // const [post, setPost] = useState(_post);
  // const post=useSelector(state=>state.postSlice.value);
  const [reply, setReply] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isReply, setIsReply] = useState(false);

  const handleLikedAndUnliked = async () => {
    if (!user) toast.error("You must logged in to like post");
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await axios.put(`/api/posts/likes/${post._id}`);
      const data = res.data;
      if (data.error) {
        toast.error(data.error);
      }

      if (!liked) {
        dispatch(postData({ ...post, likes: [...post.likes, user._id] }));
      } else {
        dispatch(postData({ ...post, likes: post.likes.filter((id) => id !== user._id) }));
      }
      setLiked(!liked);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async () => {
    if (!user) toast.error("You must logged in to like post");
    if (isReply) return;
    setIsReply(true);
    try {
      const res = await axios.put(`/api/posts/reply/${post._id}`, {
        text: reply,
      });
      const data = res.data;
      if (data.error) {
        toast.error(data.error);
      }
      dispatch(postData({ ...post, replies: [...post.replies, data.reply] }));
      onClose();
      setReply("");
    } catch (error) {
      toast.error(error);
    } finally {
      setIsReply(false);
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
          onClick={handleLikedAndUnliked}
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
                onClick={handleComment}
              >
                Reply
              </Button>
              <Button variant="ghost" mr={3} size={"sm"} onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <RepostSvg/>
        <ShareSvg />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize="sm">
          {post?.replies?.length} replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize="sm">
          {post?.likes?.length} likes
        </Text>
      </Flex>
    </Flex>
  );
};

export default Actions;

const RepostSvg = () => {
  const MAX_CHAR = 500;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector((state) => state.userSlice.value);
  const { handlePreviewImage  } = usePreviewImage();
  const imageRef = useRef(null);
  const [remainingChar] = useState(MAX_CHAR);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postSlice.value);
  const { username } = useParams();

  const handleRepostPost = async () => {
        setLoading(true);
    try{
    const res = await axios.post(`/api/posts/create`, {
      postedBy: posts?.postedBy,
      text: posts?.text,
      img: posts?.img
    });

      const data = res.data;
      if (data.error) {
        toast.error(data.error);
        return;
      }
      toast.success("Repost successfully");
      if (username === user.username) {
        dispatch(postData([...posts, data]));
      }
      // onClose();
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
      onClose();
    }
  };


  return (
    <><svg
      aria-label="Repost"
      color="currentColor"
      fill="currentColor"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
      onClick={onOpen}
      cursor={'pointer'}
    >
      <title>Repost</title>
      <path
        fill=""
        d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
      ></path>
    </svg>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Repost</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
            <Textarea
                placeholder="Post content goes here.."
                defaultValue={posts?.text}
                readOnly // Make the textarea read-only
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>

              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handlePreviewImage}
                disabled={true} />

              <BsFillImageFill 
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()} />
            </FormControl>

            {posts?.img && (
                <Flex mt={5} w={"full"} position={"relative"}>
                  <Image src={`http://localhost:5000/uploads/${posts?.img}`} alt="Selected img" />
                </Flex>
              )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleRepostPost}
              isLoading={loading}
            >
              Repost
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal></>

  );
};

const ShareSvg = () => {
  return (
    <svg
      aria-label="Share"
      color=""
      fill="rgb(243, 245, 247)"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
    >
      <title>Share</title>
      <line
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="22"
        x2="9.218"
        y1="3"
        y2="10.083"
      ></line>
      <polygon
        fill="none"
        points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      ></polygon>
    </svg>
  );
};
