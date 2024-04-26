import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useSelector } from "react-redux";

const Comment = ({ comment, createdAt, username, profilePic }) => {
  const post = useSelector((state) => state.postSlice.value);
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={profilePic} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize="sm" fontWeight="bold">
              {username}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                {createdAt}
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text>{comment}</Text>
          <Actions post={post} />
        </Flex>
      </Flex>
      <Divider />
    </>
  );
};

export default Comment;
