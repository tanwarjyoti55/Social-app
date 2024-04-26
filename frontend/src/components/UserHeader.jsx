import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useToast } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useSelector } from "react-redux";
// import { userData } from "../slice/userSlice";
import { useState } from "react";
import { toast } from "react-toastify";

import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

const UserHeader = ({ user }) => {
  const showToast = useToast();
  const currentUser = useSelector((state) => state.userSlice.value);
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser._id)
  );
  const [updating, setUpdating] = useState(false);

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast({
        title: "Success.",
        status: "success",
        description: "Profile link copied.",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      toast.info("Logged in the app");
      return;
    }
    if (updating) return;
    setUpdating(true);
    try {
      const res = await axios.post(`/api/users/follow/${user?._id}`);
      const data = res.data;
      if (data.error) {
        toast.error(data.error);
      }
      if (following) {
        toast.success(`Unfollow ${user?.name} successfully`);
        user?.followers.pop();
      } else {
        toast.success(`Followed ${user?.name} successfully`);
        user?.followers.push(currentUser._id);
      }
      setFollowing(!following);
    } catch (error) {
      toast.error(`Error ${error}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user?.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user?.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={user?.name}
            src={
              `http://localhost:5000/uploads/${user?.profilePic}` ||
              user?.profilePic
            }
            size={{
              base: "md",
              md: "xl",
            }}
          />
        </Box>
      </Flex>

      <Text>{user?.bio}</Text>

      {currentUser._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}> Update Profile</Button>
        </Link>
      )}

      {currentUser._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {" "}
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user?.followers.length} followers</Text>
          <Text color={"gray.light"}>{user?.following.length} following</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
