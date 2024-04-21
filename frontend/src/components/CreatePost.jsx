import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
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
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import usePreviewImage from "../../hooks/usePreviewImage";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "../slice/postSlice";

const MAX_CHAR = 500;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const { handlePreviewImage, imgUrl, setImgUrl } = usePreviewImage();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useSelector((state) => state.userSlice.value);
  const [loading, setLoading] = useState(false);
  const dispatch =useDispatch();
  const posts = useSelector((state)=>state.postSlice.value);
  const { username } = useParams();

console.log(posts)
  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append("postedBy", user._id);
    formData.append("text", postText);
    formData.append("image", imgUrl);
    setLoading(true);
    try {
      const res = await axios.post("/api/posts/create", formData);

      const data = res.data;
      if (data.error) {
        toast.error(data.error);
        return;
      }
      toast.success("Post created successfully");
        if (username === user.username) {
          dispatch(postData([...posts, data]));
          // setPosts([data, ...posts]);
        }
      onClose();
      setPostText("");
      setImgUrl("");
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{ base: "sm", sm: "md" }}
      >
        <AddIcon />
        Post
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post content goes here.."
                onChange={handleTextChange}
                value={postText}
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
              />

              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={URL.createObjectURL(imgUrl)} alt="Selected img" />
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
